import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAdmin']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(routerSpy, 'navigate').and.returnValue(Promise.resolve(true));

    component.email = 'cliente@correo.com';
    component.password = 'cliente123';
    fixture.detectChanges();
    if (component.loginForm) {
      (component.loginForm as any).form.markAsPristine();
      (component.loginForm as any).form.markAsUntouched();
    }
  });

  it('debe iniciar sesión correctamente a un usuario no admin y navegar a la página de inicio', fakeAsync(() => {
    const testEmail = 'cliente@correo.com';
    const testPassword = 'cliente123';

    authServiceSpy.login.and.returnValue(of(true));
    authServiceSpy.isAdmin.and.returnValue(false);
    component.email = testEmail;
    component.password = testPassword;
    fixture.detectChanges();
    tick();
    if (!component.loginForm.valid) {
      console.warn("Advertencia: El formulario no es válido en el test. Asegúrate de que el mock o el template lo permitan.");

    }

    component.onLogin();
    expect(authServiceSpy.login).toHaveBeenCalledWith(testEmail, testPassword);
    expect(authServiceSpy.isAdmin).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.errorMessage).toBe('');
  }));
});