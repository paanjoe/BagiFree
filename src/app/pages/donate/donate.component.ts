import { Component, OnInit } from '@angular/core';
import { ProductsService} from "../../shared/services/products.service"
import { testimonial } from 'src/app/shared/classes/testimonial';
@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  constructor(private productservice: ProductsService) { }

  public testimonial = [{
    image: 'assets/images/avtar.jpg',
    name: 'Khairul Filhan',
    designation: 'Top Donator',
    description: 'you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings.',
  }, {
    image: 'assets/images/2.jpg',
    name: 'Zaid Aiman',
    designation: 'Top BagiFree',
    description: 'you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings.',
  }, {
    image: 'assets/images/avtar.jpg',
    name: 'Ali Bin Mohd',
    designation: 'Main Sponsor',
    description: 'you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings.',
 }]


   // Teastimonial Slick slider config
   public testimonialSliderConfig = {
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
  };

  public testimonialList: testimonial[];

  ngOnInit() {
    this.productservice.getTestimonial().subscribe((res) => {
      this.testimonialList = [...res];
    });
  }

}
