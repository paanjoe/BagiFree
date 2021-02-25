import { Component, OnInit, Pipe } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';
import { Product, ProductCategory, Products, ProductCondition,
  ProductsAge, ProductsSize, ProductImage_Ref } from 'src/app/shared/classes/product';
import { NzModalService, NzNotificationService, NzModalRef } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Swap } from 'src/app/shared/classes/swap';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Router, ActivatedRoute } from '@angular/router';
import { Address } from 'src/app/shared/classes/address';
import { AddressService } from 'src/app/shared/services/address.service';
import { element } from 'protractor';
@Component({
  selector: 'app-blog-left-sidebar',
  templateUrl: './blog-left-sidebar.component.html',
  styleUrls: ['./blog-left-sidebar.component.scss']
})

export class BlogLeftSidebarComponent implements OnInit {

  public searchForm: FormGroup;
  public pList: Products[];
  public searchText: string = '';
  public searchLocation: string = '';
  public searchCategory: string = '';
  public productCategoryCName: ProductCategory[];

  constructor(private addressService: AddressService, private router: Router,
    private productService: ProductsService, private modalService: NzModalService, private notification: NzNotificationService,
    private fb: FormBuilder, private activatedRoute: ActivatedRoute) {
      this.searchForm = this.fb.group({
        searchLocation: [null, [Validators.required]],
        searchType: [null, [Validators.required]],
        searchInput: [null, [Validators.required]]
      });
     }

     statusLoad = false;

  ngOnInit() {
    this.statusLoad = true;

    this.activatedRoute.queryParams.subscribe(params => {
      const cat = params['category'];
      this.searchCategory = cat;
      this.searchForm = this.fb.group({
        searchLocation: [''],
        searchType: [cat],
        searchInput: ['']
      });
    });

    this.productService.productsCategory().subscribe((res) => {
      this.productCategoryCName = [...res];
    });

    this.productService.getProducts().subscribe((res) => {
      this.pList = [...res];
      this.pList.forEach((ele) => {
        const c = this.productCategoryCName.find((item: ProductCategory) => {
          return item.categoryID === ele.productCategory_ID;
        });
        ele.category = c.categoryTitle;
      });
      this.statusLoad = false;
    });
  }

    search() {
      this.statusLoad = true;
      this.searchCategory= this.searchForm.controls['searchType'].value;
      this.searchLocation = this.searchForm.controls['searchLocation'].value;
      this.searchText = this.searchForm.controls['searchInput'].value;
    }
}
