import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import {RequestsProvider} from '../../providers/requests/requests';
import {ProductEditorPage} from '../product-editor/product-editor';
import {LoginPage} from '../login/login';
import {HomePage} from '../home/home';

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

  @ViewChild(Navbar) navBar : Navbar

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider) {
  }

  private session = this.navParams.get('session');
  private productList;
  private productsShown;

  ionViewDidLoad() {
    this.loadProducts();
    this.navBar.backButtonClick = () => {
      this.navCtrl.push(HomePage, {session : this.session});
    }
  }

  private loadProducts(){
    this.reqProv.getProducts(this.session).subscribe(res => {
      this.productList = res;
      this.productsShown = res;
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  private deleteProduct(ind){
    this.reqProv.deleteProduct(this.session, this.productList[ind].pid).subscribe(res => {
      var item = this.productList[ind];
      this.productList = this.productList.filter(i => i !== item);
      console.log(this.productList);
    }, err => {
      if(err.status === 401){
        this.navCtrl.push(LoginPage);
      }
      console.log(err);
    });
  }

  private editProduct(item, ind){
    if(item === null || item === undefined){
      this.navCtrl.push(ProductEditorPage, {session : this.session});
    }
    else{
        item.pid = this.productList[ind].pid;
        this.navCtrl.push(ProductEditorPage, {session : this.session, item : item});
    }
  }

  private search(ev : any){
    const val = ev.target.value;

    if(val === ""){
      this.productsShown = this.productList;
    }

    if(val && val.trim() != ''){
      this.productsShown = this.productList.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }

  }

}
