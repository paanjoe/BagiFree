import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-top',
  templateUrl: './category-top.component.html',
  styleUrls: ['./category-top.component.scss']
})
export class CategoryTopComponent implements OnInit {
public link1: string = '/home/left-sidebar/product/34';
public link2: string = '/home/left-sidebar/product/33';
public link3: string = '/home/left-sidebar/product/38';

  constructor() { }

  ngOnInit() {
  }

}
