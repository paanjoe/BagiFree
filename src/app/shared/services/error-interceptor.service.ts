import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService {

  constructor(private authService: AuthService, private messageService : MessageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
 
        if (err.status === 401) {
          this.messageService.showMessage('error','Invalid username or password, please try again');
            // auto logout if 401 response returned from api
            this.authService.logout();
            // location.reload(true);
        }

        if (err.status === 404) {
          this.messageService.showMessage('error','Something is not right, please try again');
            // auto logout if 401 response returned from api
            this.authService.logout();
            // location.reload(true);
        }

        if (err.status === 503) {
          this.messageService.showMessage('error','Service Unavailable');
            // auto logout if 401 response returned from api
            this.authService.logout();
            // location.reload(true);
        }
        
        const error = err.error || err.statusText;
        return throwError(error);
    }))
}
}
