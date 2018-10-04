import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Constants} from '../../Constants/constants';
import {Session} from '../../interfaces/interfaces';
import {Product} from '../../interfaces/interfaces';

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

  public logout(session : Session){
    return this.http.post(this.consts.url+"logout", {session : session});
  }

  public setPassword(session? : Session, mail?){
    return this.http.post(this.consts.url+"setPw", {session : session, mail : mail});
  }

  public getOrderList(session : Session){
    return this.http.post(this.consts.url + "orderList", {session : session});
  }

  public getOrderDetails(session : Session, orderID : String){
    return this.http.post(this.consts.url + "orderDetails", {session : session, orderID : orderID});
  }

  public finishOrder(session : Session, orderID){
    return this.http.post(this.consts.url+"finishOrder", {session : session, orderID : orderID});
  }

  public deleteOrder(session : Session, orderID){
    return this.http.post(this.consts.url+"deleteOrder", {session : session, orderID : orderID});
  }

  public getAdminUsers(session : Session){
    return this.http.post(this.consts.url+"userList", {session : session});
  }

  public getProducts(session : Session, limit?){
    return this.http.post(this.consts.url+"prodList", {session : session, limit : limit});
  }

  public getProductPool(session : Session){
    return this.http.post(this.consts.url+"prodPool", {session : session});
  }

  public getPreOrderList(session : Session){
    return this.http.post(this.consts.url+"preOrderList", {session : session});
  }

  public pushToProducts(session : Session, pid : number, prod : Product){
    return this.http.post(this.consts.url+"pushProd", {session : session, pid : pid, prodObj : prod});
  }

  public pushToProductPool(session : Session, pid : number){
    return this.http.post(this.consts.url+"pushPool", {session : session, pid : pid});
  }

  public getPreOrderDetails(session : Session, preOrderID){
    return this.http.post(this.consts.url+"preOrderDetails", {session : session, preOrderID : preOrderID});
  }

  public deletePreOrder(session : Session, preOrderID){
    return this.http.post(this.consts.url+"deletePreOrder", {session : session, preOrderID : preOrderID});
  }

  public deleteProduct(session : Session, productID){
    return this.http.post(this.consts.url+"deleteProduct", {session : session, prodID : productID});
  }

  public addProduct(session : Session, product : Product){
    return this.http.post(this.consts.url+"addProduct", {session : session, product : product});
  }

  public updateProduct(session : Session, product : Product){
    return this.http.post(this.consts.url+"updateProduct", {session : session, product : product});
  }

  public searchOrder(session : Session, searchString){
    return this.http.post(this.consts.url+"searchOrder", {session : session, searchString : searchString});
  }
}
