import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// service
import { TtipobigliettoService} from '../../../services/ttipobiglietto.service';
import { TtagliabigliettoService} from '../../../services/ttagliabiglietto.service';
import { BigliettoService} from '../../../services/biglietto.service';
// model
import { Ttipobiglietto} from '../../../classes/T_tipo_biglietto';
import { Ttagliabiglietto} from '../../../classes/T_taglia_biglietto';

// aggiunti biglietti per passarli al padre (evento-ticket)
import { Biglietto } from '../../../classes/Biglietto';



import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faTicketAlt} from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BigliettoInterface } from '../../../interfaces/biglietto';


@Component({
  selector: 'tr[app-tipobiglietto]',
  templateUrl: './tipobiglietto.component.html',
  styleUrls: ['./tipobiglietto.component.css']
})
export class TipobigliettoComponent implements OnInit {

    // variabili passate dal componente padre
    @Input('tipobiglietto-data') tipobiglietto: Ttipobiglietto;
    @Input('tipobiglietto-prog') i: number;
    // 2023/10/10  aggiunta per filtrare biglietti in base allo stato
    @Input('tipobiglietto-stato') stato: number;


    // variabili passate al componente Padre@Output('onSelectStato') OnSelectStato = new EventEmitter<number>();

    @Output('onSelectbiglietti') onSelectbiglietti = new EventEmitter();


    public tagliabiglietto: Ttagliabiglietto;
    public biglietti: Biglietto[] = [];
    public bigliettinf: Biglietto[] = [];

    faUserEdit = faUserEdit;
    faTrash = faTrash;
    faInfo = faInfo;
    faInfoCircle = faInfoCircle;
    faList = faList;
    faPlusSquare = faPlusSquare;
    faSearch = faSearch;
    faSave = faSave;
    faMinus = faMinus;
    faPlus = faPlus;
    faWindowClose = faWindowClose;
    faTicketAlt = faTicketAlt;
  // -----
    public textMessage1 = '';
    public textMessage2 = '';
    public textUser = '';
    public headerPopup = '';
    public perDebug = 'utente passato: ';
    public Message = '';
    public presenti = false;
    public isVisible = false;
    public alertSuccess = false;
    public function = 0;
    public nRec = 0;
    // public stato = 0;

    public utenteFedele = false;

     // variabili per gestione inqu/edit/new

    public href = '';

    public navigateEdit = 'Edit';

    public messagenull = 'Nessun record presente !!!';

    closeResult = '';

 // variabili per notifica esito operazione con Notifier
   public type = '';
  onSelectStato: any;



    constructor(private tipobigliettoService: TtipobigliettoService,
                private tagliabigliettoService: TtagliabigliettoService,
                private bigliettoService: BigliettoService,
                private modalService: NgbModal,
                private route: Router,
                private datePipe: DatePipe,
                private notifier: NotifierService) {
                 this.notifier = notifier;
               }


  ngOnInit(): void {

     //   per gestire eventuale popup
     this.headerPopup = 'Registrazione Manifestazione';
     this.textMessage1 = '?????????? ';
  //   this.textUser = this.messa.demessa;
     this.textMessage2 = 'Registrazione non possibile';
   //  this.loadTagliabiglietto(this.tipobiglietto.idtipotaglia);   non serve

alert('tipobiglietto ----- stato passato per selezione biglietti ' + this.stato);



  }




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

  navigate(pathNavigate: string, tipobiglietto: Ttipobiglietto) {

    console.log(`navigate ---- funzione: ${pathNavigate} ---------------------  id: ${tipobiglietto.id} `);


    switch (pathNavigate) {

      case 'Edit':
        this.route.navigate(['tbiglietto/edit/' + tipobiglietto.id]);
        break;

      default:
        alert('scelta errata \n navigazione non possibile');
        break;
    }
  }


   async loadTagliabiglietto(id: number) {

        let rc = await  this.tagliabigliettoService.getbyid(id).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            console.log('evento da editare in dettaglio: ' + JSON.stringify(response['data']));
            this.tagliabiglietto = response['data'];
            }
         },
          error => {
              alert(' loadTagliabiglietto: ' + error.message);
              console.log(error);
              this.alertSuccess = false;
              this.Message = error.message;
              this.type = 'error';
              this.showNotification( this.type, this.Message);
          });
        }




open(content: any, tipobiglietto: Ttipobiglietto) {
  console.log(`open_content - user ${tipobiglietto.d_tipo}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + tipobiglietto.id + ' - ' + tipobiglietto.d_tipo );
   //this.cancellaProdotto(this.prodotto);
    this.delete(tipobiglietto.id);
    this.cancellazioneCompleted(tipobiglietto);
   // per riaggiornare elenco
    window.location.reload();

  }
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
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

  cancellazioneCompleted(tipobiglietto: Ttipobiglietto) {
    this.type = 'success';
    this.Message = `cancellazione Evento ${tipobiglietto.d_tipo}  eseguita con successo `;
    this.showNotification(this.type, this.Message);
  }

  delete(id:any) {
    console.log(id,'cancelllllllllllllllllllllllo --->');
    this.tipobigliettoService.delete(id).subscribe((res)=> {
      console.log(res,'res- delete -->');

      this.type = 'error';
      this.Message = res['message'];
      this.showNotification(this.type, this.Message);
    });
  }

/*
  dettaglio(tipobiglietto: Ttipobiglietto) {
    this.stato = 0;
    localStorage.setItem('StatoAssegni', String(this.stato));
    this.onSelecttipologia.emit(tipobiglietto.idtipotaglia);

  }
*/


  listAll(tipobiglietto: Ttipobiglietto) {
    this.stato = 9;  // fasccio elenco di tutti i biglietti emessi e liberi per serie
    localStorage.setItem('StatoAssegni', String(this.stato));
  //  this.onSelecttipologia.emit(tipobiglietto.idtipotaglia);

  }


//  da sistemare
  async Dettaglio(tipobiglietto: Ttipobiglietto) {
    console.log('frontend - Dettaglio:tipologia ' + tipobiglietto.idtipotaglia);
    console.log('frontend - Dettaglio: stato: ' + this.stato);
    let rc = await  this.bigliettoService.getAllbyTipo(tipobiglietto.idtipotaglia).subscribe(
    response => {
          if(response['rc'] === 'ok') {
            this.biglietti = response['data'];
               console.log('biglietti da editare: ' + JSON.stringify(this.biglietti));
            }
          if(response['rc'] === 'nf') {
            this.biglietti = this.bigliettinf;
          }
          this.onSelectbiglietti.emit(this.biglietti);
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



}

