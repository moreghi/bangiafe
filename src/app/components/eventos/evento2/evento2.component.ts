import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// classi
import { Evento } from '../../../classes/Evento';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faEye, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'tr[app-evento2]',
  templateUrl: './evento2.component.html',
  styleUrls: ['./evento2.component.css']
})
export class Evento2Component implements OnInit {

   // variabili passate dal componente padre
   @Input('evento2-data') evento: Evento;
   @Input('evento2-prog') i: number;
   @Output('onSelectedEvento') eventoSelezionato = new EventEmitter<number>();


   faUserEdit = faUserEdit;
   faEye = faEye;

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
  public tipoUtente = 0;  // 0 = utente non loggato  1 = utente loggato emetto biglietto da backoffice BandieraGialla



  constructor( private router: Router,
               private notifier: NotifierService)
             {
                  this.notifier = notifier;
              }

              ngOnInit(): void {
                this.isVisible = true;
                //   per gestire eventuale popup
                this.headerPopup = 'Registrazione Manifestazione';
                this.textMessage1 = '?????????? ';
             //   this.textUser = this.messa.demessa;
                this.textMessage2 = 'Registrazione non possibile';

                 console.log('avento2 --- ngOnInit --- Evento ricevuto: ' + JSON.stringify(this.evento))


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


            // verifico se la richiesta di prenotazione è fatta da utente loggato o no
              var cogn = localStorage.getItem('cognome');
              if (cogn == null) {
                  this.tipoUtente = 0;    // utente non bandiera gialla
              } else {
                this.tipoUtente = 1;   // utente bandiera gialla
              }

              if(this.tipoUtente == 0) {
                   // evento senza logistica
                   if(evento.idtipo == 1) {
                    this.router.navigate(['evento/registrazione/normal/' + evento.id])
                  }
                  if(evento.idtipo == 2) {
                    this.router.navigate(['evento/registrazione/logistica/' + evento.id])
                  }
              }
              // utente bandiera gialla -- biglietto emesso senza passaggio su eventoPosto
              if(this.tipoUtente == 1) {

                     // entrambi gli eventi sono gestiti in "evento/' + evento.id + '/tipobiglietti'"
                     // all'inyerno del componente gestisco se gestico con logistica o senza
                     this.router.navigate(['evento/' + evento.id + '/tipobiglietti'])

                    /*
                     if(evento.idtipo == 1) {
                      // visualizzo le tipologie di biglietti per fare emissione
                      this.router.navigate(['evento/' + evento.id + '/tipobiglietti'])
                    }
                    if(evento.idtipo == 2) {
                      alert('trovare la emissione biglietto diretta per eventi con logistica')
                     // this.router.navigate(['evento/registrazione/logistica/' + evento.id])
                    }  */
              }


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

                this.router.navigate(['/prenotazione/' + evento.id]);


           //   alert('Ho selezionato evento n. ' + evento.id + ' visualizzazione evento da fare')
              // fare popup o dettaglio normale con i dati selezionati

// attenzione  la gestione del passaggio dati da figlio a padre funziona
        //      alert('Ho selezionato evento n. ' + evento.id)
          //    this.eventoSelezionato.emit(evento.id);

            }

}
