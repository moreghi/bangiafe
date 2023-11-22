/*  interfaccia per prenotazione  */


export interface PrenotazioneInterface  {

  id: number;
  cognome: string;
  nome: string;
  token: string;
  telefono: string;
  idevento: number,
  datapren: string;
  dataconf: string;
  persone: number;
  email: string;
  idstato: number;
  created_at: Date;
  update_at: Date;
   // tabella correlata
  d_stato_prenotazione: string;
 }


