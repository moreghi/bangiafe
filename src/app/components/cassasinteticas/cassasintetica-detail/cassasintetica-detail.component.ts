import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply, faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// classe
import { Giornata } from '../../../classes/Giornata';
import { Cassasintetica } from '../../../classes/Cassasintetica';
import { Commanda } from '../../../classes/Commanda'
import { Manifestazione } from '../../../classes/Manifestazione';

// services
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { GiornataService } from './../../../services/giornata.service';
import { CassasinteticaService } from './../../../services/cassasintetica.service';
import { CommandaService } from '../../../services/commanda.service'

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cassasintetica-detail',
  templateUrl: './cassasintetica-detail.component.html',
  styleUrls: ['./cassasintetica-detail.component.css']
})
export class CassasinteticaDetailComponent implements OnInit {

  public title = "Gestione Cassa Sintetica -  Cassasintyetica-detail works!";

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
  faEuroSign = faEuroSign;

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

  public href = '';
  public idpassed = 0;


  public statoModulo  = '?';
  public ricercaIniziale = '';

  closeResult = '';

  public level = 0;
  public nRecord = 0;
  public enabledFunc = false;
  public rotta = '';
  public rottafase = '';
  public rottaId = 0;
  public rottaIdManif = 0;



// variabili per editazione messaggio

public Message1 = '';
public Message2 = '';
public Message3 = '';
public Message1err = 'Contattare il gestore dell applicazione.';

public isValid = false;
public idManif = 0;
public idGiornata = 0;

// per gestione abilitazione funzioni con service Moreno

public functionUrl = '';


  // ---------------------  personalizzazioni componente

  giornata: Giornata;
  cassasintetica: Cassasintetica;
  manif: Manifestazione;
  commande: Commanda[] = [];

  // ------------------   variabili per controllo data

  public datepipe: DatePipe = new DatePipe('en-US');
  public formattedDate: string;

  public date1: Date;
  public date2: Date;


  public date1n: number;
  public date2n: number;

  public date1s: string;
  public date2s: string;


  // contrData
  public dt1: any;
  public dt2: any;
  public diffDays1: any;
  public diffDays2: any;

  public dataGiorno: any;

  public stato = 1;
  public data = Date();
  public activateSelection = false;
  public nRecCommande  = 0;

  public pathimage = 'assets/images/tipologia/';
  public cassacorrect = false;

  constructor(public modalService: NgbModal,
              private giornataService: GiornataService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private manifestazioneService: ManifestazioneService,
              private cassasinteticaService: CassasinteticaService,
              private commandaService: CommandaService,
              private notifier: NotifierService) {
                  this.notifier = notifier;
              }


              ngOnInit(): void {
                this.goApplication();
              }

              goApplication() {

                this.isVisible = true;
                this.alertSuccess = true;
                this.cassacorrect = false;

                this.rotta = this.route.snapshot.url[0].path;
                this.rottafase = this.route.snapshot.url[1].path;

          //      this.idManif = +this.route.snapshot.url[2].path;

                console.log('cassasintetica-detail - rotta: ' + this.rotta);
                console.log('cassasintetica-detail - rottafase: ' + this.rottafase);

                if(this.rottafase === 'new') {
                 this.cassasintetica = new Cassasintetica();
                 this.cassasintetica.key_utenti_operation = +localStorage.getItem('id');
                 this.title = 'Gestione Cassa Sintetica';
                 this.fase = 'N';
                 this.Message = `Inserire i dati della giornata`;

                 this.route.paramMap.subscribe(p => {
                  this.idpassed = +p.get('id');
                  console.log('id recuperato: ' + this.idpassed);
                  // -------  leggo i dati della giornata
                  this.loadGiornata(this.idpassed);
                });

              } else {
                this.route.paramMap.subscribe(p => {
                  this.idpassed = +p.get('id');
                  console.log('id recuperato: ' + this.idpassed);
                  // -------  leggo i dati della giornata
                  this.loadCassasintetica(this.idpassed);
                  this.title = 'Aggiornamento CXassa Sintetica';
                  this.fase = 'M';
                  this.Message = 'Situazione Attuale Cassa Sintetica';
               });
            }
            this.type = 'success';
            this.showNotification(this.type, this.Message);
           }

           async  loadCassasintetica(id: number) {

            let rc = await this.cassasinteticaService.getbyGiornata(id).subscribe(
                resp => {

                      if(resp['rc'] === 'ok') {
                        this.cassasintetica = resp['data'];
                        this.loadGiornata(this.cassasintetica.idGiornata);
                        this.loadcommande(id);
                      }
                   },
                error => {
                     alert('sono in loadCassasintetica');
                     this.isVisible = true;
                     this.alertSuccess = false;
                     console.log('loadCassasintetica - errore: ' + error.error);
                     this.type = 'error';
                     this.Message = error.message;
                     this.alertSuccess = false;
                     this.showNotification(this.type, this.Message);
                 });
             }


           async  loadcommande(id: number) {

            let rc = await this.commandaService.getCommandebyGiornata1(id).subscribe(
             resp => {
                  if(resp['rc'] === 'ok') {
                    this.commande = resp['data'];
                    this.nRecCommande = resp['number'];
                  }
                  if(resp['rc'] === 'nf') {
                    this.nRecCommande = 0;
                  }
             },
             error => {
                  alert('sono in loadcommande -- error');
                  this.isVisible = true;
                  this.alertSuccess = false;
                  console.log('loadcommande - errore: ' + error.error);
                  this.type = 'error';
                  this.Message = error.message;
                  this.alertSuccess = false;
                  this.showNotification(this.type, this.Message);
                });
           }

         async  loadManif(id: number) {
               console.log(`loadManif - appena entrato`);
               let rc = await this.manifestazioneService.getbyid(id).subscribe(
                resp => {
                      if(resp['rc'] === 'ok') {
                            console.log(`loadManif:  ${JSON.stringify(resp['data'])} `);
                            this.manif = resp['data'];
                            this.manif.key_utenti_operation = +localStorage.getItem('id');
                            if(this.manif.stato === 0) {

                            } else {

                            }

                            console.log('fatto lettura manif: ' + this.manif.id);
                          //  this.type = 'success';
                         //   this.Message = 'situazione attuale Manifestazione';
                         //   this.alertSuccess = true;
                      }

                   },
                error => {
                     alert('sono in loadManif');
                     this.isVisible = true;
                     this.alertSuccess = false;
                     console.log('loadManif - errore: ' + error.error);
                     this.type = 'error';
                     this.Message = error.message;
                     this.alertSuccess = false;
                     this.showNotification(this.type, this.Message);
                   });
              }


async loadGiornata(id: number) {

  console.log(`loadGiornata - appena entrato` + id);
  let rc = await this.giornataService.getbyId(id).subscribe(
   resp => {
         console.log(`loadGiornata: ----------------------->  ${JSON.stringify(resp['data'])} `);
         if(resp['rc'] === 'ok') {
            this.giornata = resp['data'];
            this.loadManif(this.giornata.idManifestazione)
          }
   },
   error => {
        alert('sono in loadGiornata');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('loadGiornata - errore: ' + error.error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
      });
}

aggiornacassaAttuale(event) {
 // alert('event: ' + event)

  this.cassasintetica.cassaAttuale = event;
  this.cassasintetica.cassaInziale = event;
  this.cassacorrect = true;
}

  async conferma(cassasintetica: Cassasintetica) {
    console.log('conferma - fase: ' + this.fase);
    this.Message = '';
// controllo sulle date

    switch (this.fase)  {

        case 'N':
        console.log('sono in conferma: ' + JSON.stringify(cassasintetica))
       if(cassasintetica.cassaInziale == 0) {
        this.type = 'error';
        this.Message = 'Valorizzare la cassa Iniziale !!';
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
        return;
       }

       cassasintetica.dataCassa = this.giornata.dtGiornata1;
       cassasintetica.idGiornata = this.giornata.id;
        console.log('pronto per fare inserimento ' + JSON.stringify(cassasintetica));
        let rc = await  this.cassasinteticaService.create(cassasintetica).subscribe(
          res => {
                if(res['rc'] === 'ok') {
                  this.aggiornaGiornata(this.giornata);
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
      let rc1 = this.cassasinteticaService.update(cassasintetica).subscribe(
          res => {

                this.giornata = res['data'];
                this.type = 'success';
                this.Message = 'Aggiornata cassa Finale';
                this.alertSuccess = true;
                this.router.navigate(['giornate/' + this.manif.id]);
             },
            error => {
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;

            });
          break;
      default:
        alert('nav - funzione non ancora attivata');
        break;
    }
    this.showNotification(this.type, this.Message);
  }

  async aggiornaGiornata(giornata: Giornata) {
        giornata.statoCassa = 1;
        if(giornata.statoCassa == 1  &&
           giornata.statoUtenti == 1  &&
           giornata.statoMagazzino == 1) {
            giornata.stato = 2    // giornata aperta
           }

          console.log(`Giornata-detail -- conferma (upd) : ${JSON.stringify(giornata)}`);

          let rc1 = this.giornataService.update(giornata).subscribe(
              res => {
                   if(res['rc'] === 'ok') {
                      this.giornata = res['data'];
                      this.type = 'success';
                      this.Message = 'Aggiornato correttamente la cassa iniziale ';
                      if(giornata.stato == 2) {
                        this.Message = 'Aggiornato correttamente la cassa iniziale e aperta la giornata';
                      }
                      this.alertSuccess = true;
                      this.router.navigate(['giornate/' + this.manif.id]);
                   }
             },
             error => {
                   console.log(error);
                   this.type = 'error';
                   this.Message = error.message;
                   this.alertSuccess = false;
                   this.showNotification(this.type, this.Message);
                });

        this.showNotification(this.type, this.Message);
      }

      cassaDettagliata(giornata: Giornata) {
        alert('cambia cassa a Dettagliata')
        this.router.navigate(['giornata/CassaDett/' + this.idpassed]);

      }




/*

 if(this.giornata.statoCassa == 1  &&
       this.giornata.statoUtenti == 1  &&
       this.giornata.statoMagazzino == 1) {
        this.giornata.stato = 2    // giornata aperta
       }

      console.log(`Giornata-detail -- conferma (upd) : ${JSON.stringify(this.giornata)}`);

      let rc1 = this.giornataService.update(this.giornata).subscribe(
          res => {
               if(res['rc'] === 'ok') {
                  this.giornata = res['data'];
                  this.type = 'success';
                  this.Message = 'Aggiornato correttamente il Listino con disponibiliktà e prezzo prodotti';          //'utente aggiornato con successo del cazzo';
                  this.alertSuccess = true;
                  this.router.navigate(['giornate/' + this.manif.id]);
               }

         },
         error => {
               console.log(error);
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
               this.showNotification(this.type, this.Message);
            });

    this.showNotification(this.type, this.Message);




*/


  reset() {
  alert('da fare')

  }

  goback() {
     this.router.navigate(['manif/' + this.manif.id]);
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
