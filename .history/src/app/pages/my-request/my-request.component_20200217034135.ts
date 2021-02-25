import { Component, OnInit } from '@angular/core';
import { Product, ProductCategory, Products, ProductCondition, ProductWeight, ProductSize, ProductsSize, product_request, ProductRequest_Full, SwapRequest_Full, ProductsAge } from 'src/app/shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';
import { HttpService } from '../../shared/services/http.service'
import { User } from 'src/app/shared/classes/user';
import { SwapRequest, Swap } from 'src/app/shared/classes/swap';
import { NzModalService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.scss']
})
export class MyRequestComponent implements OnInit {

  constructor(private fb: FormBuilder, 
              private productService: ProductsService, private userService: HttpService, private modalService: NzModalService,
              private router: Router) { }

  public requestList          : ProductRequest_Full[];
  public requestSwapList      : SwapRequest_Full[];
  public productObj           : product_request         = {id: 0, productid: null, userid: null, approved: false };
  public swapObj              : SwapRequest             = {id: 0, productid: 0, userid: 0, approved: false };
  public productList          : Product[];
  public userList             : User[];
  public swapLoading          : boolean                 = false;
  public giveawayLoading      : boolean                 = false;
  public isVisible            : boolean                 = false;
  public isSwapVisible        : boolean                 = false;
  public productDetailsForm   : FormGroup;
  public swapDetailsForm      : FormGroup;
  public myItemForm           : FormGroup;
  public showContact          : boolean                 = false;
  public swaphowContact       : boolean                 = false;
  public offerObj             : Swap;
  public pCategory                : ProductCategory[];
  public pCondition               : ProductCondition[];
  public pAge                     : ProductsAge[];

  ngOnInit() {
    this.swapLoading = true;
    this.giveawayLoading = true;
    this.loadProduct();
    this.loadSwap();
    this.initForm();
    this.loadDDL();
  }

  loadDDL() {
    this.productService.productsCategory().subscribe((data: any) => {
      this.pCategory = [...data];
    }, err => {
      console.log(err);
    });

    this.productService.productsCondition().subscribe((data: any) => {
      this.pCondition = [...data];
    }, err => {
      console.log(err);
    });

    this.productService.productAge().subscribe((data:any) => {
       this.pAge = [...data];
    }, err => {
      console.log(err);
    });
  }


  /*
  Load Item Area
  */
  getImage(data: ProductRequest_Full) {
    this.productService.getImage(data.products_id).subscribe((res) => {
      data.imgURL = res.productImage;
      return data;
    });
  }

  getSwapImage(data: SwapRequest_Full) {
    this.productService.getSwapImage(data.swap_id).subscribe((res) => {
      data.imgURL = res.productImage;
      return data;
    });
  }

  loadSwap() {
    this.productService.getswapRequestByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((res) => {
      this.requestSwapList = [...res];
      this.swapLoading = false;
      this.requestSwapList.forEach((element) => {
        this.getSwapImage(element);
      });
    }, err => {
      this.swapLoading = false;
      console.log(err);
    });
  }

  loadProduct() {
    this.productService.getProductRequestByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((res) => {
      this.requestList = [...res];
      this.giveawayLoading = false;
      this.requestList.forEach((element) => {
        this.getImage(element);
      });
    }, err => {
      this.giveawayLoading = false;
      console.log(err);
    });
  }

  showConfirm1(data: SwapRequest_Full): void {
    this.modalService.confirm({
      nzTitle: '<i>Contact Information</i>',
      nzContent: `<b>Owner Name: ${data.user_username}</b><br/><b>Mobile Number: <a href="tel:${data.user_mobile}">${data.user_mobile}</a></b>`,
      nzOnOk: () => console.log('OK')
    });
  }

  showDeleteConfirm1(data: SwapRequest_Full): void {
    this.modalService.confirm({
      nzTitle: '<i>Contact Information</i>',
      nzContent: `<b>Owner Name: ${data.user_username}</b><br/><b>Email Address: <a href="mailto:${data.user_email}?Subject=BagiFree%20Request">${data.user_email}</a></b>`,
      nzOnOk: () => console.log('OK')
    });
  }

  /*
  Modal Area
  */
  bagifreeCancel(): void {
    this.isVisible = false;
  }

  swapCancel(): void {
    this.isSwapVisible = false;
  }

  bagifreeOK(): void {
    this.isVisible = false;
  }

  swapOK(): void {
    this.isSwapVisible = false;
  }

  bagifreeShow(data: ProductRequest_Full): void {

    if (data.product_request_approved === true) {
      this.showContact = true;
    }
    this.isVisible = true;
    const address: String = data.address_city + ', ' + data.address_state + ', ' + data.address_country;
    const city: String = data.address_city + ', ' + data.address_postalCode;
    const country: String = data.address_state + ', ' + data.address_country;
    const mobilefull: string = '0' + data.user_mobile;

    const cat = this.pCategory.find((ele) => { 
      return ele.categoryID === data.products_productCategory_ID;
     });

    const age = this.pAge.find((ele) => { 
      return ele.productAge_ID === data.products_productAge_ID;
    });

    const con = this.pCondition.find((ele) => {
      return ele.productConditionID === data.products_productCondition_ID;
    });

    this.productDetailsForm = this.fb.group({
      imgURL: [data.imgURL,[Validators.required]],
      productid: [data.products_id, [Validators.required]],
      productname: [data.products_productName, [Validators.required]],
      address: [address, [Validators.required]],
      city: [city, [Validators.required]],
      country: [country, [Validators.required]],
      description: [data.products_productDescription, [Validators.required]],
      mobile: [mobilefull, [Validators.required]],
      email: [data.user_email, [Validators.required]],
      brand: [data.products_productBrand, [Validators.required]],
      weight: [data.products_productWeight, [Validators.required]],
      condition: [con.productConditionTitle, [Validators.required]],
      age: [age.productAgeTitle, [Validators.required]],
      category: [cat.categoryTitle, [Validators.required]]
    });

  }

  swapShow(data: SwapRequest_Full): void {

    if (data.swap_request_approved === true) {
      this.swaphowContact = true;
    }

    this.isSwapVisible = true;
    const address: String = data.address_city + ', ' + data.address_state + ',' + data.address_country;
    const city: String = data.address_city + ', ' + data.address_postalCode;
    const country: String = data.address_state + ', ' + data.address_country;
    const mobilefull: string = '0' + data.user_mobile;
    const con = this.pCondition.find((ele) => { return ele.productConditionID = data.swap_productCondition_ID; });
    const age = this.pAge.find((ele) => { return ele.productAge_ID = data.swap_productAge_ID; });
    const cat = this.pCategory.find((ele) => { return ele.categoryID = data.swap_productCategory_ID; });


    this.swapDetailsForm = this.fb.group({
      imgURL: [data.imgURL,[Validators.required]],
      productid: [data.swap_request_id, [Validators.required]],
      productname: [data.swap_productName, [Validators.required]],
      address: [address, [Validators.required]],
      city: [city, [Validators.required]],
      country: [country, [Validators.required]],
      description: [data.swap_productDescription, [Validators.required]],
      mobile: [mobilefull, [Validators.required]],
      email: [data.user_email, [Validators.required]],
      category: [cat.categoryTitle, [Validators.required]],
      age: [age.productAgeTitle, [Validators.required]],
      condition: [con.productConditionTitle, [Validators.required]],
      brand: [data.swap_productBrand, [Validators.required]],
      sestVal: [data.swap_estVal, [Validators.required]],
      sbrand: [data.swap_productBrand, [Validators.required]],
      preferredItem: [data.swap_preferredItem, [Validators.required]]
    });


    this.productService.getSwapbyID(data.swap_request_offerid).subscribe((res) => {
      this.offerObj = res;

      const myaddress: String = this.offerObj.address.city + ', ' + this.offerObj.address.state + ', ' + this.offerObj.address.country;
      const mycity: String = this.offerObj.address.city + ', ' + this.offerObj.address.postalCode;
      const mycountry: String = this.offerObj.address.state + ', ' + this.offerObj.address.country;
      const cons = this.pCondition.find((ele) => { return ele.productConditionID = this.offerObj.productCondition_ID; });
      const ages = this.pAge.find((ele) => { return ele.productAge_ID = this.offerObj.productAge_ID; });
      const cats = this.pCategory.find((ele) => { return ele.categoryID = this.offerObj.productCategory_ID; });

      this.myItemForm = this.fb.group({
        productname: [this.offerObj.productName, [Validators.required]],
        estVal: [this.offerObj.estVal, [Validators.required]],
        description: [this.offerObj.productDescription, [Validators.required]],
        address: [myaddress, [Validators.required]],
        country: [mycountry, [Validators.required]],
        city: [mycity, [Validators.required]],
        brand: [this.offerObj.productBrand, [Validators.required]],
        preferredItem: [this.offerObj.preferredItem, [Validators.required]],
        condition: [cons.productConditionTitle, [Validators.required]],
        age: [ages.productAgeTitle, [Validators.required]],
        category: [cats.categoryTitle, [Validators.required]]
      });
    });
  }


  /*
  Form Init Area
  */
  initForm() {
    // BagiFree Form
    this.productDetailsForm = this.fb.group({
      imgURL: [null, [Validators.required]],
      requestid: [null, [Validators.required]],
      productid: [null, [Validators.required]],
      productname: [null, [Validators.required]],
      address: [null, [Validators.required]],
      country: [null, [Validators.required]],
      city: [null, [Validators.required]],
      description: [null, [Validators.required]],
      mobile: [null, Validators.required],
      email: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      age: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      category: [null, [Validators.required]],
      weight: [null, [Validators.required]]
    });

    // Swap Form
    this.swapDetailsForm = this.fb.group({
      imgURL: [null, [Validators.required]],
      requestid: [null, [Validators.required]],
      productid: [null, [Validators.required]],
      productname: [null, [Validators.required]],
      address: [null, [Validators.required]],
      country: [null, [Validators.required]],
      city: [null, [Validators.required]],
      description: [null, [Validators.required]],
      mobile: [null, Validators.required],
      email: [null, [Validators.required]],
      sbrand: [null, [Validators.required]],
      age: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      category: [null, [Validators.required]],
      weight: [null, [Validators.required]],
      sestVal: [null, [Validators.required]],
      preferredItem: [null, [Validators.required]]
    });

    this.myItemForm = this.fb.group({
      productname: [null, [Validators.required]],
      estVal: [null, [Validators.required]],
      description: [null, [Validators.required]],
      address: [null, [Validators.required]],
      country: [null, [Validators.required]],
      city: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      age: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      category: [null, [Validators.required]],
      weight: [null, [Validators.required]],
      preferredItem: [null, [Validators.required]]
    });
  }

  public ratingvisible: boolean = false;
  public rate: number = 0;
  public feedback: string = '';
  public userid: number = 0;
  public pID: number = 0;
  public prID: number = 0;

  public ratingVisible2: Boolean = false;
  public rate2: number = 0;
  public feedback2: string = '';
  public userid2: number = 0;
  public pID2: number = 0;
  public prID2: number = 0;
  public offerid: number = 0;


  openrating(data: ProductRequest_Full) {
    this.userid = 0;
    this.pID = 0;
    this.prID = 0;

    this.userid = data.user_id;
    this.ratingvisible = true;
    this.pID = data.products_id;
    this.prID = data.product_request_id;

  }

  openrating2(data: SwapRequest_Full) {
    this.userid2 = 0;
    this.pID = 0;
    this.prID = 0;
    this.offerid = 0;

    this.userid2 = data.user_id;
    this.ratingVisible2 = true;
    this.pID2 = data.swap_id;
    this.prID2 = data.swap_request_id;
    this.offerid = data.swap_request_offerid;
  }

  success(): void {
    this.modalService.success({
      nzTitle: 'Thank you for your rating. Do you like BagiFree?',
      nzContent: 'Buy us some coffee by clicking the button below in order for us to stay motivated to maintain this awesome platform!',
      nzOkText: 'Donate',
      nzOnOk: () => this.router.navigate(['pages/donate']),
      nzCancelText: 'No Thanks'
    });
  }

  handleOk2(): void {
    this.productService.insertRating(this.rate2, this.feedback2, this.userid2).subscribe((res) => {
     this.productService.productCompleted4(this.pID2).subscribe((dasdas) => {
       this.productService.productCompleted4(this.offerid).subscribe(() => {
        this.productService.productCompleted3(this.prID2).subscribe((sdasd) => {
          this.loadSwap();
          this.ratingVisible2 = false;
          this.success();
         });
       });
     });
    });
   }

  handleCancel2(): void {
    console.log('Button cancel clicked!');
    this.ratingVisible2 = false;
  }


  handleOk(): void {
   this.productService.insertRating(this.rate, this.feedback, this.userid).subscribe((res) => {
    this.productService.productCompleted2(this.pID).subscribe((dasdas) => {
      this.productService.productCompleted(this.prID).subscribe((sdasd) => {
        this.loadProduct();
        this.ratingvisible = false;
        this.success();
      });
    });
   });
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.ratingvisible = false;
  }
}
