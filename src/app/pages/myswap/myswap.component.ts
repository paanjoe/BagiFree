import { Component, OnInit } from '@angular/core';
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
  NzMessageService,
} from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Swap } from 'src/app/shared/classes/swap';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { Address } from 'src/app/shared/classes/address';
import { AddressService } from 'src/app/shared/services/address.service';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-myswap',
  templateUrl: './myswap.component.html',
  styleUrls: ['./myswap.component.scss'],
})
export class MyswapComponent implements OnInit {
  // *****************************************************************************
  // Constructor Section
  // *****************************************************************************
  constructor(
    private addressService: AddressService,
    private router: Router,
    private productService: ProductsService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private db: AngularFireDatabase,
    private imageCompress: NgxImageCompressService,
    private fb: FormBuilder
  ) { }

  // *****************************************************************************
  // Global Variable
  // *****************************************************************************
  public swapimgobj: ProductImage_Ref[];
  public swapfileList = [];
  public selectedValue: number;
  public previewImage: string;
  public previewVisible = false;
  public swappreviewImage: string;
  public swappreviewVisible = false;
  public productList: Products[];
  public swapList: any[];
  public pCategory: ProductCategory[];
  public pCondition: ProductCondition[];
  public pAge: ProductsAge[];
  public validateForm: FormGroup;
  public swapForm: FormGroup;
  public confirmModal: NzModalRef;
  public isVisible = false;
  public isSwapVisible = false;
  public isDeleteVisible = true;
  public isOkLoading = false;
  public isOKSwapLoading = false;
  public isDeleteLoading = false;
  public isActive = 'false';
  public isSwapActive = 'false';
  public Update = 'Update';
  public updateRes = true;
  public currModal: Products;
  public currSwapModal: Swap;
  public successType = 'success';
  public successTitleDelete = 'Item Deleted';
  public successTitleUpdate = 'Item Updated';
  public errorType = 'error';
  public errorTitle = 'Error';
  public errorMessage =
    'Opps! Something went wrong when updating the information. Please try again.';
  public value: string;
  public isproductLoading = true;
  public isswapLoading = true;
  public returnUrl: string;
  public address: Address[];
  public imageList: ProductImage_Ref[];
  public jkg: ProductImage_Ref[];
  public fileList = [];
  public tempBlob: Blob = new Blob();
  public test: any;
  public imgList: String;
  public lol = [];
  public images: any = [];
  public allfiles: File[] = [];
  public imgModal: Boolean = false;
  public imgModalSrc: String = '';
  public imagesSwap: any = [];
  public allfilesSwap: File[] = [];
  public imgModalSwap: Boolean = false;
  public imgModalSrcSwap: String = '';
  

  // *****************************************************************************
  // Config Section
  // *****************************************************************************
  public showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };

  public showswapUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };

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

  // Open image modal
  modalImageSwap(img) {
    this.imgModalSwap = true;
    this.imgModalSrcSwap = img;
  }

  // Close image modal
  closeimgSwap(): void {
    this.imgModalSwap = false;
  }

  // Close image modal
  cancelimgSwap(): void {
    this.imgModalSwap = false;
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

  uploadQueueSwap(event) {
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
                  this.imagesSwap.push(image);
                  // convert to blob
                  let blobTemp: Blob;
                  blobTemp = this.dataURItoBlob(res, fileName);
                  // convert to file
                  const myfile = this.blobToFile(blobTemp, fileName);
                  // push image size into array list
                  image.size = this.imageSizeConversion(myfile);
                  // push files to global
                  this.allfilesSwap.push(myfile);
                });
            }
          );
        };
        reader.readAsDataURL(files[i]);
      }
    }
    event.srcElement.value = null;
  }

  // Delete image on the queue list
  deleteImage(img: any) {
    const index = this.images.indexOf(img);
    this.images.splice(index, 1);
    this.allfiles.splice(index, 1);
  }

  deleteImageSwap(img: any) {
    const index = this.imagesSwap.indexOf(img);
    this.imagesSwap.splice(index, 1);
    this.allfilesSwap.splice(index, 1);
  }

  getOrientation(file): number {
    var reader: any, target: EventTarget;
    reader = new FileReader();
    reader.onload = (event) => {
      var view = new DataView(event.target.result);

      if (view.getUint16(0, false) != 0xffd8) return -2;

      var length = view.byteLength,
        offset = 2;

      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;

        if (marker == 0xffe1) {
          if (view.getUint32((offset += 2), false) != 0x45786966) {
            return -1;
          }
          var little = view.getUint16((offset += 6), false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;
          let x: number;
          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + i * 12, little) == 0x0112)
              x = view.getUint16(offset + i * 12 + 8, little);
          return x;
        } else if ((marker & 0xff00) != 0xff00) break;
        else offset += view.getUint16(offset, false);
      }
      return -1;
    };
    return -2;

    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  }

  public blobToFile = (theBlob: Blob, fileName: String): File => {
    const b: any = theBlob;
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
      const width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

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

  getOrientationSwap(file, callback) {
    let reader: any, target: EventTarget;
    reader = new FileReader();
    reader.onload = (event) => {
      const view = new DataView(event.target.result);

      if (view.getUint16(0, false) != 0xffd8) {
        return callback(-2);
      }

      let length = view.byteLength,
        offset = 2;

      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker == 0xffe1) {
          if (view.getUint32((offset += 2), false) != 0x45786966) {
            return callback(-1);
          }
          const little = view.getUint16((offset += 6), false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;

          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) == 0x0112)
              return callback(view.getUint16(offset + i * 12 + 8, little));
          }
        } else if ((marker & 0xff00) != 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      return callback(-1);
    };

    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  }

  getBase64Swap(file, orientation, fileName) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result;
      this.resetOrientationSwap(base64, orientation, (resetBase64Image) => {
        let dataURICompressed;
        this.imageCompress
          .compressFile(resetBase64Image, -2, 50, 50)
          .then((res) => {
            dataURICompressed = res;
            this.dataURItoBlobSwap(dataURICompressed, fileName);
          });
      });
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  resetOrientationSwap(srcBase64, srcOrientation, callback) {
    const img = new Image();

    img.onload = () => {
      const width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

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

  dataURItoBlobSwap(dataURI, fileName) {
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
    const myfile = this.blobToFile(bb, fileName);

    // start - Amazon
    // const bucket = new S3({
    //   accessKeyId: 'AKIA6K6DTSRABVHLIHOV',
    //   secretAccessKey: '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',
    //   region: 'us-east-1'
    // });
    let testvar: UploadFile;

    const bar = new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append('files[]', myfile);

      const metaData = { contentType: myfile.type };
      const randomID = ';';

      // const params = {
      //   Bucket: 'bagifree-v1.0',
      //   Key: randomID + myfile.name,
      //   Body: myfile,
      //   ACL: 'public-read',
      //   ContentType: myfile.type
      // };

      // bucket.upload(params, function (err, data) {
      //   if (err) {
      //       console.log('There was an error uploading your file: ', err);
      //       return false;
      //   }
      //   console.log('Successfully uploaded file.', data);
      //   this.imgList = data.Location;
      //   this.swapfileList = [];
      //   let id: number = this.swapfileList.length;
      //   id = id + 1;

      //   testvar = {
      //       uid: id.toString(),
      //       size: myfile.size,
      //       name: myfile.name,
      //       url: data.Location,
      //       type: myfile.type
      //   };

      //   resolve();
      //   return true;
      // });
    });

    bar.then(() => {
      this.swapfileList = this.swapfileList.concat(testvar);
    });

    return bb;
  }

  async ngOnInit() {
    // Load drop down list from database
    await this.loadformgroup();
    await this.loadDDL();
    await this.getProductList();
    await this.getSwapList();
  }

  async loadformgroup() {
    // For Products
    this.validateForm = this.fb.group({
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
    });
    // For Swap
    this.swapForm = this.fb.group({
      formLayout: ['vertical'],
      sName: [null, [Validators.required]],
      sCondition: [null, [Validators.required]],
      sAge: [null, [Validators.required]],
      sWeight: [null, [Validators.required]],
      sCategory: [null, [Validators.required]],
      isSwapAvailable: [null, [Validators.required]],
      sDescription: [null, [Validators.required]],
      sBrand: [null, Validators.required],
      address: [null, Validators.required],
      estVal: [null, Validators.required],
      sItem: [null, [Validators.required]],
    });
  }

  async getProductList() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const product: any = await this.productService.getProductsByUserID(currentUser.id).toPromise();
    this.productList = product;
    await this.getcname(this.productList);
    this.isproductLoading = false;
  }

  async getSwapList() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const swap: any = await this.productService.getSwapByUserID(currentUser.id).toPromise();
    this.swapList = swap;
    await this.getSwapcname(this.swapList);
    this.isswapLoading = false;
  }

  // General Area
  async loadDDL() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.pCategory = await this.productService.productsCategory().toPromise();
    this.pCondition = await this.productService.productsCondition().toPromise();
    this.pAge = await this.productService.productAge().toPromise();
    this.address = await this.addressService.getAddressByUserID(currentUser.id).toPromise();
  }

  createNotification(type: string, title: string, message: string): void {
    // dynamic notifications.
    this.notification.create(type, title, message);
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  async getcname(data: Products[]) {
    this.getProductCategory(data);
    this.getProductCondition(data);
    this.getProductAge(data);
  }

  async getSwapcname(data: Swap[]) {
    this.getSwapProductCategory(data);
    this.getSwapProductCondition(data);
    this.getSwapProductAge(data);
  }

  getProductAge(data: Products[]) {
      data.forEach((element) => {
        const c = this.pAge.find((item: ProductsAge) => {
          return item.productAge_ID === element.productAge_ID;
        });
        element.age = c.productAgeTitle;
      });
  }

  getProductCategory(data: Products[]) {
      data.forEach((element) => {
        const c = this.pCategory.find((item: ProductCategory) => {
          return item.categoryID === element.productCategory_ID;
        });
        element.category = c.categoryTitle;
      });
  }

  getProductCondition(data: Products[]) {
      data.forEach((element) => {
        const c = this.pCondition.find((item: ProductCondition) => {
          return item.productConditionID === element.productCondition_ID;
        });
        element.condition = c.productConditionTitle;
      });
  }

  getSwapProductAge(data: Swap[]) {
      data.forEach((element) => {
        const c = this.pAge.find((item: ProductsAge) => {
          return item.productAge_ID === element.productAge_ID;
        });
        element.age = c.productAgeTitle;
      });
  }

  getSwapProductCategory(data: Swap[]) {
      data.forEach((element) => {
        const c = this.pCategory.find((item: ProductCategory) => {
          return item.categoryID === element.productCategory_ID;
        });
        element.category = c.categoryTitle;
      });
  }

  getSwapProductCondition(data: Swap[]) {
      data.forEach((element) => {
        const c = this.pCondition.find((item: ProductCondition) => {
          return item.productConditionID === element.productCondition_ID;
        });
        element.condition = c.productConditionTitle;
      });
  }

  isProductActive(data: boolean): string {
    if (data === true) {
      return 'Available';
    }
    return 'Not Available';
  }

  // Giveaway Modal Area

  showModal(data: Products): void {
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

    this.jkg = data.productImage_Ref;
    const bar = new Promise((resolve, reject) => {
      this.jkg.forEach((itm) => {
        const y = {
          name: itm.productImage.slice(39),
          type: 'image/jpg',
          size: 10000,
          url: itm.productImage,
        };
        this.images.push(y);
      });
      resolve();
    });

    bar.then(() => {
      this.currModal = data;
      this.isVisible = true;
      this.isActive = data.isAvailable.toString();
      let isAvail: String = 'false';

      if (data.isAvailable === true) {
        isAvail = 'true';
      }

      this.validateForm = this.fb.group({
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
      });
    });
  }

  handleOk(): void {
    this.isOkLoading = true;
    this.isproductLoading = true;
    const l: number = this.images.length;

    if (l === 0) {
      this.isOkLoading = false;
      this.isproductLoading = false;
      this.isVisible = true;
      this.msg.error('Image cannot be blank!');
    } else if (l > 4) {
      this.isOkLoading = false;
      this.isproductLoading = false;
      this.isVisible = true;
      this.msg.error('Image cannot be more than 4!');
    } else {
      setTimeout(() => {
        this.isVisible = false;
        this.isOkLoading = false;
        this.updateRecord(this.currModal);
      }, 2000);
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.images = [];
    this.allfiles = [];
  }

  showConfirm(data): void {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'This change cannot be reverted.',
      nzOnOk: () => {
        this.deleteRecord(data);
      },
    });
  }

  async deleteRecord(data) {
    this.isproductLoading = true;
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const deleteImage = await this.productService.deleteImageProduct(data.id).toPromise();
      const deleteProduct = await this.productService.deleteProduct(data.id).toPromise();
      const getProduct: any = await this.productService.getProductsByUserID(currentUser.id);
      this.productList = getProduct;
      this.getcname(this.productList);
      this.isproductLoading = false;
      this.createNotification(this.successType, this.successTitleDelete, 'The item has been successfully delete.');
      this.getProductList();
    } catch (err) {
      this.getProductList();
      this.isproductLoading = false;
    }
  }

  async uploading1(uploadFile: File[]): Promise<string[]> {
    const urlString: string[] = new Array();
    for (let i = 0; i < uploadFile.length; i++) {
      const formData = new FormData();
      formData.append('image', uploadFile[i]);
      const result = await this.productService.Upload(formData).toPromise();
      urlString.push(result['_body']);
    }
    return urlString;
  }

  async updateRecord(data: Products) {
    data.productName = this.validateForm.controls['pName'].value;
    data.productBrand = this.validateForm.controls['pBrand'].value;
    data.productCategory_ID = this.validateForm.controls['pCategory'].value;
    data.productCondition_ID = this.validateForm.controls['pCondition'].value;
    data.productDescription = this.validateForm.controls['pDescription'].value;
    data.productAge_ID = this.validateForm.controls['pAge'].value;
    data.isAvailable = this.validateForm.controls['isAvailable'].value;
    data.productWeight = this.validateForm.controls['pWeight'].value;

    const c = this.address.find((itm) => {
      return itm.id === this.validateForm.controls['address'].value;
    });

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
        url: element,
      };
      this.images.push(x);
    });


    const product = await this.productService.updateProduct(data).toPromise();
    const modalImage = await this.productService.insertProductImageModal(data.id).toPromise();
    const promises = new Array();
    this.images.map((itm) => {
      promises.push(this.productService.insertProductImage(0, data.id, itm.url).toPromise());
    });

    await Promise.all(promises).then(() => {
      this.isproductLoading = false;
      this.images = [];
      this.allfiles = [];
      this.getProductList();
    });
  }

  // Swap Modal Area

  handleSwapCancel(): void {
    this.isSwapVisible = false;
    this.imagesSwap = [];
    this.allfilesSwap = [];
  }

  handleSwapOk(): void {
    this.isOKSwapLoading = true;
    this.isswapLoading = true;
    const l: number = this.imagesSwap.length;
    if (l === 0) {
      this.isOKSwapLoading = false;
      this.isswapLoading = false;
      this.isSwapVisible = true;
      this.msg.error('Image cannot be blank!');
    } else if (l > 4) {
      this.isOKSwapLoading = false;
      this.isswapLoading = false;
      this.isSwapVisible = true;
      this.msg.error('Image cannot be more than 4!');
    } else {
      setTimeout(() => {
        this.isSwapVisible = false;
        this.isOKSwapLoading = false;
        this.updateSwapRecord(this.currSwapModal);
      }, 2000);
    }
  }

  async updateSwapRecord(data: Swap) {
    data.productName = this.swapForm.controls['sName'].value;
    data.productBrand = this.swapForm.controls['sBrand'].value;
    data.productCategory_ID = this.swapForm.controls['sCategory'].value;
    data.productCondition_ID = this.swapForm.controls['sCondition'].value;
    data.productDescription = this.swapForm.controls['sDescription'].value;
    data.productAge_ID = this.swapForm.controls['sAge'].value;
    data.productWeight = this.swapForm.controls['sWeight'].value;

    const c = this.address.find((itm) => {
      return itm.id === this.swapForm.controls['address'].value;
    });

    data.address = c;
    data.estVal = this.swapForm.controls['estVal'].value;
    data.preferredItem = this.swapForm.controls['sItem'].value;

    const uploadFile: File[] = [...this.allfilesSwap];
    const list = await this.uploading1(uploadFile);

    this.allfilesSwap.forEach((e) => {
      this.imagesSwap.forEach((y) => {
        if (y.name === e.name) {
          const index = this.imagesSwap.indexOf(y);
          this.imagesSwap.splice(index, 1);
        }
      });
    });

    list.forEach((element) => {
      const x: any = {
        name: 'bagifree',
        size: 1000,
        type: 'image/jpg',
        url: element,
      };
      this.imagesSwap.push(x);
    });


    const swap = await this.productService.updateSwapProduct(data).toPromise();
    const modalswap = await this.productService.insertSwapProductImageModal(data.id).toPromise();
    const promisesImage = new Array();
    this.imagesSwap.map((itm) => {
      promisesImage.push(this.productService.insertSwapProductImage(0, data.id, itm.url).toPromise());
    });

    await Promise.all(promisesImage).then(() => {
      this.imagesSwap = [];
      this.allfilesSwap = [];
      this.isswapLoading = false;
      this.getSwapList();
    });

  }

  showSwapModal(data: Swap): void {
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

    this.swapimgobj = data.swapImage_Ref;
    const prom = new Promise((resolve, reject) => {
      this.swapimgobj.forEach((itm) => {
        const y = {
          name: itm.productImage.slice(39),
          type: 'image/jpg',
          size: 10000,
          url: itm.productImage,
        };
        this.imagesSwap.push(y);
      });
      resolve();
    });

    prom.then(() => {
      this.currSwapModal = data;
      this.isSwapVisible = true;
      this.isSwapActive = data.isAvailable.toString();
      let isAvail: String = 'false';

      if (data.isAvailable === true) {
        isAvail = 'true';
      }

      this.swapForm = this.fb.group({
        sId: [data.id],
        sName: [data.productName],
        sCondition: [data.productCondition_ID],
        sAge: [data.productAge_ID],
        sCategory: [data.productCategory_ID],
        isSwapAvailable: [isAvail],
        sDescription: [data.productDescription],
        sBrand: [data.productBrand],
        sWeight: [data.productWeight],
        address: [data.address.id],
        estVal: [data.estVal],
        sItem: [data.preferredItem],
      });
    });
    // this.selectedValue = data.address.id;
  }

  navigateAdd() {
    this.returnUrl = `/pages/post-product`;
    this.router.navigate([this.returnUrl]);
  }

  showSwapConfirm(data): void {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'This change cannot be reverted.',
      nzOnOk: () => {
        this.deleteSwapRecord(data);
      },
    });
  }

  async deleteSwapRecord(data) {
    this.isswapLoading = true;
    try {
      const promises = new Array();
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
      promises.push(this.productService.deleteSwapImageProduct(data.id).toPromise());
      promises.push(this.productService.deleteSwapProduct(data.id).toPromise());
      await Promise.all(promises);
      const getUpdatedProduct: any = await this.productService.getProductsByUserID(currentUser.id).toPromise();

      this.swapList = getUpdatedProduct;
      this.getcname(this.swapList);
      this.isswapLoading = false;
      this.createNotification(
        this.successType,
        this.successTitleDelete,
        'The item has been successfully deleted.'
      );
      this.getSwapList();
    } catch(err) {
      this.getSwapList();
      this.isswapLoading = false;
    }
  }

  getImage(data: Products) {
   this.productService.getImage(data.id).subscribe((x) => {
      return x.productImage;
    });
  }

  getSwapImage(data: Swap) {
    this.productService.getSwapImage(data.id).subscribe((x) => {
      return x.productImage;
    });
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleSwapPreview = (file: UploadFile) => {
    this.swappreviewImage = file.url || file.thumbUrl;
    this.swappreviewVisible = true;
  };
}
