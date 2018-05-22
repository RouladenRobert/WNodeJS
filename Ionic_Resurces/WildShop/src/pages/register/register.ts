import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from '../../interfaces/interfaces';
import {RequestProvider} from '../../providers/request/request';
import {LoginPage} from '../login/login';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv: RequestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  private registerUser(){
    //build User-Object here
    //this.reqProv.sendUserData(userObj).subscribe(...);
  }

  private back(){
    this.navCtrl.push(LoginPage);
  }

}
