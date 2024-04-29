/* interfaccia tabella comunicatos  */

export interface ComunicatoInterface {

  id: number;
  titolo: string;
  anno: number;
  stato: number;
  dataComunic: string;
  folder: string;
  ndett: number;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
