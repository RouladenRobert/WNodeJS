import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdcutEditorPage } from './prodcut-editor';

@NgModule({
  declarations: [
    ProdcutEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdcutEditorPage),
  ],
})
export class ProdcutEditorPageModule {}
