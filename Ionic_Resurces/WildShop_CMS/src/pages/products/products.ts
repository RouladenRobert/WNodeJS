import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {ProductEditorPage} from '../product-editor/product-editor';

/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider) {
  }

  private session = this.navParams.get('session');
  private productList;

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
  }

  private deleteProduct(item){
    this.reqProv.deleteProduct(this.session, item.pid).subscribe(res => {
      this.productList = res;
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  private editProduct(item){
    this.navCtrl.push(ProductEditorPage, {session : this.session, item : item});
  }

}
