import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from '../../interfaces/interfaces';
import {RequestProvider} from '../../providers/request/request';
import {LoginPage} from '../login/login';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private reqProv: RequestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  private register(){
    console.log("Register: ", this.surname, this.name);
    this.reqProv.register({ email: this.email, surname: this.surname, name: this.name, pass: this.password }).subscribe( res =>{
      console.log(res);
    });
  }

  private back(){
    this.navCtrl.push(LoginPage);
  }

  private hideButton(){
    var elements = document.getElementsByClassName("pass");
    if (this.email != "" && this.surname != "" && this.name != "" && this.password != ""){
      if(this.password != this.repassword){
        <HTMLElement> elements[0].style.backgroundColor = this.red;
        <HTMLElement> elements[1].style.backgroundColor = this.red;
        (<HTMLInputElement> document.getElementById("registerButton")).disabled = true;
      }else{
        <HTMLElement> elements[0].style.backgroundColor = this.green;
        <HTMLElement> elements[1].style.backgroundColor = this.green;
        (<HTMLInputElement> document.getElementById("registerButton")).disabled = false;
      }
    }
  }

}
