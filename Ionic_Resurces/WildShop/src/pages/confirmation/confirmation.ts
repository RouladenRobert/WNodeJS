import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';
import { ShopPage } from '../shop/shop';
import {HomePage} from '../home/home';
import { Session } from '../../interfaces/interfaces';
import {AlertController} from 'ionic-angular';
import {Product} from '../../interfaces/interfaces';
import {FunctionPoolProvider} from '../../providers/function-pool/function-pool';
import {LogoutPage} from '../logout/logout';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider, private alertCtl : AlertController,
              private funcitonPoolProv : FunctionPoolProvider) {
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
      this.session.productArr = [];
      this.session.idObj = {};
      console.log(this.session);
      this.navCtrl.push(HomePage, {session : this.session});
      //this.navCtrl.push(ShopPage, {session : this.session});
    }, error => {
      if(error.status === 401){
        let alert = this.alertCtl.create({
          title : "Session expired. Pleas log in again.",
          buttons : ['OK']
        });
        alert.present();
        this.reqProv.logoutWithoutSession(this.navCtrl);
      }
      else if(error.status === 403){
        let alert = this.alertCtl.create({
          title : "Your user isn't activated yet. Please click the link in your confirmation-mail.",
          buttons : ['OK']
        });
        alert.present();
      }
      else{
        let alert = this.alertCtl.create({
          title : "Something went wrong while sending the order. Please try it again later.",
          buttons : ['OK']
        });
        alert.present();
      }
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

  private calcPrice(){
    var price = 0;
    if(this.productList.length !== 0){
      for(let p of this.productList){
        price += p.amount * p.price;
      }
    }
    return price.toFixed(2);
  }

  private logout(){
    this.funcitonPoolProv.logout(this.session, this.navCtrl, LogoutPage);
  }

}
