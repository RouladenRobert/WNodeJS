import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactPage } from '../contact/contact';
import { ShopPage } from '../shop/shop';
import { InformationPage } from '../information/information';
import { RequestProvider} from '../../providers/request/request';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private session : string;
  constructor(public navCtrl: NavController, private navParams: NavParams, private reqProv : RequestProvider) {

  }

  private ionViewDidLoad(){
    this.session = this.navParams.get('session');

  }

  private goToShop(){
    this.navCtrl.push(ShopPage, {session : this.session});
  }

  private goToInfo(){
    this.navCtrl.push(InformationPage)
  }

  private goToContact(){
    this.navCtrl.push(ContactPage);
  }

  private logout(){
    console.log(this.session);
    this.reqProv.logout(this.session).subscribe((data) => {
      console.log(data);
    }, err =>{
      console.log(err);
    });
  }
}
