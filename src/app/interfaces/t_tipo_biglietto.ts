/* interfaccia tabella t_tipo_bigliettos  */

export interface TtipobigliettoInterface  {

  id: number;
  d_tipo: string;
  prezzoUnico: string;
  stato: number;
  idevento: number;
  importo: number;
  ntot: number;
  npren: number;
  nemessi: number;
  ultimoemesso: number;
  serie: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;
  // relazioni
  d_stato_tipo_biglietto: string;

}


