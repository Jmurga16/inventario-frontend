import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";

import { routes } from "./app.routes";
import { ErrorInterceptor } from "./core/interceptors/error.interceptor";
import { LoadingInterceptor } from "./core/interceptors/loading.interceptor";
import { TokenInterceptor } from "./core/interceptors/token.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(
            withFetch(),
            withInterceptorsFromDi()
        ),
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ]
};
