import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ProductsService } from '../../../../shared/services/products.service';
import { ProductCategory } from 'src/app/shared/classes/product';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-swapcategories',
  templateUrl: './swapcategories.component.html',
  styleUrls: ['./swapcategories.component.scss'],
})
export class SwapCategoriesComponent implements OnInit {
  constructor(private productService: ProductsService) {}

  public r = '/home/category';
  public categoryList: ProductCategory[];
  private subscription: Subscription;
  public mobileFilterBack() {
    $('.collection-filter').css('left', '-365px');
  }

  ngOnInit() {
    this.subscription = this.productService.productsCategory().subscribe((itm) => {
      this.categoryList = [...itm];
    });


  }

  pageConfig() {
    $('.collapse-block-title').on('click', function(e) {
      e.preventDefault;
      var speed = 300;
      var thisItem = $(this).parent(),
        nextLevel = $(this).next('.collection-collapse-block-content');
      if (thisItem.hasClass('open')) {
        thisItem.removeClass('open');
        nextLevel.slideUp(speed);
      } else {
        thisItem.addClass('open');
        nextLevel.slideDown(speed);
      }
    });
  }

  ngOnDestory() {
    this.subscription.unsubscribe();
  }
}
