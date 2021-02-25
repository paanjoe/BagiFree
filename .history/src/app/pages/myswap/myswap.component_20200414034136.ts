import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';
import { Product, ProductCategory, Products, ProductCondition, ProductsAge, ProductsSize, ProductImage_Ref } from 'src/app/shared/classes/product';
import { NzModalService, NzNotificationService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Swap } from 'src/app/shared/classes/swap';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { Address } from 'src/app/shared/classes/address';
import { AddressService } from 'src/app/shared/services/address.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-myswap',
  templateUrl: './myswap.component.html',
  styleUrls: ['./myswap.component.scss']
})

export class MyswapComponent implements OnInit {

  constructor(private addressService: AddressService, private router: Router, private productService: ProductsService, private modalService: NzModalService, private notification: NzNotificationService,
    private msg: NzMessageService,
    private db: AngularFireDatabase,
    private fb: FormBuilder) {
      // For Products
      this.validateForm = this.fb.group({
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
      // For Swap
      this.swapForm = this.fb.group({
        formLayout: ['vertical'],
        sName: [null, [Validators.required]],
        sCondition: [null, [Validators.required]],
        sAge: [null, [Validators.required]],
        sWeight: [null, [Validators.required]],
        sCategory: [null, [Validators.required]],
        isSwapAvailable: [null, [Validators.required]],
        sDescription:[null, [Validators.required]],
        sBrand: [null, Validators.required],
        address: [null, Validators.required],
        estVal: [null, Validators.required],
        sItem: [null, Validators.required]
      });
     }

  public productList: Products[];
  public swapList: any[];
  public pCategory: ProductCategory[];
  public pCondition: ProductCondition[];
  public pAge: ProductsAge[];
  public validateForm: FormGroup;
  public swapForm: FormGroup;
  public confirmModal: NzModalRef;
  public isVisible: boolean = false;
  public isSwapVisible: boolean = false;
  public isDeleteVisible: boolean = true;
  public isOkLoading: boolean = false;
  public isOKSwapLoading: boolean = false;
  public isDeleteLoading: boolean = false;
  public isActive: string = 'false';
  public isSwapActive: string = 'false';
  public Update: string = "Update";
  public updateRes:boolean = true;
  public currModal: Products;
  public currSwapModal: Swap;
  public successType: string = "success";
  public successTitleDelete: string = "Item Deleted";
  public successTitleUpdate: string = "Item Updated";
  public errorType: string = "error";
  public errorTitle: string = "Error";
  public errorMessage: string = "Opps! Something went wrong when updating the information. Please try again.";
  public value: string;
  public isproductLoading: boolean = true;
  public isswapLoading: boolean = true;
  public returnUrl: string;
  public address: Address[];
  public imageList: ProductImage_Ref[];


  public tempBlob: Blob = new Blob();
  public test: any;
  public imgList: String; 
  public lol = [];

  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  getOrientation(file, callback) {


    var reader: any,
    target: EventTarget;
    reader = new FileReader();
    reader.onload = (event) => {

      var view = new DataView(event.target.result);

      if (view.getUint16(0, false) != 0xFFD8) return callback(-2);

      var length = view.byteLength,
        offset = 2;

      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;

        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) {
            return callback(-1);
          }
          var little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;

          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112)
              return callback(view.getUint16(offset + (i * 12) + 8, little));
        }
        else if ((marker & 0xFF00) != 0xFF00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    };

    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  }

  public blobToFile = (theBlob: Blob, fileName:string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  dataURItoBlob(dataURI, fileName) {

  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURI.split(',')[1]);

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var bb = new Blob([ab], { type: "image/jpeg" });
  this.tempBlob = bb;
  var myfile = this.blobToFile(bb, fileName);

  let bar = new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append('files[]', myfile);

    const metaData = {'contentType': myfile.type};
    const randomID = this.guidGenerator();
    const storageRef: firebase.storage.Reference = firebase.storage().ref(randomID + myfile.name);

    storageRef.put(myfile, metaData).then(snapshot => {
      return snapshot.ref.getDownloadURL(); }).then(downloadURL => {
        this.imgList = downloadURL;
        let id: number = this.fileList.length;
        id = id + 1;
        let x = {
          uid: id,
          name: myfile.name,
          status: 'done',
          url: this.imgList
        };
        this.test = x;
        resolve();
        return downloadURL;
      });
  });

  bar.then(() => {
    this.fileList = this.fileList.concat(this.test);
  });

  return bb;
  }

  getBase64(file, orientation, fileName) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      var base64 = reader.result;
      this.resetOrientation(base64, orientation, (resetBase64Image) => {
        this.dataURItoBlob(resetBase64Image, fileName);
      });
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  resetOrientation(srcBase64, srcOrientation, callback) {
    var img = new Image();

    img.onload = () => {
      var width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");

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
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height, width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }

      // draw image
      ctx.drawImage(img, 0, 0);

      // export base64
      callback(canvas.toDataURL());
    };

    img.src = srcBase64;
  }

  beforeUpload = (file: File): boolean => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';

    // check file format
    if (!isJPG && !isPNG){
      this.msg.error('You can only upload JPG/PNG file!');
      return false;
    }

    // check file size
    const isLt7M = file.size / 1024 / 1024 < 7;
    if (!isLt7M) {
      this.msg.error('Image must smaller than 7MB!');
      return false;
    }

    const fileName = file.name;

    // Codename: EXIF
    this.getOrientation(file, (orientation) => {
      this.getBase64(file, orientation, fileName);
    });

    // this.fL = this.fL.concat(file);
    return false;
  }

  ngOnInit() {
    // Load drop down list from database
    this.loadformgroup();
    this.loadDDL();
    this.getProductList();
    this.getSwapList();
  }

  loadformgroup() {
    // For Products
    this.validateForm = this.fb.group({
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
    // For Swap
    this.swapForm = this.fb.group({
      formLayout: ['vertical'],
      sName: [null, [Validators.required]],
      sCondition: [null, [Validators.required]],
      sAge: [null, [Validators.required]],
      sWeight: [null, [Validators.required]],
      sCategory: [null, [Validators.required]],
      isSwapAvailable: [null, [Validators.required]],
      sDescription:[null, [Validators.required]],
      sBrand: [null, Validators.required],
      address: [null, Validators.required],
      estVal: [null, Validators.required],
      sItem: [null, [Validators.required]]
    });
  }

  getProductList(){
    // Get Giveaway
    this.productService.getProductsByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((res: any) => {
      this.productList = [...res];
      this.isproductLoading = false;
      this.getcname(this.productList);
      }, err => { this.isproductLoading = false; console.log(err); }
    );
  }

  getSwapList() {
    // Get Swap
    this.productService.getSwapByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((res: any) => {
      this.swapList = [...res];
      this.isswapLoading = false;
      this.getSwapcname(this.swapList);
      }, err => { this.isproductLoading = false; console.log(err);}
    );
  }

  // General Area
  loadDDL(): void {

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

    this.addressService.getAddressByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((x) => {
      this.address = [...x];
    }, err => {
      console.log(err);
    });
  }

  createNotification(type: string, title: string, message: string): void {
    // dynamic notifications.
    this.notification.create(
      type,
      title,
      message
    );
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  getcname(data: Products[]) {
    this.getProductCategory(data);
    this.getProductCondition(data);
    this.getProductAge(data);
  }

  getSwapcname(data: Swap[]) {
    this.getSwapProductCategory(data);
    this.getSwapProductCondition(data);
    this.getSwapProductAge(data);
  }

  getProductAge(data: Products[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pAge.find((item: ProductsAge) => {
          return item.productAge_ID === element.productAge_ID;
        });
        element.age = c.productAgeTitle;
      });
    }
  }

  getProductCategory(data: Products[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pCategory.find((item: ProductCategory) => {
          return item.categoryID === element.productCategory_ID;
        });
        element.category = c.categoryTitle;
      });
    }
  }

  getProductCondition(data: Products[]) {
   if (data !== []) {
    data.forEach((element) => {
      const c = this.pCondition.find((item: ProductCondition) => {
        return item.productConditionID === element.productCondition_ID;
      });
      element.condition = c.productConditionTitle;
    });
   }
  }

  getSwapProductAge(data: Swap[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pAge.find((item: ProductsAge) => {
          return item.productAge_ID === element.productAge_ID;
        });
        element.age = c.productAgeTitle;
      });
    }
  }

  getSwapProductCategory(data: Swap[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pCategory.find((item: ProductCategory) => {
          return item.categoryID === element.productCategory_ID;
        });
        element.category = c.categoryTitle;
      });
    }
  }

  getSwapProductCondition(data: Swap[]) {
    if (data !== []) {
      data.forEach((element) => {
        const c = this.pCondition.find((item: ProductCondition) => {
          return item.productConditionID === element.productCondition_ID;
        });
        element.condition = c.productConditionTitle;
      });
    }
  }

  isProductActive(data: boolean): string{
    if (data === true) {
      return 'Available';
    } return 'Not Available';
  }

  // Giveaway Modal Area
  public jkg: ProductImage_Ref[];

  public fileList = [];

  showModal(data: Products): void {

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
    let bar = new Promise((resolve, reject) => {
      this.fileList = [];
      let id: number = 1;
      this.jkg.forEach((itm) => {
        const x = {
          uid: id,
          name: itm.productImage.slice(79),
          status: 'done',
          url: itm.productImage
        };
        id = id + 1;
        this.fileList.push(x);
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
        address: [data.address.id, [Validators.required]]
      });

    });
  }

  handleOk(): void {
    this.isOkLoading = true;
    this.isproductLoading = true;


    if (this.fileList.length === 0) {
      this.isOkLoading = false;
      this.isproductLoading = false;
      this.isVisible = true;
      this.msg.error("Image cannot be blank!");
    } else if (this.fileList.length > 4) {
      this.isOkLoading = false;
      this.isproductLoading = false;
      this.isVisible = true;
      this.msg.error("Image cannot be more than 4!");
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
  }

  showConfirm(data): void {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'This change cannot be reverted.',
      nzOnOk: () => {this.deleteRecord(data);}
    });
  }

  deleteRecord(data) {
    this.isproductLoading = true;
    this.productService.deleteImageProduct(data.id).subscribe((x) => {
      this.productService.deleteProduct(data.id).subscribe((y) => {
        this.productService.getProductsByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((res: any) => {
          this.productList = [...res]; 
          this.getcname(this.productList);
          this.isproductLoading = false;
          this.createNotification(this.successType, this.successTitleDelete, "The item has been successfully deleted.")
          // refresh table
          this.getProductList();
          }, err => { console.log(err); this.isproductLoading = false; this.getProductList(); }
        );
        });
    });

  }

  updateRecord(data: Products) {
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

    this.productService.updateProduct(data).subscribe((x) => {
      this.productService.insertProductImageModal(data.id).subscribe((res) => {
        this.fileList.forEach((itm) => {
          this.productService.insertProductImage(0, data.id, itm.url).subscribe((res) => {
            this.isproductLoading = false;
            this.getProductList();
            window.location.reload();
          });
        });
      });
    }, err => {
      console.log(err);
      this.isproductLoading = false;
    });
  }

  // Swap Modal Area

  handleSwapCancel(): void {
    this.isSwapVisible = false;
  }

  handleSwapOk(): void {
    this.isOKSwapLoading = true;
    this.isswapLoading = true;

    if (this.swapfileList.length === 0) {
      this.isOKSwapLoading = false;
      this.isswapLoading = false;
      this.isSwapVisible = true;
      this.msg.error("Image cannot be blank!");
    } else if (this.swapfileList.length > 4) {
      this.isOKSwapLoading = false;
      this.isswapLoading = false;
      this.isSwapVisible = true;
      this.msg.error("Image cannot be more than 4!");
    } else {
      setTimeout(() => {
        this.isSwapVisible = false;
        this.isOKSwapLoading = false;
        this.updateSwapRecord(this.currSwapModal);
      }, 2000);
    }
  }

  updateSwapRecord(data: Swap){
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

     this.productService.updateSwapProduct(data).subscribe((x) => {
       this.isswapLoading = false;
       this.getSwapList();
     }, err => {
       console.log(err);
       this.isswapLoading = false;
     });

  }

  public swapimgobj: ProductImage_Ref[];
  public swapfileList = [];

  showSwapModal(data: Swap): void {

    this.swapimgobj = data.swapImage_Ref;
    let prom = new Promise((resolve, reject) => {
      this.swapfileList = [];
      this.swapimgobj.forEach((itm) => {
        const x = {
          uid: -2,
          name: 'test',
          status: 'done',
          url: itm.productImage
        };
        this.swapfileList.push(x);
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
        sDescription:[data.productDescription],
        sBrand: [data.productBrand],
        sWeight: [data.productWeight],
        address: [data.address.id],
        estVal: [data.estVal],
        sItem: [data.preferredItem]
      });
      this.selectedValue = data.address.id;
    });
    //this.selectedValue = data.address.id;

  }
  public selectedValue: number;

  navigateAdd() {
    this.returnUrl = `/pages/post-product`
    this.router.navigate([this.returnUrl]);
  }

  showSwapConfirm(data): void {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'This change cannot be reverted.',
      nzOnOk: () => {this.deleteSwapRecord(data);}
    });
  }

  deleteSwapRecord(data){
    this.isswapLoading = true;

    this.productService.deleteSwapImageProduct(data.id).subscribe((x) => {
      this.productService.deleteSwapProduct(data.id).subscribe((y) => {
        this.productService.getProductsByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((res: any) => {
          this.swapList = [...res]; 
          this.getcname(this.swapList);
          this.isswapLoading = false;
          this.createNotification(this.successType, this.successTitleDelete, "The item has been successfully deleted.")
          this.getSwapList();
          }, err => { console.log(err); this.isswapLoading = false; this.getSwapList();}
        );
      });
    });
  }



  getImage(data: Products) {
   this.productService.getImage(data.id).subscribe((x) => {
      return x.productImage;
    }); 
  }

  getSwapImage(data: Swap){
    this.productService.getSwapImage(data.id).subscribe((x) => {
      return x.productImage;
    });
  }


  public previewImage: string;
  previewVisible = false;

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;

  }


  public swappreviewImage: string;
  swappreviewVisible = false;
  
  handleSwapPreview = (file: UploadFile) => {
    this.swappreviewImage = file.url || file.thumbUrl;
    this.swappreviewVisible = true;

  }


  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  }

  showswapUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  }

}