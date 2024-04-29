import { VolontarioInterface } from '../interfaces/volontario';

export class Volontario implements VolontarioInterface {

  id: number;
  stato: number;
  cognome: string;
  nome: string;
  email: string;
  cellulare: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {

      this.id = 0;
      this.cognome = '';
      this.nome = '';
      this.stato = 0;
      this.email = '';
      this.cellulare = '';
      this.key_utenti_operation = 0;
      this.created_at = new Date();
      this.updated_at = new Date();

  }


}
















