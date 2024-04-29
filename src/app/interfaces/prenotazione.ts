/*  interfaccia per prenotazione  */


export interface PrenotazioneInterface  {

  id: number;
  idstato: number;
  tipo: string;
  idgiornata: number,
  datagiornata: string;
  cognome: string;
  nome: string;
  telefono: string;
  email: string;
  persone: number;
  datapren: string;
  dataconf: string;
  token: string;
  key_utenti_operation: number;
  created_at: Date;
  update_at: Date;
   // tabella correlata
  d_stato_prenotazione: string;
 }


