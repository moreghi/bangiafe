import { PrenotazioneInterface } from './../interfaces/prenotazione';

export class Prenotazione implements PrenotazioneInterface {

  id: number;
  idstato: number;
  tipo: string;
  idgiornata: number;
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

  constructor() {

    this.id = 0;
    this.idstato = 0;
    this.tipo = 'N';
    this.idgiornata = 0;
    this.datagiornata = '';
    this.cognome = '';
    this.nome = '';
    this.telefono = '';
    this.email = '';
    this.persone = 0;
    this.datapren = '';
    this.dataconf = '';
    this.token = '';
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.update_at = new Date();
     // tabella correlata
    this.d_stato_prenotazione = '';

  }
}
