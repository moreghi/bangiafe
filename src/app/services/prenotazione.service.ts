import { Injectable } from '@angular/core';
import { Prenotazione } from '../classes/Prenotazione';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {

  private rotta = "/prenotazione";
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
          authorization: 'Bearer ' + this.auth.getToken()
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
            });
        }

    getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });      // ok
        }

    delete(prenotazione: Prenotazione) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazione.id,  {
            headers: this.getAuthHeader()
          });      // ok
        }

    update(prenotazione: Prenotazione) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' +  prenotazione.id, prenotazione,  {
        headers: this.getAuthHeader()
      });      // ok

    }

     create(prenotazione: Prenotazione){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazione,  {
         headers: this.getAuthHeader()
      });      // ok
    }

  getbystato(stato: number) {
      this.rottafunction = 'stato';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + stato,  {
       headers: this.getAuthHeader()
     });      // ok      // ok
}

getbyevento(evento: number) {
  this.rottafunction = 'pren/Prenotazionibyevento';
     return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + evento,  {
   headers: this.getAuthHeader()
 });      // ok      // ok
}

getbyeventoestato(evento: number, stato: number) {
  this.rottafunction = 'pren/Prenotazionibyeventoestato';
     return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + evento + '/' + stato,  {
   headers: this.getAuthHeader()
 });      // ok      // ok
}




getbyemail(email: string) {
  this.rottafunction = 'email';
  return this.http.get(this.APIURL + "/" + this.rottafunction + "/'" + email + "'",  {
   headers: this.getAuthHeader()
   });
}

getCountbyevento(id: number) {

  this.rottafunction = '/count';
  return this.http.get(this.APIURL + this.rottafunction + '/' + id);
  }

  getdaEvaderebyday(id: number) {

    this.rottafunction = '/count';

    alert('prenotazioneService -- metodo < getdaEvaderebyday > momentaneamente sospeso ')
/*

    this.APIURLSEARCH = this.APIURL + this.rottadaevaderebyday;
    console.log('--------- APIURL -------------------------------   prenotazioneService - prenbyday: ' + this.APIURL);
    console.log('-----------------------------------------   prenotazioneService - prenbyday: ' + this.APIURLSEARCH);
    return this.http.get(this.APIURLSEARCH + '/' + id);      // ok      // ok
    */
    }

sendConfermaPrenotazione(prenotazione: Prenotazione){
  this.rottafunction = 'sendConferma';
  return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazione);
    }

    getgiornateConf(id: number) {

      this.rottafunction = '/giornate';
      return this.http.get(this.APIURL + this.rottafunction + '/' + id);

      }

      getbydataconf(dataconf: string) {
        this.rottafunction = 'pren/getPrenotazionibydataconf';
        return this.http.get(this.APIURL + "/" + this.rottafunction + "/" + dataconf,  {
         headers: this.getAuthHeader()
         });
      }

}








