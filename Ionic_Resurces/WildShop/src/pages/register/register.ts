import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from '../../interfaces/interfaces';
import {RequestProvider} from '../../providers/request/request';
import {LoginPage} from '../login/login';
import {Session} from '../../interfaces/interfaces';
import {HomePage} from '../home/home';
import {AlertController} from 'ionic-angular';
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
  private email: string = "";
  private surname: string = "";
  private name: string = "";
  private password: string = "";
  private repassword: string = "";
  private red = "#ff6868";
  private green = "#4fd15e";

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv: RequestProvider, private alertCtl : AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  private register(){
    console.log("Register: ", this.surname, this.name);
    this.reqProv.register({ email: this.email, surname: this.surname, name: this.name, pass: this.password }).subscribe( (res : Session) =>{
      this.navCtrl.push(HomePage, {session : res});
      console.log(res);
    }, err => {
      if(err.status === 403){
        let alert = this.alertCtl.create({
          title : "User with this email already exists.",
          buttons : ['OK']
        });
        alert.present();
      }
      else{
        let alert = this.alertCtl.create({
          title : "Sorry, something went wrong. Please try it again later.",
          buttons : ['OK']
        });
        alert.present();
      }
    });
  }

  private back(){
    this.navCtrl.push(LoginPage);
  }

  private hideButton(){
    var elements = document.getElementsByClassName("pass");
    if (this.email != "" && this.surname != "" && this.name != "" && this.password != ""){
      if(this.password != this.repassword){
        (<HTMLElement> document.querySelector('.pass')).style.backgroundColor = this.red;
        (<HTMLInputElement> document.getElementById("registerButton")).disabled = true;
      }else{
        (<HTMLElement> document.querySelector('.pass')).style.backgroundColor = this.green;
        (<HTMLInputElement> document.getElementById("registerButton")).disabled = false;
      }
    }
  }

}
