import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';
import { ShopPage } from '../shop/shop';
import { Session } from '../../interfaces/interfaces';
import {AlertController} from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider, private alertCtl : AlertController) {
  }

  session = this.navParams.get('session');
  productList = [];
  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmationPage');
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
      let alert = this.alertCtl.create({
        title : "Something went wrong while sending the order. Pleas try it again later. If it does not work then pleas contact us.",
        buttons : ['OK']
      });
      alert.present();
      console.log("[ORDER] Something went wrong");
      console.log(error);
    });
  }

  private removeFromCart(prod : Product){
    //remove element from product-array
    var index = this.productList.indexOf(prod);
    var len = this.productList.length;
    var newArr = [];
    for(let i=0; i<len; i++){
      if(i != index){
          newArr.push(this.productList[i]);
      }
    }
    this.productList = newArr;
    this.session.productArr = newArr;
  }

}
