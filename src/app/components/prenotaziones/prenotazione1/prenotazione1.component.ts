import { Component, Input, OnInit } from '@angular/core';
import { Prenotazione } from './../../../classes/Prenotazione';
import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//  import { GiornatapopComponent } from './../../components/popups/giornatapop/giornatapop.component';   gestire non con popup
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'tr[app-prenotazione1]',
  templateUrl: './prenotazione1.component.html',
  styleUrls: ['./prenotazione1.component.css']
})
export class Prenotazione1Component implements OnInit {


  @Input('prenotazione1-data') prenotazione: Prenotazione;
  @Input('prenotazione1-prog') i: number;


  faUserEdit = faUserEdit;
  faTrash = faTrash;
  faInfo = faInfo;
  faEuroSign = faEuroSign;
  faUtensils = faUtensils;
  faStream = faStream;
  faChartBar = faChartBar;
  faList = faList;
  faCalendarAlt = faCalendarAlt;

  routeGiornata = '';

  private dataOdierna: Date;
  private datepipe: DatePipe = new DatePipe('en-US');

  private dt1: string;
  private dt2: string;

  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public Message = '';
  public statoPrenotazione = '';

  constructor(public modal: NgbModal,
              private router: Router,
              public notifier: NotifierService) {
                this.notifier = notifier;
              }


  ngOnInit(): void {
    this.dataOdierna = new Date();
    console.log('prenotazione: ' + JSON.stringify(this.prenotazione));
    if(this.prenotazione.idstato == 0) {
      this.statoPrenotazione = 'Da Confermare'
    }
    if(this.prenotazione.idstato == 1) {
      this.statoPrenotazione = 'Confermata'
    }
  }



      /**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}


}

