import { PersonaInterface } from './../interfaces/persona';

export class Persona implements PersonaInterface {

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

  constructor() {

    this.id = 0;
    this.idGiornata = 0;
    this.cognome = '';
    this.nome = '';
    this.idStato = 0;
    this.email = '';
    this.cellulare = '';
    this.idRuolo = 0;
    this.dRuolo = '';
    this.inServizio = 'N';
    this.utilizzatoCommanda = 'N';
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();

  }
}








