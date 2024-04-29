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
  selector: 'td[app-card5]',
  templateUrl: './card5.component.html',
  styleUrls: ['./card5.component.css']
})
export class Card5Component implements OnInit {

  @Input('card5-data') giornata: Giornata;
// passo dati a giornata-detail (Padre)  per gestire l'elenco del codice selezzionato in card
  @Output('serataSelect') serataSelect = new EventEmitter();
 // @Output('prenotazioniSelect') prenotazioniSelect = new EventEmitter();

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

  public dataGiorno: any;
  public dataOdierna = '';
  public anno  = 0;
  public giornataAbilitata = false;
  public giornataAttiva = false;

  constructor(private router: Router,
              private datePipe: DatePipe,
              private prenotazioneService: PrenotazioneService,
              private manifestazioneService: ManifestazioneService,
              private notifier: NotifierService) {
                this.notifier = notifier;
            }

      ngOnInit(): void {

        const date = Date();
        this.dataGiorno = new Date();

        this.anno  = this.dataGiorno.getFullYear();

        let dayCopy = 0;
        let mmCopy = 0;

         var day =  this.dataGiorno.getDate();
         dayCopy = day;
         if(day < 10) {
           day = '0' + day;
         }
         var month = this.dataGiorno.getMonth();
         month =  month + 1
         mmCopy = month;
         if(month < 10) {
           month = '0' + month;
         }
         var year = this.dataGiorno.getFullYear();


         this.dataGiorno =  day + '-' + month + '-' + year;
         this.dataOdierna = this.dataGiorno;


         console.log('dataOdierna: ' + this.dataOdierna)
         console.log('giornata.dtGiornata1: ' + this.giornata.dtGiornata1)


         if(this.giornata.dtGiornata1 === this.dataOdierna) {
          this.giornataAbilitata = true;
            console.log('test verificato: ' + this.giornataAbilitata)
         } else {
          this.giornataAbilitata = false;
          console.log('test NON verificato: ' + this.giornataAbilitata)
         }

        // giornata attiva e fruibile
        if(this.giornata.statoCassa == 1 && this.giornata.statoMagazzino == 1 && this.giornata.statoUtenti == 1) {
          localStorage.setItem('idGiornata', String(this.giornata.id));
          this.giornataAttiva = true;
        } else {
          this.giornataAttiva = false;
        }






        // imposto quanti prodotti con la tipologia selezionata
        this.pathimage = this.pathimagehrader;
        this.headerMessage = 'serata del ' + this.giornata.dtGiornata1;
        this.nprenot = 0;
        this.loadManifestazione(this.giornata.idManifestazione );

   //     this.loadAlloprenotazioni(this.giornata.id );

      }

      cassa(id: number) {
        this.router.navigate(['cassasintetica/new/' + id]);

      }

      volontari(id: number) {
        this.router.navigate(['giornata/Pers//' + id]);

      }

      magazzino(id: number) {
        this.router.navigate(['giornata/Prod//' + id]);

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
