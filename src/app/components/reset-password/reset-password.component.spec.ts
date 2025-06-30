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
  let mockFormGroup: FormGroup; 
  let markAllAsTouchedSpy: jasmine.Spy; 

  const mockExistingUser: User = {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'client',
    address: '123 Test St',
    phone: '555-1111'
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserByEmail']);

    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordComponent, 
        FormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    
    mockFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    
    markAllAsTouchedSpy = spyOn(mockFormGroup, 'markAllAsTouched').and.callThrough();

    
    fixture.detectChanges(); 

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    let ngFormInstance: NgForm | null = null;

    if (formDebugElement) {
      ngFormInstance = formDebugElement.injector.get(NgForm, null);
    }

    if (ngFormInstance) {
      (ngFormInstance as any).form = mockFormGroup;
      component.forgotPasswordForm = ngFormInstance;
    } else {
      console.warn('Advertencia: No se pudo obtener la instancia de NgForm desde el DOM. Usando mock directo de NgForm.  (#forgotPasswordForm="ngForm").');
      component.forgotPasswordForm = {
        form: mockFormGroup,
        value: (mockFormGroup as any).value,
        valid: (mockFormGroup as any).valid,
        invalid: (mockFormGroup as any).invalid
      } as unknown as NgForm;
    }
  });


  it('debe mostrar un mensaje de éxito y redirigir si el email existe', fakeAsync(() => {
    authServiceSpy.getUserByEmail.and.returnValue(mockExistingUser);
    component.email = mockExistingUser.email;
    mockFormGroup.controls['email'].setValue(mockExistingUser.email);
    mockFormGroup.controls['email'].updateValueAndValidity();
    expect(mockFormGroup.valid).toBeTrue(); 
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(authServiceSpy.getUserByEmail).toHaveBeenCalledWith(mockExistingUser.email);

    expect(component.message).toBe('Si tu email está registrado, recibirás un enlace para restablecer tu contraseña. (Simulado)');
    expect(component.isError).toBeFalse();

    tick(3000);


    expect(navigateSpy).toHaveBeenCalledWith(['/reset-password'], { queryParams: { email: mockExistingUser.email } });
  }));
});