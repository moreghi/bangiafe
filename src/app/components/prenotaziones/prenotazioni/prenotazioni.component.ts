import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { EventoService } from '../../../services/evento.service';
import { PrenotazioneService } from '../../../services/prenotazione.service';
import { WGiornataService } from 'src/app/services/w-giornata.service';

// import { ManifestazioneService } from '../../../../services/manifestazione.service';
// import { AbilfunctioneService } from '../../../../services/abilfunctione.service';
// import { CtrfuncService } from '../../../../services/ctrfunc.service';
// import { GiornataService } from './../../../../services/giornata.service';
// classi
import { Prenotazione} from '../../../classes/Prenotazione';
import { Evento} from '../../../classes/Evento';
import { W_Giornate } from 'src/app/classes/W_Giornate';

// import { Abilfunctione} from '../../../../classes/Abilfunctione';
// import { Manifestazione} from '../../../../classes/Manifestazione';
// import { Giornata } from '../../../../classes/Giornata';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';






@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.css']
})
export class PrenotazioniComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public prenotazioni: Prenotazione[] = [];
  public prenotazioninull: Prenotazione[] = [];
  public prenotazione: Prenotazione;
  public giornate: Prenotazione[] = [];
  public evento: Evento;
  public wgiornate: W_Giornate[] = [];
  public wgiornata: W_Giornate;

  /*
  public abilfunctione: Abilfunctione;
  public manifestazione: Manifestazione;
  public giornate: Giornata[] = [];
  */

 /*    legenda typo messaggio esito

  this.type = 'error';    --- operazione in errore
  this.type = 'success';  --- operazione conclusa correttamente
  this.type = 'default';
  this.type = 'info';
  this.type = 'warning';
*/

 // variabili per gestione inqu/edit/new

 public href = '';
 public functionUser = '';
 public functionInqu = false;
 public functionEdit = false;
 public functionNew = false;
 public functionElenco = false;

 public searchInqu = 'show';
 public searchEdit = 'edit';
 public searchNew = 'new';
 public searchElenco = 'read';


 // funzioni di navigazione
 public navigateInqu = 'Inqu';
 public navigateEdit = 'Edit';
 public navigateEdits = 'Edits';


// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "elenco Prenotazioni";
  public trovatoRec = false;
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;


  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

 options = [
    'Tutte',
    'Da Evadere',
    'Evase',
    'selezionata'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public emailutente = '';
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente
  public enabledSelectday = false;
  public idDayActive = 0;
  public selectedDay = 0;
  public datadioggi = '';
  public dataOdierna: Date;
  public idpassed = 0;
  public statoSel = 0;
  public presentiGiornate = false;

constructor(private prenotazioneService: PrenotazioneService,
            private eventoService: EventoService,
            private wGiornataService: WGiornataService,

            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private datePipe: DatePipe,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
              this.isVisible = true;
              this.selectedDay = 0;
             //    this.checkFunctionbylevel();     da eliminare

              this.goApplication();


          }


          goApplication() {

            const date = Date();
            this.dataOdierna = new Date(date);
            this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');
            this.route.paramMap.subscribe(p => {
            this.idpassed = +p.get('id');
            console.log('id recuperato: ' + this.idpassed);
            this.loadEvento(this.idpassed);
            // carico le giornate per selezione
            this.enabledSelectday = true;
            this.ricreaAllGiornate(this.idpassed);

          })
     }

 async loadEvento(id: number) {
  console.log('frontend - loadEvento: ' + id);
  let rc = await  this.eventoService.getbyId(id).subscribe(
  response => {
  if(response['rc'] === 'ok') {
    this.evento = response['data'];
  //  this.loadGiornate(this.evento.id);    spostato
    this.statoSel = 0;
    this.loadPrenotazioni(this.evento.id, this.statoSel);
   }

},
error => {
    alert('loadEvento: ' + error.message);
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    this.Message = 'Errore loadEvento' + '\n' + error.message;
    this.showNotification(this.type, this.Message);
    console.log(error);
});

 }





          async loadPrenotazioni(id: number, stato: number) {
            console.log('loadPrenotazioni --- appena entrato ');
            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            this.searchText = '';
            let rc =  await  this.prenotazioneService.getbyeventoestato(id, stato).subscribe(
                 res => {
                    this.prenotazioni = res['data'];
                    console.log('le prenotazioni gobali  sono: ' + JSON.stringify(res['data']));
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale Prenotazioni';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Prenotazioni  -- loadPrenotazioni - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }


          async loadAllPrenotazioni(id: number) {
            console.log('loadPrenotazioni --- appena entrato ');
            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            this.searchText = '';
            let rc =  await  this.prenotazioneService.getbyevento(id).subscribe(
                 res => {
                    this.prenotazioni = res['data'];
                    console.log('le prenotazioni gobali  sono: ' + JSON.stringify(res['data']));
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale Prenotazioni';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Prenotazioni  -- loadAllPrenotazioni - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }


          async loadPrenotazioniUtente(email: string) {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.trovatoRec = false;
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.prenotazioneService.getbyemail(email).subscribe(
                 res => {
                    this.prenotazioni = res['data'];
                    console.log('le prenotazioni utente  sono: ' + JSON.stringify(res['data']));
                    this.nRec = res['number'];
                    this.trovatoRec = true;
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                },
                error => {
                   alert('Prenotazioni  -- loadPrenotazioni - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }
/*
     async   loadAllday(id: number) {  // carico tutte le giornate della festa
            console.log('loadAddday --  appena entrato : ' + id);
            let rc =  await  this.giornataService.getGiornatebyManif(id).subscribe(
              res => {
                 this.giornate = res['data'];
        //         console.log('le giornate della manifestazione sono: ' + JSON.stringify(res['data']));
             },
             error => {
                alert('Prenotazioni  -- loadPrenotazioni - errore: ' + error.message);
                console.log(error);
                this.Message = error.message;
                this.alertSuccess = false;
             });
          }
*/

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


  Nuovo() {
    this.router.navigate(['manif/new']);
  }

  onSelectionChange(tipo: string)   {

    this.tipoRichiesta = tipo;  //tifedel.substring(0,1);
    this.validSearch = true;

    if(this.tipoRichiesta === '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
        return;
      }

    switch (this.tipoRichiesta) {
                case 'Tutte':
                  this.enabledSelectday = false;
                  this.loadAllPrenotazioni(this.idpassed);
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                  break;
                case 'Da Evadere':
                  this.enabledSelectday = false;
                  this.statoSel = 0;
                  this.loadPrenotazioni(this.idpassed, this.statoSel);
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                  break;
                case 'Evase':
                  this.enabledSelectday = false;
                  this.statoSel = 1;
                  this.loadPrenotazioni(this.idpassed, this.statoSel);

             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                  break;
                case 'selezionata':
                  this.enabledSelectday = true;
                  // ricreo elenco delle giornate
                  this.ricreaAllGiornate(this.idpassed);
                  break;

                default:
                alert('Scelta errata \n ricerca non possibile');
                break;
       }
    }


      async  ricreaAllGiornate(id: number) {
        // cancello la vecchia tabella w_giornate
        this.presentiGiornate = false;
        this.cancellaAllwgiornate(id);
   }


  async  cancellaAllwgiornate(id: number) {

    let rc = await  this.wGiornataService.deleteAll().subscribe(
      res => {
          if(res['rc'] !== 'ok') {
             this.Message = 'errore in cancellazione all w_giornate';
             this.alertSuccess = false;
          }
          if(res['rc'] === 'ok') {
            this.loadGiornate(id);
         }
     },
     error => {
        alert('cancellaAllwgiornate - errore: ' + error.message);
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
     });
  }

  async   loadGiornate(id: number) {  // carico tutte le prenotazioni ordinate per data conferma
    console.log('loadGiornate --  appena entrato ');
    let rc =  await  this.prenotazioneService.getgiornateConf(id).subscribe(
      res => {
         this.giornate = res['data'];
         let prg = 0;

         for(let giornata of this.giornate) {
           this.wgiornata = new W_Giornate();
           prg = prg + 1;
           this.wgiornata.id =  prg;
           this.wgiornata.datadelGiorno =  giornata.dataconf;
           this.wgiornata.key_utenti_operation = 1;
           this.creawgiornata(this.wgiornata);
         }
          this.loadWgiornate();
     },
     error => {
        alert('Prenotazioni  -- loadGiornate - errore: ' + error.message);
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
     });
  }

  async creawgiornata(wgiornata: W_Giornate)  {
     console.log('------------------   sto facendo create di wgiornata: ' + JSON.stringify(wgiornata));
    await this.wGiornataService.create(wgiornata).subscribe(
      response => {
          if(response['rc'] === 'ok') {
  //       non faccio nulla
          }

      },
      error =>
      {
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
      });
  }


  async loadWgiornate() {
    await this.wGiornataService.getAll().subscribe(
      response => {
          if(response['rc'] === 'ok') {
            this.wgiornate = response['data'];
            console.log('letto le wgiornate ' + JSON.stringify(this.wgiornate))
            this.presentiGiornate = true;
          }

      },
      error =>
      {
        console.log(error);
        this.Message = error.message;
        this.alertSuccess = false;
      });
  }




    selectedGiornata(selectedValue: number) {
      //  alert('selezionato: ' + selectedValue);
        if(selectedValue ==  999) {
          this.type = 'error';
          this.Message = 'selezione non corrette';
          this.showNotification(this.type, this.Message);
          this.alertSuccess = false;
          this.isVisible = true;
          return;
       } else {
        this.selectedDay = selectedValue;
        console.log('giornata selezionata: ' + this.selectedDay);
        // dato che la combo ha campi diversi da prenotazione devo reciperare la data e passarla
        // per lettura per data
        this.loaddataSelect(this.selectedDay);
       }
   }



   async  loaddataSelect(selectedDay: number) {
    // console.log('loaddataSelect -- appena entrato');
      let rc = await  this.wGiornataService.getbyid(selectedDay).subscribe(
           res => {
               if(res['rc'] === 'ok') {
                this.wgiornata = res['data'];
                this.loadPrenotazioniforDay(this.wgiornata.datadelGiorno);
               }

          },
          error => {
             alert('loaddataSelect - errore: ' + error.message);
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
          });
    }

 async  loadPrenotazioniforDay(datadelgiorno: string) {
    console.log('loadPrenotazionifroDay -- appena entrato ---- ' + datadelgiorno);

      this.nRec = 0;
      this.isVisible = true;
      this.searchText = '';

      let rc = await  this.prenotazioneService.getbydataconf(datadelgiorno).subscribe(
           res => {
               if(res['rc'] === 'ok') {
                this.prenotazioni = res['data'];
                this.nRec = res['number'];
                this.Message = 'situazione attuale';
                this.alertSuccess = true;
               }
               if(res['rc'] === 'nf') {
                this.prenotazioni = this.prenotazioninull;
                this.nRec = res['number'];
                this.Message = 'Nessuna prenotazione per la data selezionata';
                this.alertSuccess = false;
               }


          },
          error => {
             alert('loadPrenotazioniforDay - errore: ' + error.message);
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
          });

   }

   goback() {
    this.router.navigate(['/evento/prenotazioni']);

    }

   onDeletedPrenotazione(esito: string) { // ho effettuato la cancellazione quindi devo rifare l'elenco


    alert(' da fare');

   }

    /*
    console.log('onDeletedPrenotazione ----- ' + esito + ' level: ' + this.level);




    if(esito === 'Dpren' ) {  // valore impostato dal figlio in fase di cancellazione
      if(this.level === 0) { // cliente loggato che visualizza le proprie prenotazioni
        this.emailutente = localStorage.getItem('email');
        this.loadPrenotazioniUtente(this.emailutente);
      } else {
          if(this.enabledSelectday === false) {
            this.loadPrenotazioni();
          } else {
            this.loadPrenotazioniforDay(this.selectedDay);
          }
      }
    }  */
  }

/*


          async   checkFunctionbylevel() {
            this.rotta = this.route.snapshot.url[0].path;
            this.level = parseInt(localStorage.getItem('user_ruolo'));


            console.log('checkFunctiobylevel - inizio: -- rotta ' + this.rotta + ' level:' + this.level);

            let rc =  await this.ctrfuncService.getfuncbyProfilo(this.level, this.rotta).subscribe(
              res =>{
               console.log(res,'res-->');
               if(res['rc'] === 'ko')  {
                this.type = 'error';
                this.Message = res['message'];
                this.alertSuccess = false;
                this.showNotification(this.type, this.Message);
                return;
               }
               if(res['rc'] === 'ok') {
                  if(res['number'] !== 1) {
                    this.type = 'error';
                    this.Message = 'Modulo non ancona habilitation';
                    this.showNotification(this.type, this.Message);
                  }  else {
                    this.functionUser = res['data'];
                    //   parte pubblica   --  fine
                    console.log('checkFunctionbylevel - funzione determinata: ' + this.functionUser);
                    this.stato = 1;
                    this.loadManifestazioneActive(this.stato);
                    // parte personalizzata
                         this.level = parseInt(localStorage.getItem('user_ruolo'));

                    if(this.level === 0) { // cliente loggato che visualizza le proprie prenotazioni
                        this.emailutente = localStorage.getItem('email');
                        this.loadPrenotazioniUtente(this.emailutente);
                      } else {

                        this.loadPrenotazioni();
                      }
                   }
                  }
                },
                   error => {
                      alert('Prenotazioni  -- getfuncbyProfilo - errore: ' + error.message);
                      console.log(error);
                      this.Message = error.message;
                      this.alertSuccess = false;
                   });
          }





*/







