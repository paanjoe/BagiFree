import { Component, OnInit, Input } from '@angular/core';
import { Product, Products } from '../../../shared/classes/product';
import { Swap } from 'src/app/shared/classes/swap';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss'],
})
export class ProductSliderComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  @Input() products: Products;

  private user: any;
  public boolDisplay = false;

  public productSlideConfig: any = {
    arrows: true,
    infinite: false,
    dots: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
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

  ngOnInit() {

  }


  postProduct() {
    this.user = this.authService.currentUser.toPromise();
      if (this.user) {
        this.router.navigate(['/pages/post-product']);
      } else {
        this.router.navigate(['../pages/login']);
      }
  }
}
