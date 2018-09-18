import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {OrderDetailPage} from '../order-detail/order-detail';
import {PreOrderDetailPage} from '../pre-order-detail/pre-order-detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private reqProv : RequestsProvider, private navParams : NavParams) {

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
    if(item.orderID !== (null || undefined)){
        this.navCtrl.push(OrderDetailPage, {item : item, session : this.session});
    }
    else if(item.preOrderID !== (null || undefined)){
        this.navCtrl.push(PreOrderDetailPage, {item : item, session : this.session});
    }
  }
}
