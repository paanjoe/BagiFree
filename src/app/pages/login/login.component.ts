import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { NzNotificationService, NzNotificationModule } from "ng-zorro-antd";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  username: FormControl;
  password: FormControl;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService
  ) {
    this.username = new FormControl('', [Validators.required, Validators.minLength(4)]);
    this.password = new FormControl('', [Validators.required,Validators.minLength(6)]);

    this.form = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

  ngOnInit() {}
  isLoadingOne = false;

  onLogin() {
    const val = this.form.value;
    if (val.username && val.password) {
      this.isLoadingOne = true;
      this.authService.login(val.username, val.password).subscribe(
        () => {
          this.isLoadingOne = false;
          this.router.navigateByUrl("/");
        },
        () => {
          this.isLoadingOne = false;
          // this.notification.create(
          //   'error',
          //   'Failed',
          //   'Opps! There is something wrong when authenticating. Please try again.'
          // );
        }
      );
    }
  }
}
