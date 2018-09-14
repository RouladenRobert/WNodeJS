import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Constants} from '../../Constants/constants';
import {Session} from '../../interfaces/interfaces';

/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestsProvider {

  constructor(public http: HttpClient, private consts : Constants) {
    console.log('Hello RequestsProvider Provider');
  }

  //execute https-request for login
  //email: String {Email-address from login-form/login.ts}
  //pass: String {Password from login-form/login.ts}
  //no return
  public login(email: string, pass: string){
    return this.http.post(this.consts.url + "login", {
      email: email,
      pass: pass
    });
  }

  public register(user : any){
    return this.http.post(this.consts.url + "register", {
      user : user
    });
  }

  public setPassword(session? : Session, mail?){
    return this.http.post(this.consts.url+"setPw", {session : session, mail : mail});
  }
}
