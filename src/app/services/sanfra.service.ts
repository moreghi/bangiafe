import { Injectable } from '@angular/core';
import { Sanfra } from '../classes/Sanfra';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SanfraService {

  sanfra: Sanfra;  // definisco i dati come array vuoto

  public rotta = "/sanfra";
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

              delete(sanfra: Sanfra) {
                this.rottafunction = 'deletebyid';
                return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + sanfra.id,  {
                     headers: this.getAuthHeader()
                      });      // ok;
                  }

              update(sanfra: Sanfra) {
                this.rottafunction = 'updatebyid';
                return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + sanfra.id, sanfra,  {
                   headers: this.getAuthHeader()
                  });
                 }

              create(sanfra: Sanfra){
                this.rottafunction = 'create';
                return this.http.post(this.APIURL + '/' + this.rottafunction, sanfra,  {
                   headers: this.getAuthHeader()
                  });      // ok;
                  }
}
