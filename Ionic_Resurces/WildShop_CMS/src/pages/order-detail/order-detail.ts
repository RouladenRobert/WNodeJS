import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {AlertController} from 'ionic-angular';
import {HomePage} from '../home/home';

/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider, private alertCtl : AlertController) {
  }

  private item = this.navParams.get('item');
  private session = this.navParams.get('session');
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    this.loadData();
  }

  private loadData(){
    this.reqProv.getOrderDetails(this.session, this.item.oid).subscribe(res => {
      this.item = res;
      console.log(res);
    }, err => {
      console.log(err);
    });
    }

  private finishOrder(){
    console.log(this.item);
    this.reqProv.finishOrder(this.session, this.item.orderID).subscribe(res => {
      this.navCtrl.push(HomePage, {session : this.session});
      return;
    }, err => {
      console.log(err);
    })
  }

  private deleteOrder(){
    let alert = this.alertCtl.create({
      title : "Bestellung wirklich löschen?",
      buttons : [{text : 'Ja', handler : function(e){
        this.reqProv.deleteOrder(this.session, this.item.orderID).subscribe(res => {
          this.navCtrl.pop();
        }, err => {
          console.log(err);
        });
      }},
    {text : 'Abbrechen', handler : function(e){return true;}}]
    });
    alert.present();
  }
  }
