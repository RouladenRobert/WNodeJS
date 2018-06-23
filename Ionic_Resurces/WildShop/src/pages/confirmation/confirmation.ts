import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';
import { ShopPage } from '../shop/shop';
import { Session } from '../../interfaces/interfaces';

/**
 * Generated class for the ConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider) {
  }

  session : Session;
  productList = [];
  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmationPage');
    this.session = this.navParams.get('session');
    this.productList = this.session.productArr;
    console.log(this.productList);
  }

  private sendOrder(){
    this.reqProv.sendOrder(this.session).subscribe((res) => {
      console.log("[ORDER] Bestellung erfolgreich");
      this.session.productArr = null;
      console.log(this.session);
      this.navCtrl.push(ShopPage, {session : this.session});
    }, error => {
      console.log("[ORDER] Something went wrong");
      console.log(error);
    });
  }

}
