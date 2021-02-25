import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from '../../../shared/classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homearea',
  templateUrl: './homearea.component.html',
  styleUrls: ['./homearea.component.scss']
})
export class HomeareaComponent implements OnInit {
  isVisible = false;
  private user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  showDesc() {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  postProduct() {
    this.user = this.authService.currentUser.subscribe(x => {
      if (x) {
        this.router.navigate(['/pages/post-product']);
      } else {
        this.router.navigate(['../pages/login']);
      }
    });
  }


  /* to refresh the token */
  navigateToDashboard() {
    this.user = this.authService.currentUser.subscribe(x => {
      if(x) {
        this.router.navigate(['/pages/post-product']);
      } else {
        this.router.navigate(['/pages/login']);
      }
    });
  }

  findGiveaway(){
    this.router.navigate(['/search/bagifree']);
  }

  findSwap(){
    this.router.navigate(['/search/swap']);
  }

  ngOnDestroy() {
    // this.user.unsubscribe();
  }
}
