import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {ProductsPage} from '../products/products';
import {AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';

/**
 * Generated class for the ProductEditorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-editor',
  templateUrl: 'product-editor.html',
})
export class ProductEditorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider, private alertCtl : AlertController) {
  }

  private session = this.navParams.get('session');
  private item = {name : null, amount : null, price : null, desc : null, weight : null, preOrderable : 'nein'};
  private buttonText = "Produkt einfügen";
  private mapPreOrderableEntry = {'ja' : true, 'nein' : false};
  private mapPreOrderableLeave = {true : 'ja', false : 'nein'};
  private bNewItem = true;
  private enabled = true;
  private alert = this.alertCtl.create({title : 'Session abgelaufen, bitte neu einloggen.',
                                  buttons : [{text : 'OK', handler : function(e){
                                    this.navCtrl.push(LoginPage);
                                  }}]});

  ionViewDidLoad() {
    if(this.navParams.get('item') !== null && this.navParams.get('item') !== undefined){
      this.item = this.navParams.get('item');
      console.log(this.item);
      this.item.preOrderable = this.mapPreOrderableEntry[this.item.preOrderable];
      this.buttonText = "Produkt aktualisieren";
      this.bNewItem = false;
    }
  }

  ionViewWillLeave(){
    this.item.preOrderable = this.mapPreOrderableLeave[this.item.preOrderable];
  }

  private sendProduct(){
    if(this.bNewItem){
      console.log("Add");
      this.reqProv.addProduct(this.session, this.item).subscribe(res => {
        this.navCtrl.push(ProductsPage, {session : this.session});
      }, err => {
        if(err.status === 401){
            //create alert and go to login on confirm
            this.alert.present();
        }
        console.log(err);
      });
    }
    else {
      this.reqProv.updateProduct(this.session, this.item).subscribe(res => {
        this.navCtrl.push(ProductsPage, {session : this.session});
      }, err => {
        if(err.status === 401){
          //create alert...
          this.alert.present();
        }
        console.log(err);
      });
    }
  }

  private enableButton(){
    if(this.item.name !== null && this.item.amount !== null && this.item.price !== null && this.item.desc !== null && this.item.weight !== null){
        this.enabled = false;
    }
  }

}
