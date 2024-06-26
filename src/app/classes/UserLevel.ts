
import { userlevelInterface } from '../interfaces/userlevel';


export class Userlevel implements userlevelInterface {

  id: number;
  userLevelName: string;
  key_utenti_operation: number;
  created_at: Date;
  updated_at: Date;

  constructor()  {
    this.id = 0;
    this.userLevelName = '';
    this.key_utenti_operation = 0;
    this.created_at = new Date();
    this.updated_at = new Date();
  }


}
