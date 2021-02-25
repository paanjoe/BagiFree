import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Product,
  Products,
  ProductImage_Ref,
  ProductCategory,
  ProductCondition,
  ProductsAge,
  product_request,
  swap_request,
} from '../../../../shared/classes/product';
import { ProductsService } from '../../../../shared/services/products.service';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { CartService } from '../../../../shared/services/cart.service';
import { Observable, of, Subscription } from 'rxjs';
import * as $ from 'jquery';
import { User } from 'src/app/shared/classes/user';
import {
  NzNotificationService,
  UploadFile,
  NzMessageService,
} from 'ng-zorro-antd';
import { Swap, SwapImage_Ref, SwapRequest } from 'src/app/shared/classes/swap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { AddressService } from 'src/app/shared/services/address.service';
import { Address } from 'src/app/shared/classes/address';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-product-right-sidebar',
  templateUrl: './product-right-sidebar.component.html',
  styleUrls: ['./product-right-sidebar.component.scss'],
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
    infinite: false,
    slidesToScroll: 1,
    asNavFor: '.product-slick',
    arrows: false,
    dots: false,
    focusOnSelect: true,
    pauseOnFocus: true,
  };

  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };

  data = [
    {
      title: 'KARHOO COURIER',
    },
    {
      title: 'DHL ECOMMERCE',
    },
    {
      title: 'POSLAJU',
    },
    {
      title: 'MatDespatch',
    },
  ];

  public swap: Swap = {
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
      mobileOption: 0,
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
    preferredItem: '',
  };
  
  public visibleModal: Boolean = false;
  public isSwapAvail: Boolean = true;
  public swapOnInit: Swap;
  public swaps: Swap[] = [];
  public sImage: SwapImage_Ref[] = [];
  public counter = 1;
  public selectedSize: any = '';
  public iStyle = 'width:100%; height:100%;';
  public pCategory: ProductCategory[];
  public pCondition: ProductCondition[];
  public pAge: ProductsAge[];
  public uid: number;
  public btnDisabled: Boolean = true;
  public req: SwapRequest[];
  public reqObj: SwapRequest;
  public isApproved: Boolean = false;
  public isRequest: Boolean = false;
  public userObj: User;
  public selfPickup: FormGroup;
  public isDecided: Boolean = false;
  public imageURL: String;
  public editForm: FormGroup;
  public address: Address[];
  public requestObj: SwapRequest;
  public mySwapItem: Swap[] = [];
  public selectedSwapItem = 0;
  public images: any = [];
  public allfiles: File[] = [];
  public tempBlob: Blob = new Blob();
  public test: any;
  public imgList: String;
  public lol = [];
  public imgModal: Boolean = false;
  public imgModalSrc: String = '';
  private subsParams: Subscription;
  public remarksField = '';
  public isVisible = false;
  public isVisible2 = false;
  private subsInsertSwap: Subscription;
  public time = new Date();
  public jkg: SwapImage_Ref[];
  public fileList = [];
  public currModal: Swap;
  public editModal = false;
  public isActive = '';
  public isEditLoading = false;
  public previewImage = '';
  public previewVisible: boolean;

  // Get Product By Id
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    public productsService: ProductsService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private db: AngularFireDatabase,
    private modalService: NzModalService,
    private imageCompress: NgxImageCompressService,
    private addressService: AddressService,
  ) { }

  async ngOnInit() {
    // Init form
    await this.initForm();
    // Init dropdownlist
    await this.loadDDL();
    // Init product Info
    await this.getProduct();

    this.selfPickup = this.fb.group({
      datePicker: [null, [Validators.required]],
      timePicker: [null, [Validators.required]],
    });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.subsParams.unsubscribe();
    this.subsInsertSwap.unsubscribe();
  }

  initForm() {
    this.editForm = this.fb.group({
      formLayout: ['vertical'],
      pName: [null, [Validators.required]],
      pCondition: [null, [Validators.required]],
      pAge: [null, [Validators.required]],
      pWeight: [null, [Validators.required]],
      pCategory: [null, [Validators.required]],
      isAvailable: [null, [Validators.required]],
      pDescription: [null, [Validators.required]],
      pBrand: [null, Validators.required],
      address: [null, Validators.required],
      pItem: [null, Validators.required],
    });
  }

  async getProduct() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
      this.uid = currentUser.id;
      const address = await this.addressService.getAddressByUserID(this.uid).toPromise();
      this.address = [...address]
      this.subsParams = this.route.params.subscribe(async (params) => {
        const id = +params['id'];
        const product = await this.productsService.getSwapbyID(id).toPromise();
        this.userObj = product.userid;
        this.swap = product;
        this.swapOnInit = product;
        this.sImage = product.swapImage_Ref;
        this.imageURL = this.sImage[0].productImage;
        this.req = [...product.swap_request];
        await this.setButton(this.reqObj);
        await this.getcname(this.swapOnInit);

        this.reqObj = this.req.find((ele) => {
          return ele.userid === this.uid;
        });

        this.req.forEach((element) => {
          if (element.userid === currentUser.id) {
            this.requestObj = element;
          }
        });
      });
    } else {
      this.subsParams = this.route.params.subscribe(async (params) => {
        const id = +params['id'];
        const product = await this.productsService.getSwapbyID(id).toPromise();
          this.userObj = product.userid;
          this.swapOnInit = product;
          this.sImage = product.swapImage_Ref;
          this.imageURL = this.sImage[0].productImage;
          this.req = [...product.swap_request];
          this.reqObj = this.req.find((ele) => {
            return ele.userid === this.uid;
          });
          this.getcname(this.swapOnInit);
        });
    }
  }

  // Open image modal
  modalImage(img) {
    this.imgModal = true;
    this.imgModalSrc = img;
  }

  // Close image modal
  closeimg(): void {
    this.imgModal = false;
  }

  // Close image modal
  cancelimg(): void {
    this.imgModal = false;
  }

  imageSizeConversion(img: any): string {
    const size = img.size / 1000;
    const mbc = size + '';
    const mb = mbc.split('.')[0];
    const length = mb.length;
    if (length === 4 || length === 5) {
      const mbsize = size / 1000;
      const splitdata = mbsize + '';
      const splitvalues = splitdata.split('.');
      let secondvariable = '';
      for (let j = 0; j < splitvalues.length; j++) {
        if (j === 1) {
          secondvariable = splitvalues[j].slice(0, 2);
        }
      }
      const sizefinal = splitvalues[0] + '.' + secondvariable + 'MB';
      return sizefinal;
    } else {
      const splitdata = size + '';
      const splitvalues = splitdata.split('.');
      let secondvariable = '';
      for (let j = 0; j < splitvalues.length; j++) {
        if (j === 1) {
          secondvariable = splitvalues[j].slice(0, 2);
        }
      }
      const sizefinal = splitvalues[0] + '.' + secondvariable + 'KB';
      return sizefinal;
    }
  }

  uploadQueue(event) {
    const files: File[] = event.target.files;
    // Compress image size first
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const orientationOriginal: number = this.getOrientation(files[i]);
        const fileName = files[i].name;
        const image = {
          name: '',
          type: '',
          size: '',
          url: '',
        };

        image.name = files[i].name;
        image.type = files[i].type;

        const reader = new FileReader();
        reader.onload = (filedata) => {
          image.url = reader.result + '';
          this.resetOrientation(
            reader.result + '',
            orientationOriginal,
            (resetBase64Image) => {
              this.imageCompress
                .compressFile(resetBase64Image, orientationOriginal, 50, 50)
                .then((res) => {
                  // push image
                  image.url = res;
                  this.images.push(image);
                  // convert to blob
                  let blobTemp: Blob;
                  blobTemp = this.dataURItoBlob(res, fileName);
                  // convert to file
                  const myfile = this.blobToFile(blobTemp, fileName);
                  // push image size into array list
                  image.size = this.imageSizeConversion(myfile);
                  // push files to global
                  this.allfiles.push(myfile);
                });
            }
          );
        };
        reader.readAsDataURL(files[i]);
      }
    }
    event.srcElement.value = null;
  }

  deleteImage(img: any) {
    const index = this.images.indexOf(img);
    this.images.splice(index, 1);
    this.allfiles.splice(index, 1);
  }

guidGenerator() {
  const S4 = function() {
    // tslint:disable-next-line: no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}

getOrientation(file): number {
  let reader: any, target: EventTarget;
  reader = new FileReader();
  reader.onload = (event) => {
    let view = new DataView(event.target.result);

    if (view.getUint16(0, false) !== 0xffd8) { return -2; }

    let length = view.byteLength,
      offset = 2;

    while (offset < length) {
      let marker = view.getUint16(offset, false);
      offset += 2;

      if (marker === 0xffe1) {
        if (view.getUint32((offset += 2), false) !== 0x45786966) {
          return -1;
        }
        let little = view.getUint16((offset += 6), false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        let tags = view.getUint16(offset, little);
        offset += 2;
        let x: number;
        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) === 0x0112) {
            x = view.getUint16(offset + i * 12 + 8, little);
        }
          }
        return x;
      // tslint:disable-next-line: no-bitwise
      } else if ((marker & 0xff00) !== 0xff00) { break; } else { offset += view.getUint16(offset, false); }
    }
    return -1;
  };
  return -2;

  reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
}

public blobToFile = (theBlob: Blob, fileName: string): File => {
  let b: any = theBlob;
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;
  // Cast to a File() type
  return <File>theBlob;
}

dataURItoBlob(dataURI, fileName) {
  // convert base64 to raw binary data held in a string
  const byteString = atob(dataURI.split(',')[1]);

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const bb = new Blob([ab], { type: 'image/jpeg' });
  this.tempBlob = bb;

  return bb;
}

getBase64(file, orientation, fileName) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const base64 = reader.result;
    this.resetOrientation(base64, orientation, (resetBase64Image) => {
      let dataURICompressed;
      this.imageCompress
        .compressFile(resetBase64Image, -2, 50, 50)
        .then((res) => {
          dataURICompressed = res;
          this.dataURItoBlob(dataURICompressed, fileName);
        });
    });
  };

  reader.onerror = (error) => {
    console.log('Error: ', error);
  };
}

resetOrientation(srcBase64, srcOrientation, callback) {
  const img = new Image();

  img.onload = () => {
    const width = img.width, height = img.height, canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');

    // set proper canvas dimensions before transform & export
    if (4 < srcOrientation && srcOrientation < 9) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    // transform context before drawing image
    switch (srcOrientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
      default:
        break;
    }

    // draw image
    ctx.drawImage(img, 0, 0);

    // export base64
    callback(canvas.toDataURL());
  };

  img.src = srcBase64;
}

async showRequestSwapModal() {
  const uid = JSON.parse(localStorage.getItem('currentUser')).id;
  const res = await this.productsService.getSwapByUserID(uid).toPromise();
  this.mySwapItem = res;
  this.visibleModal = true;
}

requestSwapOk(id: number): void {
  const uid = JSON.parse(localStorage.getItem('currentUser')).id;
  const offerid = this.selectedSwapItem;
  this.subsInsertSwap = this.productsService.insertSwapRequest(id, null, uid, offerid, this.remarksField)
    .subscribe(async (res) => {
      await this.getProduct();
      this.visibleModal = false;
    });
}

requestSwapCancel(): void {
  this.visibleModal = false;
}

async getcname(data: Swap) {
  await this.getProductCategory(data);
  await this.getProductCondition(data);
  await this.getProductAge(data);
}

async getProductAge(data: Swap) {
  if (this.pAge != null) {
    const c = this.pAge.find((item: ProductsAge) => {
      return item.productAge_ID === data.productAge_ID;
    });
    data.age = c.productAgeTitle;
  }
}

async getProductCategory(data: Swap) {
    if (this.pCategory != null) {
      const c = this.pCategory.find((item: ProductCategory) => {
        return item.categoryID === data.productCategory_ID;
      });
      data.category = c.categoryTitle;
    }
}

async getProductCondition(data: Swap) {
    if (this.pCondition != null) {
      const c = this.pCondition.find((item: ProductCondition) => {
        return item.productConditionID === data.productCondition_ID;
      });
      data.condition = c.productConditionTitle;
    }
}

setButton(data: SwapRequest) {
  if (data != null) {
    this.isRequest = true;
    this.isApproved = data.approved === true ? true : false;
    this.isDecided = data.isSelfPickup != null ? true : false;
  }
}

async loadDDL() {
  this.pCategory = await this.productsService.productsCategory().toPromise();
  this.pCondition = await this.productsService.productsCondition().toPromise();
  this.pAge = await this.productsService.productAge().toPromise();
}

  navigateToDashboard() {
    this.router.navigateByUrl('/pages/dashboard');
  }

  navigateToProceed() {
    this.router.navigateByUrl('/pages/dashboard');
  }

  onMouseOver(event: any): void {
    const target = event.target.currentSrc;
    this.imageURL = target;
  }

  public mobileSidebar() {
    $('.collection-filter').css('left', '-15px');
  }

  showModal(): void {
    this.isVisible = true;
  }

  showModal2(): void {
    this.isVisible2 = true;
  }

  handleOk(): void {
    const url = 'https://easyparcel.com/my/bm/page404/';
    window.open(url);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  async handleOk2() {
    let x = new Date();
    let y = new Date();
    x = this.selfPickup.controls['datePicker'].value;
    y = this.selfPickup.controls['timePicker'].value;

    this.requestObj.pickupDate = new Date(
      x.getFullYear(),
      x.getMonth(),
      x.getDate(),
      y.getHours(),
      y.getMinutes()
    );

    this.requestObj.isSelfPickup = true;
    this.requestObj.isNotified = true;
    this.requestObj.isCompleted = false;
    const response = await this.productsService.updateSwapRequest(this.requestObj).toPromise().then((res) => {
      this.isVisible2 = false;
      this.isDecided = true;
      this.success();
    });
  }

  success(): void {
    this.modalService.success({
      nzTitle: 'Thank you for using BagiFree. Do you like BagiFree?',
      // tslint:disable-next-line: max-line-length
      nzContent:
        // tslint:disable-next-line: max-line-length
        'We need your help today to keep this platform up and running so that this exchanges of love between people to people and people to earth can thrive for as long as we can. Your every bit of donation will go back to the BagiFree community and will not be put to waste. Your contribution is a testimony of your love to humanity, your care for cleaner earth and above all, your belief that GIVING is what makes this world a happy place to live together. Please click the ‘Love2Support’ button below to make donation.',
      nzOkText: 'Love2Support',
      nzOnOk: () => this.router.navigate(['pages/donate']),
      nzCancelText: 'No Thanks',
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
      // tslint:disable-next-line: max-line-length
      nzContent: `<b>Owner Name: ${this.userObj.username}</b><br/><b>Mobile Number: <a href="tel:0${this.userObj.mobile}">0${this.userObj.mobile}</a></b><br/><b>Email Address:  <a href="mailto:${this.userObj.email}?Subject=BagiFree%20Request">${this.userObj.email}</a></b>`,
      nzOnOk: () => console.log(''),
    });
  }


  editOK(): void {
    const length: number = this.images.length;
    this.isEditLoading = true;
    if (length > 4) {
      this.editModal = true;
      this.isEditLoading = false;
      this.msg.error('Image cannot be more than 4!');
    } else if (length === 0) {
      this.editModal = true;
      this.isEditLoading = false;
      this.msg.error('Image cannot be blank!');
    } else {
      setTimeout(() => {
        this.updateRecord(this.currModal);
      }, 2000);
    }
  }

  async uploading1(uploadFile: File[]): Promise<string[]> {
    const urlString: string[] = new Array();
    for (let i = 0; i < uploadFile.length; i++) {
      const formData = new FormData();
      formData.append('image', uploadFile[i]);
      const result = await this.productsService.Upload(formData).toPromise();
      urlString.push(result['_body']);
    }
    return urlString;
  }

  async updateRecord(data: Swap) {
    const c = this.address.find((itm) => {
      return itm.id === this.editForm.controls['address'].value;
    });

    data.productName = this.editForm.controls['pName'].value;
    data.productBrand = this.editForm.controls['pBrand'].value;
    data.productCategory_ID = this.editForm.controls['pCategory'].value;
    data.productCondition_ID = this.editForm.controls['pCondition'].value;
    data.productDescription = this.editForm.controls['pDescription'].value;
    data.productAge_ID = this.editForm.controls['pAge'].value;
    data.isAvailable = this.editForm.controls['isAvailable'].value;
    data.productWeight = this.editForm.controls['pWeight'].value;
    data.preferredItem = this.editForm.controls['pItem'].value;
    data.address = c;

    const uploadFile: File[] = [...this.allfiles];
    const list = await this.uploading1(uploadFile);

    this.allfiles.forEach((e) => {
      this.images.forEach((y) => {
        if (y.name === e.name) {
          const index = this.images.indexOf(y);
          this.images.splice(index, 1);
        }
      });
    });

    list.forEach((element) => {
      const x: any = {
        name: 'bagifree',
        size: 1000,
        type: 'image/jpg',
        url: element
      };
      this.images.push(x);
    });

    await this.productsService.updateSwapProduct(data).toPromise();
    await this.productsService.insertSwapProductImageModal(data.id).toPromise();

    const promises = new Array();

    this.images.map((itm) => {
      promises.push(this.productsService.insertSwapProductImage(0, data.id, itm.url).toPromise());
    });

    await Promise.all(promises).then(() => {
      this.images = [];
      this.allfiles = [];
      this.getProduct();
      this.isEditLoading = false;
      this.editModal = false;
    }, (err) => {
      console.log(err);
      this.editModal = false;
      this.isEditLoading = false;
    });
  }

  cancelEdit(): void {
    this.images = [];
    this.allfiles = [];
    this.editModal = false;
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  showEdit(data: Swap): void {
    this.address.forEach((itm) => {
      let finalstring = '';

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
        const x = {
          name: itm.productImage.slice(39),
          status: 'done',
          type: 'image/jpg',
          size: 1000,
          url: itm.productImage,
        };
        this.images.push(x);
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
        pItem: [data.preferredItem, [Validators.required]],
      });
    });
  }
}
