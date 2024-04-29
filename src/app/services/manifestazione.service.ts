
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manifestazione } from '../classes/Manifestazione';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';    // per gestire i grafici

@Injectable({
  providedIn: 'root'
})
export class ManifestazioneService {

  manif: Manifestazione;

  private rotta = "/manif";
  private rottafunction = '';
  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  constructor(private http: HttpClient, private auth: AuthService) { }

// attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato
// metodo per concatenare il token nei metodi di chiamata al server
      getAuthHeader(): HttpHeaders {
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
             });      // ok


         /*
          return this.http.get(this.APIURL).subscribe(
            data => console.log(data),
            error => alert(error.message)
          );
  */

      }

      getbyid(id: number) {
        return this.http.get(this.APIURL + '/' + id, {
          headers: this.getAuthHeader()
        });
      }

      delete(manif: Manifestazione) {
        this.rottafunction = 'deletebyid';
        return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + manif.id,  {
          headers: this.getAuthHeader()
        });
      }

      update(manif: Manifestazione) {
        this.rottafunction = 'updatebyid';
        return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + manif.id, manif,  {
          headers: this.getAuthHeader()
        });
      }

       create(manif: Manifestazione){
        this.rottafunction = 'create';
        return this.http.post(this.APIURL + '/' + this.rottafunction, manif,  {
          headers: this.getAuthHeader()
        });
      }

      getbyStato(stato: number) {
        this.rottafunction = 'getbyStato';
        return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + stato,  {
               headers: this.getAuthHeader()
              });      // ok;
    }

      getManifActive() {
          this.rottafunction = 'getManifestazioneActive';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/getManifestazioneActive',  {
           headers: this.getAuthHeader()
          });      // ok;
      }

      getbyAnno(anno: number) {
        this.rottafunction = 'getbyAnno';
        return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + anno,  {
               headers: this.getAuthHeader()
              });      // ok;
    }




}
