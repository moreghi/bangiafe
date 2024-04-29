import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Classe
import { Ttipologia} from './../../../classes/T_tipologia';
import { Prodotto } from './../../../classes/Prodotto';
import { Listinoprodwork } from './../../../classes/listinoprodwork'

// service
import { ProdottoService } from './../../../services/prodotto.service'
import { ListinoprodworkService } from './../../../services/listinoprodwork.service'

import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'td[app-card3]',
  templateUrl: './card3.component.html',
  styleUrls: ['./card3.component.css']
})
export class Card3Component implements OnInit {

  @Input('card3-data') tipologia: Ttipologia;
// passo dati a giornata-detail (Padre)  per gestire l'elenco del codice selezzionato in card
  @Output('tipologiaSelect') tipologiaSelect = new EventEmitter();

  faSearch = faSearch;

  public prodotti: Prodotto[]=[];
  public listinoprodottiwork: Listinoprodwork[] = [];
  public listinoprodottowork: Listinoprodwork;

  public pathimage = '';
  public pathimagehrader = 'assets/images/tipologia/';

  public idListino = 1;
  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public Message = '';
  public ordinati = 0;
  public nprodotti = 0;

  constructor(private router: Router,
              private datePipe: DatePipe,
              private listinoprodworkService: ListinoprodworkService,
              private prodottoService: ProdottoService,
              private notifier: NotifierService) {
                this.notifier = notifier;
            }


      ngOnInit(): void {

        // imposto quanti prodotti con la tipologia selezionata
        this.pathimage = this.pathimagehrader + this.tipologia.photo;

        this.loadAlloprodottialistino(this.idListino,this.tipologia.id );
        this.ordinati = 0;
        this.nprodotti = 0;

      }

      gestione(id: number) {

        this.tipologiaSelect.emit(id);

      //  this.router.navigate(['evento/dashboard/' + id]);

      }

          async  loadAlloprodottialistino(id: number, tipologia: number) {

            let rc = await this.listinoprodworkService.getallProdbylistbytipologia(tipologia, id).subscribe(
             resp => {
                  if(resp['rc'] === 'ok') {
                    this.listinoprodottiwork = resp['data'];
                    for(let prodlist of this.listinoprodottiwork) {
                      this.nprodotti += 1;
                      if(prodlist.qta > 0) {
                        this.ordinati += 1;
                      }
                   }
                }
             },
             error => {
                  alert('sono in loadallProdotti -- error');

                  console.log('loadallProdotti - errore: ' + error);
                  this.type = 'error';
                  this.Message = error.message;
                  this.showNotification(this.type, this.Message);

                });
           }

/**
  * Show a notification
  *
  * @param {string} type    Notification type
  * @param {string} message Notification message
  */

showNotification( type: string, message: string ): void {
  // alert('sono in showNot - ' + message);
   this.notifier.notify( type, message );
   console.log(`sono in showNotification  ${type}`);
//   alert('sono in notifier' + message);
 }





}
