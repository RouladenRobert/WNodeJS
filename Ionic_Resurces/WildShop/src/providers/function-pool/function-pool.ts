import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {RequestProvider} from '../request/request';
import {Session} from '../../interfaces/interfaces';

/*
  Generated class for the FunctionPoolProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FunctionPoolProvider {

  constructor(public http: HttpClient, private reqProv : RequestProvider) {
  }

  public logout(session:  Session, navCtrl, page){
    this.reqProv.logout(session).subscribe((data) => {
      console.log(data);
    }, err =>{
      if(err.status === 401){
        this.reqProv.logoutWithoutSession(navCtrl);
        return;
      }
      console.log(err);
    });
    navCtrl.push(page);
  }

  public goToConfirmation(session : Session, navCtrl, page){
    navCtrl.push(page, {session : session});
  }
}
