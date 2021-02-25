import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFile, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { Location } from '@angular/common';
import { countries } from 'src/app/mocks/country';
import { ProductsService } from 'src/app/shared/services/products.service';
import { AddressService } from 'src/app/shared/services/address.service';
import { Address } from 'src/app/shared/classes/address';
import { Products } from 'src/app/shared/classes/product';
import { Swap } from 'src/app/shared/classes/swap';
import { map, tap, finalize, filter } from 'rxjs/operators';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase} from '@angular/fire/database';
import { Observable, Observer } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import * as firebase from 'firebase';
import { Upload } from 'src/app/shared/classes/upload';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent implements OnInit {

  // public item
  states = [];
  countries = countries;
  id: string;
  fg1: FormGroup;
  data = {};
  checked = true;
  estValVisible = false;
  addressList: Address[];
  prodObj: Products;
  swapObj: Swap;
  public imageURL: string;
  public doneUpload: Boolean = false;


  // loading = false;
  // avatarUrl: string;


  // beforeUpload1 = (file: File) => {
  //   return new Observable((observer: Observer<boolean>) => {
  //     const isJPG = file.type === 'image/png';
  //     if (!isJPG) {
  //       this.msg.error('You can only upload JPG file!');
  //       observer.complete();
  //       return;
  //     }
  //     const isLt2M = file.size / 1024 / 1024 < 2;
  //     if (!isLt2M) {
  //       this.msg.error('Image must smaller than 2MB!');
  //       observer.complete();
  //       return;
  //     }
  //     // check height
  //     this.checkImageDimension(file).then(dimensionRes => {
  //       if (!dimensionRes) {
  //         this.msg.error('Image only 300x300 above');
  //         observer.complete();
  //         return;
  //       }

  //       observer.next(isJPG && isLt2M && dimensionRes);
  //       observer.complete();
  //     });
  //   });
  // };

  // private getBase64(img: File, callback: (img: string) => void): void {
  //   const reader = new FileReader();
  //   // tslint:disable-next-line: no-non-null-assertion
  //   reader.addEventListener('load', () => callback(reader.result!.toString()));
  //   reader.readAsDataURL(img);
  // }

  // private checkImageDimension(file: File): Promise<boolean> {
  //   return new Promise(resolve => {
  //     const img = new Image(); // create image
  //     img.src = window.URL.createObjectURL(file);
  //     img.onload = () => {
  //       const width = img.naturalWidth;
  //       const height = img.naturalHeight;
  //       // tslint:disable-next-line: no-non-null-assertion
  //       window.URL.revokeObjectURL(img.src!);
  //       resolve(width === height && width >= 300);
  //     };
  //   });
  // }


  // handleChange(info: { file: UploadFile }): void {
  //   switch (info.file.status) {
  //     case 'uploading':
  //       this.loading = true;
  //       break;
  //     case 'done':
  //       // Get this url from response in real world.
  //       // tslint:disable-next-line: no-non-null-assertion
  //       this.getBase64(info.file!.originFileObj!, (img: string) => {
  //         this.loading = false;
  //         this.avatarUrl = img;
  //       });
  //       break;
  //     case 'error':
  //       this.msg.error('Network error');
  //       this.loading = false;
  //       // tslint:disable-next-line: no-non-null-assertion
  //       this.getBase64(info.file!.originFileObj!, (img: string) => {
  //         this.avatarUrl = img;
  //       });
  //       break;
  //   }
  // }

  // to generate random id in firebase
  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
  public status: string = 'Not Upload yet.';


  // old upload method.
  onUpload(event:any){
    //console.log(event);
    this.status = 'Upload ....'
    const file: File = event.target.files[0];
    const metaData = {'contentType': file.type};
    console.log(file);
   // const randomID = this.guidGenerator();
    const storageRef: firebase.storage.Reference = firebase.storage().ref(file.name);
    storageRef.put(file, metaData)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL();   // Will return a promise with the download link
    }).then(downloadURL => {
      console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
      this.imageURL = downloadURL;
      console.log(this.imageURL);
      this.status = 'File Uploaded!';
      return downloadURL;
   });
  }


  uploading = false;
  fL: File[] = [];
  fileList: UploadFile[] = []
  public imgList = [] as Array<string>;

  // queue image list
  beforeUpload = (file: File): boolean => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';

    // check file format
    if(!isJPG && !isPNG){
      this.msg.error('You can only upload JPG/PNG file!');
      return false;
    }

    // check file size
    const isLt7M = file.size / 1024 / 1024 < 7;
    if (!isLt7M) {
      this.msg.error('Image must smaller than 7MB!');
      return false;
    }
    console.log(file);
    this.fL = this.fL.concat(file);
    return false;
  };

  uploadbutton(fileList: File[]){
    fileList.forEach((file) => {
      const metaData = {'contentType': file.type};
     // const randomID = this.guidGenerator();
      const storageRef: firebase.storage.Reference = firebase.storage().ref(file.name);
      storageRef.put(file, metaData).then(snapshot => {
        return snapshot.ref.getDownloadURL();
      }).then(downloadURL => {
        this.imgList.push(downloadURL);
        this.status = 'File Uploaded!';
        this.uploading = false;
        this.doneUpload = true;
        return downloadURL;
     });
    })
  }
  
  handleUpload(){
    const formData = new FormData();
    this.fL.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    this.uploadbutton(this.fL);
  }


  constructor( private router: ActivatedRoute,
    private route : Router,
    private formBuilder: FormBuilder, 
    private productService: ProductsService, 
    private addressService: AddressService,
    private db: AngularFireDatabase,
    private http: HttpClient, 
    private msg: NzMessageService) { 
    }

    ngOnInit() {
      this.initValintoFG();
      // 1. Load Address
      this.loadAddress();

      // 2. Form Group assign
      this.loadformgroup();
    }
//////////////////////////////////////////////
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}
    public addresshow: boolean = false;
    public fg: FormGroup;

    public isAddressLoading: boolean = true;
    public isAddressOKLoading: boolean = false;
    public isVisible: boolean = false;
    public addAddressObj: Address;  
    public modalData: Address;
    public confirmModal: NzModalRef;
    public countries_ = countries;
    public modalTitle: string;

    addAddress(recordType: string, data?: Address) {
      this.initValintoFG(data);
      this.addresshow = true;
    }

    initValintoFG(data?: Address) {
      if (data == null) {
        this.fg = this.formBuilder.group({
          address1: [''],
          address2: [''],
          city: ['', Validators.required],
          state: ['', Validators.required],
          postal_code: [''],
          country: ['', Validators.required],
        });
      } else {
        // Pass id information
        this.modalData = data;

        // Get value for form controls
        this.fg = this.formBuilder.group({
          address1: [data.address1],
          address2: [data.address2],
          city: [data.city],
          state: [data.state],
          postal_code: [data.postalCode],
          country: [data.country]
        });
      }
    }

    handleCancel(): void {
      //reset form value
      this.initValintoFG(null);
      this.addresshow = false;
    }
    getvaladdressfc(){
      this.addAddressObj.address1 = this.fg.controls['address1'].value;
      this.addAddressObj.address2 = this.fg.controls['address2'].value;
      this.addAddressObj.city = this.fg.controls['city'].value;
      this.addAddressObj.state = this.fg.controls['state'].value;
      this.addAddressObj.postalCode = this.fg.controls['postal_code'].value;
      this.addAddressObj.country = this.fg.controls['country'].value;
      this.addAddressObj.userId = JSON.parse(localStorage.getItem('currentUser')).id;
  
    }
    declareNewAddressObject(){
      this.addAddressObj = {
        id: 0,
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: 0,
        country: '',
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  
    handleOk(): void {
      this.isAddressOKLoading = true;
      this.isAddressLoading = true;

      this.declareNewAddressObject();
      this.getvaladdressfc();

      this.addressService.insertAddress(this.addAddressObj).subscribe(res => {
        setTimeout(() => {
            this.isAddressLoading = false;
            this.isAddressOKLoading = false;
            this.addresshow = false;
            this.loadAddress();
            this.initValintoFG(null);
          }, 2000);
        }, err => {
          console.log(err);
          this.loadAddress();
          this.isAddressLoading = false;
          this.isAddressOKLoading = false;
          this.initValintoFG(null);
        });
    }
/////////////////////////////////
    loadAddress(){
      this.addressService.getAddressByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((x) => {
        this.addressList = [...x];
      });
    }

    loadformgroup(){
      this.fg1 = this.formBuilder.group({
        productName: [null, Validators.required],
        condition: [null, Validators.required],
        productAge: [null, Validators.required],
        weight: [null, Validators.required],
        type: [null, Validators.required],
        Brand: [null, Validators.required],
        Description: [null],
        category: [null, Validators.required],
        address: [null, Validators.required],
        estVal: [null],
        status: [true],
        preferredItem: [null]
      });
    }

    showEstVal(data){
      if(data == 2){
        this.estValVisible = true;
      } else {
        this.estValVisible = false;
      }
    }

   isLoadingOne = false;
    onSubmit() {
      this.isLoadingOne = true;
      const {
        productName = {},
        condition = {},
        productAge = {},
        weight = {},
        type = {},
        Brand = {},
        Description = {},
        category = {},
        address = {},
        status = {},
        preferredItem = {}
      } = this.fg1.value;


      // Product image
      this.fileList.forEach(x => {
        x.CreatedByID = "1";
        x.CreatedByName = "Bagifree";
        x.ModifiedByID = "1";
        x.ModifiedByName = "Bagifree";
        x.Data = x.thumbUrl;
        x.Filename = x.name;
      });

      // Promise to upload image first to friebase.
      let bar = new Promise((resolve, reject) => {
        const formData = new FormData();

        this.fL.forEach((file: any) => {
          formData.append('files[]', file);
        });

        this.uploading = true;

        this.fL.forEach((file, index, array) => {
          const metaData = {'contentType': file.type};
          const randomID = this.guidGenerator();
          const storageRef: firebase.storage.Reference = firebase.storage().ref(randomID + file.name);

          storageRef.put(file, metaData).then(
            snapshot => {
            return snapshot.ref.getDownloadURL(); }).then(
              downloadURL => {
                this.imgList.push(downloadURL);
                this.uploading = false;
                this.doneUpload = true;
                console.log(downloadURL);
                if (index === (this.fL.length - 1)) {
                  console.log('masuk');
                  resolve();
                }
                return downloadURL;
          });

        });
      });

      bar.then(() => {
        // after image done upload then throw logic here...
        if (parseInt(this.fg1.controls['type'].value) == 1) {
          this.getValuefromFormControl();
            // add product first
            this.productService.insertProducts(this.prodObj).subscribe((response:any) => {
              let prod = JSON.parse(response);
              let imgArr = [] as Array<Upload>;

              this.imgList.forEach((x) => {
                let imgObj = {id: 0, productID: prod.product.id, productImage: x }
                imgArr.push(imgObj);
              });

             let arrSize = imgArr.length;
             let index = 0;
             
             imgArr.forEach((itm) => {
                this.productService.insertProductImage(itm.id, itm.productID, itm.productImage).subscribe((res) => {
                  this.isLoadingOne = false;
                  index += 1;
                  if(index == arrSize){
                    this.route.navigate([`../../home/bagifree/product/${prod.product.id}`]);
                  }
                });
              });   
            });
        } else {
          this.getSwapValuefromFormControl();
          console.log(this.swapObj);
          this.productService.insertSwapProducts(this.swapObj).subscribe((res: any) => {
            let imgArr = [] as Array<Upload>;
            let ressw = JSON.parse(res);

            this.imgList.forEach((x) => {
              let imgObj = { id: 0, productID: ressw.product.id, productImage: x }
              imgArr.push(imgObj);
            });
  
            let arrSize = imgArr.length;
            let index = 0;
            
            imgArr.forEach((itm) => {
              this.productService.insertSwapProductImage(itm.id, itm.productID, itm.productImage).subscribe((res) => {
                this.isLoadingOne = false;
                index += 1;
                if(index == arrSize){
                  
                  this.route.navigate([`../../home/swap/product/${ressw.product.id}`]);
                }
              }); 
            });
          });
        }
      });      
    }

    getValuefromFormControl(){
      this.declareNewproductObject();

      this.prodObj.productName = this.fg1.controls['productName'].value;
      this.prodObj.productDescription = this.fg1.controls['Description'].value;
      this.prodObj.productCondition_ID = this.fg1.controls['condition'].value;
      this.prodObj.productCategory_ID = this.fg1.controls['category'].value;
      this.prodObj.productBrand = this.fg1.controls['Brand'].value;
      this.prodObj.isAvailable = true;
      this.prodObj.userid = JSON.parse(localStorage.getItem('currentUser')).id;
      this.prodObj.addressId = this.fg1.controls['address'].value;
      this.prodObj.productAge_ID = this.fg1.controls['productAge'].value;
      this.prodObj.productWeight = this.fg1.controls['weight'].value;
      this.prodObj.status = true;

    }

    getSwapValuefromFormControl() {
      this.declareSwapNewproductObject();

      this.swapObj.productName = this.fg1.controls['productName'].value;
      this.swapObj.productDescription = this.fg1.controls['Description'].value;
      this.swapObj.productCondition_ID = this.fg1.controls['condition'].value;
      this.swapObj.productCategory_ID = this.fg1.controls['category'].value;
      this.swapObj.productBrand = this.fg1.controls['Brand'].value;
      this.swapObj.isAvailable = true;
      this.swapObj.userid = JSON.parse(localStorage.getItem('currentUser')).id;
      this.swapObj.productWeight = this.fg1.controls['weight'].value;
      this.swapObj.estVal = this.fg1.controls['estVal'].value;
      this.swapObj.address = this.fg1.controls['address'].value;
      this.swapObj.productAge_ID = this.fg1.controls['productAge'].value;
      this.swapObj.status = true;
      this.swapObj.preferredItem = this.fg1.controls['preferredItem'].value;
    }

    declareNewproductObject() {
      this.prodObj = {
        id: 0,
        productName: '',
        productBrand: '',
        productDescription: '',
        productCategory_ID: 0,
        productCondition_ID: 0,
        isAvailable: false,
        userid: null,
        addressId: 0,
        productAge_ID: 0,
        productWeight: 0,
        status: true,
        productImage_Ref: [],
        address: null,
        product_request: null
      };
    }

    declareSwapNewproductObject() {
      this.swapObj = {
        id: 0,
        productName: '',
        productCondition_ID: 0,
        productWeight: 0,
        productBrand: '',
        productDescription: '',
        productCategory_ID: 0,
        isAvailable: false,
        userid: null,
        estVal: '',
        address: null,
        productAge_ID: 0,
        status: true,
        swapImage_Ref: [],
        swap_request: [],
        preferredItem: ''
      };
    }



    
/**
 * File Area
 */
showUploadList = {
  showPreviewIcon: true,
  showRemoveIcon: true,
  hidePreviewIconInNonImage: true
};

previewImage: string | undefined = "";
previewVisible = false;

handlePreview = (file: UploadFile) => {
  this.previewImage = file.url || file.thumbUrl;
  this.previewVisible = true;
};
/**
* End File Area
*/
}
