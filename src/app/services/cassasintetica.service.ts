import { Injectable } from '@angular/core';
import { Cassasintetica } from '../classes/Cassasintetica';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CassasinteticaService {

  cassasintetica: Cassasintetica;  // definisco i dati come array vuoto

  public rotta = "/cassasintetica";
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

              delete(cassasintetica: Cassasintetica) {
                this.rottafunction = 'deletebyid';
                return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + cassasintetica.id,  {
                     headers: this.getAuthHeader()
                      });      // ok;
                  }

              update(cassasintetica: Cassasintetica) {
                this.rottafunction = 'updatebyid';
                return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + cassasintetica.id, cassasintetica,  {
                   headers: this.getAuthHeader()
                  });
                 }

              create(cassasintetica: Cassasintetica){
                this.rottafunction = 'create';
                return this.http.post(this.APIURL + '/' + this.rottafunction, cassasintetica,  {
                   headers: this.getAuthHeader()
                  });      // ok;
                  }

              getbyGiornata(id: number) {
                this.rottafunction = 'getbyGiornata';
                return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id,  {
                   headers: this.getAuthHeader()
                    });      // ok;
              }
}
