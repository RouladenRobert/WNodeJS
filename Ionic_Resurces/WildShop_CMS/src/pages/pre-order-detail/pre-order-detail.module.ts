import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreOrderDetailPage } from './pre-order-detail';

@NgModule({
  declarations: [
    PreOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PreOrderDetailPage),
  ],
})
export class PreOrderDetailPageModule {}
