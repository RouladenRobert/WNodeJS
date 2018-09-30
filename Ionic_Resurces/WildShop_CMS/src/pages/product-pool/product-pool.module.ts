import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPoolPage } from './product-pool';

@NgModule({
  declarations: [
    ProductPoolPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPoolPage),
  ],
})
export class ProductPoolPageModule {}
