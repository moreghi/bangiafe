import { W_GiornateInterface } from './../interfaces/w_giornate';


export class W_Giornate implements W_GiornateInterface {

  id: number;
  datadelGiorno: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.datadelGiorno = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}










