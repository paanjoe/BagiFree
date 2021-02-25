import { Address } from './address';
import { User } from './user';

// Product Colors
export type ProductColor = 'white' | 'black' | 'red' | 'green' | 'purple' | 'yellow' | 'blue' | 'gray' | 'orange' | 'pink';

// Product Size
export type ProductSize = 'M' | 'L' | 'XL';

// Product Tag
export type ProductTags = 'nike' | 'puma' | 'lifestyle' | 'caprese';

// Product
export interface Product {
  id?: number;
  name?: string;
  price?: number;
  salePrice?: number;
  discount?: number;
  pictures?: string;
  shortDetails?: string;
  description?: string;
  stock?: number;
  new?: boolean;
  sale?: boolean;
  category?: string;
  colors?: ProductColor[];
  size?: ProductTags[];
  tags?: ProductSize[];
  variants?: any[];
}

export interface Products {
  id: number;
  productName: string;
  productBrand?: string;
  productDescription?: string;
  productCategory_ID: number;
  productCondition_ID: number;
  isAvailable: boolean;
  userid: User;
  addressId: number;
  productAge_ID: number;
  productWeight: number;
  status: boolean;
  productImage_Ref: ProductImage_Ref[];
  address: Address;
  product_request: product_request[];

  // notmapped
  condition?: string;
  size?: string;
  weight?: string;
  category?: string;
  age?: string;
  requestStatus?: string;
  isApproved?: boolean;
  isSelfPickup?: boolean;
  isCompleted?: boolean;
  isDatePicked?: boolean;
  approvedID?: number;
}

export interface ProductCondition {
  id: number;
  productConditionID: number;
  productConditionTitle: string;
  productConditionDescription: string;
}

export interface ProductsSize {
  id: number;
  productSize_ID: number;
  productSizeTitle: string;
  productSizeDescription: string;
}

export interface ProductImage_Ref {
  id: number;
  productid: number;
  productImage: string;
}
export interface ProductsAge {
  id: number;
  productAge_ID: number;
  productAgeTitle: string;
  productAgeDescription: string;
}

export interface ProductWeight {
  id: number;
  productWeightID: number;
  productWeightTitle: string;
  productWeightDescription: string;
}

export interface ProductCategory {
  id: number;
  categoryID: number;
  categoryTitle: string;
  categoryDescription: string;
}

export interface product_request {
  id: number;
  productid: number;
  userid: number;
  approved: boolean;
  isSelfPickup?: boolean;
  pickupDate?: Date;
  isNotified?: boolean;
  isCompleted?: boolean;
  remarks?: string;
}

export interface swap_request {
  id: number;
  productid: number;
  userid: number;
  approved: boolean;
  isSelfPickup?: boolean;
  pickupDate?: Date;
  isNotified?: boolean;
  isCompleted?: boolean;
  offerid: number;
  remarks?: string;
}

export interface ProductRequest_Full {
        product_request_id: number;
        product_request_productid: number;
        product_request_userid: number;
        product_request_approved: boolean;
        product_request_isSelfPickup?: boolean;
        product_request_pickupDate?: Date;
        product_request_isNotified?: boolean;
        product_request_isCompleted?: boolean;
        products_productAge_ID: number;
        products_id: number;
        products_productName: string;
        products_productCondition_ID: number;
        products_productSize_ID: number;
        products_productWeight: number;
        products_productBrand: string;
        products_productDescription: string;
        products_productCategory_ID: number;
        products_isAvailable: boolean;
        products_useridId: number;
        user_id: number;
        user_username: string;
        user_password: string;
        user_mobile: number;
        user_mobileOption: number;
        user_email: string;
        user_role: string;
        user_createdAt: Date;
        user_updatedAt: Date;
        address_id: number;
        address_address1: string;
        address_address2: string;
        address_city: string;
        address_state: string;
        address_postalCode: number;
        address_country: string;
        address_createdAt: Date;
        address_updatedAt: Date;
        address_useridId: number;
        imgURL?: string;
}

export interface SwapRequest_Full {
  swap_request_id: number;
  swap_request_productid: number;
  swap_request_userid: number;
  swap_request_approved: boolean;
  swap_request_offerid?: number;
  swap_request_isSelfPickup?: boolean;
  swap_request_pickupDate?: Date;
  swap_request_isNotified?: boolean;
  swap_request_isCompleted?: boolean;
  swap_id: number;
  swap_productName: string;
  swap_productAge_ID: number;
  swap_preferredItem: string;
  swap_productCondition_ID: number;
  swap_productSize_ID: number;
  swap_productWeight_ID: number;
  swap_productBrand: string;
  swap_productDescription: string;
  swap_productCategory_ID: number;
  swap_isAvailable: boolean;
  swap_useridId: number;
  swap_estVal: string;
  user_id: number;
  user_username: string;
  user_password: string;
  user_mobile: number;
  user_mobileOption: number;
  user_email: string;
  user_role: string;
  user_createdAt: Date;
  user_updatedAt: Date;
  address_id: number;
  address_address1: string;
  address_address2: string;
  address_city: string;
  address_state: string;
  address_postalCode: number;
  address_country: string;
  address_createdAt: Date;
  address_updatedAt: Date;
  address_useridId: number;
  imgURL?: string;

}

// Color Filter
export interface ColorFilter {
  color?: ProductColor;
}

// Tag Filter
export interface TagFilter {
  tag?: ProductTags;
}

export interface ratings {
  average: number;
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface customer_feedback {
  id: number;
  rating: number;
  feedback?: string;
  user: User;
}
