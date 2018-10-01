import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {ProductsPage} from '../products/products';
import {AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {HomePage} from '../home/home';
import {Product} from '../../interfaces/interfaces';

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
  private pid;
  private wrongInputAlert = this.alertCtl.create({title : 'Bestand und Gewicht kann nur Ganzzahlwerte annehmen.',
                                  buttons : [{text : 'OK', handler : function(e){
                                    return true;
                                  }}]});
  private sessionAlert = this.alertCtl.create({title : 'Session abgelaufen, bitte neu einloggen.',
                                  buttons : [{text : 'OK', handler : function(e){
                                    this.navCtrl.push(LoginPage);
                                  }}]});

  private alertBoxObject = {title : 'Offenbar ist das Produkt bereits vorhanden. Soll es aktiviert werden?',
                                  buttons : [{text : 'Ja', handler : function(e){
                                    //set the scope of the product-editor-page
                                    const scope = this.handler.scope;
                                    console.log(scope.item);
                                    scope.reqProv.pushToProducts(scope.session, scope.pid, scope.item).subscribe(res => {
                                      return;
                                    }, err => {
                                      console.log(err);
                                    });
                                  }},
                                {text : 'Nein', handler : function(e){ return true;}}]};
  private prodAlert = this.alertCtl.create(this.alertBoxObject);

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
    if(!(this.isInt(this.item.amount) && this.isInt(this.item.weight))){
      this.wrongInputAlert.present();
      return;
    }

    if(this.bNewItem){
      this.reqProv.addProduct(this.session, this.item).subscribe(res => {
        if(res){
          //set the scope in the handler-function. Neccessary becuse the handler must access this.reqProv
          this.prodAlert.data.buttons[0].handler.scope = this;
          this.pid = res.pid;
          this.prodAlert.present();
        }
        this.navCtrl.push(ProductsPage, {session : this.session});
      }, err => {
        if(err.status === 401){
            //create alert and go to login on confirm
            this.sessionAlert.present();
        }
      });
    }
    else {
      this.reqProv.updateProduct(this.session, this.item).subscribe(res => {
        this.navCtrl.push(ProductsPage, {session : this.session});
      }, err => {
        if(err.status === 401){
          //create alert...
          this.sessionAlert.present();
        }
      });
    }
  }

  private enableButton(){
    if(this.item.name !== null && this.item.amount !== null && this.item.price !== null && this.item.desc !== null && this.item.weight !== null){
        this.enabled = false;
    }
  }

  private isInt(n){
    return Number(n) === n && n % 1 === 0;
  }

  private isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }
}
