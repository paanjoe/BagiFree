import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { api_url } from 'src/app/config';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  registerUser(username: string, password: string, mobile: string, mobileOption: number, email: string) {
    return this.http
      .post<User>(
        `${api_url}/user/register`,
        { username, password, mobile, mobileOption, email, role : 'public' },
        { responseType: 'text' as 'json' }
      )
      .pipe(
        tap(
          data => {
            this.messageService.showMessage('success', 'Successfully registered');
            this.setSession(data);
            return;
          },
          err => {
            this.messageService.showMessage('error', err);
            return err;
          }
        )
      );
  }

  public getUserProfile(id: number) {
    return this.http.get(`${api_url}/user/${id}`).pipe(
      tap(
        data => { },
        err => {
          this.messageService.showMessage('error', 'Please try again');
          return err;
        }
      )
    );
  }

  public updateProfile(id: number,   mobile: string, email: string) {
    return this.http
      .patch<User>(
        `${api_url}/user/${id}`,
        { mobile, email },
        { responseType: 'text' as 'json' }
      )
      .pipe(
        tap(
          data => {
            this.messageService.showMessage('success', 'Successfully updated');
            //this.setSession(data);
            return;
          },
          err => {
            this.messageService.showMessage('error', 'Please try again');
            return err;
          }
        )
      );
  }

  public forgotPassword(emailString: string){
    return this.http.post<User>(`${api_url}/user/forgot-password`, {email: emailString}, {responseType: 'text' as 'json'})
    .pipe(tap(
      data => {
        this.messageService.showMessage('success', 'An email has been sent to your inbox/spam folder.');
      }, err => {
        this.messageService.showMessage('error', 'Please try again');
      }
    ));
  }

  private setSession(authResult) {
    const data = JSON.parse(authResult);
    const expiresAt = moment().add(data.expiresIn, 'second');
    localStorage.setItem('id_token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data));
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    this.authService.currentUserSubject.next(data);
  }

}
