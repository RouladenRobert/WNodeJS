import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../interfaces/interfaces';
import { Product } from '../../interfaces/interfaces';
import { RequestProvider } from '../../providers/request/request';
import {AlertController} from 'ionic-angular';
import {ConfirmationPage} from '../confirmation/confirmation';
import {LogoutPage} from '../logout/logout';
import {FunctionPoolProvider} from '../../providers/function-pool/function-pool';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider, private alertCtl : AlertController, private funcitonPoolProv : FunctionPoolProvider) {
  }

  private productArr = [];
  private product : Product = this.navParams.get('product');
  private session = this.navParams.get('session');
  private orderObj : Order = {prodID : this.product.pid, amount : 1, comment: ''};
  private idObj = this.session.idObj;

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  private addOrder(){

    //get current Product-array
    if(this.session.productArr){
      this.productArr = this.session.productArr;
    }

    // check if id-object is undefined
    if(this.productArr.length === 0 && this.idObj === undefined){
      // get product-id of chosen product.
      var pid = this.orderObj.prodID;

      // create id-object and set first entry (0 as value because the values represent the index where the product is saved in the productArray)
      this.idObj = {};
      this.idObj[pid] = 0;
      this.session.idObj = this.idObj;
      this.productArr.push({amount : this.orderObj.amount, desc : this.orderObj.comment, pid : this.product.pid, name : this.product.name, price : this.product.price});
    }
    // id-object is defined
    else{
      //check if the id of the chosen product is already in the array
      if(this.idObj[this.orderObj.prodID] === undefined){
        // set new id with the lenght of the array (the index the object will be saved)
        this.idObj[this.orderObj.prodID] = this.productArr.length;
        this.productArr.push({amount : this.orderObj.amount, desc : this.orderObj.comment, pid : this.product.pid, name : this.product.name, price : this.product.price});
        this.session.idObj = this.idObj;
      }
      else{
        // case that the product is already iin the array -> update amount and the description.
        this.productArr[this.idObj[this.orderObj.prodID]].amount = this.productArr[this.idObj[this.orderObj.prodID]].amount + this.orderObj.amount;
        this.productArr[this.idObj[this.orderObj.prodID]].desc = this.productArr[this.idObj[this.orderObj.prodID]].desc +"\n"+this.orderObj.comment;
      }
    }
    this.session.productArr = this.productArr;
    this.reqProv.registerOrder(this.session).subscribe(res => {
          this.navCtrl.pop();
    }, err =>{
      let alert = this.alertCtl.create({
        title : "Error while adding order to shopping cart.",
        buttons : ['OK']
      });
      alert.present();
    });

  }

  private goToConfirmation(){
      //this.navCtrl.push(ConfirmationPage, {session : this.session});
      this.funcitonPoolProv.goToConfirmation(this.session, this.navCtrl, ConfirmationPage);
  }

  private logout(){
    this.funcitonPoolProv.logout(this.session, this.navCtrl, LogoutPage);
  }

}
