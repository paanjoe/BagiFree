import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Http } from "@angular/http";
import { ToastrService } from "ngx-toastr";
import { MessageService } from "./message.service";
import { Observable } from "rxjs";
import { Products } from "../classes/product";
import { api_url } from "src/app/config";
import { subscription } from "../classes/subscription";
import { tap } from "rxjs/operators";



@Injectable()


export class SubscriptionService {

    constructor(private http: Http, 
                private httpclient: HttpClient,
                private toastrService: ToastrService,
                private messageService: MessageService) {}


    // Set content header area
    headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    httpOptions = {
      headers: this.headers
    };


    public getAllEmail(): Observable<subscription[]> {
        return this.http.get(`${api_url}/subscription/getAllEmail/`).map((res:any) => res.json());
    }

    public getActiveEmail(): Observable<subscription[]> {
        return this.http.get(`${api_url}/subscription/getActiveEmail/`).map((res:any) => res.json());
    }

    public getInactiveEmail(): Observable<subscription[]> {
        return this.http.get(`${api_url}/subscription/getInactiveEmail/`).map((res:any) => res.json());
    }

    public insertSubcription(data: subscription) {
        let email = data.email;
        let isActive = data.isActive;
    
        return this.httpclient.post<subscription>(`${api_url}/subscription/insertSubscription`,
        { email, isActive }, {responseType: "text" as "json"}).pipe(tap(res => {
            this.messageService.showMessage("success", "Subscription successfully added.");
            return;
        }, err => {
            this.messageService.showMessage("error", "Opps! Something went wrong. Please try again.");
        }));
    }

    public deleteEmail(email: string): Observable<subscription>{
        const url = `${api_url}/subscription/deleteEmail`;
        return this.httpclient.post<subscription>(url, {email}, this.httpOptions);
    }
  
}

