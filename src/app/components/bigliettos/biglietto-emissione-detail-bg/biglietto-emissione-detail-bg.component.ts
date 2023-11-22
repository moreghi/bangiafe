
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from '../../../classes/Manifestazione';
import { Evento} from '../../../classes/Evento';
import { Ttipobiglietto} from '../../../classes/T_tipo_biglietto';
import { Ttipopagamento} from '../../../classes/T_tipo_pagamento';

import { Cassa } from '../../../classes/Cassa';
import { Cassamov } from '../../../classes/Cassamov';
import { Biglietto } from '../../../classes/Biglietto'

import { EventoSettore } from '../../../classes/Eventosettore';
import { EventoFila } from '../../../classes/Eventofila';
import { EventoPosto } from '../../../classes/Eventoposto';


import { LogSettore } from '../../../classes/Logsettore';
import { LogFila } from '../../../classes/Logfila';
import { LogPosto } from '../../../classes/Logposto';
// icone
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
// service
import { TtipobigliettoService } from '../../../services/ttipobiglietto.service';
import { TtipopagamentoService } from '../../../services/ttipopagamento.service';
import { ManifestazioneService } from '../../../services/manifestazione.service';
import { EventoService } from '../../../services/evento.service';
import { CassaService } from './../../../services/cassa.service';
import { CassamovService } from './../../../services/cassamov.service';
import { BigliettoService } from './../../../services/biglietto.service';

import { EventosettoreService } from './../../../services/eventosettore.service';
import { EventofilaService } from './../../../services/eventofila.service';
import { EventopostoService } from './../../../services/eventoposto.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-biglietto-emissione-detail-bg',
  templateUrl: './biglietto-emissione-detail-bg.component.html',
  styleUrls: ['./biglietto-emissione-detail-bg.component.css']
})
export class BigliettoEmissioneDetailBgComponent implements OnInit {

  public title = 'Emissione Biglietto da Bandiera Gialla - biglietto-emissione-detail-bg';
  public error = [];



  public tipobiglietto: Ttipobiglietto;
  public wtipobiglietto: Ttipobiglietto;
  public tipopagamento: Ttipopagamento;
  public tipopagamenti: Ttipopagamento[] = [];
  public manif: Manifestazione;
  public evento: Evento;
  public cassa: Cassa;
  public cassamov: Cassamov;
  public biglietto: Biglietto;


  public eventosettori: EventoSettore[] = [];
  public eventosettore: EventoSettore;
  public eventofile: EventoFila[] = [];
  public eventofila: EventoFila;
  public eventoposti: EventoPosto[] = [];
  public eventoposto: EventoPosto;



// cancellare
   public logsettori: LogSettore[] = [];
   public logsettore: LogSettore;
   public logfile: LogFila[] = [];
   public logfila: LogFila;
   public logposti: LogPosto[] = [];
   public logposto: LogPosto;

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

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';
  public manifActive = 1;
  public manAct = 0;

  public visibleConferma = true;
  public idpassed = 0;
  public dataEvento: Date;
  public statoAttivo = 0;
  public tipoPagamento = '?';
  public validOption = false;
  public visibleContanti = false;
  public emessobiglietto = false;
  public nrich = 0;
  public dataOdierna: Date;
  public datadioggi = '';
  public numerobigliettoedit = '';
  public bigliettoemesso = false;
  public lencampo = 0;
  public presentaCassa = false;

  public Message1 = 'messaggio di mersa'
  public cassaInizialeimporto = 0;

  public selectedTipoPagamento = 0;
  public confermaPagamento = false;

  public tipoBigliettoRichiesto = 0;
  public eventoBigliettoRichiesto = 0;
  public lastnumbercassa = 0;
  public bigliettoinEmissione = false;
  public faseEmissione = 0;   // 0= recupero il numero prossimo da emettere per visualizzare in wtipobiglietto
                              // 1= recupero il numero effettivo per creare nuono biglietto in maniera definitiva
  public selectedSettore = false;
  public selectedFila = false;
  public selectedPosto = false;
  public statoActive = 0;
  public settoreSelezionato = 0;
  public filaselezionata = 0;
  public postoSelezionato = 0;
  public provenienza = '';

  constructor(
              private manifestazioneService: ManifestazioneService,
              private eventoService: EventoService,
              private tipobigliettoService: TtipobigliettoService,
              private tipopagamentoService: TtipopagamentoService,
              private cassaService: CassaService,
              private cassamovService: CassamovService,
              private bigliettoService: BigliettoService,
              private eventosettoreService: EventosettoreService,
              private eventofilaService: EventofilaService,
              private eventopostoService: EventopostoService,
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

      this.resetinitial();
      this.loadTpagamento();

      console.log('goApplication - biglietto-emissione-detail-bg  --------  appena entrato');

      this.route.paramMap.subscribe(p => {
      this.idpassed = +p.get('id');
      if(this.idpassed == 99999) {   // biglietto da emettere
          this.biglietto = new Biglietto();
          this.bigliettodaemettere();
      }  else {
        console.log('id recuperato: ' + this.idpassed);
        this.loadBiglietto(this.idpassed);
      }

      this.Message = 'pronto per acquisto biglietto';
      });
}

bigliettodaemettere() {

   console.log('......... biglietto da emettere ----- appena entrato')

   this.tipoBigliettoRichiesto = +localStorage.getItem('emBigliettoTipo');
   this.eventoBigliettoRichiesto = +localStorage.getItem('emBigliettoEvento');

   console.log('......... emBigliettoTipo ----- ' + this.tipoBigliettoRichiesto);
   console.log('......... emBigliettoEvento ----- appena entrato ' + this.eventoBigliettoRichiesto);

   this.bigliettoinEmissione = true;
   this.loadEvento(this.eventoBigliettoRichiesto);
   this.loadCassadelGiorno(this.datadioggi, this.eventoBigliettoRichiesto);
   this.faseEmissione = 0;
   this.loadtipoBiglietto(this.faseEmissione, this.tipoBigliettoRichiesto);

}

async  loadTpagamento() {

  let rc = await this.tipopagamentoService.getAll().subscribe(
      resp => {
       //     console.log('loadTpagamento: ' + JSON.stringify(resp['data']) + ' rc: ' + resp['rc']);
            if(resp['rc'] === 'ok') {
              this. tipopagamenti= resp['data'];
              console.log('loadTpagamento_after_rc: ' + JSON.stringify(this.tipopagamenti) + ' rc: ' + resp['rc']);
            }
         },
      error => {
           alert('sono in loadTpagamento');
           console.log('loadTagli - errore: ' + error);
           this.type = 'error';
           this.Message = error.message;
           this.showNotification(this.type, this.Message);
       });
   }

resetinitial() {
        this.faseEmissione = 0;
        this.bigliettoinEmissione = false;
        this.isVisible = true;
        this.alertSuccess = true;
        this.confermaPagamento = false;
        const date = Date();
        this.dataOdierna = new Date(date);
        this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');
}

async loadBiglietto(id: number) {
        console.log('frontend - loadPrenotazEvento: ' + id);
        let rc = await  this.bigliettoService.getbyId(id).subscribe(
            response => {
            if(response['rc'] === 'ok') {
            this.biglietto = response['data'];
            this.loadEvento(this.biglietto.evento);
            this.loadCassadelGiorno(this.datadioggi, this.biglietto.evento);
            this.faseEmissione = 9; // non deve fare nulla -- impostazione necessaria ma non serve
            this.loadtipoBiglietto(this.faseEmissione, this.biglietto.tipo);
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


handleFocus(evento: any) {
    alert(' sono in focus')
}
handleBlur(evento: any) {
    alert(' sono uscito dal focus')
}

async loadCassadelGiorno(datadioggi: string, idEvento: number) {
          console.log('frontend - -------------------------->>>>>>>>   loadCassadelGiorno: ' + datadioggi + ' evento: ' + idEvento);
          let rc = await  this.cassaService.getbydata(datadioggi,idEvento).subscribe(
                response => {
                    if(response['rc'] === 'ok') {
                    this.cassa = response['data'];
                //    console.log('cassa del giorno: ' + JSON.stringify(this.cassa));
                    }
                    if(response['rc'] === 'nf') {
                      this.cassa = new Cassa();
                      this.cassa.datacassa =  this.datadioggi;
                      this.cassa.idEvento = idEvento
                      this.createCassa(this.cassa);
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

async createCassa(cassa: Cassa) {
  console.log('frontend - createCassa: ' + JSON.stringify(cassa));
  let rc = await  this.cassaService.create(cassa).subscribe(
  response => {
      if(response['rc'] === 'ok') {
         this.cassa = response['data'];
         this.lastnumbercassa = response['lastnumber'];
       }
  },
  error => {
      alert('createCassa: ' + error.message);
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'Errore createCassa' + '\n' + error.message;
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
                    if(this.evento.idtipo == 1) {
                      this.provenienza = "BG";
                    }
                    if(this.evento.idtipo == 2 && this.evento.idlogistica > 0) {
                      this.provenienza = "PR";
                    }
                    this.dataEvento = new Date(this.evento.data);
                    if(this.evento.idtipo == 2) {
                      this.loadSettoriLogistica(this.evento.id);
                    }
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

async loadSettoriLogistica(id: number) {
  //  console.log('frontend - loadtipoBiglietto: ' + id);
    this.statoActive = 0;
    this.selectedFila = false;
    this.selectedPosto = false;

      let rc = await  this.eventosettoreService.getbyIdEvento(id).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                this.eventosettori = response['data'];
               }
              if(response['rc'] === 'nf') {
                this.eventosettori = null;
              }
          },
          error => {
                alert('loadSettoriLogistica: ' + error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                this.type = 'error';
                this.Message = 'Errore loadSettoriLogistica' + '\n' + error.message;
                this.showNotification(this.type, this.Message);
                console.log(error);
    });
}



async loadFileLogistica(idEvento, idSettore: number) {
    console.log('frontend - loadFileLogistica: ---    settore: ' + idSettore);
    this.statoActive = 0;
    this.selectedPosto = false;
    let rc = await  this.eventofilaService.getbyeventoSettoreStato(idEvento, idSettore, this.statoActive).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                this.eventofile = response['data'];
               }
              if(response['rc'] === 'nf') {
                this.eventofile = null;
              }
          },
          error => {
                alert('loadFileLogistica(: ' + error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                this.type = 'error';
                this.Message = 'Errore loadFileLogistica(' + '\n' + error.message;
                this.showNotification(this.type, this.Message);
                console.log(error);
    });
}


async loadPostiLogistica(id: number, idSett: number, idFila: number) {
  console.log('frontend - loadPostiLogistica: ---   evento; ' + id + ' settore: ' + idSett + ' fila: ' + idFila);
  this.statoActive = 0;
  this.selectedPosto = false;

  let rc = await  this.eventopostoService.getbyIdEventoSettFilaActive(id, idSett, idFila).subscribe(
        response => {
            if(response['rc'] === 'ok') {
              this.eventoposti = response['data'];
             }
            if(response['rc'] === 'nf') {
              this.eventoposti = null;
            }
        },
        error => {
              alert('loadPostiLogistica(: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore loadPostiLogistica(' + '\n' + error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
  });
}


async loadtipoBiglietto(fase: number,id: number) {
    //  console.log('frontend - loadtipoBiglietto: ' + id);
      let rc = await  this.tipobigliettoService.getbyid(id).subscribe(
            response => {
                if(response['rc'] === 'ok') {
                this.tipobiglietto = response['data'];

                if(this.bigliettoinEmissione === true) {
                  if(fase == 0) {
                    this.wtipobiglietto = new Ttipobiglietto();
                    this.wtipobiglietto.ultimoemesso = this.tipobiglietto.ultimoemesso + 1;
                  }
                  if(fase == 1) {
                    this.tipobiglietto.nemessi = this.tipobiglietto.nemessi + 1;
                    this.tipobiglietto.ultimoemesso = this.tipobiglietto.ultimoemesso + 1;
                    this.biglietto.tipo = this.tipobiglietto.id;
                    this.biglietto.serie = this.tipobiglietto.serie;
                    this.biglietto.importo = this.tipobiglietto.importo
                    this.biglietto.evento = this.tipobiglietto.idevento;
                    this.biglietto.dataemi = this.datadioggi;
                    this.biglietto.numero = this.tipobiglietto.ultimoemesso;
                    this.creanuovoBiglietto(this.biglietto);
                  }
                }
             }
           },
            error => {
                  alert('loadtipoBiglietto: ' + error.message);
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = 'Errore loadtipoBiglietto' + '\n' + error.message;
                  this.showNotification(this.type, this.Message);
                  console.log(error);
      });
}


async loadtipopagamento(id: number) {
    //    console.log('frontend - loadtipopagamento: ' + id);
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


onSelecTipopagam(selectedValue: number) {
  //  alert('selezionato: ' + selectedValue);
    if(selectedValue ==  9999) {
      this.type = 'error';
      this.Message = 'selezione non corrette';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      this.selectedTipoPagamento = 0;
      return;
     } else {
        this.selectedTipoPagamento = selectedValue;
        this.biglietto.modpag = selectedValue;
     }
  }


  onSelecSettore(selectedValue: number) {
    //  alert('selezionato: ' + selectedValue);

      if(selectedValue ==  9999) {
        this.type = 'error';
        this.Message = 'selezione non corretta';
        this.showNotification(this.type, this.Message);
        this.alertSuccess = false;
        this.isVisible = true;
        this.settoreSelezionato = 0;
        this.selectedSettore = false;
        this.biglietto.settore = selectedValue;
        return;
       } else {
          this.settoreSelezionato = selectedValue;
          this.selectedSettore = true;
          this.biglietto.settore = selectedValue;
          this.selectedFila = false;
          this.selectedPosto = false;
          this.loadFileLogistica(this.evento.id,this.settoreSelezionato);

       }
    }

onSelecFila(selectedValue: number) {
  //  alert('selezionato: ' + selectedValue);
    if(selectedValue ==  9999) {
      this.type = 'error';
      this.Message = 'selezione non corretta';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      this.settoreSelezionato = 0;
      this.selectedFila = false;
      this.biglietto.fila = selectedValue;
      return;
     } else {
        this.filaselezionata = selectedValue;
        this.selectedFila = true;
        this.biglietto.fila = selectedValue;
        this.selectedPosto = false;
        this.loadPostiLogistica(this.evento.id, this.settoreSelezionato, this.filaselezionata);

     }
  }


  onSelecPosto(selectedValue: number) {
    //  alert('selezionato: ' + selectedValue);
      if(selectedValue ==  9999) {
        this.type = 'error';
        this.Message = 'selezione non corretta';
        this.showNotification(this.type, this.Message);
        this.alertSuccess = false;
        this.isVisible = true;
        this.postoSelezionato = 0;
        this.selectedPosto = false;
        this.biglietto.posto = selectedValue;
        return;
       } else {
          this.postoSelezionato = selectedValue;
          this.selectedPosto = true;
          this.biglietto.posto = selectedValue;
          this.loadeventoPosto(selectedValue);
         }
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

emettiBiglietto(biglietto: Biglietto)  {
    console.log('emettibiglietto --  appena entrato')

    this.tipoBigliettoRichiesto = +localStorage.getItem('emBigliettoTipo');
    this.eventoBigliettoRichiesto = +localStorage.getItem('emBigliettoEvento');

    console.log('......... emBigliettoTipo ----- ' + this.tipoBigliettoRichiesto);
    console.log('......... emBigliettoEvento ----- appena entrato ' + this.eventoBigliettoRichiesto);

    localStorage.removeItem('emBigliettoTipo');
    localStorage.removeItem('emBigliettoEvento');

if(this.evento.idtipo == 2) {
  if(biglietto.settore == 0) {
    this.type = 'error';
    this.Message = 'Non hai selezionato il Settore';
    this.showNotification(this.type, this.Message);
    this.alertSuccess = false;
    this.isVisible = true;
    return;
  }
  if(biglietto.fila == 0) {
    this.type = 'error';
    this.Message = 'Non hai selezionato la fila';
    this.showNotification(this.type, this.Message);
    this.alertSuccess = false;
    this.isVisible = true;
    return;
  }
  if(biglietto.posto == 0) {
    this.type = 'error';
    this.Message = 'Non hai selezionato il posto';
    this.showNotification(this.type, this.Message);
    this.alertSuccess = false;
    this.isVisible = true;
    return;
  }
}

    if(this.confermaPagamento === false) {
      this.type = 'error';
      this.Message = 'confermare avvenuto pagamento';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      return;
   }

   if(this.selectedTipoPagamento === 0) {
    this.type = 'error';
    this.Message = 'Selezionare il tipo di pagamento effettuato';
    this.showNotification(this.type, this.Message);
    this.alertSuccess = false;
    this.isVisible = true;
    return;
 }
 console.log('emettibiglietto --  -----   step_01 controlli-OK ')
      biglietto.stato = 1;
      if(biglietto.id == 0) {
        this.faseEmissione = 1;
        this.loadtipoBiglietto(this.faseEmissione, this.tipoBigliettoRichiesto);
      }  else {
        this.aggiornaBiglietto(this.biglietto);
      }

}

async  aggiornaBiglietto(biglietto: Biglietto)  {
  console.log('----- before update cassa ----------- cassa da aggiornare: ' + JSON.stringify(this.cassa));
  let rc = await  this.bigliettoService.update(biglietto).subscribe(
        response => {
            if(response['rc'] === 'ok') {
              this.aggiornaeventoPosto(this.eventoposto, biglietto);
              this.aggiornaTipoBiglietto(biglietto);
              if(this.selectedTipoPagamento !== 9)  {
                this.aggiornaCassadelGiorno(this.cassa, biglietto);
              }
        }
    },
      error => {
            alert('aggiornaBiglietto: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore aggiornaBiglietto' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
      });
  }

  async   creanuovoBiglietto(biglietto: Biglietto)  {
      this.creaBiglietto(biglietto);
      this.aggiornaTipoBiglietto(biglietto);
  }

  async creaBiglietto(biglietto: Biglietto) {
    console.log('frontend - creaBiglietto: ' + JSON.stringify(biglietto));
    let rc = await  this.bigliettoService.create(biglietto).subscribe(
        response => {
        if(response['rc'] === 'ok') {
          this.biglietto = response['data'];
          this.aggiornaeventoPosto(this.eventoposto, this.biglietto);
          if(this.selectedTipoPagamento !== 9)  {
            this.aggiornaCassadelGiorno(this.cassa, this.biglietto);
          }
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

  async aggiornaTipoBiglietto(biglietto: Biglietto) {
    //    console.log('frontend - loadtipopagamento: ' + id);
        let rc = await  this.tipobigliettoService.getbyid(biglietto.tipo).subscribe(
              response => {
                  if(response['rc'] === 'ok') {
                      this.tipobiglietto = response['data'];
                      if(this.bigliettoinEmissione === true) {
                        this.tipobiglietto.nemessi =  this.tipobiglietto.nemessi + 1;
                        this.tipobiglietto.ultimoemesso = this.tipobiglietto.ultimoemesso + 1;
                      } else {
                        this.tipobiglietto.npren =  this.tipobiglietto.npren + 1;
                      }
                      this.updateTipoBiglietto(this.tipobiglietto);
                  }
          },
        error => {
              alert('aggiornaTipoBiglietto: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore aggiornaTipoBiglietto' + '\n' + error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
        });
}

async updateTipoBiglietto(tipobiglietto: Ttipobiglietto) {
      console.log('fronteupdateTipoBigliettond - . . . . . . . .. updateTipoBiglietto ' + JSON.stringify(tipobiglietto));
      let rc = await  this.tipobigliettoService.update(tipobiglietto).subscribe(
            response => {
                if(response['rc'] === 'ok') {
                 // non faccio nulla

                }
        },
      error => {
            alert('updateTipoBiglietto: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore aggiornaTipoBiglietto' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
      });
}

async loadeventoPosto(id: number) {
  //    console.log('frontend - loadtipopagamento: ' + id);
      let rc = await  this.eventopostoService.getbyId(id).subscribe(
            response => {
                if(response['rc'] === 'ok') {
                    this.eventoposto = response['data'];
                }
        },
      error => {
            alert('loadeventoPosto: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadeventoPosto' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
      });
}


async aggiornaeventoPosto(eventoposto: EventoPosto, biglietto: Biglietto) {
      eventoposto.cognome = biglietto.cognome;
      eventoposto.nome = biglietto.nome;
      eventoposto.stato = 1;
      eventoposto.dataemi = this.datadioggi;
      eventoposto.tipobiglietto = biglietto.tipo;
      eventoposto.idbiglietto = biglietto.id;
      eventoposto.tipobiglietto = biglietto.tipo;

      let rc = await  this.eventopostoService.update(eventoposto).subscribe(
            response => {
                if(response['rc'] === 'ok') {

                }
        },
      error => {
            alert('aggiornaeventoPosto: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore aggiornaeventoPosto' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
      });
}

  async aggiornaCassadelGiorno(cassa: Cassa, biglietto: Biglietto) {
    console.log('frontend - ............................................................  aggiornaCassadelGiorno: ' + JSON.stringify(cassa));

    console.log('---------------- verifico tipoPagamentoSelected: ' + this.selectedTipoPagamento);
    if(this.selectedTipoPagamento == 1) {
     cassa.contanti = cassa.contanti + biglietto.importo;
    }
    if(this.selectedTipoPagamento == 2) {
     cassa.pos = cassa.pos + biglietto.importo;
    }
    if(this.selectedTipoPagamento == 6) {
     cassa.carteCredito = cassa.carteCredito + biglietto.importo;
    }
    if(this.selectedTipoPagamento == 7) {
     cassa.bonifici = cassa.bonifici + biglietto.importo;
    }
  /*
          da problemi
   switch (this.selectedTipoPagamento) {
     case 1:  // contanti
       this.cassa.contanti = this.cassa.contanti + biglietto.importo;
       break;
     case 2:  // Pos
       this.cassa.pos = this.cassa.pos + biglietto.importo;
       break;
     case 6:  // carte di Credito
       this.cassa.carteCredito = this.cassa.carteCredito + biglietto.importo;
       break;
     case 7:  // Bonifici
       this.cassa.bonifici = this.cassa.bonifici + biglietto.importo;
       break;
     default:
       break;
   }

   */
   console.log('----- update cassa ----------- cassa aggiornata: ' + JSON.stringify(cassa));

    let rc = await  this.cassaService.update(cassa).subscribe(
          response => {
              if(response['rc'] === 'ok') {
                this.inserisciCassamov(cassa, biglietto);
              }
          },
          error => {
              alert('aggiornaCassadelGiorno: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              this.type = 'error';
              this.Message = 'Errore aggiornamento cassa del giorno' + '\n' + error.message;
              this.showNotification(this.type, this.Message);
              console.log(error);
    });
}

async inserisciCassamov(cassa: Cassa, biglietto: Biglietto) {
  console.log('frontend - .......................... cassamov ......................................  inserisciCassamov: ' + JSON.stringify(cassa));
  this.cassamov = new Cassamov();
  this.cassamov.cognome = biglietto.cognome;
  this.cassamov.nome = biglietto.nome;
  this.cassamov.modpag = biglietto.modpag;
  this.cassamov.idcassa = cassa.id;
  this.cassamov.idevento = biglietto.evento;
  this.cassamov.importo = biglietto.importo;
  this.cassamov.idbiglietto = biglietto.id;
  this.cassamov.datamov = this.datadioggi;
  this.cassamov.stato = 1;
  this.cassamov.provenienza = this.provenienza;
  this.cassamov.specifica = "biglietto n. " + biglietto.numero + ' Serie ' + biglietto.serie + ' a ' + biglietto.cognome + ' ' + biglietto.nome;
         console.log('-------->  inserisciCassamov --- modpag: ' + biglietto.modpag)

         if(biglietto.modpag == 1) {
          this.cassamov.causale = 'CO';
         }
         if(biglietto.modpag == 2) {
          this.cassamov.causale = 'PO';
         }
         if(biglietto.modpag == 6) {
          this.cassamov.causale = 'CR';
         }
         if(biglietto.modpag == 7) {
          this.cassamov.causale = 'BO';
         }




  /*      non funziona
  switch (biglietto.modpag) {
    case 1:  // contanti
      this.cassamov.causale = 'CO';
      break;
    case 2:  // Pos
      this.cassamov.causale = 'PO';
      break;
    case 6:  // Carta credito
      this.cassamov.causale = 'CR';
      break;
    case 7:  // Bonifico
      this.cassamov.causale = 'BO';
      break;
    default:
      break;
  }
  */

  console.log('inserisciCassamov +++++++++++++++++++++++++++++++++++++++  preparato cassamov: ' + JSON.stringify(this.cassamov));



  let rc = await  this.cassamovService.create(this.cassamov).subscribe(
        response => {
            if(response['rc'] === 'ok') {
              this.isVisible = true;
              this.alertSuccess = true;
              this.type = 'success';
              this.Message = 'Emesso regolarmente biglietto' + '\n' + 'Aggiornata Cassa';
              this.showNotification(this.type, this.Message) ;
        //      window.location.reload();
            }
        },
        error => {
            alert('aggiornaCassadelGiorno: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore aggiornamento cassa del giorno' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
  });
}

  checkConferma(event) {

    if(this.selectedTipoPagamento == 0) {
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.Message = 'selezionare il tipo di pagamento';
      this.showNotification(this.type, this.Message);
      return;
    } else {
      this.confermaPagamento = event.target.checked;
    }

  }


/*
GestisciCassaIniziale(cassa: Cassa) {
  console.log('GestisciCassaIniziale ................ : appena entrato ----------  ' + JSON.stringify(cassa));
  // return;

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
            this.RegistraCassaIniziale(cassa.cassaIniziale);
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
      this.cassa.idEvento = this.biglietto.evento;
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



*/

}



