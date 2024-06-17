import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auto.interceptor";
import { AdditionalHeadersInterceptor } from "./additional-headers.interceptor";
import { BaseUrlInterceptor } from "./base-url.interceptor";

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AdditionalHeadersInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
];
