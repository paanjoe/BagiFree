import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { ProductsService } from '../../../../shared/services/products.service';
import { ProductCategory } from 'src/app/shared/classes/product';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  constructor(private productService: ProductsService) {}

  public r = '/search/bagifree';
  public categoryList: ProductCategory[];
  private subscription: Subscription;
  public mobileFilterBack() {
    $('.collection-filter').css('left', '-365px');
  }

  ngOnInit() {
    this.subscription = this.productService.productsCategory().subscribe((itm) => {
      this.categoryList = [...itm];
    });

    this.pageConfig();
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

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
