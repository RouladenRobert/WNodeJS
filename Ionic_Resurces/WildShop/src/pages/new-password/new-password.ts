import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestProvider} from '../../providers/request/request';
import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';
import {AlertController} from 'ionic-angular';

/**
 * Generated class for the NewPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-password',
  templateUrl: 'new-password.html',
})
export class NewPasswordPage {
  private old_pw : string = "";
  private new_pw1 : string = "";
  private new_pw2 : string = "";
  private email = "";
  private isSignedIn = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider, private alertCtl : AlertController) {
  }
   private session = this.navParams.get('session');
  ionViewDidLoad() {
    if(this.session !== null){
      this.isSignedIn = true;
    }
    console.log(this.isSignedIn);
  }

  private hideButton(){
    if ((this.old_pw != "" && this.new_pw1 != "" && this.new_pw2 != "") && this.isSignedIn){
      (<HTMLInputElement> document.getElementById("changePW")).disabled = false;
    }else if(!this.isSignedIn && this.email != "") {
      (<HTMLInputElement> document.getElementById("changePW")).disabled = false;
    }
  }

  private changePassword(){
    if(this.session !== null){
      if(!this.checkPasswords()){
        let alert = this.alertCtl.create({
          title : "Die eingegeben Passwörter stimmen nicht überein.",
          buttons : ['OK']
        });
        alert.present();
        return;
      }

      // senden mit session
      this.session.old_password = this.old_pw;
      this.session.password = this.new_pw2;
      this.reqProv.setPassword(this.session, undefined).subscribe(data => {
        this.session.old_password = undefined;
        this.session.password = undefined;
        this.navCtrl.push(HomePage, {session : this.session});
        return;
      }, err =>{
        console.log("Error while changing password");
      });
    }
    else{
      // senden mit Mail
      this.reqProv.setPassword(null, this.email).subscribe(data =>{
      this.navCtrl.push(LoginPage);
      return;
    }, err =>{
      console.log("Error while changing password");
    });
    }
  }

  private checkPasswords(){
    if(this.new_pw1 === this.new_pw2){
      return true;
    }
    return false;
  }
}
