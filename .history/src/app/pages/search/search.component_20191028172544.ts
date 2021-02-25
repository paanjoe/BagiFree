import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Products } from 'src/app/shared/classes/product';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Swap } from 'src/app/shared/classes/swap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor( private fb: FormBuilder,private productService: ProductsService) {
    this.searchForm = this.fb.group({
      searchType: [null, [Validators.required]],
      searchInput: [null, [Validators.required]]
    });
   }

  public disp: number = -1;
  public searchForm: FormGroup;
  public pList: Products[];
  public sList: Swap[];
  public searchText: string = '';

  ngOnInit() {
    this.productService.getProducts().subscribe((res) => {
      this.pList = [...res];
    })
    this.productService.getSwap().subscribe((res) => {
      this.sList = [...res];
    })
  }

  search(){
    if(this.searchForm.controls['searchType'].value == null){
      // no results
      this.disp = 0;
    } else if(this.searchForm.controls['searchType'].value == 1){
      // find bagifree
      this.searchText = this.searchForm.controls['searchInput'].value;
      this.disp = 1;
    } else if(this.searchForm.controls['searchType'].value == 2){
      // find swap
      this.searchText = this.searchForm.controls['searchInput'].value;
      this.disp = 2
    }


console.log(this.searchText);
  }

}
