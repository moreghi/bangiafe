import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { EventoService } from '../../../services/evento.service';
// classi
import { Evento} from '../../../classes/Evento';

// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-evento-prenotazioni',
  templateUrl: './evento-prenotazioni.component.html',
  styleUrls: ['./evento-prenotazioni.component.css']
})
export class EventoPrenotazioniComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;


  public eventi: Evento[] = [];
  public evento: Evento;
  public eventow: Evento;

 /*    legenda typo messaggio esito

  this.type = 'error';    --- operazione in errore
  this.type = 'success';  --- operazione conclusa correttamente
  this.type = 'default';
  this.type = 'info';
  this.type = 'warning';
*/

 // variabili per gestione inqu/edit/new

 public href = '';


// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "elenco Prenotazione eventi";
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente
  public postiDisp = 0;

constructor(private eventoService: EventoService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
            this.goApplication();
           }

           goApplication() {
            this.isVisible = true;
            this.postiDisp = 0;
            this.loadEventiAttivi();
         }

        async loadEventiAttivi() {

          //  faccio una verifica se gli eventi prenotabili non sono stati esauriti
          // nel caso che i posti non siano più disponibili imposto lo stato a
          this.trovatoRec = false;
          this.nRec = 0;
          this.isVisible = true;
          let rc =  await  this.eventoService.getAllActive().subscribe(
               res => {
                if(res['rc'] === 'ok') {
                  console.log('loadEventi ---- elenco ' + JSON.stringify(res['data']));
                  this.eventi = res['data'];
                  for(const evento of this.eventi) {
                    this.postiDisp = evento.nposti - evento.npostiAssegnati - evento.npostipren;
                    //  console.log('createAllPosti _________________________ Creo Posti per la fila : ' + JSON.stringify(cassaday))
                      if(this.postiDisp > 0) {
                        this.nRec = this.nRec + 1;
                      } else {
                        evento.stato = 6;
                        this.aggiornaEvento(evento);
                      }
                    }
                    this.loadEventiPrenotabili();
                  }
              },
              error => {
                 alert('-- loadEventiAttivi - errore: ' + error.message);
                 console.log(error);
                 this.Message = error.message;
                 this.alertSuccess = false;
              });
        }


        async aggiornaEvento(evento: Evento) {

          let rc =  await  this.eventoService.update(evento).subscribe(
               res => {
                if(res['rc'] !== 'ok') {
                  this.Message = 'Errore in aggiornamento stato evento ' + evento.id;
                  this.alertSuccess = false;
                }
            },
              error => {
                 alert('aggiornaEvento - errore: ' + error.message);
                 console.log(error);
                 this.Message = error.message;
                 this.alertSuccess = false;
              });
        }

        async loadEventiPrenotabili() {

          //alert('Manifestazioni   -- loadEventi :  inizio ');
          this.trovatoRec = false;
          this.nRec = 0;
          this.isVisible = true;
          let rc =  await  this.eventoService.getAllActive().subscribe(
               res => {

                if(res['rc'] === 'ok') {
                  console.log('loadEventiPrenotabili ---- elenco ' + JSON.stringify(res['data']));
                  this.eventi = res['data'];
                  this.nRec = res['number'];
                  this.trovatoRec = true;
                  this.Message = 'Situazione Attuale';
                  this.alertSuccess = true;
                }
                if(res['rc'] === 'nf') {
                  this.trovatoRec = false;
                  this.Message = 'Nessun Evento prenotabile';
                  this.alertSuccess = true;
                }
              },
              error => {
                 alert('loadEventiPrenotabili - errore: ' + error.message);
                 console.log(error);
                 this.Message = error.message;
                 this.alertSuccess = false;
              });
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


onRecivedEvento(id: number) {
  alert('ricevo da elenco evento n. ' + id);
  this.loadEventoSelezionato(id);
}

async loadEventoSelezionato(id: number) {

  let rc =  await  this.eventoService.getbyId(id).subscribe(
    res => {
     if(res['rc'] === 'ok') {
      console.log('........................................................... loadeventoSelezionato: ' + JSON.stringify(res['data']));
       this.eventow = res['data'];
       this.Message = 'situazione attuale evento selezionato ';
       this.alertSuccess = true;
     }
 },
   error => {
      alert('onRecivedEvento - errore: ' + error.message);
      console.log(error);
      this.Message = error.message;
      this.alertSuccess = false;
   });
}





}







