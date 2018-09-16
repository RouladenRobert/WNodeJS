import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {OrderDetailPage} from '../order-detail/order-detail';

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

  }

  private goToDetail(item){
    this.navCtrl.push(OrderDetailPage, {item : item, session : this.session});
  }
}
