import { Injectable } from '@angular/core';
import { Prodotto } from '../classes/Prodotto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ProdottoService {

  prodotto: Prodotto;

  private rotta = "/prodotto";
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

  delete(prodotto: Prodotto) {
     this.rottafunction = 'deletebyid';
     return this.http.delete(this.APIURL + '/' + this.rottafunction + '/' + prodotto.id,  {
        headers: this.getAuthHeader()
     });      // ok      // ok
  }

    update(prodotto: Prodotto) {
      this.rottafunction = 'updatebyid';
      return this.http.put(this.APIURL + '/' + this.rottafunction + '/' + prodotto.id, prodotto,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }

     create(prodotto: Prodotto){
      this.rottafunction = 'create';
      return this.http.post(this.APIURL + '/' + this.rottafunction, prodotto,  {
        headers: this.getAuthHeader()
      });      // ok      // ok
    }


    getProdottiforMenu(menu: string) {
      this.rottafunction = 'getProdottiforMenu';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + menu,  {
             headers: this.getAuthHeader()
            });      // ok      // ok
       }

          getProdottiforTipologia(tipo: number) {
            this.rottafunction = 'getProdottiforTipologia';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + tipo,  {
                   headers: this.getAuthHeader()
                  });
            }

          getProdottiforTipologia1(tipo: number) {
            this.rottafunction = 'getProdottiforTipologia1';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + tipo,  {
                  headers: this.getAuthHeader()
                });
           }

          getProdottiforCategoria(tipo: number) {
            this.rottafunction = 'getProdottiforCategoria';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + tipo,  {
                  headers: this.getAuthHeader()
                });
          }

           getProdottiforCompetenza(tipo: number) {
            this.rottafunction = 'getProdottiforCompetenza';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + tipo,  {
                 headers: this.getAuthHeader()
             });
         }

          getProdottiforStato(stato: number) {
            this.rottafunction = 'getProdottiforStato';
            return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + stato,  {
                    headers: this.getAuthHeader()
                });
           }

          getProdottoLastId() {
            this.rottafunction = 'prodottolast/lastid';
            return this.http.get(this.APIURL + '/' + this.rottafunction,  {
                headers: this.getAuthHeader()
            });
          }

        resettaamenu() {
          this.rottafunction = 'amenu/updateamenuProdotto';
          return this.http.post(this.APIURL + '/' + this.rottafunction ,  {
            headers: this.getAuthHeader()
          });
        }

     // su tutti i prodotti reimposto il carattere N per selectedDay
     resettaselectedDay() {
      this.rottafunction = 'selectedDay/reset';
      return this.http.post(this.APIURL + '/' + this.rottafunction ,  {
        headers: this.getAuthHeader()
      });
    }


    getProdottiforMenbyCompetenza(menu: string, competenza: number) {
      this.rottafunction = 'getProdottimenuforCompetenza';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + menu + '/' + competenza,  {
             headers: this.getAuthHeader()
            });      // ok      // ok
     }

     getAllProdottibytipologAttiva(stato: number) {
      this.rottafunction = 'getAllProdottibytipol/attiva';
      return this.http.get(this.APIURL + '/' + this.rottafunction + '/' + stato,  {
              headers: this.getAuthHeader()
          });
     }

}
