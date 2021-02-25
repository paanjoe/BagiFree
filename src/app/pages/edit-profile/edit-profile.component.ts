import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpService } from '../../shared/services/http.service';
import { User } from '../../shared/classes/user';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  // fg: FormGroup;

  loading = true;
  form: FormGroup;

  mobile: FormControl;
  email: FormControl;
  username: FormControl;

  currentUser: User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private httpService: HttpService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.authService.currentUser.subscribe(x => (this.currentUser = x));
    const { id = 0 } = this.currentUser;
    // fetch user profile
    this.httpService.getUserProfile(id).subscribe(
      (res: User) => {
        if (res.mobile.startsWith('0') || res.mobile.startsWith('6')) {
          this.mobile = new FormControl(res.mobile, [
            Validators.required,
            Validators.minLength(10)
          ]);
        } else {
          this.mobile = new FormControl('0' + res.mobile, [
            Validators.required,
            Validators.minLength(10)
          ]);
        }

        this.username = new FormControl(res.username);
        this.email = new FormControl(res.email);

        this.form = new FormGroup({
          mobile: this.mobile,
          email: this.email,
          username: this.username
        });
        // this.onChanges();
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  ngOnInit() {}

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  saveChanges() {
    const { id = 0 } = this.currentUser;
    const { mobile = '', email = '' } = this.form.value;
    this.httpService.updateProfile(id, mobile.toString(), email).subscribe(
      res => {
        window.location.reload();
      }, err => {
        console.log(err);
      }
    );
  }
}
