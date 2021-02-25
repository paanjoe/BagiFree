import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Http } from "@angular/http";
import { ToastrService } from "ngx-toastr";
import { MessageService } from "./message.service";
import { Observable } from "rxjs";
import { Products } from "../classes/product";
import { api_url } from "src/app/config";
import { faq } from "../classes/faq";
import { tap } from "rxjs/operators";



@Injectable()


export class FAQService {

    constructor(private http: Http, 
                private httpclient: HttpClient,
                private toastrService: ToastrService,
                private messageService: MessageService) {}


    // Set content header area
    headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    httpOptions = {
      headers: this.headers
    };


    public getAllFAQ(): Observable<faq[]> {
        return this.http.get(`${api_url}/faq/getAllFAQ/`).map((res:any) => res.json());
    }

    public insertFAQ(data: faq) {
        let title = data.Title;
        let content = data.Content;
    
        return this.httpclient.post<faq>(`${api_url}/faq/insertFAQ`,
        { title, content }, {responseType: "text" as "json"}).pipe(tap(res => {
            this.messageService.showMessage("success", "FAQ successfully added.");
            return;
        }, err => {
            this.messageService.showMessage("error", "Opps! Something went wrong. Please try again.");
        }));
    }
    
    public updateFAQ(data: faq): Observable<faq>{
        const url = `${api_url}/faq/updateFAQ/${data.id}`;

        return this.httpclient.patch<faq>(url, data, {responseType: "text" as "json"})
        .pipe(tap(data => {
          this.messageService.showMessage("success", "Successfully updated the information");
          return;
        }, err => {
          this.messageService.showMessage("error", "Please try again.");
        }))
    }

    public deleteFAQ(id: number): Observable<faq>{
        const url = `${api_url}/faq/deleteFAQ/${id}`;
        return this.httpclient.post<faq>(url, this.httpOptions);
    }
  
}
