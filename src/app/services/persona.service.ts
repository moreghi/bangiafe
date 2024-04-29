import { Injectable } from '@angular/core';
import { Persona } from '../classes/Persona';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  persona: Persona;

  private rotta = "/persona";
  private rottafunction = '';
  private APIURL = environment.APIURL + this.rotta;

    constructor(private http: HttpClient,
                private auth: AuthService) { }


  // attenzione: per ogni funzione che voglio usare DEVO passare il token per dimostrare che sono loggato

  getAuthHeader(): HttpHeaders   {
    // passo il token dentro a header per non farlo passare in chiaro su url
    const headers = new HttpHeaders(
        {
            Authorization: 'Bearer ' +  this.auth.getToken()
        }
      );
      return headers;
    }

  getAll() {
         return this.http.get(this.APIURL,  {
          headers: this.getAuthHeader()
        });      // ok      // ok      // ok
      }

  getbyid(id: number) {
      return this.http.get(this.APIURL + '/' + id,  {
           headers: this.getAuthHeader()
       });      // ok      // ok
    }

  delete(persona: Persona) {
     this.rottafunction = 'deletebyid';
     return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + persona.id,  {
        headers: this.getAuthHeader()
     });      // ok      // ok
  }

    update(persona: Persona) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + persona.id, persona,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }

     create(persona: Persona){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, persona,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }

    getPersonabyRuolo(idGiornata: number, ruolo: number) {
            this.rottafunction = 'getbyGiornata/Ruolo';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idGiornata + '/' + ruolo,  {
                   headers: this.getAuthHeader()
                  });
            }

    getbyGiornata(idGiornata: number) {
              this.rottafunction = 'getbyGiuornata';
              return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idGiornata,  {
                     headers: this.getAuthHeader()
                    });
              }

    getPersonabyinServizio(idGiornata: number, inservizio: string) {
            this.rottafunction = 'getPersonabyinServizio';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idGiornata + '/' + inservizio,  {
                  headers: this.getAuthHeader()
                });
           }

   getPersonabyutilizzoCommanda(idGiornata: number, utilizzato: string) {
            this.rottafunction = 'getPersonabyutilizzoCommanda';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + idGiornata + '/' + utilizzato,  {
                  headers: this.getAuthHeader()
                });
           }

  resettaAllPersone() {
          this.rottafunction = 'resetta/AllPersone';
          return this.http.post(this.APIURL + '/' + this.rottafunction ,  {
            headers: this.getAuthHeader()
          });
        }








}
