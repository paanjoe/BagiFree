import { Component, OnInit } from '@angular/core';
import { addDays, distanceInWords } from 'date-fns';
import { Product, ProductCategory, Products, ProductCondition, ProductWeight, ProductSize, ProductsSize, product_request, ProductRequest_Full, SwapRequest_Full, customer_feedback } from 'src/app/shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';
import { HttpService } from '../../shared/services/http.service'
import { User } from 'src/app/shared/classes/user';
import { SwapRequest } from 'src/app/shared/classes/swap';
import { NzModalService } from 'ng-zorro-antd';



@Component({
  selector: 'app-myrating',
  templateUrl: './myrating.component.html',
  styleUrls: ['./myrating.component.scss']
})
export class MyratingComponent implements OnInit {

  data = [
    {
      author: 'Anonymous',
      content:
        'Good Giveaway',
      datetime: distanceInWords(new Date(), addDays(new Date(), 1))
    },
    {
      author: 'Anonymous',
      content:
      'The best product giveaway ever!',
      datetime: distanceInWords(new Date(), addDays(new Date(), 2))
    }
  ];


  constructor(private productService: ProductsService, private userService: HttpService, private modalService: NzModalService) { }

  public ratingList: customer_feedback[];

  ngOnInit() {
    this.productService.getratingByUserId(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((x) => {
      this.ratingList = [...x];
      console.log(this.ratingList);
      if (this.ratingList.length > 0) {
        this.doCalc(this.ratingList);
      } else {
        this.avg = '0';
      }
    });
  }

  public sum: number = 0;
  public c: number = 0;
  public avg: string = '';

  doCalc(data: customer_feedback[]) {
    data.forEach((element) => {
      this.sum += element.rating;
      this.c += 1;
    });
    let temporary: number;
    temporary = this.sum / this.c;

    this.avg = temporary.toFixed(1);

  }

}
