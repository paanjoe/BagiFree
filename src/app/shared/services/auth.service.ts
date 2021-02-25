import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../classes/user";
import { shareReplay, takeUntil, tap } from "rxjs/operators";
import { api_url } from "../../config/index";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";
import { MessageService } from './message.service';
import { NzNotificationService } from "ng-zorro-antd";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private notification : NzNotificationService,
    private toastrService: ToastrService,
    private messageService: MessageService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  changePassword(oldPassword: string, newPassword: string, ){
    return this.http.post<User>(`${api_url}/auth/change-password`, {oldPassword, newPassword}, {responseType: "text" as "json"}).pipe(tap(data => {
          this.messageService.showMessage("success", "Successfully changed new password.");
          this.setSession(data);
          return;
        }, err => {
          return err;
        }
      )
    );
  }
  
  login(username: string, password: string) {
    return this.http
      .post<User>(
        `${api_url}/auth/login`,
        { username, password },
        { responseType: "text" as "json" }
      )
      .pipe(
        tap(
          data => {
            this.messageService.showMessage("success","Successfully logged in.");
            this.setSession(data);
            return;
          },
          err => {
           return err
          }
        )
      );
  }

  private setSession(authResult) {
    let data = JSON.parse(authResult);
    const expiresAt = moment().add(data.expiresIn, "second");
    localStorage.setItem("id_token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data));
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    this.currentUserSubject.next(data);
  }
  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("expires_at");
    this.currentUserSubject.next(null);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem("id_token");
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
