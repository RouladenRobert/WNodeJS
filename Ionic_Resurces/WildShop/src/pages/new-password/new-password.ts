import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestProvider} from '../../providers/request';

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
  private session = null;
  private email = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider) {
  }
  this.session = this.navParams('session');
  ionViewDidLoad() {
    if(this.session !== null){
      (<HTMLInputElement> document.getElementById("email").outerHTML = "";);
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
    if(this.session !== null){
      // senden mit session
      this.session.password = this.new_pw1;
      this.reqProv.setPassword(this.session, null, null);
    }
    else{
      // senden mit Mail
      this.reqProv.setPassword(null, this.email, this.new_pw1);
    }
  }
}
