import { Component, OnInit } from '@angular/core';
import { countries } from 'src/app/mocks/country';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Address } from 'src/app/shared/classes/address';
import { AddressService } from '../../shared/services/address.service' 
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})

export class AddressBookComponent implements OnInit {
  // Delcare constructor
  constructor(private fb: FormBuilder,
              private addressService: AddressService,
              private modalService: NzModalService) { }

  // Declare var
  public fg: FormGroup;
  public addressList: Address[];
  public isAddressLoading: boolean = true;
  public isAddressOKLoading: boolean = false;
  public isVisible: boolean = false;
  public addAddressObj: Address;  
  public modalData: Address;
  public confirmModal: NzModalRef;
  public countries = countries;
  public modalTitle: string;

  ngOnInit() {
    this.initValintoFG();
    this.getAddress();
  }

  initValintoFG(data?: Address){
    if(data == null) {
      this.modalTitle = "Add Address";
      this.fg = this.fb.group({
        address1: [""],
        address2: [""],
        city: ["", Validators.required],
        state: ["", Validators.required],
        postal_code: [""],
        country: ["", Validators.required],
      });
    } else {
      // Pass id information
      this.modalData = data;

      // Get value for form controls
      this.modalTitle = "Update Address";
      this.fg = this.fb.group({
        address1: [data.address1],
        address2: [data.address2],
        city: [data.city],
        state: [data.state],
        postal_code: [data.postalCode],
        country: [data.country]
      });
    }
  }

  getAddress(){
    this.addressService.getAddressByUserID(JSON.parse(localStorage.getItem('currentUser')).id).subscribe((res) => {
      this.addressList = [...res];
      this.isAddressLoading = false;
    })
  }

  addAddress(recordType: string, data?: Address) {
    if (recordType === 'Update') {
      // If this one is update record
      this.initValintoFG(data);
    }
    this.isVisible = true;
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

  getValuefromFormControl(){
    this.addAddressObj.address1 = this.fg.controls['address1'].value;
    this.addAddressObj.address2 = this.fg.controls['address2'].value;
    this.addAddressObj.city = this.fg.controls['city'].value;
    this.addAddressObj.state = this.fg.controls['state'].value;
    this.addAddressObj.postalCode = this.fg.controls['postal_code'].value;
    this.addAddressObj.country = this.fg.controls['country'].value;
    this.addAddressObj.userId = JSON.parse(localStorage.getItem('currentUser')).id;

  }

  handleOk(type: string): void {
    this.isAddressOKLoading = true;
    this.isAddressLoading = true;

    // Check if add or update
    if (this.modalTitle == "Add Address") {
      this.declareNewAddressObject();
      this.getValuefromFormControl();
      this.addressService.insertAddress(this.addAddressObj).subscribe(res => {
        setTimeout(() => {
          this.isAddressLoading = false;
          this.isAddressOKLoading = false;
          this.isVisible = false;
          this.getAddress();
          this.initValintoFG(null);
        }, 2000);      
      }, err => {
        console.log(err);
        this.getAddress();
        this.isAddressLoading = false;
        this.isAddressOKLoading = false;
        this.initValintoFG(null);
      })
    } else {
      // Assign new value to variable
      this.modalData.address1 = this.fg.controls['address1'].value;
      this.modalData.address2 = this.fg.controls['address2'].value;
      this.modalData.city = this.fg.controls['city'].value;
      this.modalData.country = this.fg.controls['country'].value;
      this.modalData.postalCode = this.fg.controls['postal_code'].value;
      this.modalData.state = this.fg.controls['state'].value;
      this.modalData.updatedAt = new Date();

      this.addressService.updateAddress(this.modalData).subscribe(res => {
        setTimeout(() => {
          this.isAddressLoading = false;
          this.isAddressOKLoading = false;
          this.isVisible = false;
          this.getAddress();
          this.initValintoFG(null);
        }, 2000);      
      }, err => {
        console.log(err);
        this.getAddress();
        this.initValintoFG(null);
        this.isAddressLoading = false;
        this.isAddressOKLoading = false;
      })
    }
    
  }

  handleCancel(): void {
    //reset form value
    this.initValintoFG(null);
    this.isVisible = false;
  }

  // Update record
  updateRecord(data){
    this.isAddressOKLoading = true;
    this.isAddressLoading = true;

    this.addressService.updateAddress(data).subscribe(res => {
      this.isAddressLoading = false;
      this.isAddressOKLoading = false;
      this.getAddress();
    }, err => {
      this.isAddressLoading = false;
      this.isAddressOKLoading = false;
      this.getAddress();
      console.log(err);
    })
  }

  // Delete record
  deleteAddress(data){
    this.isAddressLoading = true;
    this.addressService.deleteAddress(data).subscribe(res => {
      this.getAddress();
    }, err => {
      this.getAddress();
      console.log(err);
    })
  }

  showDeleteConfirm(data): void {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'This change cannot be reverted.',
      nzOnOk: () => {this.deleteAddress(data);}
    });
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
