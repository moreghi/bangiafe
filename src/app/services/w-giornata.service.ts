
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { W_Giornate } from './../classes/W_Giornate';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WGiornataService {

  private rotta = '/wgiornate';
  private rottafunction = '';
  private stato = 0;

  private APIURL = environment.APIURL + this.rotta;  // definisco l'url su cui effettuare la lettura sul server

  constructor(private http: HttpClient,
              private auth: AuthService) { }


 getAuthHeader(): HttpHeaders   {
   // passo il token dentro a header per non farlo passare in chiaro su url

   const headers = new HttpHeaders(
       {
        authorization: 'Bearer ' + this.auth.getToken()
       }
     );
     return headers;
   }


     getAll():Observable<any> {
             return this.http.get(this.APIURL,  {
              headers: this.getAuthHeader()
            });      // ok
        }


     getbyid(id: number) {
          return this.http.get(this.APIURL + '/' + id,  {
            headers: this.getAuthHeader()
          });
        }

     delete(wgiornata: W_Giornate) {
          this.rottafunction = 'deletebyid';
          return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + wgiornata.id, {
            headers: this.getAuthHeader()
          });      // ok

        }

     update(wgiornata: W_Giornate) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + wgiornata.id, wgiornata, {
        headers: this.getAuthHeader()
        });
        }

    create(wgiornata: W_Giornate){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, wgiornata, {
        headers: this.getAuthHeader()
      });      // ok
        }

    getbydata(dataday: string) {
          this.rottafunction = 'getbydata';
          return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + dataday,  {
            headers: this.getAuthHeader()
          });
        }

    deleteAll() {
          this.rottafunction = 'deleteAll';
          return this.http.delete(this.APIURL + '/' + this.rottafunction, {
            headers: this.getAuthHeader()
          });      // ok

        }


}

