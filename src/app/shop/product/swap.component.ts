import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Product,
  Products,
  customer_feedback,
} from '../../shared/classes/product';
import { CartItem } from '../../shared/classes/cart-item';
import { ProductsService } from '../../shared/services/products.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { CartService } from '../../shared/services/cart.service';
import { Observable, of } from 'rxjs';
import { Swap } from 'src/app/shared/classes/swap';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {

  constructor(
    private router: Router,
    public productsService: ProductsService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}


  @Input() swaps: Swap;

  public variantImage: any = '';
  public selectedItem: any = '';
  public imgURL: string;
  public ratingList: customer_feedback[];
  public sum = 0;
  public c = 0;
  public avg = 0;

  async ngOnInit() {
    this.imgURL = this.swaps.swapImage_Ref[0].productImage;
    await this.getavg(this.swaps.userid.id);
  }

  getImg() {
    return this.imgURL;
  }

  async getavg(userid: number) {
    this.ratingList = await this.productsService.getratingByUserId(userid).toPromise();
    if (this.ratingList.length > 0) {
      this.doCalc(this.ratingList);
    } else {
      this.avg = 0;
    }
  }

  doCalc(data: customer_feedback[]) {
    data.forEach((element) => {
      this.sum += element.rating;
      this.c += 1;
    });
    this.avg = this.sum / this.c;
  }
  
}
