import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Service
import { EventoService} from '../../../services/evento.service';
// classi
import { Evento } from '../../../classes/Evento';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt, faLocationArrow, faChair, faAddressBook, faUsers, faEuroSign, faBolt, faEye} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'tr[app-evento1]',
  templateUrl: './evento1.component.html',
  styleUrls: ['./evento1.component.css']
})
export class Evento1Component implements OnInit {

   // variabili passate dal componente padre
   @Input('evento1-data') evento: Evento;
   @Input('evento1-prog') i: number;
   @Output('onSelectedEvento') eventoSelected = new EventEmitter<number>();


   faUserEdit = faUserEdit;
   faTrash = faTrash;
   faInfo = faInfo;
   faInfoCircle = faInfoCircle;
   faList = faList;
   faPlusSquare = faPlusSquare;
   faSearch = faSearch;
   faSave = faSave;
   faMinus = faMinus;
   faPlus = faPlus;
   faWindowClose = faWindowClose;
   faTicketAlt = faTicketAlt;
   faLocationArrow = faLocationArrow;
   faChair = faChair;
   faAddressBook = faAddressBook;
   faUsers = faUsers;
   faEuroSign = faEuroSign;
   faBolt = faBolt;
   faEye = faEye;
 // -----
   public textMessage1 = '';
   public textMessage2 = '';
   public textUser = '';
   public headerPopup = '';
   public perDebug = 'utente passato: ';
   public Message = '';
   public presenti = false;
   public isVisible = false;
   public alertSuccess = false;
   public function = 0;
   public nRec = 0;
   public idPassed = 0;


    // variabili per gestione inqu/edit/new

   public href = '';

   public messagenull = 'Nessun record presente !!!';



// variabili per notifica esito operazione con Notifier
  public type = '';

   constructor(private eventoService: EventoService,
               private modalService: NgbModal,
               private route: Router,
               private datePipe: DatePipe,
               private notifier: NotifierService) {
                this.notifier = notifier;
              }


 ngOnInit(): void {
    this.isVisible = true;
    //   per gestire eventuale popup
    this.headerPopup = 'Registrazione Manifestazione';
    this.textMessage1 = '?????????? ';
 //   this.textUser = this.messa.demessa;
    this.textMessage2 = 'Registrazione non possibile';

   //  console.log('avento1 --- ngOnInit --- Evento ricevuto: ' + JSON.stringify(this.evento))


 }



/*
    Show a notification

    @param {string} type Notification type
    @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
 // alert('sono in showNot - ' + message);
 this.notifier.notify( type, message );
 console.log(`sono in showNotification  ${type}`);
 }







 prenota(evento: Evento) {

  alert('prenota evento --- funzione da fare')
// gestire se con logistica o senza
  //  this.route.navigate(['evento/edit/' + evento.id + '/' + evento.idmanif]);
 }


 getColor(stato: number) {
   switch (stato) {
     case 0:
       return 'red';
     case 1:
       return 'green';
   }
 }

 getBackground(stato: number) {
   switch (stato) {
     case 0:
       return 'black';
     case 1:
       return 'yellow';
   }
 }


show(evento: Evento) {
  alert('Ho selezionato evento n. ' + evento.id)
//  this.eventoSelected.emit(evento.id);

}



}
