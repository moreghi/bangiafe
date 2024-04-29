import { ComunicatofileInterface } from '../interfaces/comunicatofile';

export class ComunicatoFile implements ComunicatofileInterface {

  id: number;
  idComm: number;
  folder: string;
  namefile: string;
  estensione: string;
  tipo: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;


  constructor() {
    this.id = 0;
    this.idComm = 0;
    this.folder = '';
    this.namefile = '';
    this.estensione = '';
    this.tipo = '';
    this.key_utenti_operation = 0;
    this.created_at  = new Date();
    this.updated_at = new Date();

  }
}






































export interface ComunicatodfileInterface {

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
