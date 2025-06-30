import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { FormsModule, NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;
  let mockFormGroup: FormGroup; // Representa el form.form interno de NgForm
  let markAllAsTouchedSpy: jasmine.Spy; // Espía para markAllAsTouched

  const mockExistingUser: User = {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'client',
    address: '123 Test St',
    phone: '555-1111'
  };

  beforeEach(async () => {
    // Crea un spy object para AuthService
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserByEmail']);

    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordComponent, // Asegúrate de que ForgotPasswordComponent sea standalone
        FormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([]) // Proporciona el Router
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    // Configura un FormGroup real para simular forgotPasswordForm.form
    mockFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    // Espiar markAllAsTouched en el mockFormGroup
    markAllAsTouchedSpy = spyOn(mockFormGroup, 'markAllAsTouched').and.callThrough();

    // Simular la resolución de @ViewChild para NgForm
    fixture.detectChanges(); // Ejecuta la detección de cambios para que Angular resuelva @ViewChild

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    let ngFormInstance: NgForm | null = null;

    if (formDebugElement) {
      ngFormInstance = formDebugElement.injector.get(NgForm, null);
    }

    if (ngFormInstance) {
      // Reemplazar la propiedad 'form' de la instancia real de NgForm con nuestro mockFormGroup
      (ngFormInstance as any).form = mockFormGroup;
      component.forgotPasswordForm = ngFormInstance;
    } else {
      console.warn('Advertencia: No se pudo obtener la instancia de NgForm desde el DOM. Usando mock directo de NgForm. Verifica tu HTML (#forgotPasswordForm="ngForm").');
      // Fallback si NgForm no se encuentra (menos ideal)
      component.forgotPasswordForm = {
        form: mockFormGroup,
        value: (mockFormGroup as any).value,
        valid: (mockFormGroup as any).valid,
        invalid: (mockFormGroup as any).invalid
      } as unknown as NgForm;
    }
  });

  // Prueba unitaria para el escenario de email existente
  it('debe mostrar un mensaje de éxito y redirigir si el email existe', fakeAsync(() => {
    // Configurar el spy para que getUserByEmail retorne un usuario existente
    authServiceSpy.getUserByEmail.and.returnValue(mockExistingUser);

    // Asignar un email válido al componente
    component.email = mockExistingUser.email;

    // Simular que el formulario es válido (el FormControl 'email' se establece como válido)
    mockFormGroup.controls['email'].setValue(mockExistingUser.email);
    mockFormGroup.controls['email'].updateValueAndValidity();
    expect(mockFormGroup.valid).toBeTrue(); // Aserción de que el mockFormGroup es válido

    component.onSubmit();

    // Verificar que markAllAsTouched fue llamado
    expect(markAllAsTouchedSpy).toHaveBeenCalled();

    // Verificar que getUserByEmail fue llamado con el email correcto
    expect(authServiceSpy.getUserByEmail).toHaveBeenCalledWith(mockExistingUser.email);

    // Verificar el mensaje de éxito y estado de error inicial
    expect(component.message).toBe('Si tu email está registrado, recibirás un enlace para restablecer tu contraseña. (Simulado)');
    expect(component.isError).toBeFalse();

    // Avanzar el tiempo para que se ejecute el setTimeout de la redirección
    tick(3000);

    // Verificar que el router.navigate fue llamado con la ruta y los queryParams correctos
    expect(navigateSpy).toHaveBeenCalledWith(['/reset-password'], { queryParams: { email: mockExistingUser.email } });
  }));

  // Opcional: Aquí podrías añadir más pruebas unitarias si las necesitas en el futuro,
  // como escenarios de email inválido o email no registrado.
});