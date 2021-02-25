import { Component, OnInit, Pipe } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';
import {
  Product,
  ProductCategory,
  Products,
  ProductCondition,
  ProductsAge,
  ProductsSize,
  ProductImage_Ref,
} from 'src/app/shared/classes/product';
import {
  NzModalService,
  NzNotificationService,
  NzModalRef,
} from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Swap } from 'src/app/shared/classes/swap';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Router, ActivatedRoute } from '@angular/router';
import { Address } from 'src/app/shared/classes/address';
import { AddressService } from 'src/app/shared/services/address.service';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-blog-left-sidebar',
  templateUrl: './blog-left-sidebar.component.html',
  styleUrls: ['./blog-left-sidebar.component.scss'],
})
export class BlogLeftSidebarComponent implements OnInit {
  public searchForm: FormGroup;
  public pList: Products[];
  public searchText = '';
  public searchLocation = '';
  public searchCategory = '';
  public productCategoryCName: ProductCategory[];
  public statusLoad = false;
  private subscription: Subscription[] = [];

  constructor(
    private addressService: AddressService,
    private router: Router,
    private productService: ProductsService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      searchLocation: [null, [Validators.required]],
      searchType: [null, [Validators.required]],
      searchInput: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    this.statusLoad = true;
    this.productCategoryCName = await this.productService.productsCategory().toPromise();

    this.activatedRoute.queryParams.subscribe((params) => {
      const cat = params['category'];
      this.searchCategory = cat;
      this.searchForm = this.fb.group({
        searchLocation: [''],
        searchType: [cat],
        searchInput: [''],
      });
    });

    const res = await this.productService.getProducts().toPromise();
    this.pList = [...res];
    await this.pList.forEach((i) => {
      const c = this.productCategoryCName.find((itm) => {
        return itm.categoryID === i.productCategory_ID;
      });
      i.category = c.categoryTitle;
    });

    this.statusLoad = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.forEach((subs) => {
      subs.unsubscribe();
    });
  }

  search() {
    this.searchCategory = this.searchForm.controls['searchType'].value;
    this.searchLocation = this.searchForm.controls['searchLocation'].value;
    this.searchText = this.searchForm.controls['searchInput'].value;
  }
}
