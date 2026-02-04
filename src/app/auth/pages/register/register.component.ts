import { Component, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { finalize } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { RegisterRequest } from "../../models";

@Component({
    selector: "app-register",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss"
})
export class RegisterComponent {

    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);

    registerForm: FormGroup = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
        password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.pattern(/^[\d\s\-\+\(\)]+$/), Validators.maxLength(20)]]
    }, {
        validators: this.passwordMatchValidator
    });

    isLoading = false;
    hidePassword = true;
    hideConfirmPassword = true;
    errorMessage = '';

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const formValue = this.registerForm.value;
        const request: RegisterRequest = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email,
            password: formValue.password,
            phone: formValue.phone || undefined
        };

        this.authService.register(request)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: () => {
                    this.snackBar.open('Cuenta creada con éxito', 'OK', { duration: 2500 });
                    this.router.navigate(['/main/home']);
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'Error al crear la cuenta';
                }
            });
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.hideConfirmPassword = !this.hideConfirmPassword;
    }

    private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

        const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

        if (!valid) {
            return { passwordStrength: true };
        }
        return null;
    }

    private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        if (password !== confirmPassword) {
            group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }
}
