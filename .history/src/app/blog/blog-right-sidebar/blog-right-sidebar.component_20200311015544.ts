import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';
import { Product, ProductCategory, Products, ProductCondition, ProductsAge, ProductsSize, ProductImage_Ref } from 'src/app/shared/classes/product';
import { NzModalService, NzNotificationService, NzModalRef } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Swap } from 'src/app/shared/classes/swap';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Router, ActivatedRoute } from '@angular/router';
import { Address } from 'src/app/shared/classes/address';
import { AddressService } from 'src/app/shared/services/address.service';

@Component({
  selector: 'app-blog-right-sidebar',
  templateUrl: './blog-right-sidebar.component.html',
  styleUrls: ['./blog-right-sidebar.component.scss']
})
export class BlogRightSidebarComponent implements OnInit {
  public searchForm: FormGroup;
  public sList: Swap[];
  public searchText: string = '';
  public searchLocation: string = '';
  public searchCategory: string = '';
  public productCategoryCName: ProductCategory[];


  constructor(private addressService: AddressService, private router: Router, private productService: ProductsService, 
    private modalService: NzModalService, private notification: NzNotificationService, private activatedRoute: ActivatedRoute,
    private fb: FormBuilder) {
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

    this.productService.getSwap().subscribe((res) => {
      this.sList = [...res];

      this.sList.forEach((ele) => {
        const c = this.productCategoryCName.find((item: ProductCategory) => {
          return item.categoryID === ele.productCategory_ID;
        });
        ele.category = c.categoryTitle;
      });

      this.statusLoad = false;
    });
  }

  search() {
    this.searchCategory= this.searchForm.controls['searchType'].value;
    this.searchLocation = this.searchForm.controls['searchLocation'].value;
    this.searchText = this.searchForm.controls['searchInput'].value;
  }

}
