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

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

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
  public estValVisible: Boolean = false;
  addressList: Address[];
  prodObj: Products;
  swapObj: Swap;
  public imageURL: string;
  public doneUpload: Boolean = false;
  uploading = false;
  fL: File[] = [];
  public fileList: UploadFile[] = [];
  public imgList = [] as Array<string>;

  // to generate random id in firebase
  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
  public status: string = 'Not Upload yet.';


  // Codename: EXIF
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
  };

  // Codename: EXIF
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

  public blobToFile = (theBlob: Blob, fileName:string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
}

  // tslint:disable-next-line: member-ordering
  public tempBlob: Blob = new Blob();

  public test: any;
  // Codename: EXIF
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

          // start - Amazon
    // const bucket = new S3({
    //       accessKeyId: 'AKIA6K6DTSRABVHLIHOV',
    //       secretAccessKey: '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',
    //       region: 'us-east-1'
    //     });

    let bar = new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append('files[]', myfile);

      const metaData = {'contentType': myfile.type};
      const randomID = this.guidGenerator();


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
      //   this.fileList = [];
      //   let id: number = this.fileList.length;
      //   id = id + 1;
      //   let x = {
      //       uid: id,
      //       name: myfile.name,
      //       status: 'done',
      //       url: this.imgList
      //     };
      //     this.test = x;
      //     resolve();
      //   return true;
      // });


      //end

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
          console.log(this.test);
          resolve();
          return downloadURL;
        });
    });

    bar.then(() => {
      this.fileList.push(this.test);
      console.log(this.fileList);
    });

    return bb;
  }

  // Codename: EXIF
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

  // old upload method.
  onUpload(event:any){
    //console.log(event);
    this.status = 'Upload ....';
    const file: File = event.target.files[0];
    const metaData = {'contentType': file.type};
   // const randomID = this.guidGenerator();
    const storageRef: firebase.storage.Reference = firebase.storage().ref(file.name);
    storageRef.put(file, metaData)
    .then(snapshot => {
      return snapshot.ref.getDownloadURL();   // Will return a promise with the download link
    }).then(downloadURL => {
      this.imageURL = downloadURL;
      this.status = 'File Uploaded!';
      return downloadURL;
   });
  }


  // queue image list
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

    getOrientation2(file: File, callback: Function) {
      var reader = new FileReader();
    
      reader.onload = (event: ProgressEvent) => {
    
        if (! event.target) {
          return;
        }
    
        const file = event.target as FileReader;
        const view = new DataView(file.result as ArrayBuffer);
    
        if (view.getUint16(0, false) != 0xFFD8) {
            return callback(-2);
        }
    
        const length = view.byteLength
        let offset = 2;
    
        while (offset < length)
        {
            if (view.getUint16(offset+2, false) <= 8) return callback(-1);
            let marker = view.getUint16(offset, false);
            offset += 2;
    
            if (marker == 0xFFE1) {
              if (view.getUint32(offset += 2, false) != 0x45786966) {
                return callback(-1);
              }
    
              let little = view.getUint16(offset += 6, false) == 0x4949;
              offset += view.getUint32(offset + 4, little);
              let tags = view.getUint16(offset, little);
              offset += 2;
              for (let i = 0; i < tags; i++) {
                if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                  return callback(view.getUint16(offset + (i * 12) + 8, little));
                }
              }
            } else if ((marker & 0xFF00) != 0xFF00) {
                break;
            }
            else {
                offset += view.getUint16(offset, false);
            }
        }
        return callback(-1);
      };
      reader.readAsArrayBuffer(file);
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
     // let bar = new Promise((resolve, reject) => {
          // Codename: EXIF
        // const formData = new FormData();

        // this.fL.forEach((file: any) => {
        //   formData.append('files[]', file);
        // });

        // this.uploading = true;

        // this.fL.forEach((file, index, array) => {
        //   const metaData = {'contentType': file.type};
        //   const randomID = this.guidGenerator();
        //   const storageRef: firebase.storage.Reference = firebase.storage().ref(randomID + file.name);

        //   storageRef.put(file, metaData).then(
        //     snapshot => {
        //     return snapshot.ref.getDownloadURL(); }).then(
        //       downloadURL => {
        //         this.imgList.push(downloadURL);
        //         this.uploading = false;
        //         this.doneUpload = true;
        //         if (index === (this.fL.length - 1)) {
        //           resolve();
        //         }
        //         return downloadURL;
        //   });

      //  });
     // });

      // bar.then(() => {
        // after image done upload then throw logic here...
        if (parseInt(this.fg1.controls['type'].value) == 1) {
          this.getValuefromFormControl();
            // add product first
            this.productService.insertProducts(this.prodObj).subscribe((response:any) => {
              let prod = JSON.parse(response);
              let imgArr = [] as Array<Upload>;


              this.fileList.forEach((x) => {
                let imgObj = {id: 0, productID: prod.product.id, productImage: x.url }
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
          this.productService.insertSwapProducts(this.swapObj).subscribe((res: any) => {
            let imgArr = [] as Array<Upload>;
            let ressw = JSON.parse(res);

            this.fileList.forEach((x) => {
              let imgObj = { id: 0, productID: ressw.product.id, productImage: x.url }
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
      // });      
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
