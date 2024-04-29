/* interfaccia tabella Volontarioi  */

export interface VolontarioInterface {

  id: number;
  stato: number;
  cognome: string;
  nome: string;
  email: string;
  cellulare: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}



