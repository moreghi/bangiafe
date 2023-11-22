/*  interfaccia per prenotazeventomaster_Confirm  */


export interface PrenotazeventomasterConfirmInterface  {


  id: number;
  cognome: string;
  nome: string;
  email: string;
  telefono: string;
  idEvento: number;
  devento: string;
  descEvento: string;
  localita: string;
  indirizzo: string;
  dataEvento: string;
  oraEvento: string;
  iban: string;
  importo: number;
  idlogistica: number;
  idsettore: number;
  idfila: number;
  idposto: number;
  idtipobiglietto: number;
  datapren: string;
  keyuserpren: string;
  token: string;
  codpren: string;
  created_at: Date;
  updated_at: Date;
}
