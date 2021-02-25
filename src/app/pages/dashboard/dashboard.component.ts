import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';
import { User } from 'src/app/shared/classes/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private httpService: HttpService,
    private modalService: NzModalService
  ) { }

  public username: string;
  public email = '';
  public mobile = '';
  public loading = true;
  public editMode = false;
  public active = 0;
  public currentUser: User;
  private subscrption: Subscription[] = [];

  async ngOnInit() {
    this.subscrption.push(this.authService.currentUser.subscribe((x) => (this.currentUser = x)));

    const { id = 0 } = this.currentUser;

    this.subscrption.push(this.httpService.getUserProfile(id).subscribe(
      (res: User) => {
        this.loading = false;
        this.email = res.email;
        if (res.mobile.startsWith('0') || res.mobile.startsWith('6')) {
          this.mobile = res.mobile;
        } else {
          this.mobile = '0' + res.mobile;
        }
        this.username = res.username;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    ));
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.subscrption.forEach((itm) => {
      itm.unsubscribe();
    });
  }

  showEdit() {
    this.editMode = true;
  }

  switchTab(idx: number) {
    this.active = idx;
    this.editMode = false;
  }

  onLogout() {
    this.modalService.warning({
      nzTitle: 'Are you sure to logout?',
      nzContent: '',
      nzOnOk: () => this.logout(),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['../pages/login']);
  }
}
