import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // Testimonial Carousel
  public testimonial = [{
     image: 'assets/images/avtar.jpg',
     name: 'Mark jkcno',
     designation: 'Gold Donor',
     description: 'you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings.',
   }, {
     image: 'assets/images/2.jpg',
     name: 'Adegoke Yusuff',
     designation: 'Silver Donor',
     description: 'you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings.',
   }, {
     image: 'assets/images/avtar.jpg',
     name: 'John Shipmen',
     designation: 'Normal User',
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

  // Team 
  public team = [{
     image: '../../../assets/images/team/Esa.jpg',
     name: 'Esa Ismail',
     designation: 'Founder'
   }, {
     image: 'https://www.w3schools.com/howto/img_avatar.png',
     name: 'Faizal Abdullah',
     designation: 'Co-Founder I'
   }, {
     image: 'https://www.w3schools.com/howto/img_avatar.png',
     name: 'Suryani Faisol',
     designation: 'Co-Founder II'
   }, {
     image: 'https://www.w3schools.com/howto/img_avatar.png',
     name: 'Khairul Filhan',
     designation: 'Lead Developer'
   }, {
     image: 'https://www.w3schools.com/howto/img_avatar.png',
     name: 'Farhan Fazli',
     designation: 'Developer'
  }]

  // Team Slick slider config
  public teamSliderConfig = {
      infinite: true,
      speed: 300,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 3000,
      responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 586,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }
     ]
  };

}
