import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model

import { Evento} from '../../../classes/Evento';
import { Ttipobiglietto} from '../../../classes/T_tipo_biglietto';
import { EventoSettore } from '../../../classes/Eventosettore';
import { EventoFila } from '../../../classes/Eventofila';
import { EventoPosto } from '../../../classes/Eventoposto';
import { Biglietto } from '../../../classes/Biglietto'

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply, faPrint } from '@fortawesome/free-solid-svg-icons';
// service
import { TtipobigliettoService } from '../../../services/ttipobiglietto.service';
import { EventoService } from '../../../services/evento.service';
import { EventosettoreService } from '../../../services/eventosettore.service';
import { EventofilaService } from '../../../services/eventofila.service';
import { EventopostoService } from '../../../services/eventoposto.service';
import { BigliettoService } from './../../../services/biglietto.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-biglietto-print',
  templateUrl: './biglietto-print.component.html',
  styleUrls: ['./biglietto-print.component.css']
})
export class BigliettoPrintComponent implements OnInit {

  NgForm=NgForm;//this one solve my problem...initialization and declaration

  public title = 'Stampa Biglietto';
  public error = [];

  public tipobiglietto: Ttipobiglietto;
  public evento: Evento;
  public eventoposto: EventoPosto;
  public eventoSettore: EventoSettore;
  public eventofila: EventoFila;
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

  public visibleConferma = true;
  public idpassed = 0;
  public dataEvento: Date;
  public statoAttivo = 0;
  public validOption = false;
  public visibleContanti = false;
  public emessobiglietto = false;
  public nrich = 0;
  public dataOdierna;
  public datadioggi = '';
  public numerobigliettoedit = '';
  public bigliettoemesso = false;
  public lencampo = 0;
  public Message1 = 'messaggio di mersa'

  constructor(private eventoService: EventoService,
              private eventopostoService: EventopostoService,
              private tipobigliettoService: TtipobigliettoService,
              private eventofilaService: EventofilaService,
              private eventosettoreService: EventosettoreService,
              private bigliettoService: BigliettoService,
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
    this.loadBiglietto(this.idpassed);
     });
}

resetinitial() {
     this.isVisible = true;
    this.alertSuccess = true;


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
          this.loadEvento(this.eventoposto.idEvento);
          if(this.eventoposto.idSettore > 0) {
            this.loadSettore(this.eventoposto.idSettore);
            this.loadFila(this.eventoposto.idFila);
          }
          this.loadtipoBiglietto(this.eventoposto.tipobiglietto);
       }
    },
    error => {
        alert('loadEventoPosto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore loadEventoPosto' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });
}


async loadBiglietto(id: number) {

  let rc = await  this.bigliettoService.getbyId(id).subscribe(
  response => {
      if(response['rc'] === 'ok') {
        this.biglietto = response['data'];

        if(this.biglietto.stampa == 'N') {
          this.title = 'Stampa Biglietto - biglietto-print';
          this.Message = 'clicca stampa per eseguire stampa biglietto';
        }
        if(this.biglietto.stampa == 'S') {
          this.title = 'Ristampa Biglietto - biglietto-print';
          this.Message = 'clicca stampa per eseguire la ristampa biglietto';
        }
        this.loadEventoPosto(this.biglietto.posto);
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

    printBiglietto() {
      alert('devo fare la stampa fisica del pdf')
      let idPrint = "bigliettoPrint"
      var nw = window.open();
      nw.document.write(document.getElementById(idPrint).innerHTML);
      nw.print();
      nw.close();
    }

}
