import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductEditorPage } from './product-editor';

@NgModule({
  declarations: [
    ProductEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductEditorPage),
  ],
})
export class ProductEditorPageModule {}
