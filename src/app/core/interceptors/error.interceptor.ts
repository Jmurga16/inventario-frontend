import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { NotificationService } from '../services';
import { of } from 'rxjs/internal/observable/of';
import { TokenService } from '../../auth/services/token.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(catchError(objError => {
        console.log('error Interceptor')
        console.log(objError)

        if (objError instanceof HttpErrorResponse && objError.status === 401) {
          return this.handle401Error(request, next);
        }
        if (objError.status === 200 && objError.ok === false) {
          return of(new HttpResponse({ body: { message: objError.error.text } }));
        }

        return this.handleError(objError);
      }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('handle401Error')

    // Don't try to refresh for auth endpoints - just throw the error
    if (request.url.includes('/auth/')) {
      return throwError(() => new HttpErrorResponse({
        error: { message: 'Credenciales incorrectas' },
        status: 401,
        statusText: 'Unauthorized'
      }));
    }

    // For other endpoints, clear token and throw error
    this.tokenService.removeToken();
    return throwError(() => new HttpErrorResponse({
      error: { message: 'Sesión expirada' },
      status: 401,
      statusText: 'Unauthorized'
    }));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let message: string = '';
    console.log('err', err);

    if (!err.status) {
      message = 'No se puede conectar a los servicios.'
    } else {
      if (err.error?.operationCode != 200) {
        message = err.error.message
      }
      if (err.error?.error_description) {
        message = err.error.error_description;
      }
      else if (err.error?.messages) {
        const messages = err.error.messages;
        message = messages.join('<br />');
      }
      else if (err.error?.errors) {
        for (const prop of Object.keys(err.error?.errors)) {
          var propertyErrors = err.error?.errors[prop];
          message += propertyErrors.join('<br />');
        }
      } else {
        this.notificationService.showError(message)
      }
    }

    this.notificationService.showWarning(message);

    return throwError(() => err);
  }
}
