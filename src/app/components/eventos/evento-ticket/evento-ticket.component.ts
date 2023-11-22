import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faReply, faList, faTicketAlt, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
// services
import { ManifestazioneService} from './../../../services/manifestazione.service';
import { EventoService } from './../../../services/evento.service';
import { TtipobigliettoService } from './../../../services/ttipobiglietto.service';
import { CassaService } from './../../../services/cassa.service';

import { BigliettoService } from './../../../services/biglietto.service';
// Models
import { Manifestazione} from '../../../classes/Manifestazione';
import { Evento} from '../../../classes/Evento';
import { Ttipobiglietto} from '../../../classes/T_tipo_biglietto';
import { Biglietto} from '../../../classes/Biglietto';
import { Cassa } from '../../../classes/Cassa';

import { ActivatedRoute, Router } from '@angular/router';
// per gestire inserimento/Modifica con popup
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-evento-ticket',
  templateUrl: './evento-ticket.component.html',
  styleUrls: ['./evento-ticket.component.css']
})
export class EventoTicketComponent implements OnInit {

  public d_manifestazione: string;
  public data_inizio = new Date();
  public data_fine = new Date();
  public title = "elenco tipologia biglietti  - evento ticket";
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;
  faInfoCircle = faInfoCircle;
  faUserEdit = faUserEdit;
  faReply = faReply;
  faList = faList;
  faTicketAlt = faTicketAlt;
  faCheckDouble = faCheckDouble;

  public manif: Manifestazione;
  public evento: Evento;
  public eventonull: Evento;
  public tipibiglietto: Ttipobiglietto[] = [];
  public tipibigliettonull: Ttipobiglietto[] = [];
  public tipobiglietto: Ttipobiglietto;
  public biglietti: Biglietto[] = [];
  public biglietto: Biglietto;
  public cassa: Cassa;
  public wtipobiglietto: Ttipobiglietto;

  public tipoRichiesta = '?';
  public ricManif = 0;
  public validSearch = false;
  private textMessage = '';

  options = [
    'Tutte',
    'Attivo',
    'Bloccato'
  ];

  options1 = [
    'Tutti',
    'Contanti',
    'Pos',
    'Carte Credito',
    'Bonifici'
  ];

   // per paginazone
p: number = 1;
p1: number = 1;

// -----------------------------    da detail1
public canale = '';


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
public tipop = 0;
public selecPagamCorrect = false;

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
public bigliettiNull = false;
public seltagliaIbiglietti = false;

public functionUser = '';

public statoModulo  = '?';
public ricercaIniziale = '';

closeResult = '';

public level = 0;
public nRecord = 0;
public enabledFunc = false;
public rotta = '';
public rottaId = 0;
public rottaFunz = '';
public datadioggi = '';
public dataOdierna: Date;

// variabili per editazione messaggio

public Message1 = '';
public Message2 = '';
public Message3 = '';
public Message1err = 'Contattare il gestore dell applicazione.';

public isValid = false;
public idManif = 0;
public functionSelected = '';
public selectedTipoBiglietto = '';
public selectedSerie = '';
public richiestaEmissioneBiglietto = false;

// per gestione abilitazione funzioni con service Moreno

public functionUrl = '';
public rottafase = '';
public dataEvento: Date;
public neverRecord = false;

constructor(private manifestazioneService: ManifestazioneService,
            private eventoService: EventoService,
            private tipobigliettoService: TtipobigliettoService,
            private bigliettoService: BigliettoService,
            private cassaService: CassaService,
            private route: ActivatedRoute,
            private router: Router,
            private datePipe: DatePipe,
            private modalService: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }


      ngOnInit(): void {
      this.goApplication();
      }


goApplication() {
  console.log('goApplication - evento Ticket --------  appena entrato');

  this.isVisible = true;
  this.alertSuccess = true;
  //  this.loadlocalita();

  // this.rotta = this.route.snapshot.url[0].path;
  // this.rottafase = this.route.snapshot.url[1].path;

  const date = Date();
  this.dataOdierna = new Date(date);
  this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');
  this.richiestaEmissioneBiglietto = false;
  this.selectedTipoBiglietto = '';
  this.selectedSerie = '';
  this.bigliettiNull = true;
  this.seltagliaIbiglietti = false;

  this.route.paramMap.subscribe(p => {
  this.idpassed = +p.get('id');
  console.log('id recuperato: ' + this.idpassed);
  this.loadEvento(this.idpassed);
  this.Message = 'pronto per aggiornamento Tipologie Biglietti';
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

async loadEvento(id: number) {
      console.log('frontend - loadEvento: ' + id);
      let rc = await  this.eventoService.getbyId(id).subscribe(
      response => {
      if(response['rc'] === 'ok') {
        this.evento = response['data'];
        this.dataEvento = new Date(this.evento.data);
        this.loadManifestazione(this.evento.idmanif);
        this.loadtipibiglietto(this.evento.id);
       }
      if(response['rc'] === 'nf') {
        this.evento = this.eventonull;
        this.nRec = 0;
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


async loadtipibiglietto(id: number) {
  console.log('frontend ------------------------ loadtipibiglietto: ' + id);
  let rc = await  this.tipobigliettoService.getbyevento(id).subscribe(
  response => {
        if(response['rc'] === 'ok') {
          this.tipibiglietto = response['data'];
          console.log('----------------- tipibiglietto: ' + JSON.stringify(this.tipibiglietto))
          this.nRec = response['number'];
         }
        if(response['rc'] === 'nf') {
          this.tipibiglietto = this.tipibigliettonull;
          this.nRec = 0;
         }
    },
error => {
    alert('loadtipibiglietto: ' + error.message);
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    this.Message = 'Errore loadtipibiglietto' + '\n' + error.message;
    this.showNotification(this.type, this.Message);
    console.log(error);
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
//alert('da fare');
 this.router.navigate(['tbiglietto/new/' + this.evento.id]);

}

goback() {
  this.router.navigate(['manif/' + this.evento.idmanif]);
}


async onSelecttipologia(idtipologia: number) {
  console.log('frontend - onSelecttipologia: ' + idtipologia);
  let rc = await  this.bigliettoService.getAllbyTipo(idtipologia).subscribe(
  response => {
        if(response['rc'] === 'ok') {
          this.biglietti = response['data'];
          this.neverRecord = false;
          console.log('biglietti da editare: ' + JSON.stringify(this.biglietti));
          }
        if(response['rc'] === 'nf') {
          this.neverRecord = true;
        }
    },
error => {
    alert('onSelecttipologia: ' + error.error.message);
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    this.Message = 'Errore onSelecttipologia' + '\n' + error.error.message;
    this.showNotification(this.type, this.Message);
    console.log(error);
});

}

onSelectbiglietti(biglietti: Biglietto[])  {
  console.log('onSelectbiglietti -------------------------- ')
    this.biglietti = biglietti;
}

emissione(tipobiglietto: Ttipobiglietto)  {
    this.biglietto = new Biglietto();
    this.biglietto.id = 99999;
// passo i dati del tipo biglietto e evento su localStorage

    localStorage.removeItem('emBigliettoTipo');
    localStorage.removeItem('emBigliettoEvento');
    localStorage.setItem('emBigliettoTipo', String(tipobiglietto.id));
    localStorage.setItem('emBigliettoEvento', String(tipobiglietto.idevento));

    console.log('emissione del biglietto: ' + this.biglietto.id);
    this.router.navigate(['biglietto/' + this.biglietto.id + '/edit/BG']);

}

async loadCassadelGiorno(datadioggi: string, idEvento: number) {
  console.log('frontend  Evento-ticket - loadCassadelGiorno: ' + datadioggi + ' evento: ' + idEvento);
  let rc = await  this.cassaService.getbydata(datadioggi,idEvento).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        // non faccio nulla perchè le registrazioni avverrano in biglietto-emissione-detail-bg

       }
       if(response['rc'] === 'nf') {
        this.cassa = new Cassa();
        this.cassa.datacassa =  this.datadioggi;
        this.cassa.idEvento = idEvento;
        this.CreaCassaGiornaliera(this.cassa);
              }
  },
  error => {
      alert('loadCassadelGiorno: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadCassadelGiorno' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}

async CreaCassaGiornaliera(cassa: Cassa) {
  let rc = await  this.cassaService.create(cassa).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        // non faccio nulla perchè le registrazioni avverrano in biglietto-emissione-detail-bg
      }
  },
  error => {
      alert('CreaCassaGiornaliera: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore CreaCassaGiornaliera' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}



getColor(tipo: string) {
  switch (tipo) {
    case "INTERO":
      return 'blue';
    case "RIDOTTO":
      return 'yellow';
    case "GRATIS":
      return 'red';
    case "PREZZO UNICO":
      return 'orange';
    default:
      return 'violet';
  }
}

getBackground(tipo: string) {
  switch (tipo) {
    case "INTERO":
      return 'yellow';
    case "RIDOTTO":
      return 'green';
    case "GRATIS":
      return 'black';
    case "PREZZO UNICO":
      return 'blue';
    default:
      return 'green';
  }
}


getColorPag(tipopag: number) {
  switch (tipopag) {
    case 0:
      return 'red';
    case 1:
      return 'green';
    case 2:
      return 'blue';
    case 6:
      return 'orange';
    case 7:
      return 'yellow';
    default:
      return 'violet';
  }
}

getBackgroundPag(tipopag: number) {
  switch (tipopag) {
    case 0:
      return 'white';
    case 1:
      return 'yellow';
    case 2:
      return 'red';
    case 6:
      return 'black';
    case 7:
      return 'black';
    default:
      return 'green';
  }
}


getColorStato(stato: number) {
  switch (stato) {
    case 1:
      return 'green';
    case 2:
      return 'orange';
    case 3:
      return 'white';
  }
}

getBackgroundStato(stato: number) {
  switch (stato) {
    case 1:
      return 'yellow';
    case 2:
      return 'black';
    case 3:
      return 'red';
  }
}

getColor1(pren: number) {

  if(pren == 0) {
    this.canale = 'BG';
  } else {
    this.canale = 'P';
  }

  switch (this.canale) {
      case 'BG':
          return 'BG';
      case 'P':
          return 'P';
      default:
         return '?';
  }
 }

 getBackground1(pren: number) {

  if(pren == 0) {
    this.canale = 'BG';
  } else {
    this.canale = 'P';
  }

  switch (this.canale) {
    case 'BG':
       return 'BG';
    case 'P':
       return 'P';
    default:
        return '??';
  }

 }

show(biglietto: Biglietto) {
  alert('visualizzo il dettaglio assegno -- Posto: ' + biglietto.posto);
  this.router.navigate(['biglietto/' + biglietto.posto + '/edit/xx']);

}


async listAll(tipobiglietto: Ttipobiglietto) {
  this.wtipobiglietto = new Ttipobiglietto();
  this.wtipobiglietto = tipobiglietto;
  this.seltagliaIbiglietti = true;
  console.log('frontend - ListAll:tipologia ' + tipobiglietto.idtipotaglia);
//  console.log('frontend - Dettaglio: stato: ' + this.stato);
  let rc = await  this.bigliettoService.getAllbyTipo(tipobiglietto.id).subscribe(
  response => {
        if(response['rc'] === 'ok') {
            this.biglietti = response['data'];
             console.log('biglietti da editare: ' + JSON.stringify(this.biglietti));
            this.bigliettiNull = false;
          }
        if(response['rc'] === 'nf') {
          this.bigliettiNull = true;
        }

    },
    error => {
        alert('Dettaglio: ' + error.error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore Dettaglio' + '\n' + error.error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
  }


  onSelectionChangePagamento(tipoPagam: string) {
    console.log('-------------------------   onSelectionChangePagamento: ' + tipoPagam)
    this.tipop = 0;
    this.selecPagamCorrect = false;
    switch(tipoPagam) {
        case "Tutti":
          this.tipop = 0;
          break;
        case "Contanti":
          this.tipop = 1;
          break;
        case "Pos":
         this.tipop = 2;
          break;
        case "Carte Credito":
          this.tipop = 6;
          break;
        case "Bonifici":
          this.tipop = 7;
          break;
        }

        console.log('----------- tipop --------------   onSelectionChangePagamento: ' + this.tipop);

      if(this.tipop == 0) {
        this.listAll(this.wtipobiglietto)
      }
      else  {
        this.listbyPagamento(this.wtipobiglietto.id, this.tipop)
      }

    }

    async  listbyPagamento(id: number, tipop: number) {
      console.log('listbyPagamento: ' + id + ' tipo ' + tipop)
      let rc = await  this.bigliettoService.getAllbyTipoModpag(id, tipop).subscribe(
        response => {
              if(response['rc'] === 'ok') {
                console.log('listbyPagamento: ' + JSON.stringify(response['data']));
                this.biglietti = response['data'];
                this.bigliettiNull = false;

                }
              if(response['rc'] === 'nf') {
                this.bigliettiNull = true;
              }

          },
          error => {
              alert('Dettaglio: ' + error.error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore Dettaglio' + '\n' + error.error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
          });

    }









  }





/*

async Dettaglio(tipobiglietto: Ttipobiglietto) {
  console.log('frontend - Dettaglio:tipologia ' + tipobiglietto.idtipotaglia);
  const stato = 0;
//  console.log('frontend - Dettaglio: stato: ' + this.stato);
  let rc = await  this.bigliettoService.getAllbyTipoStato(tipobiglietto.idtipotaglia, stato).subscribe(
  response => {
        if(response['rc'] === 'ok') {
          this.biglietti = response['data'];
          this.bigliettiNull = false;
          this.selectedSerie = tipobiglietto.serie;
          this.selectedTipoBiglietto = tipobiglietto.d_tipo;
          this.richiestaEmissioneBiglietto = true;
             console.log('biglietti da emettere: ' + JSON.stringify(this.biglietti));
          }
        if(response['rc'] === 'nf') {
          this.bigliettiNull = true;
        }

    },
    error => {
        alert('Dettaglio: ' + error.error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore Dettaglio' + '\n' + error.error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });

}




*/










