/* interfaccia tabella Cassa  */

export interface CassaInterface {

  id: number;
  idEvento: number;
  datacassa: string;
  contanti: number;
  pos: number;
  carteCredito: number;
  bonifici: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}

