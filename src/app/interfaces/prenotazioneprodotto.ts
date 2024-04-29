/*  interfaccia per prenotazione prodotto */


export interface PrenotazioneprodottoInterface {

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

}
