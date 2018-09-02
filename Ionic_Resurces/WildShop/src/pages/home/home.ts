import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactPage } from '../contact/contact';
import { ShopPage } from '../shop/shop';
import { InformationPage } from '../information/information';
import { RequestProvider} from '../../providers/request/request';
import { LogoutPage } from '../logout/logout';
import {SettingsPage} from '../settings/settings';
import { Session } from '../../interfaces/interfaces';
import {ConfirmationPage} from '../confirmation/confirmation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private navParams: NavParams, private reqProv : RequestProvider) {

  }
  private session = this.navParams.get('session');
  private ionViewDidLoad(){

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

  private goToSettings(){
    this.navCtrl.push(SettingsPage, {session : this.session});
  }

  // executed if 'Bestellen' is pressed
  // pushes ConfirmationPage
  private goToConfirmation(){
      this.navCtrl.push(ConfirmationPage, {session : this.session})
  }

  private logout(){
    console.log(this.session);
    this.reqProv.logout(this.session).subscribe((data) => {
      console.log(data);
    }, err =>{
      if(err.status === 401){
        this.reqProv.logoutWithoutSession(this.navCtrl);
        return;
      }
      console.log(err);
    });
    this.navCtrl.push(LogoutPage);
  }
}
