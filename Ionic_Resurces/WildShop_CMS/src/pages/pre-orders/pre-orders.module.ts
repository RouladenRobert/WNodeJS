import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreOrdersPage } from './pre-orders';

@NgModule({
  declarations: [
    PreOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(PreOrdersPage),
  ],
})
export class PreOrdersPageModule {}
