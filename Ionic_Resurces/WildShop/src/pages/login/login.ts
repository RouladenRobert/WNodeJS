import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage }from '../home/home';
import { RegisterPage } from '../register/register';
import { NewPasswordPage } from '../new-password/new-password';
import {User} from '../../interfaces/interfaces';
import {Session} from '../../interfaces/interfaces';
import {RequestProvider} from '../../providers/request/request';
import {AlertController} from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv: RequestProvider, private alertCtl : AlertController) {
    console.log(this.email.length > 0 && this.password.length > 0);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private login(){
    this.reqProv.login(this.email, this.password).subscribe((session : Session) =>{
      console.log(session);
        this.navCtrl.push(HomePage, {session : session});
    }, error => {
      if(error.status === 500){
        let alert = this.alertCtl.create({
          title : 'Eroor while logging in...',
          buttons : ['OK']
        });
        alert.present();
        return;
      }
      console.log(error);
        let alert = this.alertCtl.create({
          title : error.error.msg,
          buttons : ['OK']
        });
        alert.present();
    });
  }

  private register(){
    this.navCtrl.push(RegisterPage);
  }

  private forgotPassword(){
    this.navCtrl.push(NewPasswordPage, {session : null});
  }

}
