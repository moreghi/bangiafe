import { CassasinteticaInterface } from './../interfaces/cassasintetica';

export class Cassasintetica implements CassasinteticaInterface {

  id: number;
  idGiornata: number;
  dataCassa: string;
  cassaInziale: number;
  cassaAttuale: number;
  cassaFinale: number;
  differenza: number;
  key_utenti_operation: number;
  created_at:	Date;
  updated_at:	Date;


  constructor() {
    this.id = 0;
    this.idGiornata = 0;
    this.dataCassa = '';
    this.cassaInziale = 0;
    this.cassaAttuale = 0;
    this.cassaFinale = 0;
    this.differenza = 0;
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();

  }
}


