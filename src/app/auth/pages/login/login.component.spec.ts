import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { UserHttpService } from '../../services/user-http.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ApiResponse } from '../../../core/models';
import { AuthResponse, User } from '../../models';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: HTMLElement;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserHttpService: jasmine.SpyObj<UserHttpService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockUserHttpService = jasmine.createSpyObj('UserHttpService', ['create']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserHttpService, useValue: mockUserHttpService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Structure', () => {
    it('should render the login card', () => {
      const card = compiled.querySelector('.login-card');
      expect(card).toBeTruthy();
    });

    it('should display the title "Iniciar Sesión"', () => {
      const title = compiled.querySelector('mat-card-title');
      expect(title?.textContent).toContain('Iniciar Sesión');
    });

    it('should have an email input field', () => {
      const emailInput = compiled.querySelector('input[type="email"]');
      expect(emailInput).toBeTruthy();
    });

    it('should have a submit button', () => {
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });
  });

  describe('Email FormControl Validation', () => {
    it('should initialize emailControl as empty and invalid', () => {
      expect(component.emailControl.value).toBe('');
      expect(component.emailControl.invalid).toBeTruthy();
    });

    it('should be invalid when email is empty', () => {
      component.emailControl.setValue('');
      expect(component.emailControl.hasError('required')).toBeTruthy();
    });

    it('should be invalid when email format is incorrect', () => {
      component.emailControl.setValue('invalid-email');
      expect(component.emailControl.hasError('email')).toBeTruthy();
    });

    it('should be valid when email format is correct', () => {
      component.emailControl.setValue('test@example.com');
      expect(component.emailControl.valid).toBeTruthy();
    });
  });

  describe('Error Messages', () => {
    it('should show required error when email is touched and empty', () => {
      component.emailControl.markAsTouched();
      component.emailControl.setValue('');
      fixture.detectChanges();

      const errorElement = compiled.querySelector('mat-error');
      expect(errorElement?.textContent).toContain('El correo es requerido');
    });

    it('should show email format error when email is invalid', () => {
      component.emailControl.markAsTouched();
      component.emailControl.setValue('invalid-email');
      fixture.detectChanges();

      const errorElement = compiled.querySelector('mat-error');
      expect(errorElement?.textContent).toContain('Ingresa un correo válido');
    });
  });

  describe('Form Submission', () => {
    it('should not submit when email is invalid', () => {
      component.emailControl.setValue('');
      component.onSubmit();

      expect(component.emailControl.touched).toBeTruthy();
      expect(component.isLoading).toBeFalsy();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should mark email as touched when submitting invalid form', () => {
      component.emailControl.setValue('');
      component.onSubmit();

      expect(component.emailControl.touched).toBeTruthy();
    });

    it('should call authService.login when form is valid', () => {
      const testEmail = 'test@example.com';
      const mockResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: { exists: true, token: 'mock-token' }
      };
      mockAuthService.login.and.returnValue(of(mockResponse));

      component.emailControl.setValue(testEmail);
      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith({ email: testEmail });
    });

    it('should navigate to main/task when user exists', () => {
      const testEmail = 'test@example.com';
      const mockResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: { exists: true, token: 'mock-token' }
      };
      mockAuthService.login.and.returnValue(of(mockResponse));

      component.emailControl.setValue(testEmail);
      component.onSubmit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['main/task']);
    });

    it('should open confirmation dialog when user does not exist', () => {
      const testEmail = 'test@example.com';
      const mockResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: { exists: false },
        message: 'User not found'
      };
      mockAuthService.login.and.returnValue(of(mockResponse));
      mockDialogRef.afterClosed.and.returnValue(of(false));
      mockDialog.open.and.returnValue(mockDialogRef);

      component.emailControl.setValue(testEmail);
      component.onSubmit();

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Usuario no encontrado',
          message: `El usuario con email ${testEmail} no existe. ¿Deseas crearlo?`,
          confirmText: 'Crear',
          cancelText: 'Cancelar'
        }
      });
    });

    it('should create user and login again when dialog is confirmed', fakeAsync(() => {
      const testEmail = 'test@example.com';
      const mockNotFoundResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: { exists: false },
        message: 'User not found'
      };
      const mockUser: User = {
        id: 1,
        email: testEmail,
        createdAt: new Date()
      };
      const mockLoginAfterCreateResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: { exists: true, token: 'new-token' }
      };

      // First call: user doesn't exist
      mockAuthService.login.and.returnValue(of(mockNotFoundResponse));
      mockDialogRef.afterClosed.and.returnValue(of(true));
      mockDialog.open.and.returnValue(mockDialogRef);
      mockUserHttpService.create.and.returnValue(of(mockUser));

      component.emailControl.setValue(testEmail);
      component.onSubmit();
      tick();

      // After user creation, login is called again
      mockAuthService.login.and.returnValue(of(mockLoginAfterCreateResponse));
      tick();

      expect(mockUserHttpService.create).toHaveBeenCalledWith(testEmail);
    }));

    it('should not create user when dialog is cancelled', () => {
      const testEmail = 'test@example.com';
      const mockResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: { exists: false },
        message: 'User not found'
      };
      mockAuthService.login.and.returnValue(of(mockResponse));
      mockDialogRef.afterClosed.and.returnValue(of(false));
      mockDialog.open.and.returnValue(mockDialogRef);

      component.emailControl.setValue(testEmail);
      component.onSubmit();

      expect(mockUserHttpService.create).not.toHaveBeenCalled();
    });

    it('should set isLoading to false after login completes', () => {
      const testEmail = 'test@example.com';
      const mockResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: { exists: true, token: 'mock-token' }
      };
      mockAuthService.login.and.returnValue(of(mockResponse));

      component.emailControl.setValue(testEmail);
      component.onSubmit();

      expect(component.isLoading).toBeFalsy();
    });
  });

  describe('Loading State', () => {
    it('should initialize isLoading as false', () => {
      expect(component.isLoading).toBeFalsy();
    });

    it('should disable submit button when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton.disabled).toBeTruthy();
    });

    it('should show spinner when isLoading is true', () => {
      component.emailControl.setValue('test@example.com');
      component.isLoading = true;
      fixture.detectChanges();

      const spinner = compiled.querySelector('mat-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should show "Ingresar" text when isLoading is false', () => {
      component.isLoading = false;
      fixture.detectChanges();

      const button = compiled.querySelector('button[type="submit"]');
      expect(button?.textContent?.trim()).toContain('Ingresar');
    });
  });

  describe('goToTask', () => {
    it('should navigate to main/task', () => {
      component.goToTask();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['main/task']);
    });
  });
});
