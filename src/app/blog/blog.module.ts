import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';
import { NzInputNumberModule, NzCardModule, NzRadioModule, NzTableModule, NzDividerModule, NzButtonModule, 
  NzIconModule, NzTabsModule, NzDropDownModule, NzSpinModule, NzModalModule, NzFormModule, NzInputModule, 
  NzSelectModule, NzUploadModule, NzTagModule, NzDatePickerModule, NzRateModule, NzProgressModule, NzListModule,
  NgZorroAntdModule,
   NzCommentModule, NzAvatarModule } from 'ng-zorro-antd';
import { BlogLeftSidebarComponent } from './blog-left-sidebar/blog-left-sidebar.component';
import { BlogRightSidebarComponent } from './blog-right-sidebar/blog-right-sidebar.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { ProductFilter } from './pipe/productFilter';
@NgModule({
  imports: [
    // ProductFilter,
    Ng2SearchPipeModule,
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    BlogRoutingModule,
    NzCardModule, 
    NzRadioModule, 
    NzTableModule, 
    NzDividerModule, 
    NzButtonModule, 
    NzIconModule, 
    NzTabsModule, 
    NzDropDownModule, 
    NzSpinModule, 
    NzModalModule, 
    NzFormModule, 
    NzInputModule, 
    NzSelectModule, 
    NzUploadModule, 
    NzTagModule, 
    NzDatePickerModule, 
    NzRateModule, 
    NzProgressModule, 
    NzListModule, 
    NzCommentModule, 
    NzAvatarModule 
  ],
  declarations: [
    BlogLeftSidebarComponent,
    BlogRightSidebarComponent,
    BlogDetailsComponent
  ]
})

export class BlogModule { }
