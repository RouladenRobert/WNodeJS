import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage} from '../login/login';

/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
    this.viewCtrl.showBackButton(false);
  }

  private goToLogin(){
    this.navCtrl.push(LoginPage);
  }

}
