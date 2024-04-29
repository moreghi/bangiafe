/*  interfaccia per persona  */


export interface PersonaInterface {

  id: number;
  idGiornata: number;
  cognome: string;
  nome: string;
  idStato: number;
  email: string;
  cellulare: string;
  idRuolo: number;
  dRuolo: string;
  inServizio: string;
  utilizzatoCommanda: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

