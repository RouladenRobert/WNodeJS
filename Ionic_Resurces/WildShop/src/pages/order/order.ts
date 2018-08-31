import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../interfaces/interfaces';
import { Product } from '../../interfaces/interfaces';
import { RequestProvider } from '../../providers/request/request';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider) {
  }

  private productArr = [];
  private product : Product = this.navParams.get('product');
  private session = this.navParams.get('session');
  private orderObj : Order = {prodID : this.product.pid, amount : 1, comment: ''};

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  private addOrder(){
    console.log(this.product);
    if(this.session.productArr){
      this.productArr = this.session.productArr;
    }
    this.productArr.push({amount : this.orderObj.amount, desc : this.orderObj.comment, pid : this.product.pid, name : this.product.name, price : this.product.price})
    this.session.productArr = this.productArr;
    console.log(this.session);
    this.navCtrl.pop();
  }

  private checkInput(){

  }

  /*private sendOrder(){

  }*/

}
