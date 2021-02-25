import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  ɵɵsanitizeUrlOrResourceUrl,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFile, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { countries } from 'src/app/mocks/country';
import { ProductsService } from 'src/app/shared/services/products.service';
import { AddressService } from 'src/app/shared/services/address.service';
import { Address } from 'src/app/shared/classes/address';
import { Products } from 'src/app/shared/classes/product';
import { Swap } from 'src/app/shared/classes/swap';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Upload } from 'src/app/shared/classes/upload';
// Custom Import
import * as firebase from 'firebase';
import { read } from 'fs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  // *****************************************************************************
  // Constructor Section
  // *****************************************************************************
  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private addressService: AddressService,
    private db: AngularFireDatabase,
    private http: HttpClient,
    private imageCompress: NgxImageCompressService,
    private msg: NzMessageService
  ) {}

  // *****************************************************************************
  // Public Variables
  // *****************************************************************************
  public states: any = [];
  public countries: any = countries;
  public id: string;
  public fg1: FormGroup;
  public data: any = {};
  public checked: Boolean = true;
  public estValVisible: Boolean = false;
  public addressList: Address[];
  public prodObj: Products;
  public swapObj: Swap;
  public imageURL: string;
  public doneUpload: Boolean = false;
  public uploading: Boolean = false;
  public fL: File[] = [];
  public fileList: UploadFile[] = [];
  public imgList: Array<string> = [];
  public images: any = [];
  public allfiles: File[] = [];
  public imgModal: Boolean = false;
  public imgModalSrc: String = '';
  public tempBlob: Blob = new Blob();
  public addresshow: boolean = false;
  public fg: FormGroup;
  public isAddressLoading: boolean = true;
  public isAddressOKLoading: boolean = false;
  public isVisible: boolean = false;
  public addAddressObj: Address;
  public modalData: Address;
  public confirmModal: NzModalRef;
  public countries_: any = countries;
  public modalTitle: string;
  public isLoadingOne: Boolean = false;

  // *****************************************************************************
  // Image handling area
  // *****************************************************************************

  // Handle image size label before upload
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
      let sizefinal = splitvalues[0] + '.' + secondvariable + 'MB';
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
      let sizefinal = splitvalues[0] + '.' + secondvariable + 'KB';
      return sizefinal;
    }
  }

  // File validation in terms of size and et cetra
  isFileValid(files: any): boolean {
    let fileValid: boolean = true;

    files.forEach((file) => {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';

      // check file format
      if (!isJPG && !isPNG) {
        this.msg.error('You can only upload JPG/PNG file!');
        fileValid = false;
        return fileValid;
      }

      // check file size
      const isLt7M = file.size / 1024 / 1024 < 7;
      if (!isLt7M) {
        this.msg.error('Image must smaller than 7MB!');
        fileValid = false;
        return fileValid;
      }
    });

    return fileValid;
  }

  // Queue the image before upload, do all those necessary conversion
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

  // Delete image on the queue list
  deleteImage(img: any) {
    const index = this.images.indexOf(img);
    this.images.splice(index, 1);
    this.allfiles.splice(index, 1);
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

  // Get image orientation
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

  // Convert Base URL to Blob
  dataURItoBlob(dataURI, filename) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab], { type: 'image/jpeg' });
    this.tempBlob = bb;

    return bb;
  }

  // Write the Base64 to File
  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  };

  // Reset image orientation to normal
  resetOrientation(srcBase64, srcOrientation, callback) {
    var img = new Image();

    img.onload = () => {
      var width = img.width,
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

  // *****************************************************************************
  // On Page Load
  // *****************************************************************************
  ngOnInit() {
    this.initValintoFG();
    this.loadAddress();
    this.loadformgroup();
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

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
        country: [data.country],
      });
    }
  }

  handleCancel(): void {
    //reset form value
    this.initValintoFG(null);
    this.addresshow = false;
  }

  getvaladdressfc() {
    this.addAddressObj.address1 = this.fg.controls['address1'].value;
    this.addAddressObj.address2 = this.fg.controls['address2'].value;
    this.addAddressObj.city = this.fg.controls['city'].value;
    this.addAddressObj.state = this.fg.controls['state'].value;
    this.addAddressObj.postalCode = this.fg.controls['postal_code'].value;
    this.addAddressObj.country = this.fg.controls['country'].value;
    this.addAddressObj.userId = JSON.parse(
      localStorage.getItem('currentUser')
    ).id;
  }

  declareNewAddressObject() {
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
      updatedAt: new Date(),
    };
  }

  handleOk(): void {
    this.isAddressOKLoading = true;
    this.isAddressLoading = true;

    this.declareNewAddressObject();
    this.getvaladdressfc();

    this.addressService.insertAddress(this.addAddressObj).subscribe(
      (res) => {
        setTimeout(() => {
          this.isAddressLoading = false;
          this.isAddressOKLoading = false;
          this.addresshow = false;
          this.loadAddress();
          this.initValintoFG(null);
        }, 2000);
      },
      (err) => {
        console.log(err);
        this.loadAddress();
        this.isAddressLoading = false;
        this.isAddressOKLoading = false;
        this.initValintoFG(null);
      }
    );
  }

  loadAddress() {
    this.addressService
      .getAddressByUserID(JSON.parse(localStorage.getItem('currentUser')).id)
      .subscribe((x) => {
        this.addressList = [...x];
      });
  }

  loadformgroup() {
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
      preferredItem: [null],
    });
  }

  showEstVal(data) {
    if (data == 2) {
      this.estValVisible = true;
    } else {
      this.estValVisible = false;
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

  async onSubmit() {
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
      preferredItem = {},
    } = this.fg1.value;

    const uploadFile: File[] = [...this.allfiles];
    // Upload to AWS
    const list = await this.uploading1(uploadFile);

    if (parseInt(this.fg1.controls['type'].value) === 1) {
      this.getValuefromFormControl();

      const prod: any = await this.productService.insertProducts(this.prodObj).toPromise();
      const prodJSON = JSON.parse(prod);
      const promises = new Array();
      list.map((itm) => promises.push(this.productService.insertProductImage(0, prodJSON.product.id, itm).toPromise()));
      await Promise.all(promises);
      this.isLoadingOne = false;
      this.route.navigate([
        `../../home/bagifree/product/${prodJSON.product.id}`,
      ]).then(() => { window.location.reload(); });
    } else {
      this.getSwapValuefromFormControl();
      const swap: any = await this.productService
        .insertSwapProducts(this.swapObj)
        .toPromise();
      const swapJSON = JSON.parse(swap);
      const promises = new Array();
      list.map((itm) =>
        promises.push(
          this.productService
            .insertSwapProductImage(0, swapJSON.product.id, itm)
            .toPromise()
        )
      );
      await Promise.all(promises);
      this.isLoadingOne = false;
      this.route.navigate([`../../home/swap/product/${swapJSON.product.id}`]).then(() => { window.location.reload(); });
    }
  }
  getValuefromFormControl() {
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
      product_request: null,
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
      preferredItem: '',
    };
  }
}
