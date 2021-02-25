import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Product,
         Products,
         ProductImage_Ref,
         ProductCategory,
         ProductCondition,
         ProductsAge,
         product_request, 
         swap_request} from '../../../../shared/classes/product';
import { ProductsService } from '../../../../shared/services/products.service';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { CartService } from '../../../../shared/services/cart.service';
import { Observable, of } from 'rxjs';
import * as $ from 'jquery';
import { User } from 'src/app/shared/classes/user';
import { NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { Swap, SwapImage_Ref, SwapRequest } from 'src/app/shared/classes/swap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { AddressService } from 'src/app/shared/services/address.service';
import { Address } from 'src/app/shared/classes/address';

@Component({
  selector: 'app-product-right-sidebar',
  templateUrl: './product-right-sidebar.component.html',
  styleUrls: ['./product-right-sidebar.component.scss']
})
export class ProductRightSidebarComponent implements OnInit {

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

  public swap            :   Swap = {
                              id: 0,
                              productName: '',
                              productCondition_ID: 0,
                              productWeight: 0,
                              productBrand: '',
                              productDescription: '',
                              productCategory_ID: 0,
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
                              estVal: '',
                              address: null,
                              productAge_ID: 0,
                              status: false,
                              swapImage_Ref: null,
                              condition: '',
                              size: '',
                              weight: '',
                              category: '',
                              age: '',
                              swap_request: null,
                              preferredItem: ''
                              };
    public visibleModal       : Boolean = false;
    public isSwapAvail        : Boolean = true;
    public swapOnInit         :   Swap;
    public swaps              :   Swap[] = [];
    public sImage             :   SwapImage_Ref[];
    public counter            :   number = 1;
    public selectedSize       :   any = '';
    public iStyle                 = "width:100%; height:100%;"
    public pCategory          :   ProductCategory[];
    public pCondition         :   ProductCondition[];
    public pAge               :   ProductsAge[];
    public uid                :   number;
    public btnDisabled        :   Boolean = true;
    public req                :   SwapRequest[];
    public reqObj             :   SwapRequest;
    public isApproved         :   Boolean = false;
    public isRequest          :   Boolean = false;
    public userObj            :   User;
    public selfPickup         :   FormGroup;
    public isDecided          :   Boolean = false;
    public imageURL           :   String;
    public editForm           :   FormGroup;
    public address            :   Address[];
    public requestObj         :   SwapRequest;
    public mySwapItem         :   Swap[] = [];
    public selectedSwapItem   :   number = 0;

  // Get Product By Id
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    public productsService: ProductsService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private addressService: AddressService
    ) {

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
        address: [null, Validators.required],
        pItem: [null, Validators.required]
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
          this.productsService.getSwapbyID(id).subscribe(product => {
            this.userObj = product.userid;
            this.swap = product;
            this.sImage = product.swapImage_Ref;
            this.imageURL = this.sImage[0].productImage;
            this.swapOnInit = product;
            this.req = [...product.swap_request];
            this.reqObj = this.req.find((ele) => {
              return ele.userid === this.uid;
            });
            this.setButton(this.reqObj);
            this.getcname(this.swapOnInit);
            this.req.forEach((element) => {
              if (element.userid === JSON.parse(localStorage.getItem('currentUser')).id) {
                this.requestObj = element;
              }
            });
          });
        });
      } else {
        this.route.params.subscribe(params => {
          const id = +params['id'];
          this.productsService.getSwapbyID(id).subscribe(product => {
            this.userObj = product.userid;
            this.swap = product;
            this.sImage = product.swapImage_Ref;
            this.imageURL = this.sImage[0].productImage;
            this.swapOnInit = product;
            this.req = [...product.swap_request];
            // setbutton
            this.getcname(this.swapOnInit);
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
       this.productsService.getSwapbyID(id).subscribe((response) => {
         this.userObj = response.userid;
         this.swap = response;
         this.swapOnInit = response;
         this.sImage = response.swapImage_Ref;
        this.imageURL = this.sImage[0].productImage;
         this.req = [...response.swap_request];
         this.reqObj = this.req.find((ele) => {
           return ele.userid === this.uid;
          });
         this.setButton(this.reqObj);
         this.getcname(this.swapOnInit);
         this.req.forEach((element) => {
           if (element.userid === JSON.parse(localStorage.getItem('currentUser')).id) {
             this.requestObj = element;
           }
         });
       });
     });
    } else {
      this.route.params.subscribe(params => {
        const id = +params['id'];
        this.productsService.getSwapbyID(id).subscribe((response) => {
          this.userObj = response.userid;
          this.swapOnInit = response;
          this.sImage = response.swapImage_Ref;
          this.imageURL = this.sImage[0].productImage;
          this.req = [...response.swap_request];
          this.reqObj = this.req.find((ele) => { 
            return ele.userid === this.uid;
          });
          // setButton
          this.getcname(this.swapOnInit);
        });
     });
    }
 }


  showRequestSwapModal(): void {
    //Get My Swap Item
    const uid = JSON.parse(localStorage.getItem('currentUser')).id;
    this.productsService.getSwapByUserID(uid).subscribe((res) => {
      this.mySwapItem = res;
      this.visibleModal = true;
    });
  }

  public remarksField: string = '';

  requestSwapOk(id: number): void {
    const uid = JSON.parse(localStorage.getItem('currentUser')).id;
    const offerid = this.selectedSwapItem;
    this.productsService.insertSwapRequest(id, null, uid, offerid, this.remarksField).subscribe((res) => {
      this.getProduct();
      this.visibleModal = false;
    });
  }

  requestSwapCancel(): void {
    this.visibleModal = false;
  }


  // requestProduct(id: number) {
  //   this.productsService.insertSwapRequest(id, null,JSON.parse(localStorage.getItem('currentUser')).id, offe).subscribe((res) => {
  //     this.getProduct();
  //   });
  // }

  getcname(data: Swap) {
    this.getProductCategory(data);
    this.getProductCondition(data);
    this.getProductAge(data);
  }

  getProductAge(data: Swap){
    if(this.pAge != null) {
      const c = this.pAge.find((item: ProductsAge) => {
        return item.productAge_ID === data.productAge_ID;
      });
      data.age = c.productAgeTitle;
    }
  }

  getProductCategory(data: Swap) {
    if (this.pCategory != null) {
      const c = this.pCategory.find((item: ProductCategory) => {
        return item.categoryID === data.productCategory_ID;
      });
      data.category = c.categoryTitle;
    }
  }

  getProductCondition(data: Swap) {
    if (this.pCondition != null) {
      const c = this.pCondition.find((item: ProductCondition) => {
        return item.productConditionID === data.productCondition_ID;
       });
      data.condition = c.productConditionTitle;
    }
  }

  setButton(data: SwapRequest) {
    if (data != null){
      this.isRequest = true;
      this.isApproved = data.approved === true ? true : false;
      this.isDecided = data.isSelfPickup != null ? true : false;
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
    this.router.navigateByUrl("/pages/dashboard");
  }

  navigateToProceed(){
    this.router.navigateByUrl("/pages/dashboard");
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
    $('.collection-filter').css("left", "-15px");
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
    let url = 'https://easyparcel.com/my/bm/page404/';
    window.open(url);
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  public time = new Date();

  handleOk2(): void {
    let x = new Date();
    let y = new Date();
    x = this.selfPickup.controls['datePicker'].value;
    y = this.selfPickup.controls['timePicker'].value;

    this.requestObj.pickupDate = new Date(x.getFullYear(), x.getMonth(), x.getDate(), y.getHours(), y.getMinutes());

    this.requestObj.isSelfPickup = true;
    this.requestObj.isNotified = true;
    this.requestObj.isCompleted = false;
    this.productsService.updateSwapRequest(this.requestObj).subscribe((itm) => {
      //this.createNotification();
      this.isVisible2 = false;
      this.isDecided = true;
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

  public jkg: SwapImage_Ref[]
  public fileList = [];
  public currModal: Swap;
  public editModal = false;
  public isActive: string = '';
  public isEditLoading: boolean = false;
  public previewImage = '';
  public previewVisible: boolean;

  editOK(): void {
    this.isEditLoading = true;
    setTimeout(() => {
      this.editModal = false;
      this.updateRecord(this.currModal);
    }, 2000);
  }

  updateRecord(data: Swap) {
    data.productName = this.editForm.controls['pName'].value;
    data.productBrand = this.editForm.controls['pBrand'].value;
    data.productCategory_ID = this.editForm.controls['pCategory'].value;
    data.productCondition_ID = this.editForm.controls['pCondition'].value;
    data.productDescription = this.editForm.controls['pDescription'].value;
    data.productAge_ID = this.editForm.controls['pAge'].value;
    data.isAvailable = this.editForm.controls['isAvailable'].value;
    data.productWeight = this.editForm.controls['pWeight'].value;
    data.preferredItem = this.editForm.controls['pItem'].value;
    
    const c = this.address.find((itm) => {
      return itm.id === this.editForm.controls['address'].value;
    });
    data.address = c;

    this.productsService.updateSwapProduct(data).subscribe((x) => {
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


  showEdit(data: Swap): void {
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

    this.jkg = data.swapImage_Ref;
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
        address: [data.address.id, [Validators.required]],
        pItem: [data.preferredItem, [Validators.required]]
      });
    });
  }

}
