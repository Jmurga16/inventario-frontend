import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class EmailSecurityValidator {

    static secureEmail(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) {
                return null;
            }

            // 1. Validar longitud máxima (prevenir payloads grandes)
            if (value.length > 254) {
                return { emailTooLong: { maxLength: 254, actualLength: value.length } };
            }

            // 2. Validar longitud mínima
            if (value.length < 5) { // min: a@b.c
                return { emailTooShort: { minLength: 5, actualLength: value.length } };
            }

            // 3. Detectar caracteres peligrosos (SQL injection, XSS)
            const dangerousChars = /[<>\"'`;(){}[\]\\|&$]/;
            if (dangerousChars.test(value)) {
                return { dangerousCharacters: true };
            }

            // 4. Validar formato de email estricto (RFC 5322 simplificado)
            const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(value)) {
                return { invalidEmailFormat: true };
            }

            // 5. Prevenir múltiples @ (ataque de bypass)
            const atCount = (value.match(/@/g) || []).length;
            if (atCount !== 1) {
                return { invalidEmailFormat: true };
            }

            // 6. Validar que no empiece o termine con puntos
            if (value.startsWith('.') || value.endsWith('.')) {
                return { invalidEmailFormat: true };
            }

            // 7. Prevenir puntos consecutivos
            if (value.includes('..')) {
                return { invalidEmailFormat: true };
            }

            return null;
        };
    }

    /**
     * Sanitiza el email removiendo espacios y convirtiendo a lowercase
     */
    static sanitizeEmail(email: string): string {
        if (!email) return '';

        return email
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ''); // Remover todos los espacios
    }
}
