import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../classes/product';
import { WishlistService } from '../../../../services/wishlist.service';
import { ProductsService } from '../../../../../shared/services/products.service';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/classes/user';
import { CartItem } from 'src/app/shared/classes/cart-item';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar-one.component.html',
  styleUrls: ['./topbar-one.component.scss']
})

export class TopbarOneComponent implements OnInit {
  isAuthenticated : boolean;
  currentUser : User;

  constructor(private router : Router, public productsService: ProductsService, private authService : AuthService) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(x => this.currentUser = x );
   }

   onLogout(){
     try {
     this.authService.logout();
       this.router.navigate(['../../pages/home']);
     } catch (error) {
       
     }
     
   }

}
