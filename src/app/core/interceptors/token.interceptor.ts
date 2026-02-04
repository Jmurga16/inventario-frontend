import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../../auth/services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private tokenService = inject(TokenService);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.url.includes('auth') || request.url.includes('password') || request.url.includes('blob.core')) {
            return next.handle(request);
        }

        const token = this.tokenService.getToken();
        const clonedRequest = token ? this.addAuthorizationHeader(request, token) : request;
        return next.handle(clonedRequest);
    }

    private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }
}

export const TokenInterceptorFn: HttpInterceptorFn = (request, next) => {
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();
    const clonedRequest = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
    return next(clonedRequest);
};