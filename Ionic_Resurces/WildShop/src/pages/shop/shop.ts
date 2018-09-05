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
import {FunctionPoolProvider} from '../../providers/function-pool/function-pool';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private reqProv: RequestProvider, private alertCtl : AlertController,
    private funcitonPoolProv : FunctionPoolProvider) {
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
    //console.log("Shop");
    //console.log(this.session.sessionID);
    this.reqProv.getProducts(this.session).subscribe((data: Array<Product>) => {
    if(!(data instanceof Array)){
      let alert = this.alertCtl.create({
        title : "Could not load products. Please log in again.",
        buttons : ['OK']
      });
      alert.present();
      this.navCtrl.pop();
    }
    else if(data === []){
      let alert = this.alertCtl.create({
        title : "No products aviable at the moment.",
        buttons : ['OK']
      });
      alert.present();
      this.navCtrl.pop();
    }
    else{
      this.productList = data;
    }
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

  //return image without new HTTPS-Request
  private getImage(item : Product){
    return "data:image/jpg;base64,"+item.pic;
  }

  //executed if item is clicked
  //pushes to DescriptionPage and has the productID as an argument
  private goToDescription(product: Product){
      this.navCtrl.push(DescriptionPage, {prID: product.pid, session : this.session});
    }

  // executed if 'Bestellen' is pressed
  // pushes ConfirmationPage
  private goToConfirmation(){
      //this.navCtrl.push(ConfirmationPage, {session : this.session});
      this.funcitonPoolProv.goToConfirmation(this.session, this.navCtrl, ConfirmationPage);
  }

  private logout(){
    this.funcitonPoolProv.logout(this.session, this.navCtrl, LogoutPage);
  }
}
