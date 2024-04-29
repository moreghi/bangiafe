import { Injectable } from '@angular/core';
import { Listinoprod } from '../classes/Listinoprod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListinoprodService {

  Listinoprod: Listinoprod;  // definisco i dati come array vuoto

  public rotta = "/Listinoprod";
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

              delete(listinoprod: Listinoprod) {
                this.rottafunction = 'deletebyid';
                return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + listinoprod.id,  {
                     headers: this.getAuthHeader()
                      });      // ok;
                  }

              update(listinoprod: Listinoprod) {
                this.rottafunction = 'updatebyid';
                return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + listinoprod.id, listinoprod,  {
                   headers: this.getAuthHeader()
                  });
                 }

              create(listinoprod: Listinoprod){
                this.rottafunction = 'create';
                return this.http.post(this.APIURL + '/' + this.rottafunction, listinoprod,  {
                   headers: this.getAuthHeader()
                  });      // ok;
              }

              getallProdbylistino(id: number) {
                this.rottafunction = 'listino';
                return this.http.get(this.APIURL+ '/' + this.rottafunction  + '/' + id,  {
                  headers: this.getAuthHeader()
                });      // ok;
          }

          getallProdbylistinoamenu(id: number, sel: string) {
            this.rottafunction = 'listinoamenu';
            return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + id + '/' + sel,  {
              headers: this.getAuthHeader()
            });      // ok;
      }

          getallProdbylistinobystato(id: number, stato: number) {
            this.rottafunction = 'listinobystato';
            return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + id + '/' + stato,  {
              headers: this.getAuthHeader()
            });      // ok;
  }

}
