import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Volontario } from '../classes/Volontario';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VolontarioService {

  private rotta = '/volontario';
  private rottafunction = '';

  constructor(private http: HttpClient,
              private auth: AuthService) { }

  // connessione tra backend e frontend

  apiUrl = environment.APIURL + this.rotta;

  volontario: Volontario;
  // lettura tutti gli utenti

  // non so dove usarlo nelle chiamate http
  getAuthHeader(): HttpHeaders {
    const headers = new HttpHeaders(
      {
        authorization: 'Bearer ' + this.auth.getToken()
      }
    );
    return headers;
  }

  // lettura tutti gli utenti   -- ok
  getAll():Observable<any> {

    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeader()
    } );
  }

  getbyid(id: number)  {
    return this.http.get(this.apiUrl + '/' + id, {
      headers: this.getAuthHeader()
    });
  }

  getuserbyEmail(email: string):Observable<any>  {
    this.rottafunction = "getbyemail";
    return this.http.get(this.apiUrl + '/' + this.rottafunction + '/' + email, {
      headers: this.getAuthHeader()
    });
  }

   create(volontario: Volontario){
    this.rottafunction = 'create';
    return this.http.post(this.apiUrl + '/' + this.rottafunction, volontario, {
      headers: this.getAuthHeader()
    });
  }

  delete(volontario: Volontario)  {
    this.rottafunction = "deletebyid";
     return this.http.delete(this.apiUrl + '/' + this.rottafunction + '/' + volontario, {
      headers: this.getAuthHeader()
    });
  }

  update(volontario: Volontario) {
    this.rottafunction = "updatebyid";
    return this.http.put(this.apiUrl + '/' + this.rottafunction + '/' + volontario.id, volontario, {
    headers: this.getAuthHeader()
    });
  }

  getbystato(stato: number)  {
    this.rottafunction = "getbystato";
    return this.http.put(this.apiUrl + '/' + this.rottafunction + '/' + stato, {
      headers: this.getAuthHeader()
    });
  }


}

