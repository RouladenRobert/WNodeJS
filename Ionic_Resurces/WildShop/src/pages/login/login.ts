import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage }from '../home/home';
import { RegisterPage } from '../register/register';
import {User} from '../../interfaces/interfaces';
import {Session} from '../../interfaces/interfaces';
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
  private email : string = "";
  private password : string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv: RequestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private login(){
    console.log(this.email);
    this.reqProv.login(this.email, this.password).subscribe((session : Session) =>{
        console.log(session);
        this.navCtrl.push(HomePage, {session : session});
    });

  }

  private register(){
    this.navCtrl.push(RegisterPage);
  }

  private hideButton(){
    if (this.email == "" || this.password == ""){
      (<HTMLInputElement> document.getElementById("loginButton")).disabled = true;
    }else{
      (<HTMLInputElement> document.getElementById("loginButton")).disabled = false;
    }
  }

}
