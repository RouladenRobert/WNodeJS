import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../interfaces/interfaces';
import {RequestProvider} from '../../providers/request/request';
import {DescriptionPage} from '../description/description'

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
  private session : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private reqProv: RequestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
    this.session = this.navParams.get('session');
    this.getProducts();
  }

  //fetch all products and save them in an array
  private getProducts(){
    //https.request(..);
    //productList.add(reqResult);
    //show the list (do it in the HTML-file)
    console.log(this.session);
    this.reqProv.getProducts(this.session).subscribe((data: Array<Product>) => {
    this.productList = data;
    console.log(this.productList);
  }, error =>{
    console.log(error);
  });
  }

  private sendOrder(){
    this.reqProv.sendOrder(this.session).subscribe((res) => {
      console.log("[ORDER] Bestellung erfolgreich");
      this.session.productArr = null;
      console.log(this.session);
    }, error => {
      console.log("[ORDER] Something went wrong");
      console.log(error);
    });
  }

  //executed if item is clicked
  //pushes to DescriptionPage and has the productID as an argument
  private goToDescription(product: Product){
      this.navCtrl.push(DescriptionPage, {prID: product.pid, session : this.session});
    }
}
