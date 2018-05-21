import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../interfaces/interfaces';
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

  private product : Product = this.navParams.get('product');
  private orderObj : Order = {userID : 1, prodID : this.product.pid, amount : 1, comment: ''};

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  /*
    ACHTUNG: Weitere Implementierung erst nach Implementierung der Sessions möglich, da alle Bestellungen zunächst in einem Session-Objekt gespeichert werden.
              Daher: Erst Sessions implementieren!!!!!

    TODO: Sessions implementieren, um hier fortzufahren

  */

  private order(){

  }

  private checkInput(){

  }

  private sendOrder(){

  }

}
