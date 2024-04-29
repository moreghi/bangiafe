import { Injectable } from '@angular/core';
import { Cassawc1 } from '../classes/Cassawc1';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class Cassawc1Service {

  Cassawc1: Cassawc1;  // definisco i dati come array vuoto

  public rotta = "/cassawc1";
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




              // ok
              getAll() {

                // ritorniamo un observoble - il subscribe devo farlo su users.component.ts

                // la chiamata la faccio solo se ho il token per abilitare la lettura solo a uteti loggati

                    // primo metodo passando il token in chiaro su url
                    //  return this.http.get(this.APIURL + '?token=' + this.auth.getToken());       // <---- 1° metodo  in chiaro su url

          // secondo metodo passando il token non in chiaro come header                   // <---- 2* metodo come header (non in chiaro)
                     return this.http.get(this.APIURL,  {
                      headers: this.getAuthHeader()
                    });      // ok;      // ok

                  }
               // ok

              getbyId(id: number) {
                      return this.http.get(this.APIURL + '/' + id,  {
                        headers: this.getAuthHeader()
                      });      // ok;
                  }
              // ok
              delete(id: number) {
                this.rottafunction = 'deletebyid';
                return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + id,  {
                     headers: this.getAuthHeader()
                      });      // ok;
                  }

              update(Cassawc1: Cassawc1) {
                this.rottafunction = 'updatebyid';
                return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + Cassawc1.idCommanda, Cassawc1,  {
                   headers: this.getAuthHeader()
                  });
                 }
              // ok
              create(Cassawc1: Cassawc1){
                this.rottafunction = 'create';
                return this.http.post(this.APIURL + '/' + this.rottafunction, Cassawc1,  {
                   headers: this.getAuthHeader()
                  });      // ok;
                  }


  }
