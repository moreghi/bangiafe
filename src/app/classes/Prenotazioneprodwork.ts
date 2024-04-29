import { PrenotazioneprodworkInterface } from './../interfaces/prenotazioneprodwork';

export class Prenotazioneprodwork implements PrenotazioneprodworkInterface {

  id: number;
  idPrenotazione: number;
  idProdotto: number;
  qta: number;
  created_at: Date;
  update_at: Date;

  constructor() {

    this.id = 0;
    this.idPrenotazione = 0;
    this.idProdotto = 0;
    this.qta = 0;
    this.created_at = new Date();
    this.update_at = new Date();

  }
}
