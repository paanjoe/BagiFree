import { Component, OnInit, Input } from '@angular/core';
import { Product, Products } from '../../../shared/classes/product';
import { Swap } from 'src/app/shared/classes/swap';
declare var $: any;

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrls: ['./product-tab.component.scss']
})
export class ProductTabComponent implements OnInit {

  @Input() swaps: Swap;

  constructor() { }

  ngOnInit() {
    
  }


  public productSlideConfig: any = {
    infinite: false,
    dots: true,
    arrows: true,
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
}
