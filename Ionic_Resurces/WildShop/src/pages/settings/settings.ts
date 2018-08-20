import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestProvider} from '../../providers/request/request';
import {Session} from '../../interfaces/interfaces';
import {LogoutPage} from '../logout/logout';
import {AlertController} from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestProvider, private alertCtl : AlertController) {
  }
  private session = this.navParams.get('session');
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  private deleteUser(){
    this.reqProv.deleteUser(this.session).subscribe(data => {
      return;
    }, err => {
      let alert = this.alertCtl.create({
        title : "Something went wrong while deleting your account. Please try it again.",
        buttons : ['OK']
      });
      alert.present();
    });
    this.navCtrl.push(LogoutPage);
  }

}
