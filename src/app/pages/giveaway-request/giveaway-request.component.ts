import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  Product,
  ProductCategory,
  Products,
  ProductCondition,
  ProductWeight,
  ProductSize,
  ProductsSize,
  product_request,
  ProductRequest_Full,
  SwapRequest_Full,
  swap_request,
  ProductImage_Ref,
  ProductsAge,
} from 'src/app/shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';
import { HttpService } from '../../shared/services/http.service';
import { User } from 'src/app/shared/classes/user';
import { SwapRequest, Swap, SwapImage_Ref } from 'src/app/shared/classes/swap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-giveaway-request',
  templateUrl: './giveaway-request.component.html',
  styleUrls: ['./giveaway-request.component.scss'],
})
export class GiveawayRequestComponent implements OnInit {
  constructor(
    private productService: ProductsService,
    private userService: HttpService,
    private fb: FormBuilder,
    private modalService: NzModalService
  ) {}

  public productObj: product_request = {
    id: 0,
    productid: null,
    userid: null,
    approved: false,
  };
  public swapObj: SwapRequest = {
    id: 0,
    productid: 0,
    userid: 0,
    approved: false,
  };

  public moment = require('moment');
  public requestList: Products[];
  public requestSwapList: Swap[];
  public offerObj: Swap;
  public productList: Product[];
  public userList: User[];
  public swapLoading = false;
  public giveawayLoading = false;
  public vrVisible = false;
  public isVisible = false;
  public isSwapVisible = false;
  public bagiFreeRequest: User[];
  public swapRequest: User[];
  public productDetailsForm: FormGroup;
  public swapDetailsForm: FormGroup;
  public modalData: ProductImage_Ref[] = [];
  public swapmodalData: SwapImage_Ref[] = [];
  public isApproved: boolean = null;
  public isSelfPickup: boolean = null;
  public isCompleted: boolean = null;
  public isDatePicked: boolean = null;
  public approvedID = 0;
  public isSwapDatePicked: boolean;
  public isSwapApproved: boolean = null;
  public isSwapSelfPickup: boolean = null;
  public isSwapCompleted: boolean = null;
  public Swap_approvedID = 0;
  public offerVisible = false;
  public pCategory: ProductCategory[];
  public pCondition: ProductCondition[];
  public pAge: ProductsAge[];

  async ngOnInit() {
    this.swapLoading = true;
    this.giveawayLoading = true;
    await this.loadDDL();
    this.loadProduct();
    this.loadSwap();
    this.initForm();
  }

  async loadDDL() {
    const category =  await this.productService.productsCategory().toPromise();
    const condition =  await this.productService.productsCondition().toPromise();
    const age = await this.productService.productAge().toPromise();
    this.pCategory = category;
    this.pCondition = condition;
    this.pAge = age;
  }

  loadSwap() {
    this.productService
      .getSwapByUserID(JSON.parse(localStorage.getItem('currentUser')).id)
      .subscribe(
        (res) => {
          if (res.length === 0) {
            this.swapLoading = false;
          }
          const templist: Swap[] = [...res];
          const tempbeforepush: Swap[] = [];
          const bar = new Promise((resolve, reject) => {
            templist.forEach((element) => {
              if (element.swap_request.length > 0) {
                element.swap_request.forEach((itm) => {
                  if (itm.approved === true) {
                    element.isApproved = true;
                    element.approvedID = element.id;
                    if (itm.approved === true && itm.isSelfPickup === true) {
                      element.isSelfPickup = true;
                      if (itm.pickupDate != null) {
                        if (
                          itm.approved === true &&
                          (itm.isSelfPickup === true ||
                            itm.isSelfPickup === false) &&
                          itm.isCompleted === true
                        ) {
                          element.isCompleted = true;
                        } else {
                          element.isCompleted = false;
                        }
                        element.isDatePicked = true;
                      } else {
                        element.isDatePicked = null;
                      }
                    } else if (
                      itm.approved === true &&
                      itm.isSelfPickup === false
                    ) {
                      element.isSelfPickup = false;
                    } else {
                      element.isSelfPickup = null;
                    }
                  } else if (itm.approved === null) {
                    element.approvedID = 0;
                    element.isApproved = false;
                  }
                });
                tempbeforepush.push(element);
              }
              resolve();
            });
          });

          bar.then(() => {
            this.requestSwapList = [...tempbeforepush];
            this.requestSwapList.forEach((x) => {
              this.getSwapStatus(x.swap_request);
            });
            this.swapLoading = false;
          });
        },
        (err) => {
          this.swapLoading = false;
          console.log(err);
        }
      );
  }

  loadProduct() {
    this.productService
      .getProductsByUserID(JSON.parse(localStorage.getItem('currentUser')).id)
      .subscribe(
        (res) => {
          if (res.length === 0) {
            this.giveawayLoading = false;
          }
          const templist: Products[] = [...res];
          const tempbeforepush: Products[] = [];
          const bar = new Promise((resolve, reject) => {
            templist.forEach((element) => {
              if (element.product_request.length > 0) {
                element.product_request.forEach((itm) => {
                  if (itm.approved === true) {
                    element.isApproved = true;
                    element.approvedID = element.id;
                    if (itm.approved === true && itm.isSelfPickup === true) {
                      element.isSelfPickup = true;
                      if (itm.pickupDate != null) {
                        if (
                          itm.approved === true &&
                          (itm.isSelfPickup === true ||
                            itm.isSelfPickup === false) &&
                          itm.isCompleted === true
                        ) {
                          element.isCompleted = true;
                        } else {
                          element.isCompleted = false;
                        }
                        element.isDatePicked = true;
                      } else {
                        element.isDatePicked = null;
                      }
                    } else if (
                      itm.approved === true &&
                      itm.isSelfPickup === false
                    ) {
                      element.isSelfPickup = false;
                    } else {
                      element.isSelfPickup = null;
                    }
                  } else if (itm.approved === null) {
                    element.approvedID = 0;
                    element.isApproved = false;
                  }
                });
                tempbeforepush.push(element);
              }
              resolve();
            });
          });

          bar.then(() => {
            this.requestList = [...tempbeforepush];
            this.requestList.forEach((x) => {
              this.getStatus(x.product_request);
            });
            this.giveawayLoading = false;
          });
        },
        (err) => {
          this.giveawayLoading = false;
          console.log(err);
        }
      );
  }

  approveGiveaway(userid: number, productid: number, requestid: number) {
    // Make table loading
    this.giveawayLoading = true;

    // Assign val
    this.productObj.id = requestid;
    this.productObj.productid = productid;
    this.productObj.userid = userid;
    this.productObj.approved = true;

    this.productService.updateProductRequest(this.productObj).subscribe(
      (res) => {
        this.giveawayLoading = false;
        this.isVisible = false;
        this.loadProduct();
      },
      (err) => {
        this.giveawayLoading = false;
        this.isVisible = false;
        this.loadProduct();
      }
    );
  }

  swapApproveGiveaway(userid: number, productid: number, requestid: number) {
    this.swapLoading = true;
    this.swapObj.id = requestid;
    this.swapObj.productid = productid;
    this.swapObj.userid = userid;
    this.swapObj.approved = true;

    this.productService.updateSwapRequest(this.swapObj).subscribe(
      (res) => {
        this.swapLoading = false;
        this.isSwapVisible = false;
        this.loadSwap();
      },
      (err) => {
        this.swapLoading = false;
        this.isSwapVisible = false;
        this.loadSwap();
      }
    );
  }

  handleOk(): void {
    this.vrVisible = false;
  }

  handleCancel(): void {
    this.vrVisible = false;
  }

  getStatus(pRequest: product_request[]) {
    // reset value
    this.isApproved = null;
    this.isSelfPickup = null;
    this.isCompleted = null;
    this.approvedID = 0;
    this.isDatePicked = null;

    pRequest.forEach((element) => {
      if (element.approved === true) {
        this.isApproved = true;
        this.approvedID = element.id;
      }

      if (element.approved === true && element.isSelfPickup === true) {
        this.isSelfPickup = true;
        if (element.pickupDate != null) {
          this.isDatePicked = true;
        } else {
          this.isDatePicked = false;
        }
      } else if (element.approved === true && element.isSelfPickup === false) {
        this.isSelfPickup = false;
      }

      if (
        element.approved === true &&
        (element.isSelfPickup === true || element.isSelfPickup === false) &&
        element.isCompleted === true
      ) {
        this.isCompleted = true;
      }
    });
  }

  getSwapStatus(sRequest: SwapRequest[]) {
    // reset value
    this.isSwapApproved = null;
    this.isSwapSelfPickup = null;
    this.isSwapCompleted = null;
    this.Swap_approvedID = 0;
    this.isSwapDatePicked = null;

    sRequest.forEach((element) => {
      if (element.approved === true) {
        this.isSwapApproved = true;
        this.Swap_approvedID = element.id;
      }

      if (element.approved === true && element.isSelfPickup === true) {
        this.isSwapSelfPickup = true;
        if (element.pickupDate != null) {
          this.isSwapDatePicked = true;
        } else {
          this.isSwapDatePicked = false;
        }
      } else if (element.approved === true && element.isSelfPickup === false) {
        this.isSwapSelfPickup = false;
      }

      if (
        element.approved === true &&
        (element.isSelfPickup === true || element.isSelfPickup === false) &&
        element.isCompleted === true
      ) {
        this.isSwapCompleted = true;
      }
    });
  }

  getProductAge(data: Products[]) {
    data.forEach((element) => {
      var c = this.pAge.find((item: ProductsAge) => {
        return item.productAge_ID == element.productAge_ID;
      });
      element.age = c.productAgeTitle;
    });
  }

  bagifreeShow(data: Products): void {
    this.modalData = data.productImage_Ref;
    const address: String =
      data.address.city +
      ', ' +
      data.address.state +
      ', ' +
      data.address.country;
    const city: String = data.address.city + ', ' + data.address.postalCode;
    const country: String = data.address.state + ', ' + data.address.country;

    const cond = this.pCondition.find((item: ProductCondition) => {
      return item.productConditionID === data.productCondition_ID;
    });

    const cat = this.pCategory.find((item: ProductCategory) => {
      return item.categoryID === data.productCategory_ID;
    });

    const agecname = this.pAge.find((item: ProductsAge) => {
      return item.productAge_ID === data.productAge_ID;
    });

    this.productDetailsForm = this.fb.group({
      productid: [data.id, [Validators.required]],
      productname: [data.productName, [Validators.required]],
      address: [address, [Validators.required]],
      city: [city, [Validators.required]],
      country: [country, [Validators.required]],
      description: [data.productDescription, [Validators.required]],
      brand: [data.productBrand, [Validators.required]],
      condition: [cond.productConditionTitle, [Validators.required]],
      category: [cat.categoryTitle, [Validators.required]],
      age: [agecname.productAgeTitle, [Validators.required]],
    });

    this.bagiFreeLoadRequest(data.product_request);
  }

  swapShow(data: Swap): void {
    this.swapmodalData = data.swapImage_Ref;
    const address: String =
      data.address.city +
      ', ' +
      data.address.state +
      ', ' +
      data.address.country;
    const city: String = data.address.city + ', ' + data.address.postalCode;
    const country: String = data.address.state + ', ' + data.address.country;

    const cond = this.pCondition.find((item: ProductCondition) => {
      return item.productConditionID === data.productCondition_ID;
    });

    const cat = this.pCategory.find((item: ProductCategory) => {
      return item.categoryID === data.productCategory_ID;
    });

    const agecname = this.pAge.find((item: ProductsAge) => {
      return item.productAge_ID === data.productAge_ID;
    });

    this.swapDetailsForm = this.fb.group({
      productid: [data.id, [Validators.required]],
      productname: [data.productName, [Validators.required]],
      address: [address, [Validators.required]],
      city: [city, [Validators.required]],
      country: [country, [Validators.required]],
      description: [data.productDescription, [Validators.required]],
      brand: [data.productBrand, [Validators.required]],
      condition: [cond.productConditionTitle, [Validators.required]],
      category: [cat.categoryTitle, [Validators.required]],
      age: [agecname.productAgeTitle, [Validators.required]],
      estVal: ['RM' + data.estVal, [Validators.required]],
      preferredItem: [data.preferredItem, [Validators.required]],
    });

    this.swapLoadRequest(data.swap_request);
  }

  bagiFreeLoadRequest(pRequest: product_request[]) {
    const tempUserArr: User[] = [];
    const loadUser = new Promise((resolve, reject) => {
      this.getStatus(pRequest);

      pRequest.forEach((element) => {
        this.userService
          .getUserProfile(element.userid)
          .subscribe((response: User) => {
            response.remarks = element.remarks;
            response.requestid = element.id;
            if (element.pickupDate != null) {
              response.pickupDate = moment(element.pickupDate).format(
                'MMMM Do YYYY, h:mm:ss a'
              );
            }
            tempUserArr.push(response);
          });
        resolve();
      });
    });

    loadUser.then(() => {
      this.bagiFreeRequest = tempUserArr;
      this.isVisible = true;
    });
  }

  swapLoadRequest(sRequest: SwapRequest[]) {
    const tempUserArr: User[] = [];
    const loadUser = new Promise((resolve, reject) => {
      this.getSwapStatus(sRequest);

      sRequest.forEach((element) => {
        this.userService
          .getUserProfile(element.userid)
          .subscribe((response: User) => {
            response.requestid = element.id;
            response.offerid = element.offerid;
            if (element.pickupDate != null) {
              response.pickupDate = moment(element.pickupDate).format(
                'MMMM Do YYYY, h:mm:ss a'
              );
            }
            tempUserArr.push(response);
          });
        resolve();
      });
    });

    loadUser.then(() => {
      this.swapRequest = tempUserArr;
      this.isSwapVisible = true;
    });
  }

  bagifreeOK(): void {
    this.isVisible = false;
  }

  swapOK(): void {
    this.isSwapVisible = false;
  }

  bagifreeCancel(): void {
    this.isVisible = false;
  }

  swapCancel(): void {
    this.isSwapVisible = false;
  }

  initForm() {
    // BagiFree Form
    this.productDetailsForm = this.fb.group({
      requestid: [null, [Validators.required]],
      productid: [null, [Validators.required]],
      productname: [null, [Validators.required]],
      address: [null, [Validators.required]],
      country: [null, [Validators.required]],
      city: [null, [Validators.required]],
      description: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      category: [null, [Validators.required]],
      age: [null, [Validators.required]],
    });

    // Swap Form
    this.swapDetailsForm = this.fb.group({
      requestid: [null, [Validators.required]],
      productid: [null, [Validators.required]],
      productname: [null, [Validators.required]],
      address: [null, [Validators.required]],
      country: [null, [Validators.required]],
      city: [null, [Validators.required]],
      description: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      category: [null, [Validators.required]],
      age: [null, [Validators.required]],
      estVal: [null, [Validators.required]],
      preferredItem: [null, [Validators.required]],
    });
  }

  initObj() {
    this.offerObj = {
      id: 0,
      productName: '',
      productCondition_ID: 0,
      productWeight: 0,
      productBrand: '',
      productDescription: '',
      productCategory_ID: 0,
      isAvailable: null,
      userid: null,
      estVal: '',
      address: {
        id: 0,
        address1: '',
        address2: '',
        postalCode: 0,
        city: '',
        state: '',
        country: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 0,
      },
      productAge_ID: 0,
      status: null,
      swapImage_Ref: [],
      swap_request: null,
      condition: '',
      size: '',
      weight: '',
      category: '',
      age: '',
    };
  }

  public tabIndex = 0;

  displaySwapInfo(productid: number, data: User) {
    this.tabIndex = 1;
    this.initObj();
    this.productService.getSwapbyID(data.offerid).subscribe((res) => {
      this.offerObj = res;

      const cond = this.pCondition.find((item: ProductCondition) => {
        return item.productConditionID === this.offerObj.productCondition_ID;
      });

      const cat = this.pCategory.find((item: ProductCategory) => {
        return item.categoryID === this.offerObj.productCategory_ID;
      });

      const agecname = this.pAge.find((item: ProductsAge) => {
        return item.productAge_ID === this.offerObj.productAge_ID;
      });

      this.offerObj.condition = cond.productConditionTitle;
      this.offerObj.category = cat.categoryTitle;
      this.offerObj.age = agecname.productAgeTitle;
    });
  }
  backTab() {
    this.tabIndex = 0;
  }
}
