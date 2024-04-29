import { Injectable } from '@angular/core';
import { Prenotazioneprodotto } from '../classes/Prenotazioneprodotto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneprodottoService {

  prenotazioneprodotto: Prenotazioneprodotto;  // definisco i dati come array vuoto

  public rotta = "/Prenotazioneprodotto";
  public rottafunction = '';
  public url = '';

  public APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  constructor(private http: HttpClient,
              private auth: AuthService) { }


              getAuthHeader(): HttpHeaders {
                const headers = new HttpHeaders(
                  {
                    Autorization: 'Bearer ' + this.auth.getToken()
                  }
                );
                return headers;
              }

              getAll() {
                     return this.http.get(this.APIURL,  {
                      headers: this.getAuthHeader()
                    });      // ok;      // ok

               }

              getbyId(id: number) {
                      return this.http.get(this.APIURL + '/' + id,  {
                        headers: this.getAuthHeader()
                      });      // ok;
                }

              delete(prenotazioneprodotto: Prenotazioneprodotto) {
                this.rottafunction = 'deletebyid';
                return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prenotazioneprodotto.id,  {
                     headers: this.getAuthHeader()
                      });      // ok;
                  }

              update(prenotazioneprodotto: Prenotazioneprodotto) {
                this.rottafunction = 'updatebyid';
                return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + prenotazioneprodotto.id, prenotazioneprodotto,  {
                   headers: this.getAuthHeader()
                  });
                 }

              create(prenotazioneprodotto: Prenotazioneprodotto){

        console.log('prenotazioneprodotto------   service: ' + JSON.stringify(prenotazioneprodotto))

                this.rottafunction = 'create';
                return this.http.post(this.APIURL + '/' + this.rottafunction, prenotazioneprodotto,  {
                   headers: this.getAuthHeader()
                  });      // ok;
              }

              getallProdbyprenotazione(id: number) {
                this.rottafunction = 'prenotazione';
                return this.http.get(this.APIURL+ '/' + this.rottafunction  + '/' + id,  {
                  headers: this.getAuthHeader()
                });      // ok;
          }


}
