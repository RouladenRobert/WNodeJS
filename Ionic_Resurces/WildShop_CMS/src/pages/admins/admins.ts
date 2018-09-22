import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RequestsProvider} from '../../providers/requests/requests';

/**
 * Generated class for the AdminsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admins',
  templateUrl: 'admins.html',
})
export class AdminsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv : RequestsProvider) {
  }

  private session = this.navParams.get('session');
  private userList;

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminsPage');
    this.loadUsers();
  }

  private loadUsers(){
    this.reqProv.getAdminUsers(this.session).subscribe(res => {
        this.userList = res;
    }, err => {
        console.log(err);
    });
  }

}
