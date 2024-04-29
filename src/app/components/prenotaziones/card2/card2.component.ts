import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Classe
import { Giornata} from './../../../classes/Giornata';
import { Prenotazione } from './../../../classes/Prenotazione';
import { Manifestazione } from './../../../classes/Manifestazione';
// service
import { GiornataService } from './../../../services/giornata.service'
import { PrenotazioneService } from './../../../services/prenotazione.service'
import { ManifestazioneService } from './../../../services/manifestazione.service'

import { faSearch, faUserEdit} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'td[app-card2]',
  templateUrl: './card2.component.html',
  styleUrls: ['./card2.component.css']
})
export class Card2Component implements OnInit {

  @Input('card2-data') giornata: Giornata;
// passo dati a giornata-detail (Padre)  per gestire l'elenco del codice selezzionato in card
  @Output('serataSelect') serataSelect = new EventEmitter();
  @Output('prenotazioniSelect') prenotazioniSelect = new EventEmitter();

  faSearch = faSearch;
  faUserEdit = faUserEdit;

  public prenotazione: Prenotazione;
  public prenotazioni: Prenotazione[] = [];
  public manifestazione: Manifestazione;

  public nprenot = 0;

  public pathimage = '';
  public pathimagehrader = 'assets/images/prenotazione/prenotazione.png';


  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public Message = '';
  public stato = 0;

  public headerMessage = '';

  constructor(private router: Router,
              private datePipe: DatePipe,
              private prenotazioneService: PrenotazioneService,
              private manifestazioneService: ManifestazioneService,
              private notifier: NotifierService) {
                this.notifier = notifier;
            }

      ngOnInit(): void {

        // imposto quanti prodotti con la tipologia selezionata
        this.pathimage = this.pathimagehrader;
        this.headerMessage = 'serata del ' + this.giornata.dtGiornata1;
        this.nprenot = 0;
        this.loadManifestazione(this.giornata.idManifestazione );

        this.loadAlloprenotazioni(this.giornata.id );

      }

      registra(id: number) {

        this.serataSelect.emit(id);

      //  this.router.navigate(['evento/dashboard/' + id]);

      }

      viewprenotazioni(id: number) {

        this.prenotazioniSelect.emit(id);

      //  this.router.navigate(['evento/dashboard/' + id]);

      }

      async  loadManifestazione(id: number) {

        let rc = await this.manifestazioneService.getbyid(id).subscribe(
         resp => {
              if(resp['rc'] === 'ok') {
                this.manifestazione = resp['data'];
            }
         },
         error => {
              alert('sono in loadManifestazione -- error');

              console.log('loadManifestazione - errore: ' + error);
              this.type = 'error';
              this.Message = error.message;
              this.showNotification(this.type, this.Message);

            });
       }

      async  loadAlloprenotazioni(id: number) {

            let rc = await this.prenotazioneService.getAllbyday(id).subscribe(
             resp => {
                  if(resp['rc'] === 'ok') {
                    this.prenotazioni = resp['data'];
                    for(let prenot of this.prenotazioni) {
                           this.nprenot += 1;
                    }
                }
             },
             error => {
                  alert('sono in loadAlloprenotazioni -- error');

                  console.log('loadAlloprenotazioni - errore: ' + error);
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
