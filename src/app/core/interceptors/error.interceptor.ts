import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { filter } from 'rxjs/internal/operators/filter';
import { take } from 'rxjs/internal/operators/take';
import { throwError } from 'rxjs/internal/observable/throwError';
import { NotificationService } from '../services';
import { of } from 'rxjs/internal/observable/of';
import { TokenService } from '../../auth/services/token.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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

  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('handle401Error')
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      this.tokenService.removeToken()
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addAuthorizationHeader(request, token)))
    );
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
