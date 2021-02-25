import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Product, Products, ProductImage_Ref, ProductCategory, ProductCondition, ProductsAge, product_request } from '../../../../shared/classes/product';
import { ProductsService } from '../../../../shared/services/products.service';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { CartService } from '../../../../shared/services/cart.service';
import { Observable, of } from 'rxjs';
import * as $ from 'jquery';
import { User } from 'src/app/shared/classes/user';
import { NzNotificationService, UploadFile, isTemplateRef } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressService } from 'src/app/shared/services/address.service';
import { Address } from 'src/app/shared/classes/address';
import { NgxImgZoomService } from 'ngx-img-zoom';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {
  public enableZoom: Boolean = true;
  public slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
  };

  public slideNavConfig = {
    vertical: false,
    slidesToShow: 4,
    'infinite': false,
    slidesToScroll: 1,
    asNavFor: '.product-slick',
    arrows: false,
    dots: false,
    focusOnSelect: true,
    pauseOnFocus: true
  };

  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };

  data = [
    {
      title: 'KARHOO COURIER'
    },
    {
      title: 'DHL ECOMMERCE'
    },
    {
      title: 'POSLAJU'
    },
    {
      title: 'MatDespatch'
    }
  ];

  public product            :   Products = {
                                  id: 0,
                                  productName: '',
                                  productBrand: '',
                                  productDescription: '',
                                  productCategory_ID: 0,
                                  productCondition_ID: 0,
                                  isAvailable: false,
                                  userid: {
                                    username: '',
                                    password: '',
                                    id: 0,
                                    email: '',
                                    mobile: '',
                                    token: '',
                                    mobileOption: 0
                                  },
                                  addressId: 0,
                                  productAge_ID: 0,
                                  productWeight: 0,
                                  status: false,
                                  productImage_Ref: null,
                                  address: null,
                                  product_request: null,
                                  condition: '',
                                  size: '',
                                  weight: '',
                                  category: '',
                                  age: ''
                                };

  public productOnInit      :   Products;
  public products           :   Products[] = [];
  public pImage             :   ProductImage_Ref[];
  public counter            :   number = 1; 
  public selectedSize       :   any = '';
  public iStyle                 = 'width:100%; height:100%;'
  public pCategory          :   ProductCategory[];
  public pCondition         :   ProductCondition[];
  public pAge               :   ProductsAge[];
  public uid                :   number;
  public btnDisabled        :   boolean = true;
  public req                :   product_request[];
  public reqObj             :   product_request;
  public isApproved         :   boolean = false;
  public isRequest          :   boolean = false;
  public userObj            :   User;
  public selfPickup         :   FormGroup;
  public editForm           :   FormGroup;
  public requestObj         :   product_request;
  public isDecided          :   boolean = false;
  public address            :   Address[];
  public editModal          :   Boolean = false;
  public isEditLoading      :   Boolean = false;
  public currModal          :   Products;
  public imageURL           :   String;
  public fileList = [];
  public loading            :   Boolean = false;
  public previewImage       :   string;
  public previewVisible     :   Boolean = false;
  public jkg                : ProductImage_Ref[];
  public isActive           : string = 'false';

  // Get Product By Id
  constructor(
    private ngxImgZoom: NgxImgZoomService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private productsService: ProductsService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private addressService: AddressService) {

      this.ngxImgZoom.setZoomBreakPoints([{w: 100, h: 100}, {w: 150, h: 150}, {w: 200, h: 200}, {w: 250, h: 250}, {w: 300, h: 300}]);

      this.loadDDL();

      this.editForm = this.fb.group({
        formLayout: ['vertical'],
        pName: [null, [Validators.required]],
        pCondition: [null, [Validators.required]],
        pAge: [null, [Validators.required]],
        pWeight: [null, [Validators.required]],
        pCategory: [null, [Validators.required]],
        isAvailable: [null, [Validators.required]],
        pDescription:[null, [Validators.required]],
        pBrand: [null, Validators.required],
        address: [null, Validators.required]
      });

      if (JSON.parse(localStorage.getItem('currentUser')) != null) {
        this.uid = JSON.parse(localStorage.getItem('currentUser')).id;
        this.addressService.getAddressByUserID(this.uid).subscribe((x) => {
          this.address = [...x];
        }, err => {
          console.log(err);
        });

        this.route.params.subscribe(params => { 
          const id = +params['id'];
          this.productsService.getProduct(id).subscribe(product => {
            this.userObj = product.userid;
            this.product = product;
            this.pImage = product.productImage_Ref;
            this.imageURL = this.pImage[0].productImage;
            this.productOnInit = product;
            this.req = [...product.product_request];
            this.reqObj = this.req.find((ele) => {
              return ele.userid === this.uid;
            });
            this.setButton(this.reqObj);
            this.getcname(this.productOnInit);
            this.req.forEach((element) => {
              if (element.userid === JSON.parse(localStorage.getItem('currentUser')).id) {
                this.requestObj = element;
              }
            });
          });
        });
      } else {
        // If no user logged in.
        this.route.params.subscribe(params => {
          const id = +params['id'];
          this.productsService.getProduct(id).subscribe((response) => {
            this.userObj = response.userid;
            this.product = response;
            this.pImage = response.productImage_Ref;
            this.imageURL = this.pImage[0].productImage;
            this.productOnInit = response;
            this.req = [...response.product_request];
            // setbutton
            this.getcname(this.productOnInit);
          });
        });
      }
    }

  ngOnInit() {
    this.selfPickup = this.fb.group({
      datePicker: [null, [Validators.required]],
      timePicker: [null, [Validators.required]]
    });

    this.getProduct();
  }

  getProduct() {
    if (JSON.parse(localStorage.getItem('currentUser')) != null) {
      this.uid = JSON.parse(localStorage.getItem('currentUser')).id;
      this.route.params.subscribe(params => { 
        const id = +params['id'];
        this.productsService.getProduct(id).subscribe((response) => {
          this.userObj = response.userid;
          this.product = response;
          this.productOnInit = response;
          this.req = [...response.product_request];
          this.reqObj = this.req.find((ele) => {
            return ele.userid === this.uid;
          });
          this.setButton(this.reqObj);
          this.getcname(this.productOnInit);
          this.req.forEach((element) => {
            if (element.userid === JSON.parse(localStorage.getItem('currentUser')).id) {
              this.requestObj = element;
            }
          });
        });
      });
    } else {
      // If no user logged in.
      this.route.params.subscribe(params => {
        const id = +params['id'];
        this.productsService.getProduct(id).subscribe((response) => {
          this.userObj = response.userid;
          this.productOnInit = response;
          this.req = [...response.product_request];
          // setbutton
          this.getcname(this.productOnInit);
        });
      });
    }
  }

  public remarksVisible: boolean = false;
  public remarksField: string = '';

  showRemarks() {
    this.remarksVisible = true;
  }

  remarkOk(id: number) {
    this.remarksVisible = false;
    this.requestProduct(id, this.remarksField);
  }
  remarkCancel() {
    this.remarksVisible = false;
  }

  requestProduct(id: number, remarks: string) {
    if (JSON.parse(localStorage.getItem('currentUser')) != null) {
      this.productsService.insertProductRequest(id, null, JSON.parse(localStorage.getItem('currentUser')).id, remarks).subscribe((res) => {
        this.getProduct();
      });
    } else {
      // If no user logged in.
    }
  }

  setButton(data: product_request) {
    if (data != null) {
      this.isRequest = true;
      this.isApproved = data.approved === true ? true : false;
      this.isDecided = data.isSelfPickup != null ? true : false;
    }
  }


  getcname(data: Products) {
    this.getProductCategory(data);
    this.getProductCondition(data);
    this.getProductAge(data);
  }

  getProductAge(data: Products) {
    if (this.pAge != null) {
      const c = this.pAge.find((item: ProductsAge) => {
        return item.productAge_ID === data.productAge_ID;
      });
      data.age = c.productAgeTitle;
    }
  }

  getProductCategory(data: Products) {
    if (this.pCategory != null) {
      const c = this.pCategory.find((item: ProductCategory) => {
        return item.categoryID === data.productCategory_ID;
      });
      data.category = c.categoryTitle;
    }
  }

  getProductCondition(data: Products) {
    if (this.pCondition != null) {
      const c = this.pCondition.find((item: ProductCondition) => {
        return item.productConditionID === data.productCondition_ID;
       });
      data.condition = c.productConditionTitle;
    }
  }

  loadDDL(): void {
    this.productsService.productsCategory().subscribe((data: any) => {
      this.pCategory = [...data];
    }, err => {
      console.log(err);
    });

    this.productsService.productsCondition().subscribe((data: any) => {
      this.pCondition = [...data];
    }, err => {
      console.log(err);
    });

    this.productsService.productAge().subscribe((data:any) => {
       this.pAge = [...data];
    }, err => {
      console.log(err);
    });

  }

  navigateToDashboard(){
    this.router.navigateByUrl('/pages/dashboard');
  }
  navigateToProceed(){
    this.router.navigateByUrl('/pages/dashboard');
  }


  onMouseOver(event: any): void {
    const target = event.target.currentSrc;
    this.imageURL = target;
  }


  public increment() { 
      this.counter += 1;
  }

  public decrement() {
      if(this.counter >1){
         this.counter -= 1;
      }
  }

  // For mobile filter view
  public mobileSidebar() {
    $('.collection-filter').css('left', '-15px');
  }

  // Add to cart
  public addToCart(product: Product, quantity) {
    if (quantity == 0) return false;
    this.cartService.addToCart(product, parseInt(quantity));
  }

  // Add to cart
  public buyNow(product: Product, quantity) {
     if (quantity > 0) 
       this.cartService.addToCart(product,parseInt(quantity));
       this.router.navigate(['/home/checkout']);
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
     this.wishlistService.addToWishlist(product);
  }

  
  // Change size variant
  public changeSizeVariant(variant) {
     this.selectedSize = variant;
  }

  public isVisible: boolean = false;
  public isVisible2: boolean = false;

  showModal(): void {
    this.isVisible = true;
  }

  showModal2(): void {
    this.isVisible2 = true;
  }

  handleOk(): void {
    let url = 'https://delyva.com/my/check-rates?o.address=klcc&o.postcode=56000&o.country=MY&o.lat=&o.lng=&o.opt=address&d.address=alor+setar&d.postcode=Bukit+Damansara&d.country=MY&d.lat=&d.lng=&weight=4&itemType=TASK&d.opt=address';
    window.open(url);
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  handleOk2(): void {
    let x = new Date();
    let y = new Date();
    x = this.selfPickup.controls['datePicker'].value;
    y = this.selfPickup.controls['timePicker'].value;

    this.requestObj.pickupDate = new Date(x.getFullYear(), x.getMonth(), x.getDate(), y.getHours(), y.getMinutes());
    this.requestObj.isSelfPickup = true;
    this.requestObj.isNotified = true;
    this.requestObj.isCompleted = false;
    this.productsService.updateProductRequest(this.requestObj).subscribe((itm) => {
      //this.createNotification();
      this.isDecided = true;
      this.isVisible2 = false;
      this.success();
    });
  }

  success(): void {
    this.modalService.success({
      nzTitle: 'Thank you for using BagiFree. Do you like BagiFree?',
      // tslint:disable-next-line: max-line-length
      nzContent: 'We need your help today to keep this platform up and running so that this exchanges of love between people to people and people to earth can thrive for as long as we can. Your every bit of donation will go back to the BagiFree community and will not be put to waste. Your contribution is a testimony of your love to humanity, your care for cleaner earth and above all, your belief that GIVING is what makes this world a happy place to live together. Please click the ‘Love2Support’ button below to make donation.',
      nzOkText: 'Love2Support',
      nzOnOk: () => this.router.navigate(['pages/donate']),
      nzCancelText: 'No Thanks'
    });
  }

  handleCancel2(): void {
    this.isVisible2 = false;
  }

  createNotification(): void {
    this.notification.create(
      'success',
      'Successful!',
      'Self-Pickup information has been sent to the owner. They will keep in touch with you shortly.'
    );
  }

  showConfirm(): void {
    this.modalService.confirm({
      nzTitle: '<i>Contact Information</i>',
      nzContent: `<b>Owner Name: ${this.userObj.username}</b><br/><b>Mobile Number: <a href="tel:0${this.userObj.mobile}">0${this.userObj.mobile}</a></b><br/><b>Email Address:  <a href="mailto:${this.userObj.email}?Subject=BagiFree%20Request">${this.userObj.email}</a></b>`,
      nzOnOk: () => console.log('')
    });
  }


  change(): void {
    this.loading = true;
    if (this.data.length > 0) {
      setTimeout(() => {
        this.data = [];
        this.loading = false;
      }, 1000);
    } else {
      setTimeout(() => {
        this.data = [
          {
            title: 'Ant Design Title 1'
          },
          {
            title: 'Ant Design Title 2'
          },
          {
            title: 'Ant Design Title 3'
          },
          {
            title: 'Ant Design Title 4'
          }
        ];
        this.loading = false;
      }, 1000);
    }
  }



  editOK(): void {
    this.isEditLoading = true;
    setTimeout(() => {
      this.editModal = false;
      this.updateRecord(this.currModal);
    }, 2000);
  }


  updateRecord(data: Products) {
    data.productName = this.editForm.controls['pName'].value;
    data.productBrand = this.editForm.controls['pBrand'].value;
    data.productCategory_ID = this.editForm.controls['pCategory'].value;
    data.productCondition_ID = this.editForm.controls['pCondition'].value;
    data.productDescription = this.editForm.controls['pDescription'].value;
    data.productAge_ID = this.editForm.controls['pAge'].value;
    data.isAvailable = this.editForm.controls['isAvailable'].value;
    data.productWeight = this.editForm.controls['pWeight'].value;

    const c = this.address.find((itm) => {
      return itm.id === this.editForm.controls['address'].value;
    });

    data.address = c;
    this.productsService.updateProduct(data).subscribe((x) => {
      this.isEditLoading = false;
      this.getProduct();
    }, err => {
      console.log(err);
      this.isEditLoading = false;
    });
  }

  cancelEdit(): void {
    this.editModal = false;
  }


  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }


  showEdit(data: Products): void {
    this.address.forEach((itm) => {
      let finalstring: string = '';

      if (itm.address1 !== '') {
        finalstring += itm.address1 + ', ';
      }

      if (itm.address2 !== '') {
        finalstring += itm.address2 + ', ';
      }

      if (itm.postalCode !== null) {
        finalstring += itm.postalCode + ', ';
      }

      // address1, address 2, 05150 Alor Setar, Kedah, Malaysia
      if (finalstring !== '') {
        finalstring += itm.city + ', ' + itm.state + ', ' + itm.country;
      } else {
        finalstring += itm.city + ', ' + itm.state + ', ' + itm.country;
      }
        itm.finalstring = finalstring;
    });
    this.jkg = data.productImage_Ref;
    const bar = new Promise((resolve, reject) => {
      this.fileList = [];
      this.jkg.forEach((itm) => {
        let x = {
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: itm.productImage
        };
        this.fileList.push(x);
      });
      resolve();
    });

    bar.then(() => {
      this.currModal = data;
      this.editModal = true;
      this.isActive = data.isAvailable.toString();

      let isAvail: String = 'false';
      if (data.isAvailable === true) {
        isAvail = 'true';
      }

      this.editForm = this.fb.group({
        pId: [data.id, [Validators.required]],
        pName: [data.productName, [Validators.required]],
        pCondition: [data.productCondition_ID, [Validators.required]],
        pCategory: [data.productCategory_ID, [Validators.required]],
        isAvailable: [isAvail, [Validators.required]],
        pDescription: [data.productDescription, [Validators.required]],
        pBrand: [data.productBrand, [Validators.required]],
        pAge: [data.productAge_ID, [Validators.required]],
        pWeight: [data.productWeight, [Validators.required]],
        address: [data.address.id, [Validators.required]]
      });
    });
  }
}
