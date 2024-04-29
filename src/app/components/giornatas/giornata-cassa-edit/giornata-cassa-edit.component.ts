import { Component, Input, OnInit } from '@angular/core';

import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply, faUndo, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// classe
import { Giornata } from '../../../classes/Giornata';
import { Manifestazione } from '../../../classes/Manifestazione';

// services
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { GiornataService } from './../../../services/giornata.service';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-giornata-cassa-edit',
  templateUrl: './giornata-cassa-edit.component.html',
  styleUrls: ['./giornata-cassa-edit.component.css']
})
export class GiornataCassaEditComponent implements OnInit {

  public title = 'situagione giornaliera Cassa -  giornata-cassa-edit works';

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

    faUndo = faUndo;
    faHandPointLeft = faHandPointLeft;
    faTrashAlt = faTrashAlt;
    faInfoCircle = faInfoCircle;
    faThumbsUp = faThumbsUp;
    faThumbsDown = faThumbsDown;

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

    public functionInqu =  false;
    public functionEdit = false;
    public functionEdits = false;
    public functionNew = false;

    // funzioni di navigazione
    public navigateNew = 'new';
    public navigateInqu = 'inqu';
    public navigateEdit = 'edit';
    public navigateEdits = 'edits';

    public functionUser = '';

    public statoModulo  = '?';
    public ricercaIniziale = '';

    closeResult = '';

    public level = 0;
    public nRecord = 0;
    public enabledFunc = false;
    public rotta = '';
    public rottaId = 0;
    public rottaIdManif = 0;
    public rottaFunz = '';
    public rottaTipo = '';

  // variabili per editazione messaggio

  public Message1 = '';
  public Message2 = '';
  public Message3 = '';
  public Message1err = 'Contattare il gestore dell applicazione.';

  public isValid = false;
  public idManif = 0;
  public idGiornata = 0;

  // per gestione abilitazione funzioni con service Moreno


      public textMessage1 = '';
      public textMessage2 = '';
      public textUser = '';
      public headerPopup = '';
      public manif: Manifestazione;
      public giornata: Giornata;

    // public giornata: Giornata;
    //  campi calcolati per editazione
    // sbilancio
    public s100 = 0;
    public s050 = 0;
    public s020 = 0;
    public s010 = 0;
    public s005 = 0;
    public smoneta = 0;
    // valore iniziale
    public vi100 = 0;
    public vi050 = 0;
    public vi020 = 0;
    public vi010 = 0;
    public vi005 = 0;
    public vimoneta = 0;
    // valore attuale
    public va100 = 0;
    public va050 = 0;
    public va020 = 0;
    public va010 = 0;
    public va005 = 0;
    public vamoneta = 0;
    // valore finale
    public vf100 = 0;
    public vf050 = 0;
    public vf020 = 0;
    public vf010 = 0;
    public vf005 = 0;
    public vfmoneta = 0;
    // valore sbilancio
    public vs100 = 0;
    public vs050 = 0;
    public vs020 = 0;
    public vs010 = 0;
    public vs005 = 0;
    public vsmoneta = 0;
    // totali
    public tinizio = 0;
    public tattuale = 0;
    public tfinale = 0;
    public tsbilancio = 0;
    public enabledCassaFinale = false;
    public enabledCassaIniziale = false;

    public CassaCaricata = false;

    public inibisciModCassa = false;
    public giornataAperta = 9;
    public ctrCampoNum = false;

constructor(public modalService: NgbModal,
            private giornataService: GiornataService,
            private manifestazioneService: ManifestazioneService,
            private route: ActivatedRoute,
            private router: Router,
            private datePipe: DatePipe,
            private notifier: NotifierService) {
                  this.notifier = notifier;
              }


              ngOnInit(): void {

                console.log('giornata-detail-Cassa - sono in oninit ');
                this.goApplication();

              }

              goApplication() {

                this.isVisible = true;
                this.alertSuccess = true;

                this.loadTaglie();

                this.route.paramMap.subscribe(p => {
                  this.idpassed = +p.get('id');
                  console.log('id recuperato: ' + this.idpassed);
                  // -------  leggo i dati della giornata
                  this.loadGiornata(this.idpassed);

                  if(this.giornata.statoCassa == 0) {
                    this.fase = 'N';
                    this.title = 'Creazione Cassa di Giornata';
                  }
                  if(this.giornata.statoCassa == 1) {
                    this.fase = 'M';
                    this.title = 'Gestione Cassa di Giornata';
                  }
               });

              this.type = 'success';
              this.showNotification(this.type, this.Message);
           }

           loadTaglie() {
            // da fare lettura delle taglie
           }



            async  loadManif(id: number) {
                console.log(`loadManif - appena entrato`);
                let rc = await this.manifestazioneService.getbyid(id).subscribe(
                 resp => {
                       console.log(`loadManif:  ${JSON.stringify(resp['data'])} `);
                       this.manif = resp['data'];
                       this.manif.key_utenti_operation = +localStorage.getItem('id');

                   //    this.loadlastDay(this.idManif);
                       console.log('fatto lettura manif: ' + this.manif.id);
                     //  this.type = 'success';
                    //   this.Message = 'situazione attuale Manifestazione';
                    //   this.alertSuccess = true;
                    },
                 error => {
                      alert('sono in loadManif');
                      this.isVisible = true;
                      this.alertSuccess = false;
                      console.log('loadManif - errore: ' + error);
                      this.type = 'error';
                      this.Message = error.message;
                      this.alertSuccess = false;

                    });
               }

               async loadGiornata(id: number) {

                console.log(`loadGiornata - appena entrato` + id);
                let rc = await this.giornataService.getbyId(id).subscribe(
                 resp => {

                       console.log(`loadGiornata: ----------------------->  ${JSON.stringify(resp['data'])} `);
                       if(resp['rc'] === 'ok') {
                          this.giornata = resp['data'];
                          this.giornataAperta = this.giornata.stato;
                          if(this.giornata.statoCassa == 1) {
                            this.giornata.statoCassa = 3;
                          }
                          if(this.giornata.statoCassa == 0) {
                            this.giornata.statoCassa = 1;
                          }
                          this.giornata.key_utenti_operation = +localStorage.getItem('id');
                          this.giornata.tipocassa = 'D';
                          this.loadManif(this.giornata.idManifestazione)
                          this.conteggiaValori();




                          /*  la visualizzazione del checkbox non funziona - sospendo questa visualizzazione
                          this.inibisciModCassa = true;
                          if(this.giornata.statoCassa === 1 ) {
                              this.inibisciModCassa = false;
                             }
                             */
                        }
                       if(resp['rc'] === 'nf') {


                        }
                       console.log('fatto lettura  giornata: ' + this.giornata.id);
                     //  this.type = 'success';
                     //  this.Message = 'situazione attuale giornata';
                     //  this.alertSuccess = true;
                    },
                 error => {
                      alert('sono in loadGiornata');
                      this.isVisible = true;
                      this.alertSuccess = false;
                      console.log('loadGiornata - errore: ' + error);
                      this.type = 'error';
                      this.Message = error.message;
                      this.alertSuccess = false;

                    });
              }
               goback() {
                this.router.navigate(['/manif/' + this.manif.id]);
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

             conteggiaValori() {

                     // valori iniziali
                     this.vi100 = this.giornata.i100 * 100;
                     this.vi050 = this.giornata.i050 * 50;
                     this.vi020 = this.giornata.i020 * 20;
                     this.vi010 = this.giornata.i010 * 10;
                     this.vi005 = this.giornata.i005 * 5;
                     this.vimoneta = this.giornata.icontante;
                     // valori attuali
                     this.va100 = this.giornata.a100 * 100;
                     this.va050 = this.giornata.a050 * 50;
                     this.va020 = this.giornata.a020 * 20;
                     this.va010 = this.giornata.a010 * 10;
                     this.va005 = this.giornata.a005 * 5;
                     this.vamoneta = this.giornata.acontante;

                    // valori finali
                     this.vf100 = this.giornata.f100 * 100;
                     this.vf050 = this.giornata.f050 * 50;
                     this.vf020 = this.giornata.f020 * 20;
                     this.vf010 = this.giornata.f010 * 10;
                     this.vf005 = this.giornata.f005 * 5;
                     this.vfmoneta = this.giornata.fcontante;

                    // sbilancio
                     if(this.giornata.f100 === 0  &&
                         this.giornata.f050 === 0  &&
                         this.giornata.f020 === 0  &&
                         this.giornata.f010 === 0  &&
                         this.giornata.f005 === 0  &&
                         this.giornata.fcontante === 0)  {
                           this.s100 = this.giornata.a100 - this.giornata.i100;
                           this.s050 = this.giornata.a050 - this.giornata.i050;
                           this.s020 = this.giornata.a020 - this.giornata.i020;
                           this.s010 = this.giornata.a010 - this.giornata.i010;
                           this.s005 = this.giornata.a005 - this.giornata.i005;
                           this.smoneta = this.giornata.acontante - this.giornata.icontante;
                         }   else {
                           this.s100 = this.giornata.f100 - this.giornata.i100;
                           this.s050 = this.giornata.f050 - this.giornata.i050;
                           this.s020 = this.giornata.f020 - this.giornata.i020;
                           this.s010 = this.giornata.f010 - this.giornata.i010;
                           this.s005 = this.giornata.f005 - this.giornata.i005;
                           this.smoneta = this.giornata.fcontante - this.giornata.icontante;
                         }

                     this.vs100 = this.s100 * 100;
                     this.vs050 = this.s050 * 50;
                     this.vs020 = this.s020 * 20;
                     this.vs010 = this.s010 * 10;
                     this.vs005 = this.s005 * 5;
                     this.vsmoneta = this.smoneta;
                     //  totali
                     this.tinizio = this.vi100 + this.vi050 + this.vi020 +
                                    this.vi010 + this.vi005 + (this.giornata.icontante * 1);

                     this.tattuale = this.va100 + this.va050 + this.va020 +
                                    this.va010 + this.va005 + (this.vamoneta * 1);
                     this.tfinale = this.vf100 + this.vf050 + this.vf020 +
                                    this.vf010 + this.vf005 + (this.vfmoneta * 1);
                     if(this.tfinale === 0)  {
                        this.tsbilancio = this.tattuale - this.tinizio;
                     } else {
                        this.tsbilancio = this.tfinale - this.tinizio;
                     }
                     /*
                     this.tsbilancio = this.s100 + this.s050 + this.s020 +
                                    this.s010 + this.s005 + (this.smoneta * 1);  */

              }

              backToGiornata(){
                // this.router.navigate(['users']); // rimandavo a elenco utenti
                 this.router.navigate(['manif/' + this.giornata.idManifestazione]);
              }

              resetForm(form) {
                alert('cassa-reset form  -  da fare');

                // if (this.giornata.id === 0) {
                //   this.giornata = new Giornata();
                // } else {
                //   this.giornata = this.giornatacopy;
                // }

              }



                async SalvaCassa(giornata: Giornata) {
                  if(giornata.stato == 2 ) {
                    if(giornata.statoCassa == 1 &&
                      giornata.statoMagazzino == 1 &&
                      giornata.statoUtenti == 1) {
                       giornata.stato = 3;
                      }
                  }
                  if(giornata.stato == 0 || giornata.stato == 1 ) {
                    if(giornata.statoCassa == 1 &&
                      giornata.statoMagazzino == 1 &&
                      giornata.statoUtenti == 1) {
                       giornata.stato = 2;
                      }
                  }
                  let rc = await this.giornataService.update(giornata).subscribe(
                   resp => {
                           if(resp['rc'] === 'ok') {
                            this.isVisible = true;
                            this.alertSuccess = true;
                            this.type = 'success';
                             if(giornata.stato = 2) {
                              this.Message = 'Aperta cassa regolarmente';
                             }
                             if(giornata.stato = 3) {
                              this.Message = 'Chiusa cassa regolarmente e chiusa Giornata';
                             }
                       }

                   },
                   error => {
                        alert('sono in loadGiornata');
                        this.isVisible = true;
                        this.alertSuccess = false;
                        console.log('loadGiornata - errore: ' + error);
                        this.type = 'error';
                        this.Message = error.message;
                     });
                }

      registra() {
     //   alert(' da fare')
        this.giornataAperta = 0;

      //  this.router.navigate(['/giornata/ValoriCassa/Edits/' + this.giornata.id]);
      }
     chiusuraGiornata() {
      this.giornataAperta = 8;
     }





      ctri100(importo: any) {
      //  alert('ctri100 ' + importo)
        if (isNaN(importo)) {
          alert('inserito campo errato')
          this.Message = 'il valore inserito non è numerico'
          this.alertSuccess = false;
          this.ctrCampoNum = false;
          return;
        } else {
          this.giornata.i100Valore = importo * 100;
          this.ctrCampoNum = true;
          this.Message = ''
          this.alertSuccess = true;
       //  valori attuali
          this.giornata.a100 = importo;
          this.giornata.a100Valore = this.giornata.i100Valore;
       // totale
          this.giornata.cassaInizio = 0;
          this.giornata.cassaInizio = this.giornata.cassaInizio +
                                      this.giornata.i100Valore +
                                      this.giornata.i050Valore +
                                      this.giornata.i020Valore +
                                      this.giornata.i010Valore +
                                      this.giornata.i005Valore +
                                      this.giornata.icontante;
          this.giornata.cassaAttuale = this.giornata.cassaInizio;
        }
      }

      ctri050(importo: any) {
      //  alert('ctri050 ' + importo)
        if (isNaN(importo)) {
          alert('inserito campo errato')
          this.Message = 'il valore inserito non è numerico'
          this.alertSuccess = false;
          this.ctrCampoNum = false;
          return;
        } else {
          this.giornata.i050Valore = importo * 50;
          this.ctrCampoNum = true;
          this.Message = ''
          this.alertSuccess = true;
       //  valori attuali
          this.giornata.a050 = importo;
          this.giornata.a050Valore = this.giornata.i050Valore;
       // totale
          this.giornata.cassaInizio = 0;
          this.giornata.cassaInizio = this.giornata.cassaInizio +
                                     this.giornata.i100Valore +
                                     this.giornata.i050Valore +
                                     this.giornata.i020Valore +
                                     this.giornata.i010Valore +
                                     this.giornata.i005Valore +
                                     this.giornata.icontante;
          this.giornata.cassaAttuale = this.giornata.cassaInizio;
        }
      }

      ctri020(importo: any) {
     //  alert('ctri020 importo')
        if (isNaN(importo)) {
          alert('inserito campo errato')
          this.Message = 'il valore inserito non è numerico'
          this.alertSuccess = false;
          this.ctrCampoNum = false;
          return;
        } else {
          this.giornata.i020Valore = importo * 20;
          this.ctrCampoNum = true;
          this.Message = ''
          this.alertSuccess = true;
       //  valori attuali
          this.giornata.a020 = importo;
          this.giornata.a020Valore = this.giornata.i020Valore;
       // totale
          this.giornata.cassaInizio = 0;
          this.giornata.cassaInizio = this.giornata.cassaInizio +
                                       this.giornata.i100Valore +
                                       this.giornata.i050Valore +
                                       this.giornata.i020Valore +
                                       this.giornata.i010Valore +
                                       this.giornata.i005Valore +
                                       this.giornata.icontante;
          this.giornata.cassaAttuale = this.giornata.cassaInizio;
        }
      }

      ctri010(importo: any) {
        //  alert('ctri020 importo')
           if (isNaN(importo)) {
             alert('inserito campo errato')
             this.Message = 'il valore inserito non è numerico'
             this.alertSuccess = false;
             this.ctrCampoNum = false;
             return;
           } else {
             this.giornata.i010Valore = importo * 10;
             this.ctrCampoNum = true;
             this.Message = ''
             this.alertSuccess = true;
          //  valori attuali
             this.giornata.a010 = importo;
             this.giornata.a010Valore = this.giornata.i010Valore;
          // totale
             this.giornata.cassaInizio = 0;
             this.giornata.cassaInizio = this.giornata.cassaInizio +
                                          this.giornata.i100Valore +
                                          this.giornata.i050Valore +
                                          this.giornata.i020Valore +
                                          this.giornata.i010Valore +
                                          this.giornata.i005Valore +
                                          this.giornata.icontante;
             this.giornata.cassaAttuale = this.giornata.cassaInizio;
           }
         }

         ctri005(importo: any) {
          //  alert('ctri020 importo')
             if (isNaN(importo)) {
               alert('inserito campo errato')
               this.Message = 'il valore inserito non è numerico'
               this.alertSuccess = false;
               this.ctrCampoNum = false;
               return;
             } else {
               this.giornata.i005Valore = importo * 5;
               this.ctrCampoNum = true;
               this.Message = ''
               this.alertSuccess = true;
            //  valori attuali
               this.giornata.a005 = importo;
               this.giornata.a005Valore = this.giornata.i005Valore;
            // totale
               this.giornata.cassaInizio = 0;
               this.giornata.cassaInizio = this.giornata.cassaInizio +
                                            this.giornata.i100Valore +
                                            this.giornata.i050Valore +
                                            this.giornata.i020Valore +
                                            this.giornata.i010Valore +
                                            this.giornata.i005Valore +
                                            this.giornata.icontante;
               this.giornata.cassaAttuale = this.giornata.cassaInizio;
             }
           }



         ctricontante(importo: any) {
          //  alert('ctri020 importo')
             if (isNaN(importo)) {
               alert('inserito campo errato')
               this.Message = 'il valore inserito non è numerico'
               this.alertSuccess = false;
               this.ctrCampoNum = false;
               return;
             } else {
               this.giornata.icontante = importo * 1;
               this.ctrCampoNum = true;
               this.Message = ''
               this.alertSuccess = true;
            //  valori attuali
               this.giornata.acontante = importo;

            // totale
               this.giornata.cassaInizio = 0;
               this.giornata.fcontante = 999;
               this.giornata.cassaInizio = this.giornata.cassaInizio +
                                            this.giornata.i100Valore +
                                            this.giornata.i050Valore +
                                            this.giornata.i020Valore +
                                            this.giornata.i010Valore +
                                            this.giornata.i005Valore +
                                            this.giornata.icontante;
               this.giornata.cassaAttuale = this.giornata.cassaInizio;
             }
           }
 }
