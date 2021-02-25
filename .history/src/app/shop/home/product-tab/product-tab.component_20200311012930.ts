import { Component, OnInit, Input } from '@angular/core';
import { Product, Products } from '../../../shared/classes/product';
import { Swap } from 'src/app/shared/classes/swap';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrls: ['./product-tab.component.scss']
})
export class ProductTabComponent implements OnInit {

  @Input() swaps: Swap;

  constructor(private authService: AuthService, private router: Router) { }
boolDisplay = false;
  ngOnInit() {
    // if (this.swaps.id == null) {
    //   this.boolDisplay = true;
    // }
  }

  private user: any;
  postProduct() {
    this.user = this.authService.currentUser.subscribe(x => {
      if (x) {
        this.router.navigate(['/pages/post-product']);
      } else {
        this.router.navigate(['../pages/login']);
      }
    });
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
