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

    getAldaEvadere() {

      this.rottafunction = 'pren/getPrenotazionidaEvadere/';
      return this.http.get(this.APIURL + '/' + this.rottafunction,  {
          headers: this.getAuthHeader()
        });      // ok      // ok
    }

    getAlldaEvaderebyday(id: number) {

      this.rottafunction = 'pren/prenotazionibyday';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id,  {
         headers: this.getAuthHeader()
     });      // ok      // ok
 }

   getAllbystato(idday: number, id: number) {
    this.rottafunction = 'pren/getPrenotazionibyStato';
    return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idday + '/' + id,  {
   headers: this.getAuthHeader()
 });      // ok      // ok
}


getAllbyemail(email: string) {

  this.rottafunction = 'pren/getPrenotazionibyemail';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + email,  {
   headers: this.getAuthHeader()
 });      // ok      // ok
}


// invio email dopo conferma definitiva prenotazione
sendemailPrenotazioneConfermataMoreno(prenotazione: Prenotazione) {

  console.log('frontend - prenotazioneConfirm.service - sendemailPrenotazioneConfermataMoreno ------  :  ' + JSON.stringify(prenotazione));

  return this.http.post(this.APIURL + '/pren/invioemailprenotazione/' + prenotazione.email, prenotazione);

  }

  getAllbyday(id: number) {
    this.rottafunction = 'pren/getPrenotazionibygiornata';
    return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id,  {
   headers: this.getAuthHeader()
 });      // ok      // ok
}

sendemailPrenotazionedaConfermareMoreno(prenotazione: Prenotazione) {

//console.log('frontend - prenotazione.service - sendemailPrenotazionedaConfermareMoreno ------  inizio -- ' + JSON.stringify(prenotazione) );
this.rottafunction = 'sendprenotazionedaConfermare';
return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazione);

//  return this.http.post(`this.APIAUTHURL/gmmailforregister`,  this.registerconfirmed );

}

sendemailPrenotazioneProdottidaConfermareMoreno(prenotazione: Prenotazione) {
  this.rottafunction = 'sendprenotazioneProdottidaConfermare';
  return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazione);
}
getbytoken(token: string) {
  this.rottafunction = 'getbytoken';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + token,  {
      headers: this.getAuthHeader()
  });      // ok
}


sendemailPrenotazioneConfermata(prenotazione: Prenotazione) {

  //console.log('frontend - prenotazione.service - sendemailPrenotazionedaConfermareMoreno ------  inizio -- ' + JSON.stringify(prenotazione) );
  this.rottafunction = 'sendconferma';
  return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazione);

  //  return this.http.post(`this.APIAUTHURL/gmmailforregister`,  this.registerconfirmed );

  }





}
