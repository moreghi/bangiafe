import { ListinoInterface } from './../interfaces/listino';

export class Listino implements ListinoInterface {

  id: number;
  descrizione: string;
  stato: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.descrizione = '';
    this.stato = 0;
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();
   
  }
}






