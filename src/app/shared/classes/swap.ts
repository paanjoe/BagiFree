import { Address } from './address';
import { User } from './user';

export interface Swap {

    id: number;
    productName: string;
    productCondition_ID: number;
    productWeight: number;
    productBrand?: string;
    productDescription?: string;
    productCategory_ID: number;
    isAvailable: boolean;
    userid: User;
    estVal: string;
    address: Address;
    productAge_ID: number;
    status: boolean;
    swapImage_Ref: SwapImage_Ref[];
    swap_request: SwapRequest[];
    preferredItem?: string;
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

export interface SwapRequest {
    id: number;
    productid: number;
    userid: number;
    approved: boolean;
    isSelfPickup?: boolean;
    pickupDate?: Date;
    isNotified?: boolean;
    isCompleted?: boolean;
    offerid?: number;
    remarks?: string;
  }

  export interface SwapImage_Ref {
    id: number;
    productid: number;
    productImage: string;
  }
