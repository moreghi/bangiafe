import { Injectable } from '@angular/core';
import { Giornata } from '../classes/Giornata';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GiornataService {

  giornata: Giornata[] = [];  // definisco i dati come array vuoto

  public rotta = "/giornates";
  public rottafunction = '';
  public url = '';

  public rottaManif = '/giornataManif';

  public rootlastGiornatabyManif = '/getLastGiornataByManifId/';

  public APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  public APIURLLAST = environment.APIURL + this.rottaManif;

  public tipoFiltro = 0;

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
              delete(giornata: Giornata) {
                this.rottafunction = 'deletebyid';
                return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + giornata.id,  {
                     headers: this.getAuthHeader()
                      });      // ok;
                  }

              update(giornata: Giornata) {
                this.rottafunction = 'updatebyid';
                return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + giornata.id, giornata,  {
                   headers: this.getAuthHeader()
                  });
                 }
              // ok
              create(giornata: Giornata){
                this.rottafunction = 'create';
                return this.http.post(this.APIURL + '/' + this.rottafunction, giornata,  {
                   headers: this.getAuthHeader()
                  });      // ok;
                  }

              // metodo gestito in laravel
              // per nodejs  smembrato nei die metodi getGiornateManifAll   e  getGiornateManifFiltro
              // OK  -  FATTI DUE MODULI SEPARATI
              //  'getGiornateByManif'
              getGiornateforManif(id: number) {
                this.rottafunction = 'getgiornatebymanif';


                let path = this.APIURL + '/' + this.rottafunction + '/' + id
                console.log('service -- giornata - path: ' + path )



                return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id ,  {
                          headers: this.getAuthHeader()
                        });      // ok;
                 }
              // OK
              getGiornateManifbyStato(id: number, tipoRic: string) {
                  this.tipoFiltro = 0;
                  switch (tipoRic) {
                    case 'T':
                        break;
                   case 'A':
                       this.tipoFiltro = 2;
                       break;
                   case 'C':
                       this.tipoFiltro = 3;
                       break;
                   case 'E':
                       this.tipoFiltro = 4;
                       break;
                   case 'N':
                        this.tipoFiltro = 1;
                        break;
                   default:
                       tipoRic = 'T';
                       break;
                   }
                   this.rottafunction = 'getGiornateByManifbyStato';
                       return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id + '/tipo/' + this.tipoFiltro,  {
                      headers: this.getAuthHeader()
                    });      // ok;
              }


              // ok
              getGiornataactive()  {
                this.rottafunction = 'giornataact/getGiornataactive/';
                    return this.http.get(this.APIURL + '/' + this.rottafunction ,  {
                    headers: this.getAuthHeader()
                  });      // ok;      // ok  // ok;
               }

              // Ok
              getLastGiornataidbyManif(id: number) {

                this.rottafunction = 'getLastGiornataByManifId';
                return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id,  {
                  headers: this.getAuthHeader()
                });      // ok;

                 }
              // ok
              // getGiornatebyManif(id: number) {
              //   this.rottafunction = 'getGiornateByManifId/';
              //   return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id,  {
              //           headers: this.getAuthHeader()
              //         });      // ok;
              //    }

     // per fare grafici
     getforChart(id: number) {

      this.rottafunction = 'getforChart/graph';

      return this.http.get(this.APIURL + '/' + this.rottafunction  + '/' + id).map(result => result);      // ok      // ok      // ok

   }

   getGiornateprenotabili(stato: number) {

    this.rottafunction = 'getGiornateByStato/' + stato;
    return this.http.get(this.APIURL + '/' + this.rottafunction ,  {
            headers: this.getAuthHeader()
          });      // ok;

     }
              /*
              bisogna fare  prima
                  npm install --save rxjs-compat

              e poi inserire in import

                import { map } from 'rxjs/operators';
                import 'rxjs/add/operator/map';    // per gestire i grafici

                https://www.youtube.com/watch?v=RTzi5DS7On4      per esempio

              */



                getAllGiornatebyManif(id: number) {
                  this.rottafunction = 'getAllGiornatebyManif';
                  return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + id ,  {
                            headers: this.getAuthHeader()
                          });      // ok;
                   }


                   getGiornataggmmaaaa(ggmmaaaa: string) {
                    this.rottafunction = 'getbyggmmaaaa';
                    return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + ggmmaaaa ,  {
                              headers: this.getAuthHeader()
                            });      // ok;
                     }

}
