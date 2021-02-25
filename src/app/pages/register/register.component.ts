import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl, Form } from "@angular/forms";
import { HttpService } from '../../shared/services/http.service';
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})


export class RegisterComponent implements OnInit {
  form: FormGroup;
  terms: FormControl;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  mobile: FormControl;
  mobileOption: FormControl;
  isHidden: boolean = true;

  constructor(private fb: FormBuilder, private httpService : HttpService, private router :Router) {

    this.username = new FormControl('', [Validators.required, Validators.minLength(4)]);
    this.email = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required,Validators.minLength(6)]);
    this.mobile = new FormControl('', [Validators.required]);
    this.mobileOption = new FormControl(null,[]);
    this.terms = new FormControl(false, [Validators.required]);

    this.form = new FormGroup({
      username: this.username,
      password: this.password,
      email: this.email,
      mobile: this.mobile,
      mobileOption: this.mobileOption,
      terms: this.terms
    });

    this.onChanges();
    // this.onChanges2();
  }

  onChanges() {
    this.form.get('mobile').valueChanges.subscribe(val => {
      this.form.controls['mobileOption'].setValidators([val !== null ? Validators.required :  null]);
      this.form.controls['mobileOption'].updateValueAndValidity();
    });
  }

  onChanges2(){
    this.form.get('mobileOption').valueChanges.subscribe(val => {
      // this.mobileOption = new FormControl(null, [Validators.required, Validators.minLength(10)]); 
      this.form.controls['mobile'].setValidators([Validators.required,Validators.minLength(10)]);
      this.form.controls['mobile'].updateValueAndValidity();
  });

  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  displayMobileChange(val){

  }

  ngOnInit() {

  }

  isLoadingOne = false;

  onRegister() {
    
    const { mobile = '', mobileOption = '', email = '', username = '', password = '' } = this.form.value;

    if (mobile) { 
      if (mobileOption) {
       this.register(); 
      } else {
        alert('Please choose mobile option');
      }
    } else {
      this.register();
    }
  }

  register(){
    this.isLoadingOne = true;
    const { mobile = '', mobileOption = '', email = '', username = '', password = '' } = this.form.value;
    this.httpService.registerUser(username, password, mobile, parseInt(mobileOption), email).subscribe(res => {
      this.router.navigateByUrl("/");
      this.isLoadingOne = false;
    }, err => {
      this.isLoadingOne = false;
      console.log('err',err)
    })
  }
}
