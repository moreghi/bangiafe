import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { ManifestazioneService} from './../../../services/manifestazione.service';
import { GiornataService } from './../../../services/giornata.service';
import { Manifestazione} from '../../../classes/Manifestazione';
import { Giornata} from '../../../classes/Giornata';
import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { JsonpClientBackend } from '@angular/common/http';

@Component({
  selector: 'app-giornate',
  templateUrl: './giornate.component.html',
  styleUrls: ['./giornate.component.css']
})
export class GiornateComponent {

  public d_manifestazione: string;
  public data_inizio = new Date();
  public data_fine = new Date();
  public title = "elenco giornate Manifestazione - Manif-data";
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;

  public giornate: Giornata[] = [];
  public giornata: Giornata;
  public manif: Manifestazione;
  public giornatenull: Giornata[] = [];

  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';

  options = [
    'Tutte',
    'Prenotabili',
    'Aperta',
    'Chiusa'
  ];

   // per paginazone
p: number = 1;

// -----------------------------    da detail1



// variabili per editazione messaggio
public alertSuccess = false;
public savechange = false;
public isVisible = false;

public nRecMan = 0;
public nRec = 0;
public trovatoRec = false;
public Message = '';
public isSelected = false;

public saveValueStd: boolean;
public lastNumber = 0;
public fase = '';


public isLoading = false;
public fieldVisible = false;
public messageTest1  = 'Operazione conclusa correttamente ';

// variabili per visualizzazione messaggio di esito con notifier
public type = '';
public message = '';



// parametri per interfaccia a ghost
// Parametri obbligatori:
// - routeApp
// parametri facoltativi
// keyn ---->  se numerico trasformarlo in stringa
// tipo
//     S--> campo string
//     N--> campo Numerico
//     *--> non serve key

// se impostato tipo = '*'  va impostato anche key a '*'

public routeApp = '';
public keyn = 0;
public keys = '';
public tipo = '';


public href = '';
public idpassed = 0;

public statoModulo  = '?';
public ricercaIniziale = '';

closeResult = '';

public level = 0;
public nRecord = 0;
public enabledFunc = false;
public rotta = '';
public rottaId = 0;
public rottaFunz = '';


// variabili per editazione messaggio

public Message1 = '';
public Message2 = '';
public Message3 = '';
public Message1err = 'Contattare il gestore dell applicazione.';

public isValid = false;
public idManif = 0;
public functionSelected = '';

public selectedTit = 0;
public selectedRuo = 0;
public selectedweb = 0;
public selectedSta = 0;

// per gestione abilitazione funzioni con service Moreno

public functionUrl = '';

public functionUrlUp = '';
public functionUserUp = '';

constructor(private manifestazioneService: ManifestazioneService,
            private giornataService: GiornataService,
            private route: ActivatedRoute,
            private router: Router,
            private modalService: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

  ngOnInit(): void {
    this.goApplication();
  }

  goApplication() {

    this.isVisible = true;
    this.alertSuccess = true;

    this.route.paramMap.subscribe(p => {
          this.idpassed = +p.get('idManif');
          console.log('id recuperato: ' + this.idpassed);
          // -------  leggo i dati della giornata
          this.loadManifestazione(this.idpassed);
          this.loadGiornatefromManif(this.idpassed);
      });

    this.type = 'success';
    this.Message = 'Situazione Attuale Giornate';
    this.showNotification(this.type, this.Message);
  }

// recupero i dati della messa
async loadManifestazione(id: number) {
 console.log('frontend - loadManifestazione: ' + id);
 let rc = await  this.manifestazioneService.getbyid(id).subscribe(
   response => {
       if(response['rc'] === 'ok') {
          this.manif = response['data'];
        }
        if(response['rc'] === 'nf') {
          this.isVisible = true;
          this.alertSuccess = false;
          this.Message = 'manifestazione inesistente ..  avvisare ced';
          this.showNotification(this.type, this.Message);
          alert('manifestazione inesistente ..  avvisare ced')
        }
   },
   error => {
      alert('loadManifestazione: ' + error.message);
      console.log(error);
   });

}

// metodo fatto da Moreno per selezionare le giornate della manifestazione

async loadGiornatefromManif(id: number) {
   console.log('frontend - loadGiornatefromManif: ' + id);
   this.trovatoRec = false;
   this.isVisible = true;
   let rc = await  this.giornataService.getAllGiornatebyManif(id).subscribe(    //  getGiornateforManif
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      response => {
         if(response['rc'] ===  'ok') {
          this.giornate = response['data'];
          this.nRec = response['number'];
          this.textMessage = response['message'];
          this.alertSuccess = true;
         }
         if(response['rc'] ===  'nf') {
          this.nRec = 0;
          this.textMessage = response['message'];
          this.alertSuccess = false;
         }


       //   alert('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
       //   console.log('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
      },
      error => {
         alert('Manifestazione-Data  -- loadGiornatefromManif: ' + error.message);
         console.log(error);
         this.alertSuccess = false;
         this.Message = error.message;
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

registra() {

  this.router.navigate(['giornata/new/' + this.manif.id]);

}


onSelectionChange(tipo: string)   {

 // alert('onSelectionChange - Tipo Richiesta: ' + tipo);

  this.tipoRichiesta = tipo.substring(0, 1);


  this.trovatoRec = false;
  this.isVisible = true;
  this.giornataService.getGiornateforManif(this.idpassed).subscribe(
    // sentire hidran per lettura particolare
   // this.fedeleService.getFedeliforMessa(id).subscribe(
      response => {
          console.log('dopo ricerca per tipo ' + this.tipoRichiesta + ' esito: ' + response['rc'] + ' dati: ' + JSON.stringify(response['data']) + ' record: ' + response['number']) ;
          if(response['rc'] === 'ok') {
            this.giornate = response['data'];
            this.nRec = response['number'];
            this.textMessage = response['message'];
            this.trovatoRec = true;
            this.alertSuccess = true;
            this.Message = 'Situazione Attuale';
          }
          if(response['rc'] === 'nf') {
            this.giornate = this.giornatenull;
            this.nRec = response['number'];
            this.textMessage = response['message'];
            this.trovatoRec = false;
            this.alertSuccess = false;
            this.Message = 'Situazione Attuale - Nessuna giornata presente per il tipo di richiesta';
          }


       //   alert('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
       //   console.log('loadGiornateFromManif - dovrei aver letto le giornate' + this.nRec + ' Messaggio: ' + this.textMessage);
      },
      error => {
         alert('Manifestazione-day  -- onSelectionChange: ' + error.message);
         console.log(error);
         this.alertSuccess = false;
         this.Message = error.message;
      });




  }

}


