import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Subscription} from "rxjs/Subscription";
import {Product} from '../../interfaces/interfaces';
import {User} from '../../interfaces/interfaces';
import {Session} from '../../interfaces/interfaces';
import {Constants} from '../../constants/constants';

/*
  Generated class for the RequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestProvider {

  constructor(public http: HttpClient, private consts: Constants) {
  }

  //execute https-request to fetch all products
  //returns an array of Product-objects
  public getProducts(session: string) : Observable<Array<Product>>{
    return this.http.post<Array<Product>>(this.consts.url+"shop", {session : session});
  }

  // execute https-request to fetch the product Description
  // prID: product ID
  // return: Porduct-Object
  public getDescription(prID: number, session: string) : Observable<Product>{
    return this.http.post<Product>(this.consts.url+"product", {
      prodID : prID,
      session : session
    });
  }

  // method-prototype to send user data to server
  // user: User-Object that was created by the Login or Register page
  // return: Observable
  public sendUserData(user : User) : Observable<User>{
    return this.http.post<User>(this.consts.url+"user", {
      userObj : user
    });
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

  public register(user: any){
    return this.http.post(this.consts.url + "register", {
      user: user
    });
  }

  public sendOrder(session : {}){
    return this.http.post(this.consts.url + "order", {
      proudcts : session.productArr,
      session : session
    });
  }

  public logout(session : {}){
    return this.http.post(this.consts.url+"logout", {
      session : session
    });
  }
}
