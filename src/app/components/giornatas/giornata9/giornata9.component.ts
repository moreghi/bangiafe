
import { Component, Input, OnInit } from '@angular/core';
import { GiornataService } from './../../../services/giornata.service';
import { Giornata} from '../../../classes/Giornata';
import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//  import { GiornatapopComponent } from './../../components/popups/giornatapop/giornatapop.component';   gestire non con popup
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'tr[app-giornata9]',
  templateUrl: './giornata9.component.html',
  styleUrls: ['./giornata9.component.css']
})
export class Giornata9Component {

  @Input('giornata9-data') giornata: Giornata;
  @Input('giornata9-prog') i: number;


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


  constructor(public modal: NgbModal,
              private giornataService: GiornataService,
              private route: Router,
              public notifier: NotifierService) {
                this.notifier = notifier;
              }


  ngOnInit(): void {

  }


  showlistinoGiornata(giornata: Giornata) {

    //this.router.navigate(['/socio']);





  }


  showPrenptazioniGiornata(giornata: Giornata) {
    alert('da fare visualizzazione prenotazioni')
  }

      /**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/


}





