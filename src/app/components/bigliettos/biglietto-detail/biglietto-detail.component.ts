
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from '../../../classes/Manifestazione';
import { Evento} from '../../../classes/Evento';
import { Ttipobiglietto} from '../../../classes/T_tipo_biglietto';
import { Ttipopagamento} from '../../../classes/T_tipo_pagamento';
import { EventoSettore } from '../../../classes/Eventosettore';
import { EventoFila } from '../../../classes/Eventofila';
import { EventoPosto } from '../../../classes/Eventoposto';
import { Prenotazevento } from '../../../classes/Prenotazevento';
import { Cassa } from '../../../classes/Cassa';
import { Cassamov } from '../../../classes/Cassamov';
import { Biglietto } from '../../../classes/Biglietto'

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply, faPrint } from '@fortawesome/free-solid-svg-icons';
// service
import { PrenotazeventoService } from '../../../services/prenotazevento.service';
import { TtipobigliettoService } from '../../../services/ttipobiglietto.service';
import { TtipopagamentoService } from '../../../services/ttipopagamento.service';
import { ManifestazioneService } from '../../../services/manifestazione.service';
import { EventoService } from '../../../services/evento.service';
import { EventosettoreService } from '../../../services/eventosettore.service';
import { EventofilaService } from '../../../services/eventofila.service';
import { EventopostoService } from '../../../services/eventoposto.service';
import { CassaService } from './../../../services/cassa.service';
import { CassamovService } from './../../../services/cassamov.service';
import { BigliettoService } from './../../../services/biglietto.service';

import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-biglietto-detail',
  templateUrl: './biglietto-detail.component.html',
  styleUrls: ['./biglietto-detail.component.css']
})
export class BigliettoDetailComponent implements OnInit {

  NgForm=NgForm;//this one solve my problem...initialization and declaration

  public title = 'Emissione Biglietto da prenotazione';
  public error = [];


  public pren: Prenotazevento;
  public tipobiglietto: Ttipobiglietto;
  public tipopagamento: Ttipopagamento;
  public manif: Manifestazione;
  public evento: Evento;
  public eventoposto: EventoPosto;
  public eventoSettore: EventoSettore;
  public eventofila: EventoFila;
  public cassa: Cassa;
  public cassamov: Cassamov;
  public biglietto: Biglietto;

  public datapre = '';
  public datagiaRichiesta = false;


  public dataSelected = '';
  public dataPrenotata: string;       //Date;
  public numPre = 0;
  // icone
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;
  faReply = faReply;
  faPrint = faPrint;

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';
  public manifActive = 1;
  public manAct = 0;


  options = [
    'Contanti',
    'Bonifico',
    'Elettronico'
  ];


  public visibleConferma = true;
  public idpassed = 0;
  public dataEvento: Date;
  public statoAttivo = 0;
  public tipoPagamento = '?';
  public validOption = false;
  public visibleContanti = false;
  public emessobiglietto = false;
  public nrich = 0;
  public dataOdierna;
  public datadioggi = '';
  public numerobigliettoedit = '';
  public bigliettoemesso = false;
  public lencampo = 0;
  public presentaCassa = false;
  public openNewCassa = false;
  public modifyCassa = false;
  public chiusuraCassa = false;
  public Message1 = 'messaggio di mersa'
  public cassaInizialeimporto = 0;

  constructor(private prenotazeventoService: PrenotazeventoService,
              private manifestazioneService: ManifestazioneService,
              private eventoService: EventoService,
              private eventopostoService: EventopostoService,
              private tipobigliettoService: TtipobigliettoService,
              private tipopagamentoService: TtipopagamentoService,
              private eventofilaService: EventofilaService,
              private eventosettoreService: EventosettoreService,
              private cassaService: CassaService,
              private cassamovService: CassamovService,
              private bigliettoService: BigliettoService,
              private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              public modalService: NgbModal,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }



  ngOnInit(): void {
    this.goApplication();
  }

  goApplication() {

    console.log('goApplication - biglietto-detail --------  appena entrato');
    this.resetinitial();
    this.route.paramMap.subscribe(p => {
    this.idpassed = +p.get('id');
    console.log('id recuperato: ' + this.idpassed);
    this.loadEventoPosto(this.idpassed);

    });
}

resetinitial() {
    this.cassa = new Cassa();


    this.isVisible = true;
    this.alertSuccess = true;
    this.openNewCassa = false;
    this.modifyCassa = false;
    this.chiusuraCassa = false;

    const date = Date();
    this.dataOdierna = new Date(date);
    this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');
}

async loadEventoPosto(id: number) {
  console.log('frontend - loadPrenotazEvento: ' + id);
  let rc = await  this.eventopostoService.getbyId(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.eventoposto = response['data'];
          if(this.eventoposto.stato == 0) {
             this.title = 'Emissione Biglietto da prenotazione - biglietto-detail';
             this.Message = 'pronto per acquisto biglietto';
          } else {
            this.title = 'Situazione attuale Biglietto - biglietto-detail';
            this.Message = 'Situazione attuale biglietto';
          }
          this.loadEvento(this.eventoposto.idEvento);
          if(this.eventoposto.idSettore > 0) {
            this.loadSettore(this.eventoposto.idSettore);
            this.loadFila(this.eventoposto.idFila);
          }
          if(this.eventoposto.idbiglietto > 0) {
            this.loadBiglietto(this.eventoposto.idbiglietto);
          }
          this.loadCassadelGiorno(this.datadioggi, this.eventoposto.idEvento);
          this.loadtipoBiglietto(this.eventoposto.tipobiglietto);
       }
    },
    error => {
        alert('loadBiglietto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadBiglietto' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}


async loadBiglietto(id: number) {

  let rc = await  this.bigliettoService.getbyId(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.biglietto = response['data'];
        this.loadtipopagamento(this.biglietto.modpag);
       }
  },
  error => {
      alert('loadBiglietto: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadBiglietto' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}






openCassa() {
  this.openNewCassa = true;
}


modificaCassa() {
  this.openNewCassa = false;
  this.chiusuraCassa = false;
  this.modifyCassa = true;
}

chiudiCassa() {
  this.openNewCassa = false;
  this.modifyCassa = false;
  this.chiusuraCassa = true;

}

handleFocus(evento: any) {
  alert(' sono in focus')
}
handleBlur(evento: any) {
  alert(' sono uscito dal focus')
}











async loadCassadelGiorno(datadioggi: string, idEvento: number) {
  console.log('frontend - loadCassadelGiorno: ' + datadioggi + ' evento: ' + idEvento);
  let rc = await  this.cassaService.getbydata(datadioggi,idEvento).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.cassa = response['data'];
        this.presentaCassa = true;
       }
       if(response['rc'] === 'nf') {
      //  this.cassa = new Cassa();
        this.cassa.datacassa =  this.datadioggi;
        this.presentaCassa = false;
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

async loadEvento(id: number) {
  console.log('frontend - loadEvento: ' + id);
  let rc = await  this.eventoService.getbyId(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.evento = response['data'];
        this.dataEvento = new Date(this.evento.data);

       }
  },
  error => {
      alert('Manif-Data  --loadEvento: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadEvento' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}

async loadSettore(id: number) {
  console.log('frontend - loadSettore: ' + id);
  let rc = await  this.eventosettoreService.getbyId(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.eventoSettore = response['data'];
       }
  },
  error => {
      alert('loadSettore: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadSettore' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}


async loadFila(id: number) {
  console.log('frontend - loadFila: ' + id);
  let rc = await  this.eventofilaService.getbyId(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.eventofila = response['data'];
       }
  },
  error => {
      alert('loadFila: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadFila' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}


async loadtipoBiglietto(id: number) {
  console.log('frontend - loadtipoBiglietto: ' + id);
  let rc = await  this.tipobigliettoService.getbyid(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.tipobiglietto = response['data'];
       }
  },
  error => {
      alert('loadFila: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadtipoBiglietto' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}


async loadtipopagamento(id: number) {
  console.log('frontend - loadtipopagamento: ' + id);
  let rc = await  this.tipopagamentoService.getbyid(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.tipopagamento = response['data'];
       }
  },
  error => {
      alert('loadtipopagamento: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore loadtipopagamento' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
      console.log(error);
  });
}





handleResponse(data) {
  //  this.Token.handle(data.access_token);
    this.router.navigateByUrl('/profile');
  }

  handleError(error) {
    this.error = error.error.errors;
  }

    showNotification( type: string, message: string ): void {
        this.notifier.notify( type, message );
    }

    goback() {
      this.router.navigateByUrl('/pronotevento');
    }

    print(biglietto: Biglietto) {
      this.router.navigateByUrl('/bigliettoprint/' + biglietto.id);
    }




}

/*

GestisciCassaIniziale(cassa: Cassa) {
  console.log('GestisciCassaIniziale ................ : appena entrato ----------  ' + JSON.stringify(cassa));
return;

  // apertura cassa
  if(this.presentaCassa === false) {
    if(cassa.cassaIniziale < 0) {
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'inserire un valore Maggiore di zero';
      this.showNotification(this.type, this.Message);
      return;
    } else {
  //    this.RegistraCassaIniziale(cassa.cassaIniziale);   eliminato metodo
    }
  }
}







GestisciCassaFinale(cassa: Cassa) {
console.log('GestisciCassaFinale: appena entrato ----------  ' + JSON.stringify(cassa));

  // apertura cassa
    if(this.presentaCassa === true) {
      if(cassa.cassaFinale < 0) {
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'inserire un valore Maggiore di zero';
        this.showNotification(this.type, this.Message);
        return;
      } else {
        this.RegistraCassaFinale(cassa.cassaFinale);
      }
    }
  }


  async RegistraCassaFinale(importo: number) {
    console.log('frontend - RegistraCassaFinale: ' + importo);
    this.cassa.cassaFinale = importo;
    this.cassa.stato = 2;
    let rc = await  this.cassaService.create(this.cassa).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.presentaCassa = true;
          this.isVisible = true;
          this.alertSuccess = true;
          this.type = 'success';
          this.Message = 'Cassa giornaliera Chiusa correttamente ';
          this.showNotification(this.type, this.Message);
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

async RegistraCassaIniziale(importo: number) {
  console.log('frontend - RegistraCassaIniziale: ' + importo);
  this.cassa.datacassa = this.datadioggi;
  this.cassa.idEvento = this.eventoposto.idEvento;
  this.cassa.cassaIniziale = importo;
  this.cassa.stato = 1;
  let rc = await  this.cassaService.create(this.cassa).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.presentaCassa = true;
        this.isVisible = true;
        this.alertSuccess = true;
        this.type = 'success';
        this.Message = 'Cassa giornaliera aperta correttamente ';
        this.showNotification(this.type, this.Message);
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








@Component({
  selector: 'app-biglietto-emissione-logistica',
  templateUrl: './biglietto-emissione-logistica.component.html',
  styleUrls: ['./biglietto-emissione-logistica.component.css']
})
export class BigliettoEmissioneLogisticaComponent implements OnInit {

  // private type = "password";















onSelectionChange(tipo: string)   {

  this.tipoPagamento = tipo.substring(0, 1);  //tifedel.substring(0,1);
  this.validOption = true;

  if(this.tipoPagamento === '?') {
      this.validOption = false;
      alert('effettuare la selezione della modalità d pagamento ,\n operatività non possibile');
      return;
    }

  switch (this.tipoPagamento) {
              case 'C':
                this.visibleContanti = true;
                break;
              case 'P':
                this.visibleContanti = true;
                break;
              case 'N':
                this.visibleContanti = false;
                alert('impostare una forma di pagamento');
                break;
              default:
              alert('Scelta errata \n ricerca non possibile');
              break;
     }
  }


 conferma() {
  this.emettibiglietto(this.pren.idtipobiglietto);
}

async emettibiglietto(id: number) {
  let rc = await  this.tipobigliettoService.getbyid(id).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.tipobiglietto = response['data'];
          this.tipobiglietto.ultimoemesso +=  1;
          this.tipobiglietto.key_utenti_operation = +localStorage.getItem('id');
          this.aggiornatipobiglietto(this.tipobiglietto, this.tipobiglietto.ultimoemesso);
          this.numerobigliettoedit = '';
          this.numerobigliettoedit = '0000' + this.tipobiglietto.ultimoemesso.toString();
          this.bigliettoemesso = true;

      }
    },
    error => {
        alert('emettibiglietto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore emettibiglietto' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });

}

async aggiornatipobiglietto(tipobiglietto: Ttipobiglietto, biglietto: number) {
  let rc = await  this.tipobigliettoService.update(tipobiglietto).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.creabiglietto(biglietto);
          console.log('aggiornatipobiglietto .......tipopagamento ............. ' + this.tipoPagamento);

          if(this.tipoPagamento === 'C') {
            this.aggiornaCassa();
          } else {
            this.isVisible = true;
            this.alertSuccess = true;
            this.type = 'success';
            this.Message = 'Emesso regolarmente biglietto - pagamento con Pos';
            this.showNotification(this.type, this.Message);
          }
        }
    },
    error => {
        alert('aggiornatipobiglietto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore aggiornatipobiglietto' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });

}

async creabiglietto(biglietto: number) {

  const date = Date();
  this.dataOdierna = new Date(date);
  this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');

  this.biglietto = new Biglietto();
  this.biglietto.cellulare = this.pren.telefono;
  this.biglietto.cognome = this.pren.cognome;
  this.biglietto.dataconf = this.datadioggi;
  this.biglietto.dataemi = this.pren.datapren;
  this.biglietto.datapre = this.pren.datapren;
  this.biglietto.email = this.pren.email;
  this.biglietto.evento = this.pren.idevento;
  this.biglietto.fila = this.pren.idfila;
  this.biglietto.idprenotazione = this.pren.id;
  this.biglietto.key_utenti_operation = +localStorage.getItem('id');
  this.biglietto.nome = this.pren.nome;
  this.biglietto.numero = biglietto;
  this.biglietto.posto = this.pren.idposto;
  this.biglietto.settore = this.pren.idsettore;
  this.biglietto.stato = 1;
  this.biglietto.tipo = this.pren.idtipobiglietto;

  let rc = await  this.bigliettoService.create(this.biglietto).subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.loadbigliettolastid();
        }
    },
    error => {
        alert('creabiglietto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore creabiglietto' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}

async loadbigliettolastid() {
  let rc = await  this.bigliettoService.getlastId().subscribe(
    response => {
        if(response['rc'] === 'ok') {
          this.biglietto = response['data'];
          this.aggiornaprenotazevento(this.biglietto.id);
         }
    },
    error => {
        alert('loadbigliettolastid: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadbigliettolastid' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}

async aggiornaprenotazevento(biglietto: number) {

  this.pren.idbiglietto = biglietto;
  this.pren.idstato = 1;

  let rc = await  this.prenotazeventoService.updatePrenotazione(this.pren).subscribe(
    response => {
        if(response['rc'] === 'ok') {
         //  non faccio nulla
         }
    },
    error => {
        alert('aggiornaprenotazevento: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore aggiornaprenotazevento' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });

}

async aggiornaCassa() {

    const date = Date();
    this.dataOdierna = new Date(date);
    this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');

    let rc = await  this.cassaService.getbydata(this.datadioggi).subscribe(
      response => {
          if(response['rc'] === 'ok') {
            this.cassa = response['data'];
            this.cassa.importo +=  this.tipobiglietto.importo;
            this.cassa.key_utenti_operation = +localStorage.getItem('id');
            this.aggiornaImportoCassa(this.cassa);
           }
      },
      error => {
          alert('aggiornaCassa: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore aggiornaCassa' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });
    }

async  aggiornaImportoCassa(cassa: Cassa) {
      let rc = await  this.cassaService.update(cassa).subscribe(
        response => {
            if(response['rc'] === 'ok') {
               this.inseriscimovcassa(cassa.id);

             }
        },
        error => {
            alert('aggiornaCassa: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore aggiornaCassa' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
    }



  async inseriscimovcassa(id: number) {
    console.log('frontend - conferma- inseriscimovcassa: ');
    this.cassamov = new Cassamov();
    this.cassamov.cognome = this.pren.cognome;
    this.cassamov.nome = this.pren.nome;
    this.cassamov.idcassa = id;
    this.cassamov.idbiglietto = this.biglietto.id;
    this.cassamov.idevento = this.pren.idevento;
    this.cassamov.importo = this.tipobiglietto.importo;
    this.cassamov.key_utenti_operation = +localStorage.getItem('id');
    this.cassamov.modpag = 1;  // Contanti
    this.cassamov.stato = 1;

    let rc = await  this.cassamovService.create(this.cassamov).subscribe(
        response => {
            if(response['rc'] === 'ok') {
                this.aggiornapostoevento(this.pren.idevento, this.pren.idsettore, this.pren.idfila, this.pren.idposto,  this.biglietto.id);  // da fare
                this.isVisible = true;
                this.alertSuccess = true;
                this.type = 'success';
                this.Message = 'Emesso regolarmente biglietto - pagamento per Contanti';
                this.showNotification(this.type, this.Message);
             }
        },
        error => {
            alert('inseriscimovcassa: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore inseriscimovcassa' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
  }




async  aggiornapostoevento(idevento: number, idsettore: number, idfila: number, idposto: number,  biglietto: number) {
    let rc = await  this.eventopostoService.getbyIdEventoSettFilaposto(idevento, idsettore, idfila, idposto).subscribe(
      response => {
          if(response['rc'] === 'ok') {
              this.eventoposto = response['data'];
              this.eventoposto.idbiglietto = biglietto;
              this.aggiornaposto(this.eventoposto);  // da fare
           }
      },
      error => {
          alert('aggiornapostoevento: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore aggiornaposteevento' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });
  }


  async  aggiornaposto(eventoposto: EventoPosto) {
    let rc = await  this.eventopostoService.update(eventoposto).subscribe(
      response => {
          if(response['rc'] === 'ok') {

           }
      },
      error => {
          alert('aggiornaposto: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore aggiornaposto' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });
  }






}



/*







              ngOnInit(): void {


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







        rilasciaRichieste() {
          alert('sono in submit  ------  da adattara e scelta con logistica');
          console.log('sono in submit -----------  ' );
          // creare il record master
          this.creaprenotazeventomasterConfirm();


         // this.invioemailperconferma();




          // leggo le richieste e faccio inserimento su pronotazeventoConfirm e poi mando la mail
          // this.loadEventoPostiprenotati(this.keyuserpren);


       }





   async   creaprenotazeventomasterConfirm() {

        console.log('creaprenotmaster: ' + localStorage.getItem('keyuserpren_idevento'));
        let merdaxx = 0;
        merdaxx = +localStorage.getItem('idevento');
        console.log('dopo normalizzazione a numero: ' + merdaxx);

        this.prenotazeventomasterConfirm = new  PrenotazeventomasterConfirm();
        this.prenotazeventomasterConfirm.cognome = localStorage.getItem('keyuserpren_cognome');
        this.prenotazeventomasterConfirm.nome = localStorage.getItem('keyuserpren_nome');
        this.prenotazeventomasterConfirm.email = localStorage.getItem('keyuserpren_email');
        this.prenotazeventomasterConfirm.telefono = localStorage.getItem('keyuserpren_telefono');
        this.prenotazeventomasterConfirm.keyuserpren = localStorage.getItem('keyuserpren');
        this.prenotazeventomasterConfirm.datapren = localStorage.getItem('keyuserpren_datapren');
        this.prenotazeventomasterConfirm.idevento = +localStorage.getItem('keyuserpren_idevento');
        this.prenotazeventomasterConfirm.devento = this.evento.descrizione;
        this.prenotazeventomasterConfirm.idlogistica = +localStorage.getItem('keyuserpren_idlogistica');
        this.prenotazeventomasterConfirm.idsettore = +localStorage.getItem('keyuserpren_idsettore');
        this.prenotazeventomasterConfirm.idfila = +localStorage.getItem('keyuserpren_idfila');
        this.prenotazeventomasterConfirm.idposto = +localStorage.getItem('keyuserpren_idposto');
        this.prenotazeventomasterConfirm.idtipobiglietto = +localStorage.getItem('keyuserpren_idtipobiglietto');
        let rc = await  this.prenotazeventomasterConfirmService.create(this.prenotazeventomasterConfirm).subscribe(
                response => {
                      if(response['rc'] === 'ok') {
                      this.codpren = response['codpren'];
                      this.token = response['token'];
                      console.log('inviata email conferma - codpren: ' + this.codpren + ' token: ' + this.token);
                      // leggo le richieste e faccio inserimento su pronotazeventoConfirm -- mail appena inviata al capogruppo
                      this.loadEventoPostiprenotati(this.keyuserpren, this.codpren, this.token);
                      this.registratoevento = true;
                      }
                },
                error => {
                      alert('invioemailperconferma: ' + error.message);
                      this.isVisible = true;
                      this.alertSuccess = false;
                      this.type = 'error';
                      this.Message = 'Errore invioemailperconferma' + '\n' + error.message;
                      this.showNotification(this.type, this.Message);
                      console.log(error);
                });
    }







       openSelezPosto(form: NgForm) {
       // alert('aprire popup per selezione settore/fila posto/tipo biglietto');
        console.log('aprire popup per selezione settore/fila posto/tipo biglietto ');

        // verifico se creato il gruppo di prenotazione su localstorage
        this.keyuserpren = localStorage.getItem('keyuserpren');
        console.log('localStorage - keyuserpren ' + this.keyuserpren);
        if(this.keyuserpren == null) {

          const date = new Date();

          //console.log(this.datePipe.transform(date,"dd/MM/yyyy")); //output : 2018-02-13


          this.keyuserpren = form.value.cognome.substring(0, 3) + form.value.nome.substring(0, 3) + form.value.telefono.substring(-2, 2) + this.datePipe.transform(date,"dd-MM-yyyy");
          localStorage.setItem('keyuserpren', this.keyuserpren);
          localStorage.setItem('keyuserpren_cognome', form.value.cognome);
          localStorage.setItem('keyuserpren_nome', form.value.nome);
          localStorage.setItem('keyuserpren_email', form.value.email);
          localStorage.setItem('keyuserpren_telefono', form.value.telefono);
          localStorage.setItem('keyuserpren_datapren', this.datePipe.transform(date,"dd-MM-yyyy"));
          localStorage.setItem('keyuserpren_stato', 'prima');
          console.log('localStorage - Creata keyuserpren ' + this.keyuserpren);
        }

        this.eventoposto = new EventoPosto();
        this.eventoposto.id = 1;
        this.eventoposto.keyuserpren = this.keyuserpren;
        this.eventoposto.idlogistica = this.evento.idlogistica;
        this.eventoposto.idEvento = this.evento.id;
        this.eventoposto.cognome = form.value.cognome;
        this.eventoposto.nome = form.value.nome;
        this.eventoposto.cellulare = form.value.telefono;
        this.eventoposto.email = form.value.email;

        console.log('nuovoElemento ----------  dati passati: ' + JSON.stringify(this.eventoposto));


        const ref = this.modalService.open(EventopostopopComponent, {size:'lg'});
        ref.componentInstance.selectedUser = this.eventoposto;

        ref.result.then(
           (yes) => {
             console.log('Click YES');

             // leggo il file con elemento caricato
             this.nrich = 0;
             this.loadEventoPosti(this.keyuserpren);


            // this.loadlocalita();
             //this.router.navigate(['/socio/edit/' + this.socio.id]);   // per aggiornare elenco richiamo la stessa pagina
           },
           (cancel) => {
             console.log('click Cancel');
           });
      }


   async   loadEventoPosti(keyuserpren: string) {
        console.log('frontend - loadEventoPosti: ' + keyuserpren);
        let rc = await  this.eventopostoService.getbykeyuserpren(keyuserpren).subscribe(
        response => {
            this.eventoposti = response['data'];
            this.nrich  = response['number'];
            this.prenotatiposti = true;
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




      async   loadEventoPostiprenotati(keyuserpren: string, codpren: string, token: string) {
        console.log('frontend - loadEventoPostiprenotati: ' + keyuserpren);
        let rc = await  this.eventopostoService.getbykeyuserpren(keyuserpren).subscribe(
        response => {
            this.eventoposti = response['data'];
            const oggi = new Date();
            for(const posto of this.eventoposti) {
              console.log('postoprenotato : ---------- posto ------------------ ' + JSON.stringify(posto));
              this.pren = new PrenotazeventoConfirm();
              this.pren.cognome = posto.cognome;
              this.pren.nome = posto.nome;
              this.pren.email = posto.email;
              this.pren.idevento = posto.idEvento;
              this.pren.idlogistica = posto.idlogistica;
              this.pren.idsettore = posto.idSettore;
              this.pren.idfila = posto.idFila;
              this.pren.idposto = posto.idPosto;
              this.pren.idtipobiglietto = posto.tipobiglietto;
              this.pren.persone = 1;
              this.pren.telefono = posto.cellulare;
              this.pren.datapren = this.datePipe.transform(oggi,"dd/MM/yyyy");
              this.pren.codpren =  codpren;
              this.pren.token = token;
              console.log('pronto per inserimento prenotazione: ----------- pren -------------' + JSON.stringify(this.pren));
              this.prenotazeventoConfirmService.registerConfermetPrenotazeventologisticaMoreno(this.pren).subscribe(
                resp => {
                           if(resp['rc'] === 'ok') {
                            // non faccio nulla
                           }
                    },
                error => {
                       console.log('errore in creazione conferme prenotazione ' + error.message);
                       this.handleError(error);
                       console.log(error.message);
                       this.type = 'error';
                       this.Message = 'errore in creazione conferme prenotazione: ' + error.message;
                       this.showNotification(this.type, this.Message);
                 });
           }

        },
        error => {
            alert('loadEventoPostiprenotati: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadEventoPostiprenotati' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });

      }


/*

spostati sulla popup


    async   loadSettori(id: number) {    // utilizzo solo settori operativi per l'evevnto
            console.log('frontend - loadSettori -  logistica: ' + id);
            let rc = await  this.eventosettfilapostiService.getbyIdEventoSettori(id).subscribe(
            response => {
                this.eventosettfilaposti = response['data'];
            },
            error => {
                alert('loadSettori: ' + error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                this.type = 'error';
                this.Message = 'Errore loadSettori' + '\n' + error.message;
                this.showNotification(this.type, this.Message);
                console.log(error);
            });

          }


          selectedtipoBiglietto(selectedValue: number) {
            //  alert('selezionato: ' + selectedValue);
              if(selectedValue === 99) {
             //   alert('selezionato: ---  uscito errato ' );
                this.type = 'error';
                this.Message = 'selezione non corrette';
                this.showNotification(this.type, this.Message);
                this.alertSuccess = false;
                this.isVisible = true;
            } else {
            //  alert('selezionato: ------------- uscito corretto');
              this.tipobigliettoService.getbyid(selectedValue).subscribe(
                  resp => {
                    this.tipibiglietto = resp['data'];
                  },
                  error => {
                    this.isVisible = true;
                    this.alertSuccess = false;
                    console.log(error);
                    this.Message = error.message;
                    this.type = 'error';
                    this.showNotification(this.type, this.Message);
                  });
               }
            }


            onSelectedSettore(selectedValue: number) {
              //  alert('selezionato: ' + selectedValue);
                if(selectedValue ==  99) {
                  this.type = 'error';
                  this.Message = 'selezione non corrette';
                  this.showNotification(this.type, this.Message);
                  this.alertSuccess = false;
                  this.isVisible = true;
                  this.selectedSettore = 0;
                  this.settoreselcted = false;
                  this.eventosettfilaposti1 = this.eventosettfilapostienull;
                  return;
               } else {
                this.loadFilebySettore(this.evento.id, selectedValue);
                this.selectedSettore = selectedValue;
                this.settoreselcted = true;
                console.log('fatto selezione Settore - selezionato: ' + this.evento.id + ' settore ' + selectedValue);


              }

            }




            onSselectedFila(selectedValue: number) {
             //  alert('selezionato: ' + selectedValue);
               if(selectedValue ==  99) {
                 this.type = 'error';
                 this.Message = 'selezione non corrette';
                 this.showNotification(this.type, this.Message);
                 this.alertSuccess = false;
                 this.isVisible = true;
                 this.selectedFila = 0;
                 this.eventosettfilaposti1 = this.eventosettfilapostienull;
                 return;
              } else {
               this.loadPostibyFila(this.evento.id, selectedValue);
               this.selectedFila = selectedValue;
               console.log('fatto selezione Settore - selezionato: ' + this.evento.id + ' settore ' + selectedValue);


              }

          }

          loadPostibyFila(id: number, idFila: number) {
           // da fare
          }

       async  loadFilebySettore(id: number, idSett: number) {    // utilizzo solo settori operativi per l'evevnto
             console.log('frontend - loadFilebySettore -  evento: ' + id + ' settore: ' + idSett);
             let rc = await  this.eventosettfilapostiService.getbyIdEventofileofSettore(id, idSett).subscribe(
             response => {
                 this.eventosettfilaposti1 = response['data'];
             },
             error => {
                 alert('loadFilebySettore: ' + error.message);
                 this.isVisible = true;
                 this.alertSuccess = false;
                 this.type = 'error';
                 this.Message = 'Errore loadFilebySettore' + '\n' + error.message;
                 this.showNotification(this.type, this.Message);
                 console.log(error);
             });

           }



             async loadtipibiglietto(id: number) {
               console.log('frontend - loadtipibiglietto: ' + id);
               let rc = await  this.tipobigliettoService.getbyevento(id).subscribe(
               response => {
                     if(response['rc'] === 'ok') {
                       this.tipibiglietto = response['data'];
                      }
                     if(response['rc'] === 'nf') {
                       this.tipibiglietto = this.tipibigliettonull;
                      }
                 },
             error => {
                 alert('loadtipibiglietto: ' + error.message);
                 this.isVisible = true;
                 this.alertSuccess = false;
                 this.type = 'error';
                 this.Message = 'Erroreloadtipibiglietto' + '\n' + error.message;
                 this.showNotification(this.type, this.Message);
                 console.log(error);
             });

         }




*/








