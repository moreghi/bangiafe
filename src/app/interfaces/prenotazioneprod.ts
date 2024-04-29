/*  interfaccia per prenotazioneprod  */


export interface PrenotazioneprodInterface  {

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

 }

