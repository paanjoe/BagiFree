import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Http } from "@angular/http";
import { ToastrService } from "ngx-toastr";
import { MessageService } from "./message.service";
import { Observable } from "rxjs";
import { Products } from "../classes/product";
import { api_url } from "src/app/config";
import { testimonial } from "../classes/testimonial";
import { tap } from "rxjs/operators";



@Injectable()


export class TestimonialService {

    constructor(private http: Http, 
                private httpclient: HttpClient,
                private toastrService: ToastrService,
                private messageService: MessageService) {}


    // Set content header area
    headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    httpOptions = {
      headers: this.headers
    };


    public getTestimonial(): Observable<testimonial[]> {
        return this.http.get(`${api_url}/testimonial/getAllTestimonial/`).map((res:any) => res.json());
    }

    public insertTestimonial(data: testimonial) {
        let image = data.image;
        let name = data.name;
        let designation = data.designation;
        let description = data.description;
    
        return this.httpclient.post<testimonial>(`${api_url}/testimonial/insertTestimonial`,
        { image, name, designation, description }, {responseType: "text" as "json"}).pipe(tap(res => {
            this.messageService.showMessage("success", "Testimonial successfully added.");
            return;
        }, err => {
            this.messageService.showMessage("error", "Opps! Something went wrong. Please try again.");
        }));
    }
    
    public updateTestimonial(data: testimonial): Observable<testimonial>{
        const url = `${api_url}/testimonial/updateTestimonial/${data.id}`;

        return this.httpclient.patch<testimonial>(url, data.id, {responseType: "text" as "json"})
        .pipe(tap(data => {
          this.messageService.showMessage("success", "Successfully updated the information");
          return;
        }, err => {
          this.messageService.showMessage("error", "Please try again.");
        }))
    }

    public deleteTestimonial(id: number): Observable<testimonial>{
        const url = `${api_url}/testimonial/deleteTestimonial/${id}`;
        return this.httpclient.post<testimonial>(url, this.httpOptions);
    }
  
}
