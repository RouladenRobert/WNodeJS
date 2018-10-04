import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import {RequestsProvider} from '../../providers/requests/requests';
import {ProductEditorPage} from '../product-editor/product-editor';
import {LoginPage} from '../login/login';
import {HomePage} from '../home/home';
import {ProductPoolPage} from '../product-pool/product-pool';
import {AlertController} from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider, private alertCtl : AlertController) {
  }

  private session = this.navParams.get('session');
  private productList;
  private productsShown;
  private alertBoxObject = {title : 'Offenbar ist das Produkt bereits vorhanden. Soll es aktiviert werden?',
                                  buttons : [{text : 'Ja', handler : function(e){
                                    //set the scope of the product-editor-page
                                    const scope = this.handler.scope;
                                    const ind = this.handler.ind;
                                    scope.reqProv.deleteProduct(scope.session, scope.productList[ind].pid).subscribe(res => {
                                      scope.productList = scope.productList.splice(ind, 1);
                                    }, err => {
                                      if(err.status === 401){
                                        this.navCtrl.push(LoginPage);
                                      }

                                    });
                                  }},
                                {text : 'Nein', handler : function(e){ return true;}}]};

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
    alert = this.alertCtl.create(this.alertBoxObject);
    alert.data.buttons[0].handler.scope = this;
    alert.data.buttons[0].handler.ind = ind;
    alert.present();
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

  private goToProductPool(){
    this.navCtrl.push(ProductPoolPage, {session : this.session});
  }

}
