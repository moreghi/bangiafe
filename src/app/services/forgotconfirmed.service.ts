import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForgotPassword } from '../classes/Forgot-password';    // ../../../classes/user
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotconfirmedService {

  private rotta = 'forgotpasswords';

  constructor(private http: HttpClient, private auth: AuthService) { }

  // connessione tra backend e frontend

  apiUrl = environment.APIAUTURL + this.rotta;

  forgotconf: ForgotPassword;
  // lettura tutti gli utenti

  getAuthHeader(): HttpHeaders {
    const headers = new HttpHeaders(
      {
        authorization: 'Bearer ' + this.auth.getToken()
      }
    );
    return headers;
  }



  getAll():Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // inserimento nuovo utente
  createNew(data:any):Observable<any> {
    console.log(data,'forgotconfirmedService - CreateNew');
    return this.http.post(`${this.apiUrl}`, data);
  }

  // cancellazione utente
  delete(email:any):Observable<any>  {
    console.log('cancellazione richiesta reset: ' + email);
    return this.http.delete(`${this.apiUrl}/${email}`);
  }


  update(data:any,email:any):Observable<any> {
    console.log(`aggiornamento richiesta ripristino ${email} `);
    return this.http.put(`${this.apiUrl}/${email}`, data);
  }

 // Visualizzazione singolo utente
 getby(email:any):Observable<any>  {
  console.log('ForgotconfirmedService ------ lettura singola richiesta: ' + email);

  return this.http.get(`${environment.APIURL}/forgotpasswords/${email}`, {
    headers: this.getAuthHeader()
  });

 }
//  spostato da authservice
 forgotPwd(email: string) {
  return this.http.post(this.apiUrl + "/forgotpwd", { email }, {
    headers: this.getAuthHeader()
  });
}

// non funziona - togliere
 confresetPassword(email: string, newpassword: string) {

  const test = environment.APIURL + "/confresetuserpwd";

  console.log(`forgotService - confresetPassword - parametri ${email} ' ' ${newpassword} url: ${test}`);



  return this.http.post(environment.APIURL + "/confresetuserpwd", { email, newpassword });
}


resetpassword(email: string, password: string) {

  const test = this.apiUrl + "/resetpassword";
  const test1 = `${this.apiUrl}/resetpassword`;
  console.log(`forgotService - resetpassword - parametri ${email} ' ' ${password} url: ${test} url1: ${test1}`);

// this.apiUrl + "/resetpassword"

  return this.http.post(`${this.apiUrl}/resetpassword`, { email, password });
}



}
