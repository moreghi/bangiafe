/*  interfaccia per prenotazionework  */


export interface PrenotazioneworkInterface  {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  idgiornata: number,
  datapren: string;
  persone: number;
  email: string;
  created_at: Date;
  update_at: Date;

 }
