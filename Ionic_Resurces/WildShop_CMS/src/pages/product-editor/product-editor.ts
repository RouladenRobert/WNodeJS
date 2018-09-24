import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  private session = this.navParams.get('session');
  private item;

  ionViewDidLoad() {
    if(this.navParams.get('item') !== null && this.navParams.get('item') !== undefined){
      this.item = this.navParams.get('item');
    }

    console.log(document.getElementById("desc"));
  }

  private sendProduct(item){

  }

}
