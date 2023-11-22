import { PrenotazeventomasterConfirmInterface } from '../interfaces/prenotaeventomasterConfirm';

export class PrenotazeventomasterConfirm implements PrenotazeventomasterConfirmInterface {

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

  constructor() {

    this.id = 0;
    this.cognome = '';
    this.nome = '';
    this.email = '';
    this.telefono = '';
    this.idEvento = 0;
    this.devento = '';
    this.descEvento = '';
    this.localita = '';
    this.indirizzo = '';
    this.dataEvento = '';
    this.oraEvento = '';
    this.iban = '';
    this.importo = 0;
    this.idlogistica = 0;
    this.idsettore = 0;
    this.idfila = 0;
    this.idposto = 0;
    this.idtipobiglietto = 0;
    this.datapren = '';
    this.keyuserpren = '';
    this.token = '';
    this.codpren = '';
    this.created_at = new Date();
    this.updated_at = new Date();

}



}
