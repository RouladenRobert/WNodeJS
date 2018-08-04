import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../interfaces/interfaces';
import { Session } from '../../interfaces/interfaces';
import {RequestProvider} from '../../providers/request/request';
import {DescriptionPage} from '../description/description';
import {ConfirmationPage} from '../confirmation/confirmation';
import {AlertController} from 'ionic-angular';
import {LogoutPage} from '../logout/logout';

/**
 * Generated class for the ShopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  private productList: Array<Product>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private reqProv: RequestProvider, private alertCtl : AlertController) {
  }
  private session = this.navParams.get('session');
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
    this.getProducts();
  }

  //fetch all products and save them in an array
  private getProducts(){
    //https.request(..);
    //productList.add(reqResult);
    //show the list (do it in the HTML-file)
    console.log("Shop");
    console.log(this.session.sessionID);
    this.reqProv.getProducts(this.session).subscribe((data: Array<Product>) => {
    this.productList = data;
  }, error =>{
    if(error.status === 401){
      let alert = this.alertCtl.create({
        title : "Session expired. Pleas log in again.",
        buttons : ['OK']
      });
      alert.present();
      this.reqProv.logoutWithoutSession(this.navCtrl);
    }
    else{
      let alert = this.alertCtl.create({
        title : "Something went wrong while loading the offers. Please try it again.",
        buttons : ['OK']
      });
      alert.present();
    }
  });
  }

  //executed if item is clicked
  //pushes to DescriptionPage and has the productID as an argument
  private goToDescription(product: Product){
      this.navCtrl.push(DescriptionPage, {prID: product.pid, session : this.session});
    }

  // executed if 'Bestellen' is pressed
  // pushes ConfirmationPage
  private goToConfirmation(){
      this.navCtrl.push(ConfirmationPage, {session : this.session})
  }

  private logout(){
    console.log(this.session);
    this.reqProv.logout(this.session).subscribe((data) => {
      console.log(data);
    }, err =>{
      if(err.status === 401){
        this.reqProv.logoutWithoutSession(this.navCtrl);
        return;
      }
      console.log(err);
    });
    this.navCtrl.push(LogoutPage);
  }
}
