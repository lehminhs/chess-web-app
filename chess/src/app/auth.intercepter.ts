import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

import { tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor (
        private authService: AuthService,
        private router: Router
    ) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isLoggedIn()) {
            req = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.authService.getToken()}`,
                },
            });
        } else {
            this.authService.logout();
            this.router.navigate(['login']);
        }

        // return next.handle(req);
        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            return
          }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                this.router.navigate(['login']);
              }
            }
          }));
    }
}