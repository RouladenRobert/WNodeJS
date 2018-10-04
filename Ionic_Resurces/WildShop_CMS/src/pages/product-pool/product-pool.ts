import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';
import {AlertController} from 'ionic-angular';
import {HomePage} from '../home/home';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider, private alertCtl : AlertController) {
  }

  private session = this.navParams.get('session');
  private products;
  private pool;

  private err404Alert = this.alertCtl.create({title : 'Das Produkt wurde gerade von einem anderen Admin gelöscht.',
                                  buttons : [{text : 'OK', handler : function(e){
                                    return true;
                                  }}]});

  private unknownErr = this.alertCtl.create({title : 'Ein Fehler ist aufgetreten, bitte später noch einmal versuchen.',
                                  buttons : [{text : 'OK', handler : function(e){
                                    const scope = this.handler.scope;
                                    scope.navCtrl.push(HomePage, {session : scope.session});
                                    return true;
                                  }}]});



  ionViewDidLoad() {
    this.loadData();
  }

  private loadData(){
    //in case of an error, the scope is set here
    this.unknownErr.data.buttons[0].handler.scope = this;

    this.reqProv.getProducts(this.session).subscribe(prods => {
      this.products = prods;
      this.reqProv.getProductPool(this.session).subscribe(productPool => {
        this.pool = productPool;
      }, err => {
        console.log(err);
        this.unknownErr.present();
      });
    }, err => {
      console.log(err);
      this.unknownErr.present();
    });
  }

  private pushToProducts(ind){
    var item = this.pool[ind];
    this.reqProv.pushToProducts(this.session, item.pid, null).subscribe(res => {
      this.pool.splice(ind, 1);
      this.products.push(item);
      return;
    }, err => {
      console.log(err);
      if(err.status === 404){
        this.err404Alert.present();
      }
      else{
        this.unknownErr.data.buttons[0].handler.scope = this;
        this.unknownErr.present();
      }
    });
  }

  private pushToProductPool(ind){
    var item = this.products[ind];
    this.reqProv.pushToProductPool(this.session, item.pid).subscribe(res => {
      this.products.splice(ind, 1);
      this.pool.push(item);
      return;
    }, err => {
      console.log(err);
      if(err.status === 404){
        this.err404Alert.present();
      }
      else{
        this.unknownErr.data.buttons[0].handler.scope = this;
        this.unknownErr.present();
      }
    });

  }
}
