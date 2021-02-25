import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-about-bagifree",
  templateUrl: "./about-bagifree.component.html",
  styleUrls: ["./about-bagifree.component.scss"],
})

export class AboutBagifreeComponent implements OnInit {

  public videos = [
    {
      name: "01 How to Create Free Account on BagiFree",
      link: "https://www.youtube.com/embed/jkcMo5OAUAQ",
    },
    {
      name: "02 Login & Dashboard Overview",
      link: "https://www.youtube.com/embed/FZcYbifOt8c",
    },
    {
      name: "03 How to Post Bagifree Stuff",
      link: "https://www.youtube.com/embed/RNx4D_owmQc",
    },
  ];


  transformUrl(url) {
    return url.replace("watch?v=", "v/");
  }

  constructor() { }

  ngOnInit() { }
}
