import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';
import { Product } from '../../interfaces/interfaces';
import { OrderPage } from '../order/order';

/**
 * Generated class for the DescriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-description',
  templateUrl: 'description.html',
})
export class DescriptionPage {

  private currProd: Product;
  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv: RequestProvider) {
  }

  ionViewDidLoad(){
        this.showDescription();
  }

  //get productID which is delivered by the push coming from ShopPage
  //send DB-request to fetch all description data
 private showDescription(){
    var prID = this.navParams.get('prID');
    var sessionID = this.navParams.get('session');
    //DB-request to fetch description data
    this.reqProv.getDescription(prID, sessionID).subscribe((data: Product) => {
      this.currProd = data[0];
  }, error => {
    console.log(error);
  });
}

  // push OrderPage
  // the user will order the product in the OrderPage
  // pushes the currProd with the page
  private goToOrder(){
    this.navCtrl.push(OrderPage, {product : this.currProd});
  }
}
