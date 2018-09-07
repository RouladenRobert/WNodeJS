import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FunctionPoolProvider} from '../../providers/function-pool/function-pool';

/**
 * Generated class for the InformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private fctPool : FunctionPoolProvider) {
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
  }

  //private logout(){
    //this.fctPool.logout();
  //}

}
