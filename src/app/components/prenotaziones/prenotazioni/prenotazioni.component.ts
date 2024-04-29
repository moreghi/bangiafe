import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { GiornataService } from '../../../services/giornata.service';
import { SanfraService } from '../../../services/sanfra.service';


// classi
import { Giornata} from '../../../classes/Giornata';
import { Sanfra} from '../../../classes/Sanfra';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.css']
})
export class PrenotazioniComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public giornate: Giornata[] = [];
  public giornata: Giornata;
  public sanfra: Sanfra;

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


  public title = "elenco Giornate Prenotabili";
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;
  public idSanfra = 0;

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private giornataService: GiornataService,
            private sanfraService: SanfraService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
            this.loadSanfra();
            this.loadGiornatePrenotabili();
           }

           async loadSanfra() {

            this.nRec = 0;
            this.isVisible = true;
            this.idSanfra = 1;
            let rc =  await  this.sanfraService.getbyId(this.idSanfra).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.sanfra = res['data'];
                    this.nRec = res['number'];
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessuna associazione prenotasbil';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadSanfra - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }



          async loadGiornatePrenotabili() {

            this.nRec = 0;
            this.isVisible = true;
            this.stato = 1;
            let rc =  await  this.giornataService.getGiornateprenotabili(this.stato).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.giornate = res['data'];
                    console.log('giornate prenotabili: ' + JSON.stringify(this.giornate))
                    this.nRec = res['number'];
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessuna Giornata prenotasbil';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadGiornatePrenotabili - errore: ' + error.message);
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

  serataSelect(id: number) {
    // alert('passato prenotazione per la giornata:' + id)
    this.router.navigate(['requestConfirmPrenotazione/' + id]);
  }

  prenotazioniSelect(id: number) {
  //  alert('passato prenotazione per la gvisualizzare il dettaglio delle prenotazioni di giornata:' + id)
    this.router.navigate(['PrenotazionidelGiorno/' + id]);

  }




}

