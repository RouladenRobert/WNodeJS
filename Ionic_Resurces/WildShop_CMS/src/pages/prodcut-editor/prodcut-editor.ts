import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProdcutEditorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prodcut-editor',
  templateUrl: 'prodcut-editor.html',
})
export class ProdcutEditorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  private session = this.navParams.get('session');
  private item = this.navParams.get('item');

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdcutEditorPage');
  }

  private sendChanges(item){
    //must be implemented in backend first
  }

}
