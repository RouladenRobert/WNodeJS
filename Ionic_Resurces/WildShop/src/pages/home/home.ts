import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactPage } from '../contact/contact';
import { ShopPage } from '../shop/shop';
import { InformationPage } from '../information/information';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private session : string;
  constructor(public navCtrl: NavController, private navParams: NavParams) {

  }

  private goToShop(){
    this.session = this.navParams.get('session');
    this.navCtrl.push(ShopPage, {session : this.session});
  }

  private goToInfo(){
    this.navCtrl.push(InformationPage)
  }

  private goToContact(){
    this.navCtrl.push(ContactPage);
  }
}
