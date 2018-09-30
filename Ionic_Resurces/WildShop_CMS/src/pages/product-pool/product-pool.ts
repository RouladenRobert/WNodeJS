import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';

/**
 * Generated class for the ProductPoolPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-pool',
  templateUrl: 'product-pool.html',
})
export class ProductPoolPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  private session = this.navParams.get('session');
  private products = [];
  private pool = [];

  private loadData(){
    this.reqProv.getProducts(this.session).subscribe(prods => {
      this.products = prods;
      this.reqProv.getProductPool(this.session).subscribe(productPool => {
        this.pool = productPool;
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }

  private pushToProducts(ind){
    var item = this.pool[ind];
    this.reqProv.pushToProductPool(this.session, item.pid).subscribe(res => {
      return;
    }, err => {
      console.log(err);
    });

    this.pool = this.pool.splice(ind, 1);
    this.products.push(item);
  }

  private pushToProductPool(ind){
    var item = this.products[ind];
    this.reqProv.pushToProducts(this.session, item.pid).subscribe(res => {
      return;
    }, err => {
      console.log(err);
    });

    this.products = this.products.splice(ind, 1);
    this.pool.push(item);

  }
}
