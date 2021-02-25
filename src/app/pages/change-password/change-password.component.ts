import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { HttpService } from 'src/app/shared/services/http.service';
import { User } from 'src/app/shared/classes/user';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  // Constructor Declarations.
  constructor(private authService: AuthService,
      private httpService:  HttpService,
      private modalService: NzModalService, private fb: FormBuilder,)
      {
        this.currentPassword = new FormControl('', [Validators.required,Validators.minLength(6)]);
        this.newPassword = new FormControl('', [Validators.required,Validators.minLength(6)]);
        this.confirmPassword = new FormControl('', [Validators.required,Validators.minLength(6)]);

        this.form = new FormGroup({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        });
      }

  // Variable Declarations.
  public username: string;
  public currentUser : User;
  public form: FormGroup;
  public currentPassword: FormControl;
  public newPassword: FormControl;
  public confirmPassword: FormControl;
  public isLoading: boolean = false;

  ngOnInit() {
    this.authService.currentUser.subscribe(x => (this.currentUser = x));
    const { id = 0 } = this.currentUser;

    this.httpService.getUserProfile(id).subscribe((res: User) => {
        this.username = res.username;
      }, err => {
        console.log(err);
      }
    );
  }

  changePasswordConfirmation() {
    this.modalService.warning({
      nzTitle: "Are you sure to change password?",
      nzContent: "This change cannot be reverted.",
      nzOnOk: () => this.saveChanges(),
      nzCancelText: "No"
    });
  }

  currentPasswordIncorrect() {
    this.modalService.warning({
      nzTitle: "Your current password is incorrect. Please try again.",
      nzOnOk: () => console.log(),
    });
  }

  newconfirmPasswordIncorrect() {
    this.modalService.warning({
      nzTitle: "Your new password and confirm password is incorrect. Please try again.",
      nzOnOk: () => console.log(),
    });
  }

  resetFormValue(){
    this.form = this.fb.group({
      address1: ["", Validators.required],
      currentPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      confirmPassword: ["", Validators.required]
    });
  }

  saveChanges() {
    this.authService.changePassword(this.currentPassword.value, this.newPassword.value).subscribe(
      () => {
        // success
        this.resetFormValue();
      }, err => {
        // failed
        this.resetFormValue();
      }
    )

  }
}
