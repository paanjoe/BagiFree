import { Component, OnInit } from '@angular/core';
import {
  Product,
  Products,
  ProductsAge,
  ProductCategory,
  ProductCondition,
} from '../../shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';
import { Swap } from 'src/app/shared/classes/swap';
import { merge, interval, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private productsService: ProductsService) {}

  public products: Products[] = [];
  public swaps: Swap[] = [];
  public pCategory: ProductCategory[] = [];
  public pCondition: ProductCondition[] = [];
  public pAge: ProductsAge[] = [];
  public statusLoadBagiFree = false;
  public statusLoadSwap = false;
  public productSlideConfig: any = {
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  async ngOnInit() {
    // Loading status
    this.statusLoadBagiFree = true;
    this.statusLoadSwap = true;

    this.pCategory = await this.productsService.productsCategory().toPromise();
    this.pCondition = await this.productsService
      .productsCondition()
      .toPromise();
    this.pAge = await this.productsService.productAge().toPromise();

    this.getpro();
    this.getswa();

    this.randomConfig();
  }

  randomConfig() {
    $('#tab-1').css('display', 'Block');
    $('.default').css('display', 'Block');
    $('.tabs li a').on('click', function() {
      event.preventDefault();
      $(this)
        .parent()
        .parent()
        .find('li')
        .removeClass('current');
      $(this)
        .parent()
        .addClass('current');
      let currunt_href = $(this).attr('href');
      $('#' + currunt_href).show();
      $(this)
        .parent()
        .parent()
        .parent()
        .find('.tab-content')
        .not('#' + currunt_href)
        .css('display', 'none');
    });
  }

  async getswa() {
    this.swaps = await this.productsService.getSwap().toPromise();
    await this.getcnameswap(this.swaps).then(
      () => {
        this.statusLoadSwap = false;
      },
      () => {
        this.statusLoadSwap = false;
      }
    );
  }

  async getpro() {
    this.products = await this.productsService.getProducts().toPromise();
    await this.getcname(this.products).then(
      () => {
        this.statusLoadBagiFree = false;
      },
      () => {
        this.statusLoadBagiFree = false;
      }
    );
  }

  async getcname(data: Products[]) {
    await this.getProductCategory(data);
    await this.getProductCondition(data);
    await this.getProductAge(data);
  }

  async getcnameswap(data: Swap[]) {
    await this.getswapProductCategory(data);
    await this.getswapProductCondition(data);
    await this.getswapProductAge(data);
  }

  getswapProductAge(data: Swap[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c: ProductsAge = this.pAge.find(
          (item: ProductsAge) => item.productAge_ID === element.productAge_ID
        );
        if (c !== null) {
          element.age = c.productAgeTitle;
        }
      });
    }
  }

  getswapProductCategory(data: Swap[]) {
    if (data !== [] && data !== null) {
      data.forEach((element) => {
        const c: ProductCategory = this.pCategory.find(
          (item: ProductCategory) =>
            item.categoryID === element.productCategory_ID
        );
        if (c !== null) {
          element.category = c.categoryTitle;
        }
      });
    }
  }

  getswapProductCondition(data: Swap[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c: ProductCondition = this.pCondition.find(
          (item: ProductCondition) =>
            item.productConditionID === element.productCondition_ID
        );
        if (c !== null) {
          element.condition = c.productConditionTitle;
        }
      });
    }
  }

  getProductAge(data: Products[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c: ProductsAge = this.pAge.find(
          (item: ProductsAge) => item.productAge_ID === element.productAge_ID
        );
        if (c !== null) {
          element.age = c.productAgeTitle;
        }
      });
    }
  }

  getProductCategory(data: Products[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c: ProductCategory = this.pCategory.find(
          (item: ProductCategory) =>
            item.categoryID === element.productCategory_ID
        );
        if (c !== null) {
          element.category = c.categoryTitle;
        }
      });
    }
  }

  getProductCondition(data: Products[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c: ProductCondition = this.pCondition.find(
          (item: ProductCondition) =>
            item.productConditionID === element.productCondition_ID
        );
        if (c !== null) {
          element.condition = c.productConditionTitle;
        }
      });
    }
  }
}
