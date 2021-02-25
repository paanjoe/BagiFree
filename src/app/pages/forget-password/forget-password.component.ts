import { Component, OnInit } from '@angular/core';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  email:string = "";

  constructor(private notification: NzNotificationService, private httpService: HttpService) { }

  ngOnInit() {
  }

    public results: boolean = false;
  onSubmit(){
    console.log(this.email);
    
    this.httpService.forgotPassword(this.email).subscribe((x) => {
      console.log(x);
    })

    if(this.results == true) {
      //Success
      this.notification.create(
        'success',
        'Success',
        'An email password recovery has been sent to '+ this.email +' , please check in your inbox/spam folder.'
      );
    } else {
      //Failed
    this.notification.create(
      'error',
      'Failed',
      'Opps! There is something wrong when sending an email. Please try again.'
    );
    }
    
  }

}
