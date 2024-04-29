import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// classe
import { Giornata } from '../../../classes/Giornata';
import { Manifestazione } from '../../../classes/Manifestazione';
import { Persona } from '../../../classes/Persona'
import { Volontario } from '../../../classes/Volontario'
import { Truoloday } from '../../../classes/T_ruolo_day';
// services
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { GiornataService } from './../../../services/giornata.service';
import { PersonaService } from '../../../services/persona.service';
import { VolontarioService } from '../../../services/volontario.service';
import { TruoloDayService } from './../../../services/truolo-day.service';


// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';
//import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-giornata-detail-persone',
  templateUrl: './giornata-detail-persone.component.html',
  styleUrls: ['./giornata-detail-persone.component.css']
})
export class GiornataDetailPersoneComponent  implements OnInit {

  public title = "Gestione Persone -  giornata-detail-Persone works!";

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
  public aggiornatiVolontari = false;

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
  public rottaIdManif = 0;
  public rottaFunz = '';


public isValid = false;
public idPassed = 0;
public idGiornata = 0;

// per gestione abilitazione funzioni con service Moreno

public functionUrl = '';


  // ---------------------  personalizzazioni componente

  giornata: Giornata;
  persone: Persona[]= [];
  persone1: Persona[]= [];
  persona: Persona;
  manif: Manifestazione;
  volontari: Volontario [] = [];

  truoli: Truoloday[] = [];
  truolo: Truoloday;

  gior: Giornata;

  public tipoRic = '';
  public tipoGiornata = '';

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
    'Con Ruolo',
    'Non Assegnato',
    'Selezione'
  ];

  options1 = [
    'No',
    'Si'
  ];

  public stato = 1;
  public data = Date();
  public activateSelection = false;

  public searchText = '';
// per paginazone
  p = 1;
  p1 = 1;
  datawork = 'nonselect'

  public pathimage = 'assets/images/tipologia/';
  public ruoloSearch = 0;

  public idGiornatasave = 0;
  public prodottoCorretto = 'S';
  public selectedRuo = 0;
  public selectedRuolox = 0;
  public nRecx = 0;
  public nRecs = 0;
  public nRecn = 0;

  constructor(public modalService: NgbModal,
              private giornataService: GiornataService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private manifestazioneService: ManifestazioneService,
              private personaService: PersonaService,
              private volontarioService: VolontarioService,
              private truolodayService: TruoloDayService,
              private notifier: NotifierService) {
                  this.notifier = notifier;
              }


              ngOnInit(): void {
                this.goApplication();
              }

              goApplication() {

                this.isVisible = true;
                this.alertSuccess = true;

                this.loadtruoliday();

                this.route.paramMap.subscribe(p => {
                  this.idPassed = +p.get('id');
                  console.log('id recuperato: ' + this.idPassed);
                  // -------  leggo i dati della giornata
                  this.loadGiornata(this.idPassed);

                  this.Message = 'Situazione Attuale Giornata';
               });

              this.type = 'success';
              this.showNotification(this.type, this.Message);
           }

           async  loadtruoliday() {

            let rc = await this.truolodayService.getAll().subscribe(
                resp => {
                      console.log('loadtruoliday: ' + JSON.stringify(resp['data']));
                      if(resp['rc'] === 'ok') {
                        this.truoli = resp['data'];
                      }
                   },
                error => {
                     alert('sono in loadtruoliday');
                     this.isVisible = true;
                     this.alertSuccess = false;
                     console.log('loadtruoliday - errore: ' + error.error);
                     this.type = 'error';
                     this.Message = error.message;
                     this.alertSuccess = false;
                     this.showNotification(this.type, this.Message);
                 });
             }

             async  loadtruolidaySelected(id: number,ruolo: number) {

             console.log('loadtruolidaySelected --  appena entrato -- ruolo: ' + ruolo + ' giornata: ' +  id)


              let rc = await this.personaService.getPersonabyRuolo(id,ruolo).subscribe(
                  resp => {
                        console.log('loadtruolidaySelected: ' + JSON.stringify(resp['data']));
                        if(resp['rc'] === 'ok') {
                          this.persone = resp['data'];
                          this.nRec = resp['number'];
                        }
                        if(resp['rc'] === 'nf') {
                          this.nRec = 0;
                        }
                     },
                  error => {
                       alert('sono in loadtruolidaySelected');
                       this.isVisible = true;
                       this.alertSuccess = false;
                       console.log('loadtruolidaySelected - errore: ' + error.message);
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
            this.loadPersonediGiornata(id);
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
        console.log('loadGiornata - errore: ' + error.error);
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

              async loadPersonediGiornata(id: number) {
                console.log(`loadPersonediGiornata - appena entrato -------------->   Giornata: ${id}`);
                let rc = await this.personaService.getbyGiornata(id).subscribe(
                 resp => {

                  console.log('esito lettura persone: ' + resp['rc'])
                       if(resp['rc'] === 'ok') {
                             this.persone = resp['data'];
                             this.nRec = resp['number'];
                             this.nRecx = 0;
                             this.nRecs = 0;
                             this.nRecn = 0;
                             console.log('----------------   trovate persone: ' + JSON.stringify(this.persone))
                         }
                         if(resp['rc'] === 'nf') {
                          this.nRec = 0;
                          this.creaPersonebyGiornata(id);
                      }

                    },
                 error => {
                      alert('sono in loadPersonediGiornata');
                      this.isVisible = true;
                      this.alertSuccess = false;
                      console.log('loadPersonediGiornata - errore: ' + error.error);
                      this.type = 'error';
                      this.Message = error.message;
                      this.alertSuccess = false;
                      this.showNotification(this.type, this.Message);
                    });
               }

         async creaPersonebyGiornata(id: number) {
                console.log(`creaPersonebyGiornata - appena entrato`);
                let rc = await this.volontarioService.getAll().subscribe(
                 resp => {
                       if(resp['rc'] === 'ok') {
                             this.volontari = resp['data'];
                             for(const volontario of this.volontari) {
                              this.persona = new Persona();
                              this.persona.idGiornata = id;
                              this.persona.inServizio = 'X';
                              this.persona.cellulare = volontario.cellulare;
                              this.persona.cognome = volontario.cognome;
                              this.persona.nome = volontario.nome;
                              this.persona.email = volontario.email;
                              this.persona.dRuolo = 'NON ASSEGNATO';
                              this.persona.utilizzatoCommanda = 'N';
                              this.persona.key_utenti_operation = +localStorage.getItem('id');
                              this.creapersona(this.persona);
                          }
                          this.loadPersonediGiornata(id);
                      }
                 },
                 error => {
                      alert('sono in creaPersonebyGiornata');
                      this.isVisible = true;
                      this.alertSuccess = false;
                      console.log('creaPersonebyGiornata - errore: ' + error.error);
                      this.type = 'error';
                      this.Message = error.message;
                      this.alertSuccess = false;
                      this.showNotification(this.type, this.Message);
                    });
               }

               async creapersona(persona: Persona) {
                let rc = await this.personaService.create(persona).subscribe(
                 resp => {
                       if(resp['rc'] === 'ok') {
                       // non faccio niente
                      }
                 },
                 error => {
                      alert('sono in  creapersona');
                      this.isVisible = true;
                      this.alertSuccess = false;
                      console.log(' creapersona - errore: ' + error.error);
                      this.type = 'error';
                      this.Message = error.message;
                      this.alertSuccess = false;
                      this.showNotification(this.type, this.Message);
                    });
              }

// faccio il controllo se fatto aggiornamento completo di tutti i profili per il personale a disposizione
              async loadAllPersonediGiornata(id: number) {
                this.nRecx = 0;
                console.log(`loadAllPersonediGiornata - appena entrato -------------->   Giornata: ${id}`);
                let rc = await this.personaService.getbyGiornata(id).subscribe(
                 resp => {

                  console.log('esito lettura persone: ' + resp['rc'])
                       if(resp['rc'] === 'ok') {
                             this.persone1 = resp['data'];
                             for(const pers of this.persone1) {
                              if(pers.idRuolo == 0) {
                                this.nRecx += 1;
                              }
                          }
                      }
                 },
                 error => {
                      alert('sono in loadAllPersonediGiornata');
                      this.isVisible = true;
                      this.alertSuccess = false;
                      console.log('loadAllPersonediGiornata - errore: ' + error.error);
                      this.type = 'error';
                      this.Message = error.message;
                      this.alertSuccess = false;
                      this.showNotification(this.type, this.Message);
                    });
               }










  async conferma() {


// aggiorna il listino con i dati da listinowork


  //  this.aggiiornaprodLitinofromWork(this.giornata.idlistino, this.listinow)

    this.giornata.operationCassa = 'N';
    this.giornata.statoUtenti = 1;
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
  }

  //  aggiorno il listino con i valori di quantita e prezzo da work

  async aggiornaManifestazione(manif: Manifestazione) {

  console.log('aggiornaManifestazione: ---------------  ' + JSON.stringify(manif))


    manif.stato = 1;  // imposto la manifestazione prenotabile
    let rc = await this.manifestazioneService.update(manif).subscribe(
     resp => {
           if(resp['rc'] === 'ok') {
           // non faccio niente
          }
     },
     error => {
          alert('sono in  aggiornaManifestazione');
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(' aggiornaManifestazione - errore: ' + error.error.message);
          this.type = 'error';
          this.Message = error.message;
          this.alertSuccess = false;
          this.showNotification(this.type, this.Message);
        });
  }


  async aggiornaGiornata(giornata: Giornata) {
    console.log('aggiornaGiornata: --------------->>>>>>>>>   ' + JSON.stringify(giornata))
    let rc = await this.giornataService.update(giornata).subscribe(
     resp => {
           if(resp['rc'] === 'ok') {
           // non faccio niente
          }
     },
     error => {
          alert('sono in  aggiornaGiornata');
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(' aggiornaGiornata - errore: ' + error.error.message);
          this.type = 'error';
          this.Message = error.message;
          this.alertSuccess = false;
          this.showNotification(this.type, this.Message);
        });
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

   confermaPersona(persona: Persona) {
    alert(' da fare ' )

   }

   onSelectionChange1(tipo: string, persona: Persona)   {

    console.log('.......................... onSelectionChange1 - Tipo Richiesta: ' + tipo);
    this.tipoRichiesta = tipo.substring(0, 1);
    persona.inServizio = this.tipoRichiesta;
    if(this.tipoRichiesta == 'N') {
      persona.idRuolo = 0;
      persona.dRuolo = 'NON ASSEGANTO';
    }

    this.aggiornapersona(persona);

 }

 selectedRuolo(persona: Persona, selectedValue: number) {
  //  alert('selezionato: ' + selectedValue);
    if(selectedValue ==  999) {
      this.type = 'error';
      this.Message = 'selezione non corrette';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      return;
   } else {
      this.selectedRuo = selectedValue;
      console.log('ruolo selezionata: ' + this.selectedRuo);
      persona.idRuolo = selectedValue;
      this.loadRuolo(persona)

   }

  }


  selectedRuolo1(id: number, selectedValue: number) {
    //  alert('selezionato: ' + selectedValue);
      if(selectedValue ==  999) {
        this.type = 'error';
        this.Message = 'selezione non corrette';
        this.showNotification(this.type, this.Message);
        this.alertSuccess = false;
        this.isVisible = true;
        return;
     } else {
        this.selectedRuolox = selectedValue;
        console.log('ruolo selezionata: ' + this.selectedRuolox);
        this.loadtruolidaySelected(id ,selectedValue)
     }

    }

 async loadRuolo(persona: Persona) {
    console.log('loadRuolo: --------------->>>>>>>>>   ' + JSON.stringify(persona.idRuolo))
    let rc = await this.truolodayService.getbyId(persona.idRuolo).subscribe(
     resp => {
           if(resp['rc'] === 'ok') {
            this.truolo  = resp['data'];
            persona.dRuolo = this.truolo.d_ruolo_day;
            persona.inServizio = 'S';
            this.aggiornapersona(persona);
          }
     },
     error => {
          alert('sono in  aggiornaGiornata');
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(' aggiornaGiornata - errore: ' + error.error.message);
          this.type = 'error';
          this.Message = error.message;
          this.alertSuccess = false;
          this.showNotification(this.type, this.Message);
        });
  }

   async aggiornapersona(persona: Persona)   {

    let rc = await this.personaService.update(persona).subscribe(
      resp => {

       //     console.log(`loadlastGiornata: ----------------------->  ${JSON.stringify(resp['data'])} `);
            if(resp['rc'] === 'ok') {
              this.conteggioassegnazioni(persona.idGiornata);
            }
      },
      error => {
           alert('sono in aggiornapersona');
           this.isVisible = true;
           this.alertSuccess = false;
           console.log('aggiornapersona - errore: ' + error.error.message);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;

         });
  //  this.aggiornaprodottoamenu(tipo, persona)

 }

 async conteggioassegnazioni(id: number) {
  this.nRecx = 0;
  this.nRecs = 0;
  this.nRecn = 0;
  console.log(`conteggioassegnazioni - appena entrato -------------->   Giornata: ${id}`);
  let rc = await this.personaService.getbyGiornata(id).subscribe(
   resp => {

    console.log('esito lettura persone: ' + resp['rc'])
         if(resp['rc'] === 'ok') {
               this.persone1 = resp['data'];
               this.nRecx =  resp['number'];
               for(const pers of this.persone1) {

                if(pers.idRuolo !== 0 && pers.inServizio == 'S') {
                  this.nRecs += 1;
                }
                if(pers.idRuolo !== 0 && pers.inServizio == 'N') {
                  this.nRecn += 1;
                }
                this.aggiornatiVolontari = false;
                if((this.nRecs + this.nRecn) == this.nRecx) {
                  this.aggiornatiVolontari = true;
                }
            }
        }
   },
   error => {
        alert('sono in loadAllPersonediGiornata');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('loadAllPersonediGiornata - errore: ' + error.error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
      });
 }







   focusFunction() {
    this.Message = " "
    this.alertSuccess = true;
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
        this.cancellaUser(this.manif);
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

  cancellaUser(manif: Manifestazione) {

    this.manifestazioneService.delete(manif).subscribe(
        response => {
          if(response['ok']) {
            this.isVisible = true;
            this.alertSuccess = true;
            this.type = 'success';
            this.Message = 'Manifestazione cancellata correttamente';
            this.showNotification(this.type, this.Message);
          }
      },
      error =>
          {
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore cancellazione User' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
          });
  }


  onSelectionChange(tipo: string)   {

    // alert('onSelectionChange - Tipo Richiesta: ' + tipo);

     this.trovatoRec = false;
     this.isVisible = true;
     this.activateSelection = false;

     switch (tipo) {
      case 'Tutti':
       this.activateSelection = false;
       this.loadPersonediGiornata(this.giornata.id);
   //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
      break;
      case 'Con Ruolo':
      alert('da fare')
          this.activateSelection = false;
          this.amenu = 'S'  // da  coprreggere
        //  this.loadprodottibyamenu(this.listinowork.id, this.amenu)
        break;
      case 'Non Assegnato':
          this.ruoloSearch = 0;
          this.loadtruolidaySelected(this.giornata.id ,this.ruoloSearch)
        break;
      case 'S':
      this.activateSelection = true;
      this.nRec = 0;
        break;
      default:
      alert('Scelta errata \n ricerca non possibile');
      break;
    }
 }




/*

async loadprodottibyamenu(id: number, amenu: string) {
  console.log(`loadprodottibyamenu - appena entrato`);
  let rc = await this.listinoprodworkService.getallProdbylistinoamenu(id,amenu).subscribe(
   resp => {

      console.log(`loadprodottibytipologia: ----------------------->  ${JSON.stringify(resp['data'])} `);
         if(resp['rc'] === 'ok') {
            this.listinoprodottiwork = resp['data'];
            this.nRec = resp['number'];
          }
       },
   error => {
        alert('sono in loadprodottibytipologia');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('loadprodottibytipologia - errore: ' + error.error.message);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;

      });
}


async countAllprodottiworkamenu(id: number) {
  console.log(`lcountAllprodottiworkamenu - appena entrato`);
  let rc = await this.listinoprodworkService.getcountProdottiamenu(id).subscribe(
   resp => {

      console.log('countAllprodottiworkamenu: -----------------------> ' + this.nprodtot );
         if(resp['rc'] === 'ok') {
            this.nprodtots = resp['nums'];
            this.nprodtotn = resp['numn'];
          }
          if(resp['rc'] === 'nf') {
            this.nprodtots = 0;
            this.nprodtotn = 0;
          }
       },
   error => {
        alert('sono in countAllprodottiworkamenu');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('countAllprodottiworkamenu - errore: ' + error.error.message);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;

      });
}
*/

// vecchia modalità senza count
async loadAllpersone() {
  console.log(`loadAllpersone - appena entrato`);
  let rc = await this.personaService.getAll().subscribe(
   resp => {

         if(resp['rc'] === 'ok') {
            this.persone = resp['data'];
            this.nRec = resp['number'];
          }
          if(resp['rc'] === 'nf') {
            this.nRec = 0;
          }
       },
   error => {
        alert('sono in loadAllpersone');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('loadAllpersone - errore: ' + error.error.message);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;

      });
}





/*



   gestione(tipologia: Ttipologia) {
    console.log('-----------------   gestione ' + JSON.stringify(tipologia))
    this.loadprodottibytipologia(tipologia.id, this.listinowork.id);
   }


   async loadprodottibytipologia(idtipologia: number, id: number) {
    console.log('------------------------------------------  loadprodottibytipologia - appena entrato -- tipol ' + idtipologia + ' listinow:' + id);
    let amenu = 'X'
    let rc = await this.listinoprodworkService.getallProdbylistbytipologiabyamenu(idtipologia,id, amenu).subscribe(
     resp => {

        console.log(`loadprodottibytipologia: ----------------------->  ${JSON.stringify(resp['data'])} `);
           if(resp['rc'] === 'ok') {
              this.listinoprodottiwork = resp['data'];
              this.nRec = resp['number'];
            }
            if(resp['rc'] === 'nf') {
              this.nRec = 0;
            }
         },
     error => {
          alert('sono in loadprodottibytipologia');
          this.isVisible = true;
          this.alertSuccess = false;
          console.log('loadprodottibytipologia - errore: ' + error.error.message);
          this.type = 'error';
          this.Message = error.message;
          this.alertSuccess = false;

        });
  }

  getColor(amenu: string) {
    switch (amenu) {
      case 'S':
        return 'green';
      case 'N':
        return 'red';
    }
  }


  tipologiaSelect(id: number) {
   // alert('codice passato dal figlio card a giornata-detail -- padre_ Tipologia: ' + id + ' this.listinowork.id: ' + this.listinowork.id)
    this.loadprodottibytipologia(id, this.listinowork.id);
  }

*/



}
