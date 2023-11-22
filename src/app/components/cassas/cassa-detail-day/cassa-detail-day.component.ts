


import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from './../../../classes/Manifestazione';
import { Evento} from './../../../classes/Evento';
import { Cassa } from './../../../classes/Cassa';
import { Cassamov } from './../../../classes/Cassamov';

// icone
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faEnvelope, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
// service
import { ManifestazioneService } from './../../../services/manifestazione.service';
import { EventoService } from './../../../services/evento.service';
import { CassaService } from './../../../services/cassa.service';
import { CassamovService } from './../../../services/cassamov.service';

import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';
import { mergeNsAndName } from '@angular/compiler';



@Component({
  selector: 'app-cassa-detail-day',
  templateUrl: './cassa-detail-day.component.html',
  styleUrls: ['./cassa-detail-day.component.css']
})
export class CassaDetailDayComponent implements OnInit {

  public title = 'Evento Situazione Incassi -- cassa-detail-day';
  public error = [];

  public cognome = '';
  public email = '';

  public manif: Manifestazione;
  public evento: Evento;
  public cassa: Cassa;
  public casse: Cassa[] = [];
  public cassamovs: Cassamov[] = [];

  public datapre = '';
  public datagiaRichiesta = false;
  public currencyPipeString = '';
  public data1 = '';


  // icone
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;
  faUserEdit = faUserEdit;
  faSearch = faSearch;
  faEnvelope = faEnvelope;
  faTicketAlt = faTicketAlt;

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';

  closeResult = '';

  public initialDate: any;
  public visibleConferma = true;

  public emailsend = false;
  public importoTotb = 0;
  public tcontanti = 0;
  public trovatoRec = false;
  // per paginazone
  p1: number = 1;
  p2: number = 1;

  public searchText = '';

 options = [
    'Tutti',
    'Selettivo'
  ];

  options1 = [
    'Tutti',
    'Contanti',
    'Pos',
    'Carta di Credito',
    'Bonifico'
  ];

  options2 = [
    'Prenotazioni',
    'Bandiera Gialla'
  ];


  public editdetailPosti = false;
  public presentiPosti = false;
  public idpassed = 0;
  public delCognome = '';
  public delNome = '';
  public charRic = '?';
  public validSearch = false;
  public stato = 0;
  public nRec = 0;
  public nRec1 = 0;

  public date1;
  public date2;
  public datetest;
  public datetest1;
  public selectedday = 0
  public cassaselected  = false;
  public causaleCO = 'Contanti';
  public causaleBO = 'Bonifico';
  public causalePO = 'Pos';
  public causaleCR = 'Carta di Credito';
  public tipo = '';
  public search_mov = '';
  public search_provenienza = '';
  public search_day = '';
  public SelezioneUtente = '';
  public tiporicerca = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private manifestazioneService: ManifestazioneService,
    private eventoService: EventoService,
    private cassaService: CassaService,
    private cassamovService: CassamovService,
    private notifier: NotifierService) {
      this.notifier = notifier;
      route.queryParams.subscribe(
        params => {
         });
    }


    ngOnInit(): void {
      this.goApplication();

    }


    goApplication() {
     console.log('Cassa-detaill-day -------------------  goApplication');


      this.search_mov = 'XX';
      this.search_provenienza = 'XX';
      this.search_day = 'XX';

      this.datetest = new Date();

      this.datetest1 = this.datetest.getDate();
    //  console.log('goApplication ------ datetest1 ' + this.datetest1)

     this.date2 = '29/05/2023';
     this.date1 = new Date().toLocaleDateString('it-IT');
     this.isVisible = true;
     this.alertSuccess = true;
     this.selectedday = 0;

     this.route.paramMap.subscribe(p => {
     this.idpassed = +p.get('idEvento');
    // console.log('id recuperato: ' + this.idpassed);

     this.loatTotaliCassa(this.idpassed);   // test
     this.loadEvento(this.idpassed);
     this.showTotaliCassa(this.idpassed);

     this.tipo = 'Tutti';
     this. onSelectionChange(this.tipo);

     })

   }

      showTotaliCassa(id: number) {
        this.loatTotaliCassa(id);
        this.charRic = 'T';
        this.loadAllMovCassa(this.evento.id);
        this.cassaselected =  true;
       }


   async  loatTotaliCassa(id: number) {
    console.log('frontend cassa-detail-day ---------------------------------  loatTotaliCassa: ' + id);
        let rc = await  this.cassaService.getAllbyEvento(id).subscribe(
        response => {
            if(response['rc'] === 'ok') {
                this.cassa = new Cassa();
              console.log('------letto i totali cassa ------------- ------- ' + JSON.stringify(response['data']));

                this.cassa.contanti = response['data'].tContanti;
                this.cassa.pos = response['data'].tPos;
                this.cassa.carteCredito = response['data'].tCarte;
                this.cassa.bonifici = response['data'].tBonifici;
                console.log('------------ loatTotaliCassa ------- ' + JSON.stringify(this.cassa));
          //      this.loadMovimentiCassa(id);
             }
            if(response['rc'] === 'nf') {
              this.Message = 'Nessuna cassa presente';
              this.isVisible = true;
              this.alertSuccess = false;
           }
      },
        error => {
                alert('loatTotaliCassa: ' + error.error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                this.type = 'error';
                this.Message = 'Errore loatTotaliCassa' + '\n' + error.error.message;
                this.showNotification(this.type, this.Message);
                console.log(error);
            });
    }


   onSelectionChange(tipo: string)   {
    this.charRic = tipo.substring(0,1)
     this.validSearch = true;



    if(this.charRic === '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
        return;
      }
      this.trovatoRec = false;
    switch (this.charRic) {
                case 'T':
                this.showTotaliCassa(this.evento.id);
                //   this.loadAllMovCassa(this.evento.id);     via
                break;
                case 'S':
                  this.search_mov = 'XX';
                  this.search_provenienza = 'XX';
                  this.search_day = 'XX';
                  this.loadAllDayCassa(this.evento.id);
              //    vosializzo un messaggio di nessun record presente in attesa di selezionare
              // data dalla combo
                  break;
               default:
                alert('Scelta errata \n ricerca non possibile');
                break;
       }
    }

    onSelectionChange1(tipomov: string) {

        this.SelezioneUtente = tipomov.substring(0,2).toUpperCase();
        this.validSearch = true;
        this.search_mov = 'XX';

        if(this.SelezioneUtente === '?') {
           this.validSearch = false;
           alert('effettuare la selezione del tipo pagamento ,\n ricerca non possibile');
           return;
         }
         // correggo per carte di credito
         if(this.SelezioneUtente === 'CA') {
          this.SelezioneUtente = 'CR';
        }


         this.trovatoRec = false;
         this.search_mov = this.SelezioneUtente;
         this.Message = "premi ricerca per visualizzare i movimenti per il tipo pagamento selezionato";
         this.isVisible = true;
         this.alertSuccess = true;
    }
    onSelectionChange2(tipomov: string) {
      this.SelezioneUtente = tipomov.substring(0,2).toUpperCase();
      this.validSearch = true;
      this.search_mov = 'XX';

      if(this.SelezioneUtente === '?') {
         this.validSearch = false;
         alert('effettuare la selezione del tipo registrazione evento ,\n ricerca non possibile');
         return;
       }
       // correggo il canale bandiera gialla di emissione biglietto
       if(this.SelezioneUtente === 'BA') {
        this.SelezioneUtente = 'BG';
      }

       this.trovatoRec = false;
       this.search_provenienza = this.SelezioneUtente;
       this.Message = "premi ricerca per visualizzare i movimenti per il tipo canale selezionato";
       this.isVisible = true;
       this.alertSuccess = true;
          }

      onSelectionChangeDay(selectedValue: number) {
        //  alert('selezionato: ' + selectedValue);
          if(selectedValue ==  99) {
            this.type = 'error';
            this.Message = 'selezione non corrette';
            this.showNotification(this.type, this.Message);
            this.alertSuccess = false;
            this.isVisible = true;
            this.selectedday = 0;
            this.cassaselected = false;
            return;
         } else {

              this.selectedday = selectedValue;
              this.loadCassa(this.selectedday);
              this.cassaselected = true;
              this.alertSuccess = true;
              this.Message = 'Movimenti della giornata selezionata';
              this.alertSuccess = true;
         }

     }


     async  loadCassa(id: number) {
      console.log('frontend cassa-detail-day ---------------------------------  loadCassa: ' + id);
          let rc = await  this.cassaService.getbyId(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                  this.cassa = response['data'];
                  console.log('------------ loadCassa ------- ' + JSON.stringify(this.cassa));
                  this.loadMovimentiCassa(id);
               }
              if(response['rc'] === 'nf') {
                this.Message = 'Nessuna cassa presente';
                this.isVisible = true;
                this.alertSuccess = false;
             }
        },
          error => {
                  alert('loadCassa: ' + error.error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadCassa' + '\n' + error.error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
              });
      }

     async  loadMovimentiCassa(id: number) {
      console.log('frontend ---------------------------------------------------------------  loadMovimentiCassa: ' + id);
          let rc = await  this.cassamovService.getAllbyCassa(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                  this.cassamovs = response['data'];
                  this.nRec = response['number'];
                  this.tcontanti = 0;
                  for(const cassaday of this.cassamovs) {
                  //  console.log('createAllPosti _________________________ Creo Posti per la fila : ' + JSON.stringify(cassaday))
                    if(cassaday.modpag == 1) {
                      this.tcontanti = this.tcontanti + cassaday.importo;
                    }
                  }
               }
              if(response['rc'] === 'nf') {
                this.nRec = 0;
                this.Message = 'Nessun movimento di cassa presente';
                this.isVisible = true;
                this.alertSuccess = false;
             }
        },
          error => {
                  alert('loadMovimentiCassa: ' + error.error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadMovimentiCassa' + '\n' + error.error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
              });
      }

      async  loadMovimentiCassabytipopag(id: number, tipopag: string) {
        console.log('frontend ---------------------------------------------------------------  loadMovimentiCassabytipopag: ' + id);
            let rc = await  this.cassamovService.getAllbyEventoetipopag(id, tipopag).subscribe(
            response => {
                if(response['rc'] === 'ok') {
                    this.cassamovs = response['data'];
                    this.nRec = response['number'];
                    this.tcontanti = 0;
                    for(const cassaday of this.cassamovs) {
                    //  console.log('createAllPosti _________________________ Creo Posti per la fila : ' + JSON.stringify(cassaday))
                      if(cassaday.modpag == 1) {
                        this.tcontanti = this.tcontanti + cassaday.importo;
                      }
                    }
                 }
                if(response['rc'] === 'nf') {
                  this.nRec = 0;
                  this.Message = 'Nessun movimento di cassa presente';
                  this.isVisible = true;
                  this.alertSuccess = false;
               }
          },
            error => {
                    alert('loadMovimentiCassabytipopag: ' + error.error.message);
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.type = 'error';
                    this.Message = 'Errore loadMovimentiCassabytipopag' + '\n' + error.error.message;
                    this.showNotification(this.type, this.Message);
                    console.log(error);
                });
        }


        async  loadMovimentiCassabyprovenienza(id: number, provenienza: string) {
          console.log('frontend ---------------------------------------------------------------  loadMovimentiCassabyprovenienza: ' + id + ' ' + provenienza);
              let rc = await  this.cassamovService.getAllbyEventoeprovenienza(id, provenienza).subscribe(  // da fare
              response => {
                  if(response['rc'] === 'ok') {
                      this.cassamovs = response['data'];
                      this.nRec = response['number'];
                      this.tcontanti = 0;
                      for(const cassaday of this.cassamovs) {
                      //  console.log('createAllPosti _________________________ Creo Posti per la fila : ' + JSON.stringify(cassaday))
                        if(cassaday.modpag == 1) {
                          this.tcontanti = this.tcontanti + cassaday.importo;
                        }
                      }
                   }
                  if(response['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessun movimento di cassa presente';
                    this.isVisible = true;
                    this.alertSuccess = false;
                 }
            },
              error => {
                      alert('loadMovimentiCassabytipopag: ' + error.error.message);
                      this.isVisible = true;
                      this.alertSuccess = false;
                      this.type = 'error';
                      this.Message = 'Errore loadMovimentiCassabytipopag' + '\n' + error.error.message;
                      this.showNotification(this.type, this.Message);
                      console.log(error);
                  });
          }

          async  loadMovimentiCassabyprovenienzaetipopagamento(id: number, tipopag: string, provenienza: string) {
            console.log('frontend ---------------------------------------------------------------  loadMovimentiCassabyprovenienza: ' + id + ' ' + provenienza);
                let rc = await  this.cassamovService.getAllbyEventoeprovenienzatipopag(id, tipopag, provenienza).subscribe(  // da fare
                response => {
                    if(response['rc'] === 'ok') {
                        this.cassamovs = response['data'];
                        this.nRec = response['number'];
                        this.tcontanti = 0;
                        for(const cassaday of this.cassamovs) {
                        //  console.log('createAllPosti _________________________ Creo Posti per la fila : ' + JSON.stringify(cassaday))
                          if(cassaday.modpag == 1) {
                            this.tcontanti = this.tcontanti + cassaday.importo;
                          }
                        }
                     }
                    if(response['rc'] === 'nf') {
                      this.nRec = 0;
                      this.Message = 'Nessun movimento di cassa presente';
                      this.isVisible = true;
                      this.alertSuccess = false;
                   }
              },
                error => {
                        alert('loadMovimentiCassabytipopag: ' + error.error.message);
                        this.isVisible = true;
                        this.alertSuccess = false;
                        this.type = 'error';
                        this.Message = 'Errore loadMovimentiCassabytipopag' + '\n' + error.error.message;
                        this.showNotification(this.type, this.Message);
                        console.log(error);
                    });
            }


    async loadAllDayCassa(id: number) {
      console.log('frontend - loadAllMovCassa: ' + id);
          let rc = await  this.cassaService.getAllDaybyEvento(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                  this.casse = response['data'];
                  this.nRec = response['number'];
                  this.trovatoRec = true;
               }
              if(response['rc'] === 'nf') {
                this.nRec = 0;
                this.Message = 'Nessuna giornata di cassa presente';
                this.isVisible = true;
                this.alertSuccess = false;
             }
        },
          error => {
                  alert('loadAllMovCassa: ' + error.error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadAllMovCassa' + '\n' + error.error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
              });
      }

async loadAllMovCassa(id: number) {
  console.log('frontend - loadAllMovCassa: ' + id);
      let rc = await  this.cassamovService.getAllbyEvento(id).subscribe(
      response => {
          if(response['rc'] === 'ok') {
              this.cassamovs = response['data'];
              this.nRec = response['number'];
              this.trovatoRec = true;
              this.tcontanti = 0;
              for(const cassaday of this.cassamovs) {
              //  console.log('createAllPosti _________________________ Creo Posti per la fila : ' + JSON.stringify(cassaday))
                if(cassaday.modpag == 1) {
                  this.tcontanti = this.tcontanti + cassaday.importo;
                }
              }
           }
          if(response['rc'] === 'nf') {
            this.nRec = 0;
            this.Message = 'Nessun movimento di cassa presente';
            this.isVisible = true;
            this.alertSuccess = false;
            this.trovatoRec = false;
         }
    },
      error => {
              alert('loadAllMovCassa: ' + error.error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore loadAllMovCassa' + '\n' + error.error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
          });
  }


async loadEvento(id: number) {
console.log('frontend - loadEvento: ' + id);
    let rc = await  this.eventoService.getbyId(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {
            this.evento = response['data'];
            this.loadManifestazione(this.evento.idmanif);
            this.onSelectionChange(this.charRic);

        }
        if(response['rc'] === 'nf') {
          this.Message = 'Nessuna Prenotazione presente';
          this.isVisible = true;
          this.alertSuccess = false;
       }
  },
    error => {
            alert('Manif-Data  --loadEventi: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadEventi' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
}

async loadManifestazione(id: number) {
      console.log('frontend - loadManifestazione: ' + id);
      let rc = await  this.manifestazioneService.getbyId(id).subscribe(
      response => {
          this.manif = response['data'];
      },
      error => {
                  alert('Manif-Data  --loadManifestazione: ' + error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadManifestazione' + '\n' + error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
                  });
   }

/*
async   loadEventoPosti(token: string) {
      console.log('frontend - loadEventoPosti: ' + token);
      let rc = await  this.eventopostoService.getbytoken(token).subscribe(
      response => {
            console.log('loadEventoPosti: --------- posti ------------- ' + JSON.stringify(response['data']));
            this.eventoposti = response['data'];
            this.importoTotb = response['imptotale'];
            },
      error => {
            alert('loadEventoPosti: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadEventoPosti' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
}

*/








conferma() {
   alert('da fare 1111');
//  this.deletePreneventmasterConfirmed(this.token);

}

handleError(error) {
this.error = error.error.errors;
}


showNotification( type: string, message: string ): void {
this.notifier.notify( type, message );
}


EseguiRicerca(id: number, tipopag: string, provenienza: string, giorno: string) {
   console.log('EseguiRicerca ----- tipopag: ' + tipopag + ' provenienza: ' + provenienza + ' giorno: ' + giorno)
   this.tiporicerca = false;
   if(provenienza === "XX" && tipopag === "XX" && giorno === "XX")  {
    this.isVisible = true;
    this.alertSuccess = false;
    this.Message = 'Effettuare le selezioni desiderate -- Ricerca non possibile';
    return;
  }

  if(tipopag === 'TU') {
    this.loadAllMovCassa(id);
    this.tiporicerca = true;
    return;
  }
  if(tipopag !== 'XX' && provenienza === 'XX' && giorno === 'XX') {
    console.log('Step_01')
    if(tipopag === 'TU') {
      this.loadAllMovCassa(id);
      this.tiporicerca = true;
    } else {
      this.loadMovimentiCassabytipopag(id,tipopag);
      this.tiporicerca = true;
    }
  }

  if(tipopag === 'XX' && provenienza !== 'XX' && giorno === 'XX') {
    console.log('Step_02')
      this.loadMovimentiCassabyprovenienza(id,provenienza);  // da fare service
      this.tiporicerca = true;
  }

  if(tipopag === 'XX' && provenienza === 'XX' && giorno !== 'XX') {
    console.log('Step_03')
    this.loadCassa(this.selectedday);
    this.tiporicerca = true;
}

if(tipopag !== 'XX' && provenienza !== 'XX' && giorno === 'XX') {
  console.log('Step_04')
    this.loadMovimentiCassabyprovenienzaetipopagamento(id,tipopag,provenienza);  // da fare service
    this.tiporicerca = true;
}





if(this.tiporicerca === false) {
  alert('tipo ricerca non prevista ' + ' tipopag: ' + tipopag + ' provenienza: ' + provenienza + + ' giorno: ' + giorno);
}



provenienza = "XX";
tipopag = "XX";
giorno = "XX";

  }








}



