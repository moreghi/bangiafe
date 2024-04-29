import { PrenotazioneprodottoInterface } from './../interfaces/prenotazioneprodotto';

export class Prenotazioneprodotto implements PrenotazioneprodottoInterface {

  id: number;
  stato: number;
  idprenot: number;
  idprodotto: number;
  descrizione: string;
  tipologia: number;
  categoria: number;
  competenza: number;
  qta: number;
  prezzo: number;
  photo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.stato = 0;
    this.idprenot = 0;
    this.idprodotto = 0;
    this.descrizione = '';
    this.tipologia = 0;
    this.categoria = 0;
    this.competenza = 0;
    this.qta = 0;
    this.prezzo = 0;
    this.photo = '';
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}



















