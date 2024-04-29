import { ListinoworkInterface } from '../interfaces/listinowork';

export class Listinowork implements ListinoworkInterface {

  id: number;
  datalistino: string;
  descrizione: string;
  stato: number;
  nprodx: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.datalistino = '';
    this.descrizione = '';
    this.stato = 0;
    this.nprodx = 0;
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();

  }
}
