import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Product, Products, ProductCategory, ProductCondition, ProductWeight, ProductsSize, product_request, ProductRequest_Full, SwapRequest_Full, ProductsAge, ProductImage_Ref, customer_feedback } from '../classes/product';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { map, filter, scan, tap, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { api_url } from 'src/app/config';
import { MessageService } from './message.service';
import { HttpHeaders } from '@angular/common/http';
import { Swap, SwapRequest, SwapImage_Ref } from '../classes/swap';
import { faq } from '../classes/faq';
import { testimonial } from '../classes/testimonial';
import { subscription } from '../classes/subscription';



// Get product from Localstorage
const products = JSON.parse(localStorage.getItem('compareItem')) || [];

@Injectable()

export class ProductsService {
  public currency = 'USD';
  public catalogMode = false;
  public compareProducts: BehaviorSubject<Products[]> = new BehaviorSubject([]);
  public observer:  Subscriber<{}>;

  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  httpOptions = {
    headers: this.headers
  };


  // Initialize
  constructor(private http: Http, private httpclient: HttpClient, private toastrService: ToastrService, private messageService: MessageService) {
     this.compareProducts.subscribe(products => products = products);
  }


public getImage(id: number): Observable<ProductImage_Ref> {
  return this.http.get(`${api_url}/product/getproductsImageByID/${id}`).map((res) => res.json());
}

public getSwapImage(id: number): Observable<SwapImage_Ref> {
  return this.http.get(`${api_url}/product/getproductsSwapImageByID/${id}`).map((res) => res.json());
}

  public getProductRequestByUserID(id: number): Observable<ProductRequest_Full[]> {
    return this.http.get(`${api_url}/product/getProductRequestByUserID/${id}`).map((res) => res.json());
  }

  public getratingByUserId(id: number): Observable<customer_feedback[]> {
    return this.http.get(`${api_url}/product/getratingByUserId/${id}`).map((res) => res.json());
  }


  public getFeedbackbyUserId(id: number): Observable<customer_feedback[]> {
    return this.http.get(`${api_url}/feedback/getFeedbackByUserId/${id}`).map((res) => res.json());
  }

  public getswapRequestByUserID(id: number): Observable<SwapRequest_Full[]> {
    return this.http.get(`${api_url}/product/getswapRequestByUserID/${id}`).map((res) => res.json());
  }

  public getmyProductRequestByUserID(id: number): Observable<ProductRequest_Full[]> {
    return this.http.get(`${api_url}/product/getmyProductRequestByUserID/${id}`).map((res) => res.json());
  }

  public getmyswapRequestByUserID(id: number): Observable<SwapRequest_Full[]> {
    return this.http.get(`${api_url}/product/getmyswapRequestByUserID/${id}`).map((res) => res.json());
  }

  public getSwapByUserID(id: number): Observable<Swap[]> {
    return this.http.get(`${api_url}/product/getSwapByUserId/${id}`).map((res: any) => res.json());
  }

  public productCompleted(id: number): Observable<Products>{
    return this.http.get(`${api_url}/product/productCompleted/${id}`).map((res: any) => res.json());
  }
  public productCompleted2(id: number): Observable<Products>{
    return this.http.get(`${api_url}/product/productCompleted2/${id}`).map((res: any) => res.json());
  }

  public productCompleted3(id: number): Observable<Products>{
    return this.http.get(`${api_url}/product/productCompleted3/${id}`).map((res: any) => res.json());
  }
  public productCompleted4(id: number): Observable<Products>{
    return this.http.get(`${api_url}/product/productCompleted4/${id}`).map((res: any) => res.json());
  }


  public updateProductRequest(data: product_request): Observable<product_request> {
    const url = `${api_url}/product/updateProductRequest/${data.id}`;
    return this.httpclient.patch<product_request>(url, data, {responseType: 'text' as 'json'})
    .pipe(tap(res => {
      //this.messageService.showMessage('success', 'Successfully updated the information.');
    }, err => {
      this.messageService.showMessage('error', 'Please try again.');
    }));
  }

  public updateSwapRequest(data: SwapRequest): Observable<SwapRequest> {
    const url = `${api_url}/product/updateSwapRequest/${data.id}`;
    return this.httpclient.patch<SwapRequest>(url, data, {responseType: 'text' as 'json'})
    .pipe(tap(res => {
      //this.messageService.showMessage('success', 'Successfully updated the information.');
    }, err => {
      this.messageService.showMessage('error', 'Please try again.');
    }));
  }


   /*
      ---------------------------------------------
      ----------  Product Category  ----------------
      ---------------------------------------------
   */

  //  public test(){
  //   let promise = new Promise<ProductCategory[]>((resolve, reject) => {
  //     let apiURL = `${api_url}/product/getproductsCategoryAll/`
  //     this.http.get(apiURL).toPromise().then(
  //         res => { // Success
  //         //  console.log(res.json());
  //           resolve(res.json());
  //         }
  //       );
  //   });
  //   return promise;
  //  }



    public productsCategory(): Observable<ProductCategory[]> {
      return this.http.get(`${api_url}/product/getproductsCategoryAll/`).map((res: any) => res.json());
    }


    // Get Products By Id
    public productsCategoryById(id: number): Observable<ProductCategory> {
      return this.productsCategory().pipe(map(items => items.find((item: ProductCategory) => item.categoryID === id)));
    }
  /*
      ---------------------------------------------
      ----------  Product Condition  ----------------
      ---------------------------------------------
   */
  public productsCondition(): Observable<ProductCondition[]> {
    return this.http.get(`${api_url}/product/getproductsConditionAll/`).map((res: any) => res.json());
  }

  // Get Products By Id
  public productsConditionById(id: number): Observable<ProductCondition> {
    return this.productsCondition().pipe(map(items => items.find((item: ProductCondition) => item.productConditionID === id)));
  }
/*
  /*
      ---------------------------------------------
      ----------  Product Size  ----------------
      ---------------------------------------------
   */
  public productsSize(): Observable<ProductsSize[]> {
    return this.http.get(`${api_url}/product/getproductsSizeAll/`).map((res: any) => res.json());
  }

  public productAge(): Observable<ProductsAge> {
    return this.http.get(`${api_url}/product/getproductsAgeAll`).map((res: any) => res.json());
  }

  // Get Products By Id
  public productsSizeById(id: number): Observable<ProductsSize> {
    return this.productsSize().pipe(map(items => items.find((item: ProductsSize) => item.productSize_ID === id)));
  }
  /*
      ---------------------------------------------
      ----------  Product Weight  ----------------
      ---------------------------------------------
   */

  public productsWeight(): Observable<ProductWeight[]> {
    return this.http.get(`${api_url}/product/getproductsWeightAll/`).map((res: any) => res.json());
  }

  // Get Products By Id
  public productsWeightById(id: number): Observable<ProductWeight> {
    return this.productsWeight().pipe(map(items => items.find((item: ProductWeight) => item.productWeightID === id)));
  }
  public insertRating(rate: number, feedback: string, userid: number): Observable<customer_feedback>{
    return this.httpclient.post<customer_feedback>(`${api_url}/product/insertRating`, {rate,feedback,userid }, {responseType: 'text' as 'json'}).pipe(tap(res => {
      // donothing
    }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
    }));
  }

  public insertProducts(data: Products) {
    const productName = data.productName;
    const productBrand = data.productBrand;
    const productDescription = data.productDescription;
    const productCategory_ID = data.productCategory_ID;
    const productCondition_ID = data.productCondition_ID;
    const userid = data.userid;
    const isAvailable = data.isAvailable;
    const addressId = data.addressId;
    const productAge_ID = data.productAge_ID;
    const productWeight = data.productWeight;
    const status = data.status;

    return this.httpclient.post<Products>(`${api_url}/product/insertProduct`,
    { productName, productBrand, productDescription, productCategory_ID, productCondition_ID, userid, isAvailable, addressId, productAge_ID, productWeight, status }, {responseType: 'text' as 'json'}).pipe(tap(res => {
        this.messageService.showMessage('success', 'Product successfully added.');
        return;
    }, err => {
        this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
    }));
}


public insertProductImage(id: number , productID: number, productImage: string) {
  return this.httpclient.post<any>(`${api_url}/product/insertProductImage`,
  { id, productID, productImage }, {responseType: 'text' as 'json'}).pipe(tap(res => {
     // this.messageService.showMessage("success", "Product Image successfully added.");
      return;
  }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}

public insertProductImageModal(productID: number) {
  return this.httpclient.post<any>(`${api_url}/product/insertProductImageModal`,
  { productID }, {responseType: 'text' as 'json'}).pipe(tap(res => {
     // this.messageService.showMessage("success", "Product Image successfully added.");
      return;
  }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}

public insertProductRequest(productid: number, approved: boolean, userid: number, remarks: string) {
  return this.httpclient.post<any>(`${api_url}/product/insertProductRequest`, {
    productid,
    approved,
    userid,
    remarks
  }, {responseType: 'text' as 'json'}).pipe(tap(res => {
    this.messageService.showMessage('success', 'Product Request success!.');
    return;
}, err => {
    this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
}));
}

public insertSwapRequest(productid: number, approved: boolean, userid: number, offerid: number, remarks: string) {
  return this.httpclient.post<any>(`${api_url}/product/insertSwapRequest`, {
    productid,
    approved,
    userid,
    offerid,
    remarks
  }, {responseType: 'text' as 'json'}).pipe(tap(res => {
    this.messageService.showMessage('success', 'Swap Request success!.');
    return;
}, err => {
    this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
}));
}

public insertSwapProductImage(id: number , productID: number, productImage: string) {
  return this.httpclient.post<any>(`${api_url}/product/insertSwapProductImage`,
  { id, productID, productImage }, {responseType: 'text' as 'json'}).pipe(tap(res => {
      // this.messageService.showMessage("success", "Product Image successfully added.");
      return;
  }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}

public Upload(file: FormData) {
  return this.httpclient.post(`${api_url}/product/upload`,
  {file}).pipe(tap(res => {
    return;
  }, err => {
    this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}
public insertSwapProductImageModal(productID: number) {
  return this.httpclient.post<any>(`${api_url}/product/insertSwapProductImageModal`,
  { productID }, {responseType: 'text' as 'json'}).pipe(tap(res => {
      // this.messageService.showMessage("success", "Product Image successfully added.");
      return;
  }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}

public insertSwapProducts(data: Swap) {
  const productName = data.productName;
  const productBrand = data.productBrand;
  const productDescription = data.productDescription;
  const productCategory_ID = data.productCategory_ID;
  const productCondition_ID = data.productCondition_ID;
  const userid = data.userid;
  const isAvailable = data.isAvailable;
  const productWeight = data.productWeight;
  const estVal = data.estVal;
  const address = data.address;
  const productAge_ID = data.productAge_ID;
  const status = data.status;
  const preferredItem = data.preferredItem;

  return this.httpclient.post<Swap>(`${api_url}/product/insertSwapProduct`,
  { productName, productBrand, productDescription, productCategory_ID, productCondition_ID, userid, isAvailable, productWeight, estVal, address, productAge_ID, status, preferredItem }, {responseType: 'text' as 'json'}).pipe(tap(res => {
      this.messageService.showMessage('success', 'Swap Product successfully added.');
      return;
  }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}




  // Observable Product Array
  public products(): Observable<Products[]> {
    return this.http.get(`${api_url}/product/getproductsAll/`).map((res: any) => res.json());
  }

  public swap(): Observable<Swap[]> {
    return this.http.get(`${api_url}/product/getswapAll/`).map((res: any) => res.json());
  }

  // Get Products
  public getProducts(): Observable<Products[]> {
    return this.products();
  }

  public getSwap(): Observable<Swap[]> {
    return this.swap();
  }

  public getSwapbyID(id: number): Observable<Swap> {
    return this.swap().pipe(map(items => items.find((item: Swap) => item.id === id)));
  }

  // Get Products by User ID
  public getProductsByUserID(id: number): Observable<Products[]> {
    return this.http.get(`${api_url}/product/getProductsByUserId/${id}`).map((res: any) => res.json());
  }
  // Get Products By Id
  public getProduct(id: number): Observable<Products> {
    return this.products().pipe(map(items => items.find((item: Products) => item.id === id)));
  }

  public deleteProduct(id: number): Observable<Products> {
    const url = `${api_url}/product/deleteProducts/${id}`;
    return this.httpclient.post<Products>(url, this.httpOptions);
  }

  public getAllFAQ(): Observable<faq[]> {
    return this.http.get(`${api_url}/faq/getAllFAQ/`).map((res: any) => res.json());
}

public insertFAQ(data: faq) {
  const title = data.Title;
  const content = data.Content;

  return this.httpclient.post<faq>(`${api_url}/faq/insertFAQ`,
  { title, content }, {responseType: 'text' as 'json'}).pipe(tap(res => {
      this.messageService.showMessage('success', 'FAQ successfully added.');
      return;
  }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}

public updateFAQ(data: faq): Observable<faq> {
  const url = `${api_url}/faq/updateFAQ/${data.id}`;

  return this.httpclient.patch<faq>(url, data, {responseType: 'text' as 'json'})
  .pipe(tap(data => {
    this.messageService.showMessage('success', 'Successfully updated the information');
    return;
  }, err => {
    this.messageService.showMessage('error', 'Please try again.');
  }));
}

public deleteFAQ(id: number): Observable<faq> {
  const url = `${api_url}/faq/deleteFAQ/${id}`;
  return this.httpclient.post<faq>(url, this.httpOptions);
}

public getTestimonial(): Observable<testimonial[]> {
  return this.http.get(`${api_url}/testimonial/getAllTestimonial/`).map((res: any) => res.json());
}

public insertTestimonial(data: testimonial) {
  const image = data.image;
  const name = data.name;
  const designation = data.designation;
  const description = data.description;

  return this.httpclient.post<testimonial>(`${api_url}/testimonial/insertTestimonial`,
  { image, name, designation, description }, {responseType: 'text' as 'json'}).pipe(tap(res => {
      this.messageService.showMessage('success', 'Testimonial successfully added.');
      return;
  }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}

public updateTestimonial(data: testimonial): Observable<testimonial> {
  const url = `${api_url}/testimonial/updateTestimonial/${data.id}`;

  return this.httpclient.patch<testimonial>(url, data.id, {responseType: 'text' as 'json'})
  .pipe(tap(data => {
    this.messageService.showMessage('success', 'Successfully updated the information');
    return;
  }, err => {
    this.messageService.showMessage('error', 'Please try again.');
  }));
}

public getAllEmail(): Observable<subscription[]> {
  return this.http.get(`${api_url}/subscription/getAllEmail/`).map((res: any) => res.json());
}

public getActiveEmail(): Observable<subscription[]> {
  return this.http.get(`${api_url}/subscription/getActiveEmail/`).map((res: any) => res.json());
}

public getInactiveEmail(): Observable<subscription[]> {
  return this.http.get(`${api_url}/subscription/getInactiveEmail/`).map((res: any) => res.json());
}

public insertSubcription(data: subscription) {
  const email = data.email;
  const isActive = data.isActive;

  return this.httpclient.post<subscription>(`${api_url}/subscription/insertSubscription`,
  { email, isActive }, {responseType: 'text' as 'json'}).pipe(tap(res => {
      this.messageService.showMessage('success', 'Subscription successfully added.');
      return;
  }, err => {
      this.messageService.showMessage('error', 'Opps! Something went wrong. Please try again.');
  }));
}

public deleteEmail(email: string): Observable<subscription> {
  const url = `${api_url}/subscription/deleteEmail`;
  return this.httpclient.post<subscription>(url, {email}, this.httpOptions);
}


public deleteTestimonial(id: number): Observable<testimonial> {
  const url = `${api_url}/testimonial/deleteTestimonial/${id}`;
  return this.httpclient.post<testimonial>(url, this.httpOptions);
}
  public deleteImageProduct(id: number): Observable<ProductImage_Ref> {
    const url = `${api_url}/product/deleteImageProducts/${id}`;
    return this.httpclient.post<ProductImage_Ref>(url, this.httpOptions);
  }

  public deleteSwapImageProduct(id: number): Observable<SwapImage_Ref> {
    const url = `${api_url}/product/deleteSwapImageProducts/${id}`;
    return this.httpclient.post<SwapImage_Ref>(url, this.httpOptions);
  }

  public deleteSwapProduct(id: number): Observable<Swap> {
    const url = `${api_url}/product/deleteSwapProducts/${id}`;
    return this.httpclient.post<Swap>(url, this.httpOptions);
  }

  public updateProduct(id: Products): Observable<Products> {
    const url = `${api_url}/product/updateProducts/${id.id}`;
    return this.httpclient.patch<Products>(url, id, {responseType: 'text' as 'json'})
    .pipe(tap(data => {
      this.messageService.showMessage('success', 'Successfully updated the information');
      return;
    }, err => {
      this.messageService.showMessage('error', 'Please try again.');
    }));
  }

  public updateSwapProduct(id: Swap): Observable<Swap> {
    const url = `${api_url}/product/updateSwapProducts/${id.id}`;
    return this.httpclient.patch<Swap>(url, id, {responseType: 'text' as 'json'})
    .pipe(tap(data => {
      this.messageService.showMessage('success', 'Successfully updated the information');
      return;
    }, err => {
      this.messageService.showMessage('error', 'Please try again.');
    }));
  }

  handleError(arg0: string, smartphone: any): (err: any, caught: Observable<any>) => import('rxjs').ObservableInput<any> {
    throw new Error('Method not implemented.');
  }



   // Get Products By category
  public getProductByCategory(category: string): Observable<Products[]> {
    return this.products().pipe(map(items =>
       items.filter((item: Products) => {
         if (category == 'all') {
            return item;
         } else {
            return item.category.toString() === category;
         }

       })
     ));
  }

   /*
      ---------------------------------------------
      ----------  Compare Product  ----------------
      ---------------------------------------------
   */

  // Get Compare Products
  public getComapreProducts(): Observable<Products[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<Products[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Product): boolean {
    const item = products.find(item => item.id === product.id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Product): Product | boolean {
    let item: Product | boolean = false;
    if (this.hasProduct(product)) {
      item = products.filter(item => item.id === product.id)[0];
      const index = products.indexOf(item);
    } else {
      if (products.length < 4) {
        products.push(product);
      } else {
        this.toastrService.warning('Maximum 4 products are in compare.');
      } // toasr services
    }
      localStorage.setItem('compareItem', JSON.stringify(products));
      return item;
  }

  // Removed Product
  public removeFromCompare(product: Product) {
    if (product === undefined) { return; }
    const index = products.indexOf(product);
    products.splice(index, 1);
    localStorage.setItem('compareItem', JSON.stringify(products));
  }



}
