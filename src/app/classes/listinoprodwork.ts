import { ListinoprodworkInterface } from './../interfaces/listinoprodwork';

export class Listinoprodwork implements ListinoprodworkInterface {

  id: number;
  idlistino: number;
  stato: number;
  amenu: string;
  idprodotto: number;
  descrizione: string;
  tipologia: number;
  categoria: number;
  competenza: number;
  qta: number;
  prezzo: number;
  pz: number;
  photo: string;
  qtadisp: number;
  smin: number;
  qtavend: number;
  qtapren: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor() {
    this.id = 0;
    this.idlistino = 0;
    this.stato = 0;
    this.amenu = 'N';
    this.idprodotto = 0;
    this.descrizione = '';
    this.tipologia = 0;
    this.categoria = 0;
    this.competenza = 0;
    this.qta = 0;
    this.prezzo = 0;
    this.pz = 0;
    this.photo = '';
    this.qtadisp = 0;
    this.smin = 0;
    this.qtavend = 0;
    this.qtapren = 0;
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();

  }
}










