import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { finalize } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { LoginRequest } from "../../models";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent {

    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    isLoading = false;
    hidePassword = true;
    errorMessage = '';

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const request: LoginRequest = this.loginForm.value;

        this.authService.login(request)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: () => {
                    this.router.navigate(['/main/home']);
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'Credenciales incorrectas';
                }
            });
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }
}
