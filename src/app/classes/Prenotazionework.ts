import { PrenotazioneworkInterface } from './../interfaces/prenotazionework';

export class Prenotazionework implements PrenotazioneworkInterface {

  id: number;
  cognome: string;
  nome: string;
  telefono: string;
  idgiornata: number;
  datapren: string;
  persone: number;
  email: string;
  created_at: Date;
  update_at: Date;

  constructor() {

    this.id = 0;
    this.cognome = '';
    this.nome = '';
    this.telefono = '';
    this.idgiornata = 0;
    this.datapren = '';
    this.persone = 0;
    this.email = '';
    this.created_at = new Date();
    this.update_at = new Date();

  }
}
