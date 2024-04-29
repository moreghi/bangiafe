/*  interfaccia per listino prodotti */


export interface ListinoprodInterface {

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
  photo: string;
  qtadisp: number;
  smin: number;
  qtavend: number;
  qtapren: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
