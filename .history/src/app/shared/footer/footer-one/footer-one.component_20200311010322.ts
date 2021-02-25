import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ProductSize } from '../../classes/product';
import { subscription } from '../../classes/subscription';
import { MessageService } from '../../services/message.service';
@Component({
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: ['./footer-one.component.scss']
})
export class FooterOneComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private productservice: ProductsService,
              private messageService: MessageService) {
    this.subscriber = this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])]
    });
   }

  public value: string;
  public subscriber: FormGroup;

  ngOnInit() {
    
  }

  addSubscriber(){

    if (this.subscriber.controls['email'].value === '' || this.subscriber.controls['email'].value === null ) {
      this.messageService.showMessage('error', 'Please enter a valid email address.');
    } else {
      const subscriber = { email: this.subscriber.controls['email'].value, isActive: true} as subscription
      this.productservice.insertSubcription(subscriber).subscribe((res) => {
        // do nothing
      });
    }
  }

}
