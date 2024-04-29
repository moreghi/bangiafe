import { ComunicatodettInterface } from '../interfaces/comunicatodett';

export class ComunicatoDett implements ComunicatodettInterface {

  id: number;
  idComm: number;
  desccomun: string;
  testo: string;
  folder: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.idComm = 0;
    this.desccomun = '';
    this.testo = '';
    this.folder = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}

































