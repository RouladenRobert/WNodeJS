//define an product interface
//every request that returns a Product or a list of products should use this interface
export interface Product{
  name : string;
  price: number;
  stock: number;
  weight: number;
  pid : number;
  description?:string;

}

export interface User{
  userName : string;
  userID : number;

}

export interface Session{
  sessionID : string;
  sessionStart : string; //Zeitpunkt, zu dem Session gestartet wurde -> läuft irgendwann aus

}

export interface Order{
  userID : number,
  prodID : number,
  amount : number,
  comment? : string
}
