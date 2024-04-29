import { PrenotazioneprodInterface } from '../interfaces/prenotazioneprod';

export class Prenotazioneprod implements PrenotazioneprodInterface {

  id: number;
  stato: number;
  idProdotto: number;
  descrizione: string;
  tipologia: number;
  categoria: number;
  competenza: number;
  qta: number;
  prezzo: number;
  photo: string;
  idprenot: number;
  key_utenti_operation: number;
  created_at: Date;
  update_at: Date;

  constructor() {

    this.id = 0;
    this.stato = 0;
    this.idProdotto = 0;
    this.descrizione = '';
    this.tipologia = 0;
    this.categoria = 0;
    this.competenza = 0;
    this.qta = 0;
    this.prezzo = 0;
    this.photo = '';
    this.idprenot = 0;
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.update_at = new Date();

  }
}

