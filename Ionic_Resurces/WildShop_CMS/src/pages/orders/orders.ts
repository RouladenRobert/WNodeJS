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
  private shownOrderList;
  private searchString;

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
    this.getOrders();
  }

  private getOrders(){
    this.reqProv.getOrderList(this.session).subscribe(res => {
      this.orderList = res;
      this.shownOrderList = res;
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

  private search(ev : any){
      const val = ev.target.value;
      if(val === ""){
        this.shownOrderList = this.orderList;
        return;
      }

      if(val && val.trim() != ''){
        switch(val[0]){
          case "#": {
            this.shownOrderList = this.orderList.filter((item) => {
              return (item.oid.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
            break;
          }
          default: {
            var nameList = [];
            var surnameList = [];
            nameList = this.orderList.filter((item) => {
              return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });

            surnameList = this.orderList.filter((item) => {
              return (item.surname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });

            this.shownOrderList = nameList.concat(surnameList);
          }
        }
      }

      //calculate the percentage proprotion of this.shownOrderList -> if its smaller than 10% search in database for some results...
      var p = (this.shownOrderList.length / this.orderList.length);
      if(p < 0.1){
        this.reqProv.searchOrder(this.session, val).subscribe(res => {
          this.shownOrderList = res;
        }, err => {
          if(err.status === 401){
            return;
          }
          else if(err.status === 404){
            console.log("Order not found");
            return;
          }
          console.log(err)
        });
      }
      //console.log(this.shownOrderList);
  }
}
