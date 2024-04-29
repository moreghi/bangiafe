import { Injectable } from '@angular/core';
import { Prenotazioneprodwork } from '../classes/Prenotazioneprodwork';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneprodworkService {

  public prenotazioneprodwork: Prenotazioneprodwork;


  private rotta = "/prenotazioneprodwork";
  private rottafunction = '';

  // vecchia versione senza environment
  //  private APIURL = 'http://localhost:8000/users';  // definisco l'url su cui effettuare la lettura sul server

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server
  private APIURLSEARCH = '';

     constructor(private http: HttpClient, private auth: AuthService) { }


  // attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato

  getAuthHeader(): HttpHeaders   {
    // passo il token dentro a header per non farlo passare in chiaro su url
    const headers = new HttpHeaders(
        {
            Authorization: 'Bearer ' +  this.auth.getToken()
        }
      );
      return headers;
      }


    getAll() {

      // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

    // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

        // primo metodo passando il token in chiaro su url
        //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

        // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
         return this.http.get(this.APIURL,  {
          headers: this.getAuthHeader()
        });      // ok      // ok
     }

        getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });      // ok
        }

        delete(prenotazioneprodwork: Prenotazioneprodwork) {

          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazioneprodwork.id,  {
            headers: this.getAuthHeader()
          });      // ok

        }

    update(prenotazioneprodwork: Prenotazioneprodwork) {

      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  prenotazioneprodwork.id, prenotazioneprodwork,  {
        headers: this.getAuthHeader()
      });      // ok
    }


     create(prenotazioneprodwork: Prenotazioneprodwork){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazioneprodwork,  {
         headers: this.getAuthHeader()
      });      // ok
    }


}
