import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestProvider} from '../../providers/request/request';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider) {
  }
   private session = this.navParams.get('session');
  ionViewDidLoad() {
    if(this.session !== null){
      (<HTMLInputElement> document.getElementById("email")).outerHTML = "";
    }
    else{
      (<HTMLInputElement> document.getElementById("changePW")).disabled = false;
      (<HTMLInputElement> document.getElementById("old_pw")).outerHTML = "";
      (<HTMLInputElement> document.getElementById("new_pw1")).outerHTML = "";
      (<HTMLInputElement> document.getElementById("new_pw2")).outerHTML = "";
    }
    console.log('ionViewDidLoad NewPasswordPage');
  }

  private hideButton(){
    if (this.old_pw == "" || this.new_pw1 == "" || this.new_pw2 == ""){
      (<HTMLInputElement> document.getElementById("changePW")).disabled = true;
    }else{
      (<HTMLInputElement> document.getElementById("changePW")).disabled = false;
    }
  }

  private changePassword(){
    console.log(this.session);
    if(this.session !== null){
      // senden mit session
      this.session.old_password = this.old_pw;
      this.session.password = this.new_pw2;
      this.reqProv.setPassword(this.session, null).subscribe(data => {
        return;
      }, err =>{
        console.log("Error while changing password");
      });
    }
    else{
      // senden mit Mail
      this.reqProv.setPassword(null, this.email).subscribe(data =>{
      return;
    }, err =>{
      console.log("Error while changing password");
    });
    }
  }
}
