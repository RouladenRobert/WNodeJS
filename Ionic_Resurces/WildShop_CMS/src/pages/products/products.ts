import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {ProductEditorPage} from '../product-editor/product-editor';
import {LoginPage} from '../login/login';

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
    this.loadProducts();
  }

  private loadProducts(){
    this.reqProv.getProducts(this.session).subscribe(res => {
      this.productList = res;
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  private deleteProduct(item){
    this.reqProv.deleteProduct(this.session, item.pid).subscribe(res => {
      this.productList = res;
      console.log(res);
    }, err => {
      if(err.status === 401){
        this.navCtrl.push(LoginPage);
      }
      console.log(err);
    });
  }

  private editProduct(item){
    if(item === null || item === undefined){
      this.navCtrl.push(ProductEditorPage, {session : this.session});
    }
    else{
        this.navCtrl.push(ProductEditorPage, {session : this.session, item : item});  
    }
  }

}
