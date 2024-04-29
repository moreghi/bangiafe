import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// classe

import { Volontario } from '../../../classes/Volontario'
// services
import { VolontarioService } from './../../../services/volontario.service';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-volontario-detail',
  templateUrl: './volontario-detail.component.html',
  styleUrls: ['./volontario-detail.component.css']
})
export class VolontarioDetailComponent implements OnInit {



  public title = "Gestione Volontario -  giornata-detail works!";

// icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faSave = faSave;
  faUserEdit = faUserEdit;
  faMinus = faMinus;
  faPlus = faPlus;
  faWindowClose = faWindowClose;
  faTrash = faTrash;
  faReply = faReply;

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

  public statoStampa = '';

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

// per gestione abilitazione funzioni con service Moreno

public functionUrl = '';


  // ---------------------  personalizzazioni componente

  volontario: Volontario;
  volontari: Volontario[] = [];

  public tipoRic = '';
  public tipoGiornata = '';

  // ------------------   variabili per controllo data

  public datepipe: DatePipe = new DatePipe('en-US');
  public formattedDate: string;


  public foundLastday = false;
  public neverDay = '';
  public enabledDay = false;   // se stato manifestazione = 0 (non aperta) abilito il taso conferma per inserire giornate
  public prg = 0;
  public rottafase = '';

  public dataGiorno: any;
  public selezionatoAll = false;
  public selezionatoActivi = false;
  public selezionatoSel = false;
  public SelectionUser = false;
  public tipoRichiesta = '';
  public amenu = '';

  options = [
    'Tutti',
    'Attivi',
    'Non Attivi',
    'Selezione'
  ];

  options1 = [
    'Si',
    'No'
  ];

  public stato = 1;

  public activateSelection = false;

  public searchText = '';
// per paginazone
  p = 1;
  p1 = 1;
  datawork = 'nonselect'


  public listwork = 1;
  public nprodtot = 0;
  public nprodtots = 0;
  public nprodtotn = 0;
  public nprodamenu = 0;
  public listinow = 1;
  public idGiornatasave = 0;

  constructor(public modalService: NgbModal,
              private volontarioService: VolontarioService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private notifier: NotifierService) {
                  this.notifier = notifier;
              }


              ngOnInit(): void {
                this.goApplication();
              }

              goApplication() {

                this.isVisible = true;
                this.alertSuccess = true;

                this.rotta = this.route.snapshot.url[0].path;
                this.rottafase = this.route.snapshot.url[1].path;

                console.log('volontario-detail - rotta: ' + this.rotta);
                console.log('volontario-detail - rottafase: ' + this.rottafase);

                if(this.rottafase === 'new') {
                 this.volontario = new Volontario();
                 this.volontario.key_utenti_operation = +localStorage.getItem('id');
                 this.title = 'Inserimento Volontario';
                 this.fase = 'N';
                 this.Message = `Inserire i dati del volontario`;

               } else {
                   this.route.paramMap.subscribe(p => {
                     this.idpassed = +p.get('id');
                     console.log('id recuperato: ' + this.idpassed);
                     // -------  leggo i dati della giornata
                     this.loadVolontario(this.idpassed);
                     this.title = 'Aggiornamento VolontaRIO';
                     this.fase = 'M';
                     this.Message = 'Situazione Attuale Volontario';
                  });
              }
              this.type = 'success';
              this.showNotification(this.type, this.Message);
           }

   async loadVolontario(id: number) {

  console.log(`loadVolontario - appena entrato` + id);
  let rc = await this.volontarioService.getbyid(id).subscribe(
   resp => {
         if(resp['rc'] === 'ok') {
            this.volontario = resp['data'];
            this.type = 'success';
            this.alertSuccess = true;
            this.Message = 'situazione attuale volontario';
          }
         if(resp['rc'] === 'nf') {
            this.type = 'error';
            this.alertSuccess = false;
            this.Message = 'Nessun volontario presente';
          }
          this.showNotification(this.type, this.Message);
   },
   error => {
        alert('sono in loadVolontario');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('loadVolontario - errore: ' + error.error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
      });
}



  async conferma(volontario: Volontario) {
    console.log('conferma - fase: ' + this.fase);
    this.Message = '';

    console.log('tutto ok');

    switch (this.fase)  {

        case 'N':
        console.log('pronto per fare inserimento ' + JSON.stringify(this.volontario));

        let rc = await  this.volontarioService.create(volontario).subscribe(
          res => {
                if(res['rc'] === 'ok') {
                  this.volontario = res['data'];
                  this.type = 'success';
                  this.Message =  'Volontario creato Correttamente';                               //'utente  creato con successo';
                  this.alertSuccess = true;
                  this.router.navigate(['volontari']);
                }
             },
            error => {
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
               this.showNotification(this.type, this.Message);
            });
          break;
      case 'M':

      console.log(`volontario-detail -- conferma (upd) : ${JSON.stringify(volontario)}`);


      let rc1 = this.volontarioService.update(volontario).subscribe(
          res => {
                this.volontario = res['data'];
                this.type = 'success';
                this.Message = 'Volontario aggiornato con successo';          //'utente aggiornato con successo del cazzo';
                this.alertSuccess = true;
                this.showNotification(this.type, this.Message);
                this.router.navigate(['volontari']);
             },
            error => {
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
               this.showNotification(this.type, this.Message);
            });
          break;
      default:
        alert('nav - funzione non ancora attivata');
        break;
    }
    this.showNotification(this.type, this.Message);
  }


  goback() {
     this.router.navigate(['volontari']);
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



   open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
      if(result ===  'Cancel click') {
         this.cancellazioneAbort();
      }
      if(result ===  'Delete click') {
        // gestire uscita da popup
        this.cancellaUser(this.volontario);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
   //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
      this.cancellazioneAbort();
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cancellazioneAbort() {
    this.type = 'warning';
    this.Message = 'cancellazione abbandonata dall utente';
    this.showNotification(this.type, this.Message);
  }

  cancellaUser(volontario: Volontario) {

    this.volontarioService.delete(volontario).subscribe(
        response => {
          if(response['ok']) {
            this.isVisible = true;
            this.alertSuccess = true;
            this.type = 'success';
            this.Message = 'Volontario cancellato correttamente';
            this.showNotification(this.type, this.Message);
          }
      },
      error =>
          {
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore cancellazione volontario' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
          });
  }


  onSelectionChange(tipo: string)   {

    alert('da fare')
    // alert('onSelectionChange - Tipo Richiesta: ' + tipo);

// attenzione da sistemare


                //    this.tipoRichiesta = tipo.substring(0, 1);

                //    this.trovatoRec = false;
                //    this.isVisible = true;
                //    this.activateSelection = false;

                //    switch (this.tipoRichiesta) {
                //     case 'T':
                //      this.activateSelection = false;
                //      this.loadAllprodottiwork(this.listwork);
                //  //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                //     break;
                //     case 'A':
                //         this.activateSelection = false;
                //         this.amenu = 'S'
                //         this.loadprodottibyamenu(this.listinowork.id, this.amenu)
                //       break;
                //     case 'N':
                //         this.activateSelection = false;
                //         this.amenu = 'N'
                //         this.loadprodottibyamenu(this.listinowork.id, this.amenu)
                //       break;
                //     case 'S':
                //     this.activateSelection = true;
                //       break;
                //     default:
                //     alert('Scelta errata \n ricerca non possibile');
                //     break;
                //   }
 }

  // getColor(amenu: string) {
  //   switch (amenu) {
  //     case 'S':
  //       return 'green';
  //     case 'N':
  //       return 'red';
  //   }
  // }






}
