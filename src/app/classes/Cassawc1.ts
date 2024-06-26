import { Cassawc1Interface } from '../interfaces/cassawc1';

export class Cassawc1 implements Cassawc1Interface {

  idCommanda: number;
  i100: number;
  i100Valore: number;
  i050: number;
  i050Valore: number;
  i020: number;
  i020Valore: number;
  i010: number;
  i010Valore: number;
  i005: number;
  i005Valore: number;
  icontante: number;
  r100: number;
  r100Valore: number;
  r050: number;
  r050Valore: number;
  r020: number;
  r020Valore: number;
  r010: number;
  r010Valore: number;
  r005: number;
  r005Valore: number;
  rcontante: number;
  totaleResto: number;
  key_utenti_operation: number;
  created_at:	Date;
  updated_at:	Date;


  constructor() {

    this.idCommanda = 0;
    this.i100 =  0;
    this.i100Valore =  0;
    this.i050 =  0;
    this.i050Valore =  0;
    this.i020 =  0;
    this.i020Valore =  0;
    this.i010 =  0;
    this.i010Valore =  0;
    this.i005 =  0;
    this.i005Valore =  0;
    this.icontante =  0;
    this.r100 =  0;
    this.r100Valore =  0;
    this.r050 =  0;
    this.r050Valore =  0;
    this.r020 =  0;
    this.r020Valore =  0;
    this.r010 =  0;
    this.r010Valore =  0;
    this.r005 =  0;
    this.r005Valore =  0;
    this.rcontante =  0;
    this.totaleResto = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}






