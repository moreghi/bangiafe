/* interfaccia tabella comunicatofiles  */


export interface ComunicatofileInterface {

  id: number;
  idComm: number;
  folder: string;
  namefile: string;
  estensione: string;
  tipo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
