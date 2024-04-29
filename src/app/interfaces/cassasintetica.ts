/*  interfaccia della tabella cassasinteticas  */

export interface CassasinteticaInterface {
  id: number;
  idGiornata: number;
  dataCassa: string;
  cassaInziale: number;
  cassaAttuale: number;
  cassaFinale: number;
  differenza: number;
  key_utenti_operation: number;
  created_at:	Date;
  updated_at:	Date;

}
