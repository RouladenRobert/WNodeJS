import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../interfaces/interfaces';
import { Product } from '../../interfaces/interfaces';
import { RequestProvider } from '../../providers/request/request';
import {AlertController} from 'ionic-angular';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider, private alertCtl : AlertController) {
  }

  private productArr = [];
  private product : Product = this.navParams.get('product');
  private session = this.navParams.get('session');
  private orderObj : Order = {prodID : this.product.pid, amount : 1, comment: ''};

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  private addOrder(){
    if(this.session.productArr){
      this.productArr = this.session.productArr;
    }
    this.productArr.push({amount : this.orderObj.amount, desc : this.orderObj.comment, pid : this.product.pid, name : this.product.name, price : this.product.price});
    this.session.productArr = this.productArr;
    this.reqProv.registerOrder(this.session).subscribe(res => {
          this.navCtrl.pop();
    }, err =>{
      let alert = this.alertCtl.create({
        title : "Error while adding order to shopping cart.",
        buttons : ['OK']
      });
      alert.present();
    });
  }

  private goToConfirmation(){
      this.navCtrl.push(ConfirmationPage, {session : this.session});
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

  /*private sendOrder(){

  }*/

}
