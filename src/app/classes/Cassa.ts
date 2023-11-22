import { CassaInterface } from '../interfaces/cassa';

export class Cassa implements CassaInterface {

  id: number;
  idEvento: number;
  datacassa: string;
  contanti: number;
  pos: number;
  carteCredito: number;
  bonifici: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.idEvento = 0;
    this.datacassa = '';
    this.contanti = 0;
    this.pos = 0;
    this.carteCredito = 0;
    this.bonifici = 0;
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}

