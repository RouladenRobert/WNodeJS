import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage }from '../home/home';
import { RegisterPage } from '../register/register';
import {User} from '../../interfaces/interfaces';
import {RequestProvider} from '../../providers/request/request';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private username : string;
  private password : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv: RequestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private login(){
    console.log(this.username);
    if((this.username == null || this.username == '')||(this.password ==  null || this.password == '')){
      alert("Bitte Daten eingeben!");
      return;
    }
    //request senden und Ergebnis prüfen, bei Erfolgsmeldung weiterleiten auf HomePage
    //this.reqProv.sendUserData(userObj).subscribe(...);
    this.navCtrl.push(HomePage);
  }

  private register(){
    this.navCtrl.push(RegisterPage);
  }

}
