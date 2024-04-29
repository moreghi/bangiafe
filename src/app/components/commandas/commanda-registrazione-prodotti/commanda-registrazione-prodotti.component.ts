import { Component, OnInit } from '@angular/core';
// model Class
import { Commandaw } from '../../../classes/Commandaw';
import { Commandawriga } from '../../../classes/Commandawriga';
import { Persona } from '../../../classes/Persona';
import { Prodotto } from '../../../classes/Prodotto';
import { ActivatedRoute, Router } from '@angular/router';
// Services
import { CommandawService } from './../../../services/commandaw.service';
import { CommandawrigaService} from './../../../services/commandawriga.service';
import { PersonaService } from './../../../services/persona.service';
import { ProdottoService } from './../../../services/prodotto.service';
// other
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch,
          faPlusSquare, faTrash, faUserEdit, faWindowClose, faMinus, faPlus, faReply } from '@fortawesome/free-solid-svg-icons';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-commanda-registrazione-prodotti',
  templateUrl: './commanda-registrazione-prodotti.component.html',
  styleUrls: ['./commanda-registrazione-prodotti.component.css']
})
export class CommandaRegistrazioneProdottiComponent implements OnInit {

  public title = 'Registrazione Commanda  -  Commanda-registrazione-anagrafica';

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

  public functionUrl = '';

  public functionUrlUp = '';
  public functionUserUp = '';
  public tipoSelected = '';

    // ---------------------  personalizzazioni componente

    public routenavigate = '';

    options = [
      'Primi',
      'Secondi',
      'Contorni',
      'Dolci',
      'Bevande',
     ];

   public textMessage1 = '';
   public textMessage2 = '';
   public textUser = '';
   public headerPopup = '';
   public effettuataCancellazioneOld = false;

   public commandaw: Commandaw;
   public commandawriga: Commandawriga;
   public persona: Persona;
   public persone: Persona[] = [];
   public personenull: Persona[] = [];
   public commandawrighe: Commandawriga[] = [];
   public commandawrighenull: Commandawriga[] = [];
   public commandawrigheordinati: Commandawriga[] = [];
   public prodotti: Prodotto[] = [];
   public prodottinull: Prodotto[] = [];
   public prodotto: Prodotto;

   public tipoRichiesta = '?';
   public ricManif = 0;
   public validSearch = false;
   private textMessage = '';
   public nDay = 0;
   public statoRic = 0;
   public registrata = false;

   public prenotatocognomeenome = '';

   public idCommanda = 0;
   public idlogged = 0;

   public Tnumero = 0;
   public Tnumpersone = 0;
   public Tpagato = 0;

   public selectedProdotto = 0;
   public selectedProdottoAcquistato = 0;
   public visibleProdottiAcquistati = false;
   public visibleProdotti = false;
   public visibleProdotto = false;
   public tipologia = 0;
   public anagrafica = '';
   public routeGiornata = '';
   public prg = 0;
   public EnabledCassa = false;
   // per paginazone
   p_prod: number = 1;
   p_righe: number = 1;
   p_ord: number = 1;

   public fase = '';
   public nRecOrd = 0;
   public totaleProdotti = 0;

   constructor(public modalService: NgbModal,
               private commandawService: CommandawService,
               private commandawrigaService: CommandawrigaService,
               private personaService: PersonaService,
               private prodottoService: ProdottoService,
               private route: ActivatedRoute,
               private router: Router,
               private datePipe: DatePipe,
               private notifier: NotifierService) {
                       this.notifier = notifier;
                   }

         ngOnInit(): void {

           console.log('Commanda-registrazione-Prodotti - sono in oninit ');

           this.goApplication();

         }

         goApplication() {

        console.log('-------------  sono appena entrata in commanda-registrazione-prodotti --- goApplication')
         this.idGiornata = parseInt(localStorage.getItem('idGiornata'));
         this.idlogged = +localStorage.getItem('id');
         this.route.paramMap.subscribe(p => {
          this.idCommanda = +p.get('idCommanda');
          console.log('id recuperato: ' + this.idCommanda);
          // -------  leggo i dati della giornata

         this.loadCommandaw(this.idCommanda);
         this. commandaSelect(this.idCommanda);

         });

         console.log('-------------   goApplication  -- step01')
         this.title = 'Inserimento Prodotti Commanda';
         this.fase = 'N';
         this.Message = `Inserire i prodotti`;
         this.isVisible = true;
         this.alertSuccess = true;
         this.EnabledCassa = false;
         console.log('-------------   goApplication  -- step02')
                    //  fine parte personalizzabile
                 this.type = 'success';
                 this.showNotification(this.type, this.Message);
        }



     async loadCommandaw(id: number) {
       let res = await this.commandawService.getbyid(id).subscribe(
         response => {
               this.commandaw = response['data'];
           },
       error => {
           alert('giornata-detail-prodotti  --loadCommanda: ' + error.message);
           console.log(error);
           this.isVisible = true;
           this.alertSuccess = false;
           this.type = 'error';
           this.Message = 'Errore loadCommanda' + '\n' + error.message;
           this.showNotification(this.type, this.Message);
       });

 }


     /**
      * Show a notification
      *
      * @param {string} type    Notification type
      * @param {string} message Notification message
      */

     showNotification( type: string, message: string ): void {

     this.notifier.notify( type, message );
     console.log(`sono in showNotification  ${type}`);

     }




     onSelectionChange(tipo: string)   {

        this.commandaSelect(this.idCommanda)  // riaggiorno la lista dei prodotti ordinati
        this.tipoSelected = tipo;
        this.visibleProdottiAcquistati = false;
        this.visibleProdotti = true;
        this.visibleProdotto = false;
        switch (tipo) {
                 case 'Primi':
                     this.tipologia = 1;
                     break;
                 case 'Secondi':
                    this.tipologia = 2;
                    break;
                 case 'Contorni':
                     this.tipologia = 3;
                     break;
                 case 'Dolci':
                     this.tipologia = 5;
                     break;
                 case 'Bevande':
                     this.tipologia = 4;
                     break;
                 default:
                 alert('Scelta errata' + '\n' + 'ricerca non possibile');
                 break;
        }
        this.loadProdottibyTipologia(this.tipologia);
   }


async loadProdottiOrdinati(id: number) {
  console.log(`loadProdottiOrdinati - appena entrato`);
  let rc = await this.commandawrigaService.getProdottiOrdinati(id).subscribe(
  resp => {
      if(resp['rc'] === 'ok') {
       this.commandawrighe = resp['data'];
       this.nRec = resp['number'];
       this.trovatoRec = true;
       this.EnabledCassa = true;
      }
      if(resp['rc'] === 'nf') {
        this.commandawrighe = this.commandawrighenull;
        this.trovatoRec = false;
        this.nRec = 0;
        this.EnabledCassa = false;
      }
    },
  error => {
      alert('sono in loadProdottiOrdinati - error');
      this.isVisible = true;
      this.alertSuccess = false;
      console.log('loadProdottiOrdinati - errore: ' + error);
      this.type = 'error';
      this.Message = error.message;
      this.alertSuccess = false;
      this.showNotification(this.type, this.Message);
  });

}

// solo prodotti non selezionati giornalmente
async loadProdottibyTipologia(id: number) {
    console.log(`loadProdottibyTipologia - appena entrato`);
    let rc = await this.prodottoService.getProdottiforTipologia1(id).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
         this.prodotti = resp['data'];
         this.nRec = resp['number'];
        }
        if(resp['rc'] === 'nf') {
          this.prodotti = this.prodottinull;
          this.nRec = 0;
        }
      },
    error => {
        alert('sono in loadProdottibyTipologia - error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('loadProdottibyTipologia - errore: ' + error);
        this.type = 'error';
        this.Message = error.message;
        this.showNotification(this.type, this.Message);
    });

}

onSelectTipologia(tipologia: number) {
  alert('onSelectTipologia -------------  passata da figlio : ' + tipologia);
  this.tipologia = tipologia;
}



async onSelectProdotto(prod: Prodotto) {
 // console.log('onSelectProd --- recuperato da figlio ' + JSON.stringify(prod) + ' tipo da selezione radiobutton: ' + this.tipoSelected);

 this.prodotto = new Prodotto();
 this.visibleProdottiAcquistati = false;
 this.visibleProdotti = false;
 this.visibleProdotto = true;
 this.prodotto.photo = prod.photo;

 let rc = await this.commandawrigaService.getCommandawrigabyidProd(this.commandaw.id, prod.id).subscribe(
  resp => {
      if(resp['rc'] === 'ok') {
        console.log('onSelectProd --- commandawriga ---- recuperata da figlio ' + JSON.stringify(resp['data']));
       this.commandawriga = resp['data'];
       }
     },
  error => {
      alert('sono in onSelectProdotto - error');
      this.isVisible = true;
      this.alertSuccess = false;
      console.log('onSelectProdotto - errore: ' + error);
      this.type = 'error';
      this.Message = error.message;
      this.alertSuccess = false;
      this.showNotification(this.type, this.Message);
  });
}

async onSelectOrdinato(commandawriga: Commandawriga) {
  alert('onSelectOrdinato --- recuperato da figlio ' + JSON.stringify(commandawriga));
  this.commandawriga = commandawriga;
  this.visibleProdotto = true;

  let rc = await this.prodottoService.getbyid(commandawriga.idProdotto).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          console.log('onSelectOrdinato --- commandawriga ---- recuperata da figlio ' + JSON.stringify(resp['data']));
          this.prodotto = resp['data'];
          // recuperare la foto
         }
       },
    error => {
        alert('sono in onSelectOrdinato - error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('onSelectOrdinato - errore: ' + error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });

 }


 onSelectDeleted(flagDelete: string) {

      alert('onSelectDeleted ------ ' + flagDelete);

      if(flagDelete === 'S') {
        this.visibleProdottiAcquistati = true;
        this.visibleProdotti = false;
        this.visibleProdotto = false;
        this.loadProdottiOrdinati(this.idCommanda);
      }

 }


// ricreo le commandawriga con qta > 0  per editare elenco
 async commandaSelect(id: number) {
  alert('commandaSelect --- recuperato da figlio ' + id);


  let rc = await this.commandawrigaService.getProdottiOrdinati(id).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          console.log('onSelectOrdinato --- commandawriga ---- recuperata da figlio ' + JSON.stringify(resp['data']));
          this.commandawrigheordinati = resp['data'];
          this.nRecOrd = resp['number'];
          let nump = 0;
          let valorep = 0;
          for(let riga of this.commandawrigheordinati) {
            if(riga.qta !== 0) {
              nump = nump + riga.qta;
              valorep = valorep + (riga.qta * riga.prezzo_day);
            }
          }
          this.commandaw.importoProdotti = valorep;
          this.commandaw.numProdotti = nump;
          this.commandaw.importodaPagare = this.commandaw.importoProdotti  +
                                           this.commandaw.importoCoperto -
                                           this.commandaw.buonoPasto;
          this.aggiornaCommandaw( this.commandaw);



          // totalizzo importo prodotti della commanda
     //     this.preparaCassa(this.commandawrigheordinati);    // da eliminare
         }
    },
    error => {
        alert('sono in commandaSelect - error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('commandaSelect - errore: ' + error);
        this.type = 'error';
        this.Message = error.message;
        this.showNotification(this.type, this.Message);
    });

 }



async annullaOrdineProdotto(commandawriga: Commandawriga) {

   commandawriga.disponibile_Day = commandawriga.disponibile_Day + commandawriga.qta;
   commandawriga.qta = 0;

   let rc = await this.commandawrigaService.updateCommandawriga(commandawriga).subscribe(
     resp => {
         if(resp['rc'] === 'ok') {
            this.commandaSelect(this.idCommanda);
          }
        },
     error => {
         alert('sono in annullaOrdineProdotto - error');
         this.isVisible = true;
         this.alertSuccess = false;
         console.log('annullaOrdineProdotto - errore: ' + error);
         this.type = 'error';
         this.Message = error.message;
         this.showNotification(this.type, this.Message);
     });

  }

backToGiornata() {
  this.routeGiornata = 'commanda/RegistraAnag/new/' + this.idGiornata;
  this.router.navigate([`${this.routeGiornata}`]);

}

simpleAlert() {

}

alertWithSuccess() {


}

async conferma() {
  console.log('conferma - appena entrato');
  if(this.commandawriga.qta === 0) {
    this.isVisible = true;
    this.alertSuccess = false;
    this.type = 'error';
    this.Message = 'inserire quantità corretta';
    this.showNotification(this.type, this.Message);
  } else {
    let rc = await this.commandawrigaService.updateCommandawriga(this.commandawriga).subscribe(
      resp => {
          if(resp['rc'] === 'ok') {
            this.aggiornaselectedDay(this.commandawriga.idProdotto);
            this.EnabledCassa = true;
           }
         },
      error => {
          alert('sono in conferma - error');
          this.isVisible = true;
          this.alertSuccess = false;
          console.log('onSelectProdotto - errore: ' + error);
          this.type = 'error';
          this.Message = error.message;
          this.alertSuccess = false;
          this.showNotification(this.type, this.Message);
      });
   }

}

async aggiornaselectedDay(id: number) {

  let rc = await this.prodottoService.getbyid(id).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          this.prodotto = resp['data'];
          this.prodotto.selectedDay = 'S';
          console.log('aggiornaselectedday: ------- ' + JSON.stringify(this.prodotto));
          this.aggiornaprodotto(this.prodotto);
         }
       },
    error => {
        alert('sono in aggiornaselectedDay - error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('aggiornaselectedDay - errore: ' + error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });
 }

 async aggiornaprodotto(prodotto: Prodotto) {

  let rc = await this.prodottoService.update(prodotto).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          // rifaccio la lettura dei prodotti della stessa tipologia
          this.loadProdottibyTipologia(this.tipologia);

          this.visibleProdottiAcquistati = false;
          this.visibleProdotti = true;
          this.visibleProdotto = false;


          this.isVisible = true;
          this.alertSuccess = true;
          this.type = 'success';
          this.Message = 'prodotto acquisito in commanda';
          this.showNotification(this.type, this.Message);
         }
       },
    error => {
        alert('sono in aggiornaprodotto - error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('aggiornaprodotto - errore: ' + error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });
 }


resetProdotto() {
  this.onSelectionChange(this.tipoSelected);
}


async loadPersonaleSanfra()  {
  alert('loadPersonaleSanfra ----   da fare')
}



// async loadPersonaleSanfra() {
//       console.log(`loadPersonaleSanfra - appena entrato`);
//       let rc = await this.personaService.getPersonabyutilizzoCommanda().subscribe(
//        resp => {
//           if(resp['rc'] === 'ok') {
//            this.persone = resp['data'];
//            console.log('trovato persone: ' + JSON.stringify(this.persone));
//           }
//           if(resp['rc'] === 'nf') {
//            this.persone = this.personenull;
//           }
//       },
//       error => {
//           alert('loadPersonaleSanfra - error');
//           this.isVisible = true;
//           this.alertSuccess = false;
//           console.log('loadPersonaleSanfra - errore: ' + error);
//           this.type = 'error';
//           this.Message = error.message;
//           this.alertSuccess = false;
//           this.showNotification(this.type, this.Message);
//       });
// }





elenco() {
alert(' da fare');
}

registraIncasso() {

  alert('preparare  cassaws  per gestione cassa dettagliata')
  this.routeGiornata = 'commanda/RegistraCassa/' + this.idCommanda;
  this.router.navigate([`${this.routeGiornata}`]);

}


// async registraIncasso() {
//     console.log('registraIncasso - appena entrata');

//     let rc = await this.cassawcService.deletebyidCommanda(this.idCommanda).subscribe(
//       resp => {
//             console.log('fatto cancellazione cassawc ' + this.idCommanda + ' rc: ' + resp['rc']);
//             if(resp['rc'] === 'ok') {
//                     this.createCassawc(this.idCommanda);
//                   }
//             if(resp['rc'] === 'nf') {
//                     this.createCassawc(this.idCommanda);
//                   }
//             this.preparaCassa();
//            },
//       error => {
//            alert('sono in nuovaCommanda - error');
//            this.isVisible = true;
//            this.alertSuccess = false;
//            console.log('nuovaCommanda - errore: ' + error);
//            this.type = 'error';
//            this.Message = error.message;
//            this.alertSuccess = false;
//            this.showNotification(this.type, this.Message);
//          });
//     }

// async createCassawc(id: number) {
//   console.log('createCassawc - appenza entrato ----   Commanda ' + id);

//   let rc = await this.ttagliaService.getAll().subscribe(
//     resp => {

//           if(resp['rc'] === 'ok') {
//              console.log(`createCassawc: ----------------------->  ${JSON.stringify(resp['data'])} `);
//              this.taglie = resp['data'];
//              this.prg = id * 100;
//              for(let tagl of this.taglie) {
//                 if(tagl.id > 0) {
//                   this.cassawc = new Cassawc();
//                   console.log(`creanewCassawCommanda: ------fatto istanza -------->  ${JSON.stringify(this.cassawc)} `);
//                   this.prg = this.prg + 1;
//                   this.cassawc.id = this.prg;
//                   this.cassawc.idCommanda = id;
//                   this.cassawc.idTaglia = tagl.id;

//                   console.log(`creanewCassawcCommanda: ------- pronto per inserire ---------------->  ${JSON.stringify(this.cassawc)} `);

//                   this.registranewCassawc(this.cassawc);
//                 }
//              }
//            }
//        },
//     error => {
//          alert('sono in createCassawc');
//          this.isVisible = true;
//          this.alertSuccess = false;
//          console.log('createCassawc - errore: ' + error);
//          this.type = 'error';
//          this.Message = error.message;
//          this.alertSuccess = false;
//          this.showNotification(this.type, this.Message);
//        });

// }

// async registranewCassawc(cassawc: Cassawc) {


//   console.log(`registranewCassawc appena entrato: ----------------------->  ${JSON.stringify(cassawc)} `);
//   let rc = await this.cassawcService.createCassa(cassawc).subscribe(
//     resp => {
//           if(resp['rc'] !== 'ok') {
//             this.isVisible = true;
//             this.alertSuccess = false;
//             console.log('registranewCassawc - errore:creazione nuova taglia ');
//             this.type = 'error';
//             this.Message = 'errore in creazione nuove taglie';
//             this.alertSuccess = false;
//             this.showNotification(this.type, this.Message);
//             return;
//            }
//        },
//     error => {
//          this.isVisible = true;
//          this.alertSuccess = false;
//          console.log('registranewCassawc - errore: ' + error);
//          this.type = 'error';
//          this.Message = error.message;
//          this.alertSuccess = false;
//          this.showNotification(this.type, this.Message);
//        });

// }





async aggiornaCommandaw(commandaw: Commandaw) {

  let rc =  await this.commandawService.update(commandaw).subscribe(
            response => {
                if(response['rc'] === 'ok') {
                  this.isVisible = true;
                  this.alertSuccess = true;
                  this.type = 'success';
                  this.Message = 'Prodotto inserito correttamente in ordine';
              //    this.showNotification(this.type, this.Message);
                  // this.routenavigate = '/commanda/RegistraCassa/new/' + this.commandaw.id;
                  // this.router.navigate([`${this.routenavigate}`]);
                }
             },
            error =>
            {
              console.log(error);
              this.Message = error.message;
              this.alertSuccess = false;
            });
}

/*
    metodi non più usati

async preparaCassa(commandawrighe: any) {

   // leggo tutte le righe commanda e  ricalcolo gli importi
   let nump = 0;
   let valorep = 0;

  //  for(let riga of this.commandawrighe) {
    for(let riga of commandawrighe) {
     if(riga.qta !== 0) {
       nump = nump + riga.qta;
       valorep = valorep + riga.qta * riga.prezzo_day;
     }
   }
   this.commandaw.importoProdotti = valorep;
   this.commandaw.numProdotti = nump;
   this.commandaw.importodaPagare = this.commandaw.importoProdotti  +
                                    this.commandaw.importoCoperto -
                                    this.commandaw.buonoPasto;

   let rc =  await this.commandawService.update(this.commandaw).subscribe(
             response => {
                 if(response['rc'] === 'ok') {
                   this.isVisible = true;
                   this.alertSuccess = true;
                   this.type = 'success';
                   this.Message = 'Aggiunto prodotto';
    //               this.showNotification(this.type, this.Message);
    //               this.routenavigate = '/commanda/RegistraCassa/new/' + this.commandaw.id;
    //               this.router.navigate([`${this.routenavigate}`]);
                 }
              },
             error =>
             {
               console.log(error);
               this.Message = error.message;
               this.alertSuccess = false;
             });
}


*/

}
