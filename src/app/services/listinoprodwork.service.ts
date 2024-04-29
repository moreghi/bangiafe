import { Injectable } from '@angular/core';
import { Listinoprodwork } from '../classes/listinoprodwork';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListinoprodworkService {


  Listinoprod: Listinoprodwork;  // definisco i dati come array vuoto

  public rotta = "/Listinoprodwork";
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

              delete(listinoprod: Listinoprodwork) {
                this.rottafunction = 'deletebyid';
                return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + listinoprod.id,  {
                     headers: this.getAuthHeader()
                      });      // ok;
                  }

              update(listinoprod: Listinoprodwork) {
                this.rottafunction = 'updatebyid';
                return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + listinoprod.id, listinoprod,  {
                   headers: this.getAuthHeader()
                  });
                 }

              create(listinoprod: Listinoprodwork){
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

          // filtro per attivi e non attivi su tutto il listino
          getallProdbylistinoamenu(id: number, sel: string) {
            this.rottafunction = 'listinoamenu';
            return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + id + '/' + sel,  {
              headers: this.getAuthHeader()
            });      // ok;
      }


      getallProdbylistbytipologia(tipologia: number, listino: number) {
        this.rottafunction = 'listinobytipo';
        return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + tipologia + '/' + listino,  {
          headers: this.getAuthHeader()
        });      // ok;
  }

  getallProdattivibylistino(id: number) {
    this.rottafunction = 'listinoact';
    return this.http.get(this.APIURL+ '/' + this.rottafunction  + '/' + id,  {
      headers: this.getAuthHeader()
    });      // ok;
 }

 getcountProdottiamenu(id: number) {
  this.rottafunction = 'getCountbyameenu';
  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id,  {
          headers: this.getAuthHeader()
      });
 }


 deleteAll() {
  this.rottafunction = 'deleteAll';
  return this.http.delete(this.APIURL + '/' + this.rottafunction,  {
       headers: this.getAuthHeader()
        });      // ok;
    }

    getProdottiordinati() {
      this.rottafunction = 'getProdotti/Ordinati';
      return this.http.get(this.APIURL + '/' + this.rottafunction,  {
              headers: this.getAuthHeader()
          });
     }

     getallProdbylistbytipologiabyamenu(tipologia: number, listino: number, amenu: string) {
      this.rottafunction = 'listinobytipobyamenu';
      return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + tipologia + '/' + listino + '/' + amenu,  {
        headers: this.getAuthHeader()
      });      // ok;
}


    getbyidProdotto(idProdotto: number) {
      this.rottafunction = 'listinobyidProdotto';
      return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + idProdotto,  {
        headers: this.getAuthHeader()
      });      // ok;
    }





}
