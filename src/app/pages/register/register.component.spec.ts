// src/app/pages/register/register.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormsModule, NgForm, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

// El validador de coincidencia de contraseñas (asegurarse de que sea el mismo que en tu componente)
const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl) => {
  const passwordControl = formGroup.get('password');
  const confirmPasswordControl = formGroup.get('confirmPassword');

  if (!passwordControl || !confirmPasswordControl || !passwordControl.value || !confirmPasswordControl.value) {
    return null;
  }

  if (passwordControl.value !== confirmPasswordControl.value) {
    const currentErrors = confirmPasswordControl.errors || {};
    confirmPasswordControl.setErrors({ ...currentErrors, passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Si coinciden, eliminar el error si existe
    const errors = confirmPasswordControl.errors;
    if (errors && errors['passwordMismatch']) {
      delete errors['passwordMismatch'];
      confirmPasswordControl.setErrors(Object.keys(errors).length === 0 ? null : errors);
    }
    return null;
  }
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;
  let mockFormGroup: FormGroup; // Será una instancia real de FormGroup
  let mockMarkAllAsTouchedSpy: jasmine.Spy; // Espía para FormGroup.markAllAsTouched
  let mockFormGroupResetSpy: jasmine.Spy; // Espía para FormGroup.reset

  const mockNewUser: User = {
    fullName: 'New User Test',
    email: 'new.user@example.com',
    password: 'Password123!',
    role: 'client',
    address: '123 New St',
    phone: '123-456-7890'
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'register',
      'getUserByEmail'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent, // Asegúrate de que RegisterComponent es un componente standalone importado aquí
        FormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([]) // Proporciona el Router
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map(),
              queryParamMap: new Map(),
              params: {},
              queryParams: {},
              url: [],
              fragment: null,
              data: {}
            },
            paramMap: of(new Map()),
            queryParams: of({}),
            fragment: of(null),
            data: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,20}$';

    // *** CLAVE: Crear una INSTANCIA REAL de FormGroup y sus FormControl ***
    mockFormGroup = new FormGroup({
      fullName: new FormControl(mockNewUser.fullName, Validators.required),
      email: new FormControl(mockNewUser.email, [Validators.required, Validators.email]),
      // Usa el patrón del componente para el validador
      password: new FormControl(mockNewUser.password, [Validators.required, Validators.pattern(component.passwordPattern)]),
      address: new FormControl(mockNewUser.address),
      phone: new FormControl(mockNewUser.phone),
      confirmPassword: new FormControl(mockNewUser.password, Validators.required)
    });

    // Añadir el validador de coincidencia de contraseñas a la instancia real de FormGroup
    mockFormGroup.addValidators(passwordMatchValidator);
    // Recalcular la validez después de añadir validadores y valores iniciales
    mockFormGroup.updateValueAndValidity();

    // *** CLAVE: Espiar los métodos de esta INSTANCIA REAL de FormGroup ***
    mockMarkAllAsTouchedSpy = spyOn(mockFormGroup, 'markAllAsTouched').and.callThrough(); // Espía y permite que el método original se ejecute
    mockFormGroupResetSpy = spyOn(mockFormGroup, 'reset').and.callThrough(); // Espía y permite que el método original se ejecute

    // --- Simular la resolución de @ViewChild para NgForm ---
    fixture.detectChanges(); // Ejecutar la detección de cambios para que Angular resuelva el @ViewChild.

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    let ngFormInstance: NgForm | null = null;

    if (formDebugElement) {
      ngFormInstance = formDebugElement.injector.get(NgForm, null);
    }

    if (ngFormInstance) {
      // Reemplazar la propiedad 'form' de la instancia real de NgForm con nuestro mockFormGroup (que es un FormGroup real).
      (ngFormInstance as any).form = mockFormGroup;
      // Asignar esta instancia de NgForm al componente.
      component.registerForm = ngFormInstance;
    } else {
      console.warn('Advertencia: No se pudo obtener la instancia de NgForm desde el DOM. Usando mock directo de NgForm. Verifica tu HTML (#registerForm="ngForm").');
      component.registerForm = {
        form: mockFormGroup,
        value: (mockFormGroup as any).value,
        valid: (mockFormGroup as any).valid,
        invalid: (mockFormGroup as any).invalid,
        resetForm: () => mockFormGroup.reset(),
      } as unknown as NgForm;
    }
  });

  // Aserciones para el FormGroup para verificar su validez antes de la acción
  beforeEach(() => {
    // Establecer los valores del formulario real para que sea válido
    mockFormGroup.setValue({
      fullName: mockNewUser.fullName,
      email: mockNewUser.email,
      password: mockNewUser.password,
      address: mockNewUser.address,
      phone: mockNewUser.phone,
      confirmPassword: mockNewUser.password
    });
    // Forzar el estado de `newUser` y `confirmPassword` en el componente para que coincida con el formulario
    component.newUser = { ...mockNewUser };
    component.confirmPassword = mockNewUser.password || '';

    // Asegurar que el formulario real esté válido con los datos proporcionados
    if (!mockFormGroup.valid) {
      console.error('El mockFormGroup NO es válido antes de la prueba. Errores:', mockFormGroup.errors);
      Object.keys(mockFormGroup.controls).forEach(key => {
        const control = mockFormGroup.get(key);
        if (control && control.errors) {
          console.error(`Control ${key} tiene errores:`, control.errors);
        }
      });
    }
    expect(mockFormGroup.valid).toBeTrue();
  });


  it('debe registrar exitosamente un nuevo usuario y navegar a la página de login', fakeAsync(() => {
    authServiceSpy.getUserByEmail.and.returnValue(undefined);
    authServiceSpy.register.and.returnValue(true);

    component.onRegister();
    tick(2000); // Avanza el tiempo para que el setTimeout del router.navigate se ejecute

    expect(mockMarkAllAsTouchedSpy).toHaveBeenCalled();
    expect(component.passwordMismatch).toBeFalse();
    expect(authServiceSpy.getUserByEmail).toHaveBeenCalledWith(mockNewUser.email);
    expect(authServiceSpy.register).toHaveBeenCalledWith(
      jasmine.objectContaining({
        fullName: mockNewUser.fullName,
        email: mockNewUser.email,
        password: mockNewUser.password,
        role: 'client',
        address: mockNewUser.address,
        phone: mockNewUser.phone
      })
    );

    expect(component.successMessage).toBe('¡Registro exitoso! Ahora puedes iniciar sesión.');
    expect(component.errorMessage).toBe('');

    expect(mockFormGroupResetSpy).toHaveBeenCalled(); // Este es el que debe ser llamado ahora

    expect(component.confirmPassword).toBe('');

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }));
});