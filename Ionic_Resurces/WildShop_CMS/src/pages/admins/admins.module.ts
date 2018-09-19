import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminsPage } from './admins';

@NgModule({
  declarations: [
    AdminsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminsPage),
  ],
})
export class AdminsPageModule {}
