import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ProductsService } from "../../../../shared/services/products.service"
import { ProductCategory } from 'src/app/shared/classes/product';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(private productService: ProductsService) { }
  
public r: string = "/blog/left-sidebar";
  public categoryList: ProductCategory[];
  // collapse toggle
  ngOnInit() {
    this.productService.productsCategory().subscribe((itm) => {
      this.categoryList = [...itm];
    });


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

  // For mobile view
  public mobileFilterBack() {
     $('.collection-filter').css("left", "-365px");
  }

}
