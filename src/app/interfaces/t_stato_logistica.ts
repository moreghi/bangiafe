/* interfaccia tabella t_stato_logisticas  */

export interface TstatologisticaInterface  {

  id: number;
  d_stato_logistica: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

}
