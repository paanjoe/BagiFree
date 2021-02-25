import { Component, OnInit } from '@angular/core';
import { Product, Products, ProductsAge, ProductCategory, ProductCondition } from '../../shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';
import { Swap } from 'src/app/shared/classes/swap';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private productsService: ProductsService) { }

  public products: Products[] = [];
  public swaps: Swap[] = [];
  public pCategory: ProductCategory[] = [];
  public pCondition: ProductCondition[] = [];
  public pAge: ProductsAge[] = [];


  public productSlideConfig: any = {
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [{
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    ]
  };

  statusLoadBagiFree = false;
  statusLoadSwap = false;

  ngOnInit() {
    this.statusLoadBagiFree = true;
    this.statusLoadSwap = true;
    this.loadDDL();
    this.getpro();
    this.getswa();

    $('#tab-1').css('display', 'Block');
    $('.default').css('display', 'Block');
    $('.tabs li a').on('click', function () {
      event.preventDefault();
      $(this).parent().parent().find('li').removeClass('current');
      $(this).parent().addClass('current');
      let currunt_href = $(this).attr('href');
      $('#' + currunt_href).show();
      $(this).parent().parent().parent().find('.tab-content').not('#' + currunt_href).css('display', 'none');
    });
  }

  getswa() {
    this.productsService.getSwap().subscribe((swaps) => {
      this.swaps = swaps;
      this.getcnameswap(this.swaps);
      this.statusLoadSwap = false;
    }, () => { this.statusLoadSwap = false; });
  }

  getpro() {
    this.productsService.getProducts().subscribe((products) => {
      this.products = products;
      this.getcname(this.products);
      this.statusLoadBagiFree = false;
    }, () => { this.statusLoadBagiFree = false; });
  }

  getcname(data: Products[]) {
    this.getProductCategory(data);
    this.getProductCondition(data);
    this.getProductAge(data);
  }

  getcnameswap(data: Swap[]) {
    this.getswapProductCategory(data);
    this.getswapProductCondition(data);
    this.getswapProductAge(data);
  }
  getswapProductAge(data: Swap[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c: ProductsAge = this.pAge.find((item: ProductsAge) => item.productAge_ID === element.productAge_ID);
        if (c === null) {
          element.age = c.productAgeTitle;
        }
      });
    }
  }

  getswapProductCategory(data: Swap[]) {
    if (data !== [] && data !== null) {
      data.forEach((element) => {
        const c = this.pCategory.find((item: ProductCategory) => item.categoryID === element.productCategory_ID);
        element.category = c.categoryTitle;
      });
    }
  }

  getswapProductCondition(data: Swap[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pCondition.find((item: ProductCondition) => item.productConditionID === element.productCondition_ID);
        element.condition = c.productConditionTitle;
      });
    }
  }

  getProductAge(data: Products[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pAge.find((item: ProductsAge) => item.productAge_ID === element.productAge_ID);
        element.age = c.productAgeTitle;
      });
    }
  }

  getProductCategory(data: Products[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pCategory.find((item: ProductCategory) => item.categoryID === element.productCategory_ID);
        element.category = c.categoryTitle;
      });
    }
  }

  getProductCondition(data: Products[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pCondition.find((item: ProductCondition) => item.productConditionID === element.productCondition_ID);
        element.condition = c.productConditionTitle;
      });
    }
  }

  loadDDL(): void {
    this.productsService.productsCategory().subscribe((data: any) => {
      this.pCategory = [...data];
    }, err => {
      console.log(err);
    });

    this.productsService.productsCondition().subscribe((data: any) => {
      this.pCondition = [...data];
    }, err => {
      console.log(err);
    });

    this.productsService.productAge().subscribe((data: any) => {
      this.pAge = [...data];
    }, err => {
      console.log(err);
    });

  }
}
