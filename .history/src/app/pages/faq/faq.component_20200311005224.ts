import { Component, OnInit } from '@angular/core';
import { FAQService } from '../../shared/services/faq.service';
import { ProductsService } from '../../shared/services/products.service';
import { faq } from 'src/app/shared/classes/faq';
import { ProductSize } from 'src/app/shared/classes/product';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(private faqservice: FAQService,
              private productservice: ProductsService) { }

  public listFAQ: faq[];

  spinstatus = true;

  ngOnInit() {
    this.productservice.getAllFAQ().subscribe((res) => {
      this.listFAQ = [...res];
      this.spinstatus = false;
    });
  }

}
