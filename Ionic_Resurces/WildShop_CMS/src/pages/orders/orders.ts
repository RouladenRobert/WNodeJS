import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {OrderDetailPage} from '../order-detail/order-detail';
import {LoginPage} from '../login/login';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider) {
  }
  private session = this.navParams.get('session');
  private orderList;
  private searchString;

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
    this.getOrders();
  }

  private getOrders(){
    this.reqProv.getOrderList(this.session).subscribe(res => {
      this.orderList = res;
      console.log(res);
    }, err => {
      if(err.status === 401){
        this.navCtrl.push(LoginPage);
      }
      console.log(err);
    });
  }

  private deleteOrder(item){
    this.reqProv.deleteOrder(this.session, item.oid).subscribe(res => {
      console.log(res);
    }, err => {
      if(err.status === 401){
        this.navCtrl.push(LoginPage);
      }
      console.log(err);
    });
  }

  private goToDetail(item){
    this.navCtrl.push(OrderDetailPage, {session : this.session, item : item});
  }
}
