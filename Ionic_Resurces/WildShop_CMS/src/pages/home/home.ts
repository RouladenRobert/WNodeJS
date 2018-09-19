import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {OrderDetailPage} from '../order-detail/order-detail';
import {PreOrderDetailPage} from '../pre-order-detail/pre-order-detail';
import {FunctionPoolProvider} from '../../providers/function-pool/function-pool';
import {LogoutPage} from '../logout/logout';
import {PreOrdersPage} from '../pre-orders/pre-orders';
import {ProductsPage} from '../products/products';
import {AdminsPage} from '../admins/admins';
import {OrdersPage} from '../orders/orders';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private reqProv : RequestsProvider, private navParams : NavParams, private funcitonPool : FunctionPoolProvider) {

  }
  private session = this.navParams.get('session');
  private orderList;
  private userList;
  private prodList;
  private preOrderList;

  ionViewDidLoad(){
    this.loadData();
  }

  private loadData(){
    //laod data step by step and independent of each other..
    // if one data-box could not be loaded the other boxes should not be affected
    this.reqProv.getOrderList(this.session).subscribe(res => {
      this.orderList = res;
      console.log(res);
  }, err => {
      console.log(err);
  });

  this.reqProv.getAdminUsers(this.session).subscribe(res => {
      this.userList = res;
  }, err => {
      console.log(err);
  });

  this.reqProv.getProducts(this.session, 20).subscribe(res => {
    this.prodList = res;
  }, err => {
    console.log(err);
  });

  this.reqProv.getPreOrderList(this.session).subscribe(res => {
    this.preOrderList = res;
  }, err => {
    console.log(err);
  });

  }

  private goToDetail(item){
    if(item.oid !== (null || undefined)){
        this.navCtrl.push(OrderDetailPage, {item : item, session : this.session});
    }
    else if(item.poid !== (null || undefined)){
        this.navCtrl.push(PreOrderDetailPage, {item : item, session : this.session});
    }
  }

  private logout(){
    this.funcitonPool.logout(this.session, this.navCtrl, LogoutPage);
  }

  private goToOrders(){
    this.navCtrl.push(OrdersPage, {session : this.session});
  }

  private goToPreOrders(){
    this.navCtrl.push(PreOrdersPage, {session : this.session});
  }

  private goToProducts(){
    this.navCtrl.push(ProductsPage, {session : this.session});
  }

  private goToAdmins(){
    this.navCtrl.push(AdminsPage, {session : this.session});
  }
}
