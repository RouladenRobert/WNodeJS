import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContactPage } from '../contact/contact';
import { ShopPage } from '../shop/shop';
import { InformationPage } from '../information/information';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  private goToShop(){
    this.navCtrl.push(ShopPage);
  }

  private goToInfo(){
    this.navCtrl.push(InformationPage)
  }

  private goToContact(){
    this.navCtrl.push(ContactPage);
  }
}
