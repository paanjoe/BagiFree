import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { IsotopeModule } from 'ngx-isotope';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AboutUsComponent } from './about-us/about-us.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LookbookComponent } from './lookbook/lookbook.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { CollectionComponent } from './collection/collection.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ContactComponent } from './contact/contact.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CompareComponent } from './compare/compare.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaqComponent } from './faq/faq.component';
import { TypographyComponent } from './typography/typography.component';
import { GridTwoColComponent } from './portfolio/grid-two-col/grid-two-col.component';
import { GridThreeColComponent } from './portfolio/grid-three-col/grid-three-col.component';
import { GridFourColComponent } from './portfolio/grid-four-col/grid-four-col.component';
import { MasonaryTwoGridComponent } from './portfolio/masonary-two-grid/masonary-two-grid.component';
import { MasonaryThreeGridComponent } from './portfolio/masonary-three-grid/masonary-three-grid.component';
import { MasonaryFourGridComponent } from './portfolio/masonary-four-grid/masonary-four-grid.component';
import { MasonaryFullwidthComponent } from './portfolio/masonary-fullwidth/masonary-fullwidth.component';
import { DonateComponent } from './donate/donate.component';
import { TermsComponent } from './terms/terms.component';
import { AddProductComponent } from './add-product/add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyswapComponent } from './myswap/myswap.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { MyRequestComponent } from './my-request/my-request.component';
import { GiveawayRequestComponent } from './giveaway-request/giveaway-request.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyratingComponent } from './myrating/myrating.component';
import { NzInputNumberModule, NzPopoverModule, NzDescriptionsModule, NzCarouselModule, NzCardModule, NzRadioModule,NzTableModule, NzDividerModule, NzButtonModule, NzIconModule, NzTabsModule, NzDropDownModule, NzSpinModule, NzModalModule, NzFormModule, NzInputModule, NzSelectModule, NzUploadModule, NzTagModule, NzDatePickerModule, NzRateModule, NzProgressModule, NzListModule, NzCommentModule, NzAvatarModule } from 'ng-zorro-antd';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NgbTabsetModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {NgxImageCompressService} from 'ngx-image-compress';

export const options: Partial<IConfig> | (()=> Partial<IConfig>) = null;

@NgModule({
  imports: [
    NzInputNumberModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    CommonModule,
    PagesRoutingModule,
    SlickCarouselModule,
    IsotopeModule,
    NzSpinModule,
    NzTableModule,
    NzIconModule,
    NzPopoverModule,
    NzTabsModule,
    NzDatePickerModule,
    NzTagModule,
    NzDividerModule,
    FormsModule,
    NgbTabsetModule,
    NzCarouselModule,
    NzFormModule,
    NzDescriptionsModule,
    NzDropDownModule,
    NzModalModule,
    NzSelectModule,
    NzUploadModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzRateModule,
    NzProgressModule,
    NzListModule,
    NzRadioModule,
    NzCommentModule,
    NzAvatarModule,
    NgbModule,
    NzCardModule,
    Ng2SearchPipeModule,
    NgxMaskModule.forRoot(options)
  ],
  declarations: [
    AboutUsComponent,
    ErrorPageComponent,
    LookbookComponent,
    LoginComponent,
    RegisterComponent,
    SearchComponent,
    WishlistComponent,
    CartComponent,
    CollectionComponent,
    ForgetPasswordComponent,
    ContactComponent,
    CheckoutComponent,
    CompareComponent,
    OrderSuccessComponent,
    DashboardComponent,
    FaqComponent,
    TypographyComponent,
    GridTwoColComponent,
    GridThreeColComponent,
    GridFourColComponent,
    MasonaryTwoGridComponent,
    MasonaryThreeGridComponent,
    MasonaryFourGridComponent,
    MasonaryFullwidthComponent,
    DonateComponent,
    TermsComponent,
    AddProductComponent,
    MyswapComponent,
    AddressBookComponent,
    MyRequestComponent,
    GiveawayRequestComponent,
    ChangePasswordComponent,
    MyratingComponent,
    EditProfileComponent,
    SpinnerComponent
  ], providers:[NgxImageCompressService]
})
export class PagesModule { }
