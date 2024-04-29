import { Injectable } from '@angular/core';
import { Listino } from '../classes/Listino';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListinoService {

  listino: Listino;  // definisco i dati come array vuoto

  public rotta = "/listino";
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

              delete(listino: Listino) {
                this.rottafunction = 'deletebyid';
                return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + listino.id,  {
                     headers: this.getAuthHeader()
                      });      // ok;
                  }

              update(listino: Listino) {
                this.rottafunction = 'updatebyid';
                return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + listino.id, listino,  {
                   headers: this.getAuthHeader()
                  });
                 }
    
              create(listino: Listino){
                this.rottafunction = 'create';
                return this.http.post(this.APIURL + '/' + this.rottafunction, listino,  {
                   headers: this.getAuthHeader()
                  });      // ok;
                  }
}
