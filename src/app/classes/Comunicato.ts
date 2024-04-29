import { ComunicatoInterface } from '../interfaces/comunicato';

export class Comunicato implements ComunicatoInterface {

  id: number;
  titolo: string;
  anno: number;
  stato: number;
  dataComunic: string;
  folder: string;
  ndett: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.titolo = '';
    this.anno = 0;
    this.stato = 0;
    this.dataComunic = '';
    this.folder = '';
    this.ndett = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}
























