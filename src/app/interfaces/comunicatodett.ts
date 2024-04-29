/* interfaccia tabella comunicatodetts  */


export interface ComunicatodettInterface {

  id: number;
  idComm: number;
  desccomun: string;
  testo: string;
  folder: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
