import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { map, filter, scan, tap, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { api_url } from 'src/app/config';
import { MessageService } from './message.service';
import { HttpHeaders } from '@angular/common/http';
import { Address } from "../classes/address";

@Injectable()

export class AddressService{

      constructor(private http: Http,
                private httpclient: HttpClient,
                private toastrService: ToastrService, 
                private messageService: MessageService){ }

    headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    httpOptions = {
        headers: this.headers
    };

    public getAddressByUserID(id: number): Observable<Address[]>{
        return this.http.get(`${api_url}/address/getAddressByUserId/${id}`).map((res: any) => res.json())
    }
    
    public insertAddress(data: Address) {
        let address1 = data.address1;
        let address2 = data.address2;
        let city = data.city;
        let state = data.state;
        let postalCode;
        if (data.postalCode === null) {
            postalCode = 0;
        }
        let country = data.country;
        let userid = data.userId;

        return this.httpclient.post<Address>(`${api_url}/address/insertAddress`,
        { address1,address2,city,state,postalCode,country,userid }, {responseType: "text" as "json"}).pipe(tap(res => {
            this.messageService.showMessage("success", "Address successfully added.");
            return;
        }, err => {
            this.messageService.showMessage("error", "Opps! Something went wrong. Please try again.");
        }))
    }

    public updateAddress(data: Address): Observable<Address>{
       const url = `${api_url}/address/updateAddress/${data.id}`;

        return this.httpclient.patch<Address>(url, data, {responseType: "texxt" as "json"}).pipe(tap(data => {
            return this.messageService.showMessage("success", "Successfully update the information.");
        }, err => {
            this.messageService.showMessage("error", "Please try again.");
        }))
    }

    public deleteAddress(data: Address): Observable<Address>{
        const url = `${api_url}/address/deleteAddress/${data.id}`;
        return this.httpclient.post<Address>(url, this.httpOptions);
    }

}
