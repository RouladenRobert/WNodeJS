import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private reqProv : RequestsProvider, private navParams : NavParams) {

  }
  private session = this.navParams.get('session');
  private orderList;

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
  }

}
