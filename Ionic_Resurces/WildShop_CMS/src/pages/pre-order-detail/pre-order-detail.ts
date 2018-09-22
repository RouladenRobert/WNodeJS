import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {AlertController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';


/**
 * Generated class for the PreOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pre-order-detail',
  templateUrl: 'pre-order-detail.html',
})
export class PreOrderDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public reqProv : RequestsProvider, private alertCtl : AlertController) {
  }

  private item = this.navParams.get('item');
  private session = this.navParams.get('session');
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    this.loadData();
  }

  private loadData(){
    this.reqProv.getOrderDetails(this.session, this.item.poid).subscribe(res => {
      this.item = res;
      console.log(res);
    }, err => {
      if(err.status === 401){
        this.navCtrl.push(LoginPage);
      }
      console.log(err);
    });
    }

  private deleteOrder(){
    let reqP = this.reqProv;
    let oID = this.item.orderID;
    let session = this.session;
    let navC = this.navCtrl;
    let alert = this.alertCtl.create({
      title : "Vorbestellung wirklich löschen?",
      buttons : [{text : 'Ja', role : 'submit', handler : function(e){
        reqP.deleteOrder(session, oID).subscribe(res => {
          navC.pop();
        }, err => {
          if(err.status === 401){
            navC.push(LoginPage);
          }
          console.log(err);
        });
      }},
    {text : 'Abbrechen', handler : function(e){return true;}}]
    });
    alert.present();
  }

}
