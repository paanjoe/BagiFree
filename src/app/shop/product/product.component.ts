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
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  constructor(
    private router: Router,
    public productsService: ProductsService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}
  @Input() products: Products;

  public variantImage: any = '';
  public selectedItem: any = '';
  public avg = 0;
  public ratingList: customer_feedback[];
  public sum = 0;
  public c = 0;

  async ngOnInit() {
    await this.getavg(this.products.userid.id);
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
