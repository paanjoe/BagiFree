import { Component, OnInit, Input } from '@angular/core';
import { Product, Products } from '../../../shared/classes/product';
import { Swap } from 'src/app/shared/classes/swap';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss']
})
export class ProductSliderComponent implements OnInit {

  constructor() { }
  @Input() products: Products;

  public productSlideConfig: any = {
    arrows: true,
    infinite: false,
    dots: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
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

  boolDisplay = false;
  ngOnInit() {
    console.log(this.products);
    if (this.products == []) {
      this.boolDisplay = true;
    }
  }

}
