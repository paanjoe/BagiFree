import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, Products, customer_feedback } from '../../shared/classes/product';
import { CartItem } from '../../shared/classes/cart-item';
import { ProductsService } from '../../shared/services/products.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { CartService } from '../../shared/services/cart.service';
import { Observable, of } from 'rxjs';
import { Swap } from 'src/app/shared/classes/swap';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements OnInit {

  @Input() swaps : Swap;

  public variantImage  :  any = ''; 
  public selectedItem  :  any = '';

  constructor(private router: Router, public productsService: ProductsService, 
    private wishlistService: WishlistService, private cartService: CartService) { 
  }

  imgURL: string;

  ngOnInit() {
     this.imgURL = this.swaps.swapImage_Ref[0].productImage;
     this.getavg(this.swaps.userid.id);
    // console.log(this.swaps.swapImage_Ref);
  }

  getImg(){
    return this.imgURL;
  }
  getavg(userid: number) {
    this.productsService.getratingByUserId(userid).subscribe((rating) => {
      this.ratingList = [...rating];
      if (this.ratingList.length > 0) {
        this.doCalc(this.ratingList);
      } else {
        this.avg = 0;
      }
    });
  }
  public ratingList: customer_feedback[];
  public sum: number = 0;
  public c: number = 0;
  public avg: number = 0;

  doCalc(data: customer_feedback[]){
    data.forEach((element) => {
      this.sum += element.rating;
      this.c += 1;
    });
    this.avg = this.sum / this.c;
  }
}
