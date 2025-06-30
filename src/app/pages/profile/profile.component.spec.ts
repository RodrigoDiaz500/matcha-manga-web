import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { BehaviorSubject, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router; // Declaramos 'router' como el tipo Router real
  let navigateSpy: jasmine.Spy; // Este será el espía específico para el método navigate
  let currentUserSubject: BehaviorSubject<User | undefined>;

  const mockLoggedInUser: User = {
    id: 'user123',
    email: 'test@example.com',
    password: 'oldPassword123',
    fullName: 'Test User',
    role: 'client',
    address: '123 Test St',
    phone: '555-0000'
  };

  beforeEach(fakeAsync(async () => {
    currentUserSubject = new BehaviorSubject<User | undefined>(mockLoggedInUser);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'updateUser',
      'login',
      'isAdmin',
      'getUserByEmail',
      'getUserById'
    ]);
    Object.defineProperty(authServiceSpy, 'currentUser$', { value: currentUserSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        FormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([]) // Esto provee un mock de Router
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
        // No necesitamos proveer Router aquí; RouterTestingModule ya lo hace
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    // Obtenemos la instancia del Router que TestBed ha provisto (del RouterTestingModule)
    router = TestBed.inject(Router);
    // Ahora, espiamos específicamente el método 'navigate' de esa instancia
    navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.profileForm = {
      valid: true,
      value: {
        fullName: 'Test User',
        email: 'test@example.com',
        address: '123 Test St',
        phone: '555-0000'
      },
      form: { controls: {} } as any
    } as NgForm;

    fixture.detectChanges();
    tick();
  }));

  afterEach(() => {
    // No se necesita nada aquí si todas las asincronías están manejadas por fakeAsync/tick
  });

  // --- ÚNICA PRUEBA UNITARIA SOLICITADA ---

  it('debe actualizar exitosamente el perfil del usuario sin cambiar la contraseña', fakeAsync(() => {
    // 1. **Configuración (Arrange):**

    authServiceSpy.updateUser.and.returnValue(of(true));

    component.editableUser = {
      id: mockLoggedInUser.id,
      fullName: 'Nuevo Nombre Test',
      email: 'nuevo.email@example.com',
      role: mockLoggedInUser.role,
      address: 'Nueva Dirección 789',
      phone: '999-8888'
    };

    component.changePasswordMode = false;

    // 2. **Acción (Act):**
    component.onUpdateProfile();
    tick();

    // 3. **Verificación (Assert):**
    expect(authServiceSpy.updateUser).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: mockLoggedInUser.id,
        fullName: 'Nuevo Nombre Test',
        email: 'nuevo.email@example.com',
        role: mockLoggedInUser.role,
        address: 'Nueva Dirección 789',
        phone: '999-8888',
        password: mockLoggedInUser.password
      })
    );
    expect(component.successMessage).toBe('Perfil actualizado exitosamente.');
    expect(component.errorMessage).toBe('');
    expect(component.changePasswordMode).toBe(false);
    expect(component.currentPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.confirmNewPassword).toBe('');

    // Verificamos que el método navigate del Router NO fue llamado en este escenario de éxito,
    // ya que no debería haber redirección.
    expect(navigateSpy).not.toHaveBeenCalled();
  }));
});