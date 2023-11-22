/* interfaccia tabella register_confirmed  */

export interface RegisterconfirmedInterface {

  id: number;
  cognome: string;
  nome: string;
  email: string;
  username: string;
  password: string;
  token: string;
  created_at: Date;
  updated_at: Date;

}
