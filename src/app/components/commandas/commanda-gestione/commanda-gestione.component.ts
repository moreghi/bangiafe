import { Component, OnInit } from '@angular/core';
// model Class
import { Commanda } from '../../../classes/Commanda';
import { Commandariga } from '../../../classes/Commandariga';
import { Giornata } from '../../../classes/Giornata';
import { ActivatedRoute, Router } from '@angular/router';
import { Prodotto } from '../../../classes/Prodotto';
import { Msgpopup } from '../../../classes/Msgpopup';
import { Graphprod } from '../../../classes/Graphprod';

// Services
import { CommandaService } from './../../../services/commanda.service';
import { CommandarigaService} from './../../../services/commandariga.service';
import { GiornataService} from './../../../services/giornata.service';
import { ProdottoService} from './../../../services/prodotto.service';
import { GraphprodService} from './../../../services/graphprod.service';
import { GrapfService } from './../../../services/grapf.service';
// other
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faUndo, faSave, faHandPointLeft, faTrashAlt, faInfoCircle, faThumbsUp, faThumbsDown, faSearch, faGripLines,
          faPlusSquare, faTrash, faUserEdit, faWindowClose, faMinus, faPlus, faReply, faAlignLeft, faChartLine, faFire, faTruck } from '@fortawesome/free-solid-svg-icons';
import {formatDate} from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';   // per gestire il format delle date
// utilizzo popup per conferma ripristino
// seconda soluzione con popup component
import { InfoComponent } from './../../../components/popups/info/info.component';

@Component({
  selector: 'app-commanda-gestione',
  templateUrl: './commanda-gestione.component.html',
  styleUrls: ['./commanda-gestione.component.css']
})
export class CommandaGestioneComponent implements OnInit {

  public title = 'Gestione Evasione  Commanda  -  Commanda-registrazione-anagrafica';

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
    faAlignLeft = faAlignLeft;
    faChartLine = faChartLine;
    faFire = faFire;
    faTruck = faTruck;
    faGripLines = faGripLines;

    // variabili per editazione messaggio
    public alertSuccess = false;
    public savechange = false;
    public isVisible = false;

    public nRecMan = 0;
    public nRec = 0;
    public nRecPr = 0;
    public trovatoRec = false;
    public Message = '';
    public isSelected = false;

    public saveValueStd: boolean;
    public lastNumber = 0;
    public fase = '';
    public faseLavorativa = '';


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

    public functionValid = false;

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

  public testDate = '';
  public testDateD: Date;
  public lavorazione = '';
    // ---------------------  personalizzazioni componente

    public routenavigate = '';

    options = [
      'Prodotti',
      'Commande',
     ];

    optionsMenu = [
      'Primi',
      'Secondi',
      'Contorni',
      'Dolci',
      'Bevande',
     ];

     optionsMenuCucina = [
      'Primi',
      'Secondi',
      'Contorni',
      'Dolci',
     ];

     optionsMenuBevande = [
      'Bevande',
     ];


     optionsBev = [
      'Tutti',
      'da Consegnare',
      'Consegnati',
      ];

    optionsProd = [
      'Tutti',
      'da Lavorare',
      'da Consegnare',
      'Consegnati',
      ];

    optionsComm = [
      'Tutte',
      'da Evadere',
      'Parzialmente Evase',
      'Evase',
      ];

      optionsOrd = [
        'Commanda',
        'Prodotto',
         ];

      optionsOrdComm = [
          'Commanda',
          'Cliente',
        ];

   public textMessage1 = '';
   public textMessage2 = '';
   public textUser = '';
   public headerPopup = '';
   public effettuataCancellazioneOld = false;

   public commanda: Commanda;
   public commande: Commanda[] = [];
   public commandenull: Commanda[] = [];
   public commandariga: Commandariga;
   public giornata: Giornata;
   public commandarighe: Commandariga[] = [];
   public commandarighenull: Commandariga[] = [];
   public commandarighedetailCommanda: Commandariga[] = [];
   public prodottinull: Prodotto[] = [];
   public prodotti: Prodotto[] = [];
   public prodottibysel: Prodotto[] = [];

   public msgpopup: Msgpopup;
   public graphprod: Graphprod;
   public graphprods: Graphprod[] = [];
   public graphprodsnull: Graphprod[] = [];

   public tipoRichiesta = '?';
   public ricManif = 0;
   public validSearch = false;
   private textMessage = '';
   public nDay = 0;
   public statoRic = 0;
   public registrata = false;

   public nRecCo = 0;
   public nRecBe = 0;
   public nRecCu = 0;
   public nRecMe = 0;
   public tipologia = 0;
   public stato = 0;
   public idLevel = 0;
   public enabledCucina = false;
   public enabledBevande = false;
   public competenza = 0;
   public flagLavorazione = 0;
   public flagConsegna = 0;

   public  interval = 'minutes';
   public  mm = 0;
   public date1 = null;
   public date2 = null;

   public searchText = '';
   // per paginazone
   p_prod: number = 1;
   p_righe: number = 1;
   p_graph: number = 1;
   p_comm: number = 1;


   p_prodComm: number = 1;
   p2c: number = 1;
   p3c: number = 1;


   public idlogged = 0;
   public visibleCommande = false;
   public visibleProdottiCommanda = false;
   public visibleProdotti = false;
   public visibleProdotto = false;
   public visibleProdottoCucina = false;
   public visibleProdottoBevande = false;
   public selectSelettiva = false;
   public selectedProd = 0;
   public SelectedCommanda = 0;
   public selectFinal = false;
   public righeCommande = false;
   public nessunaCommanda = false;
   public visibleFull = false;
   public enabledGrafici = false;
   public commandatoedit = false;

   // flag da rivedere
   public selezionatoxx = false;

   public trovatoRecRighe = false;
   public enabledRighe = false;
   public tipolavorazione = '';
   public today: Date;

   public orderby = '';

   public c1 = '';
   public c2 = '';
   public test = 0;
   public testok = 0;
   public ambiente = 0;  // 2=ambiente Cucina  -- 3=AmbienteBevande
   public strSql = '';
   public dettaglioCommanda = false;
   public clienteCommanda = '';
   public prodottoSelected = 0;
   public viewfromCommanda = false;

   constructor(public modalService: NgbModal,
               private commandaService: CommandaService,
               private commandarigaService: CommandarigaService,
               private giornataService: GiornataService,
               private prodottoService: ProdottoService,
               private graphprodService: GraphprodService,
               private grapfService: GrapfService,
               private route: ActivatedRoute,
               private router: Router,
               private datePipe: DatePipe,
               private notifier: NotifierService) {
                       this.notifier = notifier;
                       this.today = new Date();
            console.log('today inizializzato nel costruttore: ' + this.today.toISOString());
                   }


                   ngOnInit(): void {

                    console.log('Commanda-registrazione-Cassa - sono in oninit ');

                    this.goApplication();

                  }

                  goApplication() {

                    this.isVisible = true;
                    this.alertSuccess = true;

                    this.c1 = this.route.snapshot.url[0].path;
                    this.c2 = this.route.snapshot.url[1].path;

                   // this.idGiornata = +localStorage.getItem('idGiornata');
                    this.idlogged = +localStorage.getItem('id');
                    this.idLevel = +localStorage.getItem('user_ruolo');
                    this.route.paramMap.subscribe(p => {
                      this.idGiornata = +p.get('idGiornata');
                      console.log('idGiornata recuperato: ' + this.idGiornata);
                      // -------  leggo i dati della giornata

                      this.loadGiornata(this.idGiornata);

                     });







                    console.log('gestioneCommande - idGiornata ' + localStorage.getItem('idGiornata'))
                    console.log('gestioneCommande - idlogged ' + localStorage.getItem('id'))
                    console.log('gestioneCommande - idLevel ' + localStorage.getItem('user_ruolo'))

                    this.visibleCommande = false;
                    this.visibleProdotti = false;

alert('commandaGestione -- idGiornata: ' + this.idGiornata)




                    if(this.c1 === 'commanda' && this.c2 === 'gestioneBevande' || this.c2 === 'gestioneCucina' ) {

                      this.functionValid = true;
                      if(this.idLevel !== -1 && this.idLevel !== 2 && this.idLevel !== 3 ) {
                          this.Message = 'profilo non abilitato alla gestione Commande ';
                          this.alertSuccess = false;
                          this.type = 'error';
                          this.showNotification(this.type, this.Message);
                          return;
                      }
                      this.enabledCucina = false;
                      this.enabledBevande = false;
                      if(this.idLevel === -1 && this.c2 === 'gestioneCucina' || this.idLevel === 2) {
                        this.enabledCucina = true;
                        this.ambiente = 2;
                        this.competenza = 1;
                        this.title = 'Gestione Evasione Commanda  -  Settore Cucina'
                      }
                      if(this.idLevel === -1 && this.c2 === 'gestioneBevande' || this.idLevel === 3 ) {
                        this.enabledBevande = true;
                        this.ambiente = 3;
                        this.competenza = 2;
                        this.title = 'Gestione Evasione Commanda  -  Settore Bevande'
                       }

                    }

  console.log('dopo filtri per individuare filone');

  console.log('enabledCucina: ' + this.enabledCucina);
  console.log('enabledBevande: ' + this.enabledBevande);
  console.log('title: ' + this.title);

                    if(this.functionValid !== true) {
                      this.Message = 'funzione non ammessa - avvisare amministratore';
                      this.alertSuccess = false;
                      this.type = 'error';
                      this.showNotification(this.type, this.Message);
                      return;
                    }

                  this.fase = 'M';
                  this.Message = `effettuare le scelte per gestire i prodotti o/e commande`;

                  //  fine parte personalizzabile
                  this.type = 'success';
                  this.showNotification(this.type, this.Message);

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


              async loadGiornata(id: number) {
                let res = await this.giornataService.getbyId(id).subscribe(
                response => {
                  console.log('----------------->     loadGiornata - fatto lettura --- ' + JSON.stringify(response['data']));
                    this.giornata = response['data'];
                    this.giornata.key_utenti_operation = +localStorage.getItem('id');
                },
                error => {
                    alert('giornata-detail-prodotti  --loadGiornata: ' + error.message);
                    console.log(error);
                    this.isVisible = true;
                    this.alertSuccess = false;
                    this.type = 'error';
                    this.Message = 'Errore loadGiornata' + '\n' + error.message;
                    this.showNotification(this.type, this.Message);
                });

          }

              onSelectionChange(tipo: string) {
                // parametri per prodotti
                this.selectSelettiva = false;    // flag usato in selezione Commande
                this.viewfromCommanda = false  // dettaglio prodotti da elenco commande
                this.selectFinal = false;
                this.visibleProdotti = false;
                this.visibleCommande = false;
                this.selectSelettiva = false;
                this.visibleProdotto = false;
                this.enabledGrafici === false;
                this.visibleProdottoCucina = false;
                this.visibleProdottoBevande = false;
                this.enabledRighe = false;
                this.enabledGrafici = false;
                // parametri per commande
                this.righeCommande = false;
                switch (tipo) {
                  case 'Prodotti':
                      this.visibleProdotti = true;
                      this.prodottoSelected = 999;  // per differenziare da Prodotto selezionato da combo
                      break;
                  case 'Commande':
                      this.visibleCommande = true;
                      this.commandatoedit = false;

                      break;
                  default:
                  alert('Scelta errata' + '\n' + 'ricerca non possibile');
                  break;
                 }
                 // faccio la ricigenerazione dei totali per gestire i grafici
                this.statistica();
              }


              onSelectionChangeMenu(tipo: string)   {
                 console.log('------------------------------------------     onSelectionChangeMenu + tipo: ' + tipo);
                 this.selectFinal = false;
                 this.stato = 99;  // per inibire di vedere le testate elenco prima di selezionare
                 this.visibleProdotto = true;
                 this.enabledRighe = false;
                 this.resetoptionfinalProd();
                 this.resetOrder();
                 switch (tipo) {
                          case 'Primi':
                              this.tipologia = 1;
                              this.selectedProd = 0;
                              this.visibleProdottoCucina = true;
                              break;
                          case 'Secondi':
                             this.tipologia = 2;
                             this.selectedProd = 0;
                             this.visibleProdottoCucina = true;
                             break;
                          case 'Contorni':
                              this.tipologia = 3;
                              this.selectedProd = 0;
                              this.visibleProdottoCucina = true;
                              break;
                          case 'Dolci':
                              this.tipologia = 5;
                              this.selectedProd = 0;
                              this.visibleProdottoCucina = true;
                              break;
                          case 'Bevande':
                              this.tipologia = 4;
                              this.selectedProd = 0;
                              this.visibleProdottoBevande = true;
                              break;
                          default:
                          alert('Scelta errata' + '\n' + 'ricerca non possibile');
                          break;
                 }


                // this.loadProdottibyTipologia(this.tipologia);
                this.orderby = '*';    // imposto ordinamento per commanda
                this.getAllCommande(this.orderby);
            }


            selectedProdotto(selectedValue: number) {
              //  alert('selezionato: ' + selectedValue);
                this.stato = 9;
                this.nRec = 0;
                this.dettaglioCommanda = false;
                this.resetoptionfinalProd();    // effettuo pima il reset delle precedenti soluzioni finali
                this.selectFinal = false;
                if(selectedValue ===  999) {
                  this.type = 'error';
                  this.Message = 'selezione non corrette';
                  this.showNotification(this.type, this.Message);
                  this.alertSuccess = false;
                  this.isVisible = true;
                  return;
               } else {
                this.selectedProd = selectedValue;
                console.log('tipologia selezionata: ' + this.selectedProd + ' fare lettura delle righe commanda con il prodotto selezionato');
                this.prodottoSelected = selectedValue;
                this.tipo = 'Tutti';
                this.onSelectionChangeProd(this.tipo, this.prodottoSelected)

                // this.loadProdottibyTipologia(this.selectedProd);
               }

           }


async loadProdottibyTipologia(id: number) {

  let rc = await this.prodottoService.getProdottiforTipologia1(id).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          this.prodotti = resp['data'];
          this.trovatoRec = true;
          this.nRecPr = resp['number'];
          this.enabledRighe = true;
        }
        if(resp['rc'] === 'nf') {
          this.prodotti = this.prodottinull;
          this.trovatoRec = false;
          this.nRecPr = 0;
          this.enabledRighe = false;
        }
      },
    error => {
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });
}

onSelectionChangeProd(tipo: string, prod: number)   {
           alert(' onSelectionChangeProd - tipo:' + tipo + ' prod: ' + prod);
            this.selectSelettiva = false;
            this.visibleProdottoCucina = false;
            this.visibleProdottoBevande = false;
            this.visibleFull = false;
            this.orderby = '*';    // imposto ordinamento per commanda
            this.resetOrder();
            switch (tipo) {
                          case 'Tutti':
                              this.stato = 9;  // per inibire di vedere le testate elenco prima di selezionare
                              this.visibleProdottoCucina = true;
                              this.visibleFull = true;
                              this.selectedProd = 0;
                              this.lavorazione = '';
                              if(prod == 999 ) {
                                this.creaStrsql(this.ambiente, this.tipologia, this.stato)
                              } else {
                                this.creaStrsqlSelected(this.ambiente, this.tipologia, this.stato, prod)
                              }

                              break;
                          case 'da Lavorare':
                             this.stato = 0;
                             this.visibleProdottoCucina = true;
                             this.selectSelettiva = true;
                             this.lavorazione = 'Cucinare';
                             if(prod == 999 ) {
                              this.creaStrsql(this.ambiente, this.tipologia, this.stato)
                            } else {
                              this.creaStrsqlSelected(this.ambiente, this.tipologia, this.stato, prod)
                            }
                             break;
                          case 'da Consegnare':
                             this.stato = 1;
                             this.visibleProdottoCucina = true;
                             this.selectSelettiva = true;
                             this.lavorazione = 'Consegnare';
                             if(prod == 999 ) {
                              this.creaStrsql(this.ambiente, this.tipologia, this.stato)
                            } else {
                              this.creaStrsqlSelected(this.ambiente, this.tipologia, this.stato, prod)
                            }
                             break;
                          case 'Consegnati':
                              this.stato = 2;
                              this.visibleProdottoCucina = true;
                              this.selectSelettiva = true;
                              this.lavorazione = 'Consegnati';
                              if(prod == 999 ) {
                                this.creaStrsql(this.ambiente, this.tipologia, this.stato)
                              } else {
                                this.creaStrsqlSelected(this.ambiente, this.tipologia, this.stato, prod)
                              }
                              break;
                          default:
                          alert('Scelta errata' + '\n' + 'ricerca non possibile');
                          break;
                 }

             /*   non dovrebbero più servire
            if(this.selectSelettiva === true) {
              if(this.selectedProd === 0) {
                // non ho selezionato nesusn prodotto specifico  - faccio elenco tuttti i prodotti della tipologia
                  this.getProdottibytipologiaeStato(this.tipologia, this.stato, this.orderby);
              } else {
                  this.getProdottibyprodottoeStato(this.selectedProd, this.stato);
              }
                } else {
                  if(this.selectedProd === 0) {
                    // non ho selezionato nesusn prodotto specifico  - faccio elenco tuttti i prodotti della tipologia
                      this.getAllProdottibytipologia(this.tipologia, this.orderby);
                  } else {
                      this.getAllProdottibyprodotto(this.selectedProd);
                  }
             }  */

         }




         onSelectionChangeOrder(tipo: string) {
         //  alert('ordinamento per:  ' + tipo);
           switch (tipo) {
            case 'Commanda':
                this.orderby = '*';
                break;
            case 'Prodotto':
               this.orderby = 'P';
               break;
            default:
            alert('Scelta errata' + '\n' + 'ordinamento non possibile');
            break;
           }
           if(this.selectSelettiva === true) {
                if(this.selectedProd === 0) {
                  // non ho selezionato nesusn prodotto specifico  - faccio elenco tuttti i prodotti della tipologia
                    this.getProdottibytipologiaeStato(this.tipologia, this.stato, this.orderby);
                } else {
                    this.getProdottibyprodottoeStato(this.selectedProd, this.stato);
                }
           } else {
                if(this.selectedProd === 0) {
                  // non ho selezionato nesusn prodotto specifico  - faccio elenco tuttti i prodotti della tipologia
                    this.getAllProdottibytipologia(this.tipologia, this.orderby);
                } else {
                    this.getAllProdottibyprodotto(this.selectedProd);
                }
           }
       }

       onSelectionChangeOrderCommanda(tipo: string) {
        //  alert('ordinamento per:  ' + tipo);
          switch (tipo) {
           case 'Commanda':
               this.orderby = '*';
               break;
           case 'Cliente':
              this.orderby = 'A';
              break;
           default:
           alert('Scelta errata' + '\n' + 'ordinamento non possibile');
           break;
          }

          if(this.selectSelettiva === true) {
            this.getAllCommandebyStato(this.stato, this.orderby);
            } else {
            this.getAllCommande(this.orderby);
        }
      }

         resetoptionfinalProd() {
          var ele = document.getElementsByName('radiogroup2');
          for(var i=0;i<ele.length;i++) {
            var element = ele[i] as HTMLInputElement;
            element.checked = false;
           }
         }

         resetoptionfinalCommanda() {
          var ele = document.getElementsByName('radiogroup4');
          for(var i=0;i<ele.length;i++) {
            var element = ele[i] as HTMLInputElement;
            element.checked = false;
           }
         }




         resetOrder() {
          var ele = document.getElementsByName('radiogroup21');
          for(var i=0;i<ele.length;i++) {
            var element = ele[i] as HTMLInputElement;
            element.checked = false;
           }
         }



         onSelectionChangeBev(tipo: string) {
        //  alert(' bevanda selezionato: ' + tipo);

          this.selectSelettiva = false;
          // non servono
          this.visibleProdottoCucina = false;
          this.visibleProdottoBevande = false;
          this.orderby = '*';    // imposto ordinamento per commanda
          switch (tipo) {
                        case 'Tutti':
                            this.visibleProdottoCucina = true;
                            break;
                        case 'da Consegnare':
                           this.stato = 1;
                           this.visibleProdottoCucina = true;
                           this.selectSelettiva = true;
                           break;
                        case 'Consegnati':
                            this.stato = 2;
                            this.visibleProdottoCucina = true;
                            this.selectSelettiva = true;
                            break;
                        default:
                        alert('Scelta errata' + '\n' + 'ricerca non possibile');
                        break;
               }
          if(this.selectSelettiva === true) {
                if(this.selectedProd === 0) {
                  // non ho selezionato nesusn prodotto specifico  - faccio elenco tuttti i prodotti della tipologia
                    this.getProdottibytipologiaeStato(this.tipologia, this.stato, this.orderby);
                } else {
                    this.getProdottibyprodottoeStato(this.selectedProd, this.stato);
                }
                  } else {
                    alert ('sono tu scelta tytti per ordinamento');
                    if(this.selectedProd === 0) {
                      // non ho selezionato nesusn prodotto specifico  - faccio elenco tuttti i prodotti della tipologia
                        this.getAllProdottibytipologia(this.tipologia, this.orderby);

                    } else {
                        this.getAllProdottibyprodotto(this.selectedProd);
                    }
               }
           }

/*

creo la strsql per estrarre i prodotti da commandarigaa

*/

creaStrsql(ambiente: number, tipologia: number, stato: number) {
  this.strSql = 'SELECT `commandarigas`.*, `commandas`.`anagrafica_cliente` as cliente FROM `commandarigas` inner join `commandas` on `commandas`.`id` = `commandarigas`.`idCommanda` ' +
                ' where `commandas`.`idGiornata` = ' +  this.idGiornata + ' and `commandarigas`.`tipologia` = ' + tipologia;
  if(stato !== 9)  {
    this.strSql = this.strSql  + ' and `commandarigas`.`stato` = ' + stato;
  }
  this.loadProdottibyStrsql(this.strSql);

}

creaStrsqlSelected(ambiente: number, tipologia: number, stato: number, prod: number) {
  this.strSql = 'SELECT `commandarigas`.*, `commandas`.`anagrafica_cliente` as cliente FROM `commandarigas` inner join `commandas` on `commandas`.`id` = `commandarigas`.`idCommanda` ' +
                ' where `commandas`.`idGiornata` = ' +  this.idGiornata + ' and `commandarigas`.`tipologia` = ' + tipologia + ' and `commandarigas`.`idProdotto` = ' + prod;
  if(stato !== 9)  {
    this.strSql = this.strSql  + ' and `commandarigas`.`stato` = ' + stato;
  }
  this.loadProdottibyStrsql(this.strSql);

}


/*

creo la strsql per estrarre le Commande

*/

creaStrsqlCommande(stato: number) {


  this.strSql = 'select `commandas`.*, `t_stato_commandas`.`d_stato_commanda` from `commandas` ' +
                ' inner join `t_stato_bevandes` ON `t_stato_bevandes`.`id` = `commandas`.`statoBevande` ' +
                ' inner join `t_stato_commandas` ON `t_stato_commandas`.`id` = `commandas`.`stato` ' +
                ' inner join `t_stato_contabiles` ON `t_stato_contabiles`.`id` = `commandas`.`statoContabile` ' +
                ' inner join `t_stato_cucinas` ON `t_stato_cucinas`.`id` = `commandas`.`statoCucina` ' +
                ' inner join `manifestaziones` ON `manifestaziones`.`id` = `commandas`.`idSanfra` '  +
                ' inner join `giornatas` ON `giornatas`.`id` = `commandas`.`idGiornata` ' +
                ' where `commandas`.`idGiornata` = ' +  this.idGiornata;

    if(stato !== 9)  {
    this.strSql = this.strSql  + ' and `commandas`.`stato` = ' + stato;
  }

alert('creaStrsqlCommande: ' + this.strSql)


  this.loadCommandebyStrsql(this.strSql);

}












/*
  effettuo la lettura dei prodotti delle righe commanda in base a criteri impostati
  nella form passando la stringa strsql

*/

           async loadProdottibyStrsql(strsql: string) {

            let rc = await this.commandarigaService.getprodottibyStrsql(strsql).subscribe(
              resp => {
                  if(resp['rc'] === 'ok') {
                    this.commandarighe = resp['data'];
                    console.log('loadProdottibyStrsql -- commandarighe: ' +  JSON.stringify(this.commandarighe))
                    this.nRec = resp['number'];
                  }
                  if(resp['rc'] === 'nf') {
                    this.nRec = 0;
                  }
                },
              error => {
                  this.isVisible = true;
                  this.alertSuccess = false;
                  this.type = 'error';
                  this.Message = error.message;
                  this.alertSuccess = false;
                  this.showNotification(this.type, this.Message);
              });
          }

/*
  effettuo la lettura dei prodotti delle righe commanda in base a criteri impostati
  nella form passando la stringa strsql

*/

async loadCommandebyStrsql(strsql: string) {

  let rc = await this.commandaService.getcommandebyStrsql(strsql).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          this.commande = resp['data'];
          console.log('loadCommandebyStrsql -- commande: ' +  JSON.stringify(this.commande))
          this.nRecCo = resp['number'];
        }
        if(resp['rc'] === 'nf') {
          this.nRecCo = 0;
        }
      },
    error => {
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });
}






         onSelectionChangeComm(tipo: string) {
         //  alert('da fare');
           this.selectSelettiva = false;
           this.orderby = '*';    // imposto ordinamento per commanda
           this.trovatoRecRighe = false;
           switch (tipo) {
                         case 'Tutte':
                            this.selectSelettiva = true;
                            this.stato = 9;
                            break;
                         case 'da Evadere':
                            this.stato = 2;
                            this.selectSelettiva = true;
                            break;
                         case 'Parzialmente Evase':
                             this.stato = 3;
                             this.selectSelettiva = true;
                             break;
                         case 'Evase':
                             this.stato = 4;
                             this.selectSelettiva = true;
                             break;
                         default:
                         alert('Scelta errata' + '\n' + 'ricerca non possibile');
                         break;
                }

                this.creaStrsqlCommande(this.stato);


// non servono più

          //  if(this.selectSelettiva === true) {
          //        this.getAllCommandebyStato(this.stato, this.orderby);
          //        } else {
          //        this.getAllCommande(this.orderby);
          //    }
         }


   async   getAllCommandebyStato(stato: number, order: string) {

    console.log(`getAllCommandebyStato - appena entrato --  stato ${stato} ----- order: ${order}` );

    if(this.enabledCucina === true) {
      this.competenza = 1;
     }
    if(this.enabledBevande === true) {
      this.competenza = 2;
     }

    console.log('getAllCommandebyStato - parametri  -- Giornata ' + this.idGiornata + ' stato:  ' + stato + ' competenza: ' + this.competenza);
    let rc = await this.commandaService.getCommandeforGiornataeCompetenzaestato(this.idGiornata, this.competenza, stato, order).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          console.log('getAllCommandebyStato .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
          this.commande = resp['data'];
          this.righeCommande = true;
          this.trovatoRecRighe = true;
          this.nRecCo = resp['number'];
          this.enabledRighe = true;
          this.visibleProdottiCommanda = false;
          this.nessunaCommanda = false;
        }
        if(resp['rc'] === 'nf') {
          this.commandarighe = this.commandarighenull;
          this.trovatoRec = false;
          this.righeCommande = false;
          this.trovatoRecRighe = true;
          this.visibleCommande = true;
          this.nessunaCommanda = true;
          this.nRecCo = 0;
          this.enabledRighe = false;
          this.visibleProdottiCommanda = false;
        }
      },
    error => {
        alert('sono in getAllCommandebyStato - error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('getAllCommandebyStato - errore: ' + error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });

  }


 async  getAllCommande(order: string) {

    console.log(`getAllCommande - appena entrato --  ---- order: ${order}` );

    if(order === '') {
      order = '*';
     }


  //  let rc = await this.commandaService.getCommandebyGiornata(this.idGiornata, order).subscribe(
    let rc = await this.commandaService.getCommandebyGiornata(this.idGiornata, order).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
          console.log('getAllCommande .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
          this.commande = resp['data'];
          this.righeCommande = true;
          this.trovatoRecRighe = true;
          this.nRecCo = resp['number'];
          this.enabledRighe = true;
          this.visibleProdottiCommanda = false;
          this.nessunaCommanda = false;
        }
        if(resp['rc'] === 'nf') {
          this.commandarighe = this.commandarighenull;
          this.trovatoRecRighe = true;
          this.righeCommande = false;
          this.visibleCommande = true;
          this.nessunaCommanda = true;
          this.nRecCo = 0;
          this.enabledRighe = false;
          this.visibleProdottiCommanda = false;
        }
    },
    error => {
        alert('sono in getAllCommande- error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('getAllCommande - errore: ' + error);
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });
 }

   async  getProdottibytipologiaeStato(tipologia: number, stato: number, order: string) {
        alert('------ -------------------->  fare lettura dei prodotto per tipologia e stato' + tipologia + ' e stato: ' + stato);
        console.log(`getProdottibytipologiaeStato - appena entrato - tipologia: ${tipologia} --  stato ${stato}` );
        let rc = await this.commandarigaService.getProdottibytipologiaeStato(tipologia, stato, order).subscribe(
        resp => {
            if(resp['rc'] === 'ok') {
              console.log('getProdottibytipologiaeStato .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
              this.commandarighe = resp['data'];
              this.trovatoRec = true;
              this.nRecPr = resp['number'];
              this.enabledRighe = true;
            }
            if(resp['rc'] === 'nf') {
              this.commandarighe = this.commandarighenull;
              this.trovatoRec = false;
              this.nRecPr = 0;
              this.enabledRighe = true;
            }
          },
        error => {
            alert('sono in getProdottibytipologiaeStato - error');
            this.isVisible = true;
            this.alertSuccess = false;
            console.log('getProdottibytipologiaeStato - errore: ' + error);
            this.type = 'error';
            this.Message = error.message;
            this.alertSuccess = false;
            this.showNotification(this.type, this.Message);
        });
      }


   async  getProdottibyprodottoeStato(id: number, stato: number) {
     //     alert('fare lettura del prodotto per prodotto ' + id + ' e stato: ' + stato);
          let rc = await this.commandarigaService.getProdottibyprodottoeStato(id, stato).subscribe(
            resp => {
                if(resp['rc'] === 'ok') {
                  console.log('getProdottibyprodottoeStato .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
                  this.commandarighe = resp['data'];
                  this.trovatoRec = true;
                  this.nRecPr = resp['number'];
                  this.enabledRighe = true;
                }
                if(resp['rc'] === 'nf') {
                  this.commandarighe = this.commandarighenull;
                  this.trovatoRec = false;
                  this.nRecPr = 0;
                  this.enabledRighe = true;
                }
              },
            error => {
                alert('sono in getProdottibyprodottoeStato - error');
                this.isVisible = true;
                this.alertSuccess = false;
                console.log('getProdottibyprodottoeStato - errore: ' + error);
                this.type = 'error';
                this.Message = error.message;
                this.alertSuccess = false;
                this.showNotification(this.type, this.Message);
            });

        }


    async    getAllProdottibytipologia(tipologia: number, order: string) {
         // alert('fare lettura di tutti i prodotti per tipologia ' + tipologia );

         console.log(`getAllProdottibytipologia - appena entrato - tipologia: ${tipologia}  e order: ${order}` );
         let rc = await this.commandarigaService.getAllProdottibytipologia(tipologia, order).subscribe(
         resp => {
             if(resp['rc'] === 'ok') {
               console.log('getAllProdottibytipologia .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
               this.commandarighe = resp['data'];
               this.trovatoRec = true;
               this.nRecPr = resp['number'];
               this.enabledRighe = true;
             }
             if(resp['rc'] === 'nf') {
               this.commandarighe = this.commandarighenull;
               this.trovatoRec = false;
               this.nRecPr = 0;
               this.enabledRighe = true;
             }
           },
         error => {
             alert('sono in getAllProdottibytipologia - error');
             this.isVisible = true;
             this.alertSuccess = false;
             console.log('getAllProdottibytipologia - errore: ' + error);
             this.type = 'error';
             this.Message = error.message;
             this.alertSuccess = false;
             this.showNotification(this.type, this.Message);
         });

        }


        getAllProdottibyprodotto(id: number) {
          alert('fare lettura di tutti i prodotti per prodotto ' + id );
        }


        cucinare(commandariga: Commandariga) {
          console.log(' devo cucinare il prodotto ' + commandariga.descrizione_prodotto + ' commandariga: ' + JSON.stringify(commandariga));
          commandariga.stato = 1;
          commandariga.flag_lavorazione = 1;

          commandariga.ora_lavorazione = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
         /*
          console.log(' ....moment ... new Date()...   data normalizzata con moment ' + this.testDate);

          this.testDateD = new Date(this.testDate);
          console.log(' ....moment ... testDateD...   data riportata a date ' + JSON.stringify(this.testDateD));

          commandariga.ora_lavorazione = this.testDateD;
          // new Date();
          console.log(' ..........   data prima di datePipe ' + commandariga.ora_lavorazione);













        //  this.datePipe.transform(commandariga.ora_lavorazione, 'yyyy/MM/dd hh:mm:ss');
        //  console.log(' -------------------  data dopo datePipe ' + commandariga.ora_lavorazione);


  console.log('data normale ' + commandariga.ora_lavorazione);

 // commandariga.ora_lavorazione = formatDate(Date.now(),'yyyy-MM-dd','en-US');   non va

  console.log('data dopo localstring ' + commandariga.ora_lavorazione);


*/

          this.date1 = commandariga.ora_inizio;
          this.date2 = new Date();
          this.mm = 60 - this.getDateDiff(this.date2, this.date1, this.interval);
          if(this.mm > 999) {
            this.mm = 999;
          }
          commandariga.delayLavorazione = this.mm;
          if(this.mm <= 10) {
            commandariga.semaphoreLavorazione = 'verde.jpg';
          } else if(this.mm > 10 && this.mm <= 15) {
            commandariga.semaphoreLavorazione = 'azzurro.jpg';
          } else if(this.mm > 15 && this.mm <= 20) {
            commandariga.semaphoreLavorazione = 'giallo.jpg';
          } else if(this.mm > 20 && this.mm <= 25) {
            commandariga.semaphoreLavorazione = 'arancio.jpg';
          }else {
            commandariga.semaphoreLavorazione = 'viola.jpg';
          }

          console.log('pronto per fare update ' + JSON.stringify(commandariga));
          this.aggiornacommandariga(commandariga);
          this.riaggiornaDatiSelezionati();
        }

        annulla(commandariga: Commandariga) {
          alert('annulla lavorazione fatta');
        }


        consegnare(commandariga: Commandariga) {
          alert(' devo consegnare il prodotto ' + commandariga.descrizione_prodotto);


          commandariga.stato = 2;
          commandariga.flag_consegna = 1;

          commandariga.ora_consegna = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          this.date1 = commandariga.ora_inizio;
          this.date2 = new Date();
          this.mm = 60 - this.getDateDiff(this.date2, this.date1, this.interval);
          if(this.mm > 999) {
            this.mm = 999;
          }
          commandariga.delayConsegna = this.mm;
          if(this.mm <= 10) {
            commandariga.semaphoreConsegna = 'verde.jpg';
          } else if(this.mm > 10 && this.mm <= 15) {
            commandariga.semaphoreConsegna = 'azzurro.jpg';
          } else if(this.mm > 15 && this.mm <= 20) {
            commandariga.semaphoreConsegna = 'giallo.jpg';
          } else if(this.mm > 20 && this.mm <= 25) {
            commandariga.semaphoreConsegna = 'arancio.jpg';
          }else {
            commandariga.semaphoreConsegna = 'viola.jpg';
          }

          console.log('pronto per fare update ' + JSON.stringify(commandariga));
          this.aggiornacommandariga(commandariga);
          this.riaggiornaDatiSelezionati();
        }


merda(commandariga: Commandariga) {
  alert('sono un merdaaaaaaaaaaaaaaaaaaaaaaaa ')

}



  async prodCommanda(commandariga: Commandariga, cliente: string) {

       console.log('prodCommanda --- ho fatto click -----  commanda: ' + commandariga.idCommanda)


//     alert('dettaglioCommanda 1   = ' + this.dettaglioCommanda)


      this.dettaglioCommanda = !this.dettaglioCommanda;
      if(this.dettaglioCommanda === false) {
        return;
      }
      alert('dettaglioCommanda =  2 ' + this.dettaglioCommanda + '   cliente: ' + cliente)

let rc = await this.commandarigaService.getProdbyCommanda(commandariga.idCommanda).subscribe(
  resp => {
      if(resp['rc'] === 'ok') {
    //    console.log('erroreconsegna .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
    this.clienteCommanda = cliente;
    this.commandarighedetailCommanda = resp['data'];
    //     this.msgpopup.txt03 = 'commanda: ' + commandariga.idCommanda + ' -- ' + this.commanda.anagrafica_cliente;
    //     const ref = this.modalService.open(InfoComponent, {size:'lg'});
    //     ref.componentInstance.selectedUser = this.msgpopup;

    //     ref.result.then(
    //       (yes) => {
    //         console.log('Click YES');
    //         // alert('risposta ok da popup');

    //  //  eseguo annullo operatività


    //       },
    //       (cancel) => {
    //         console.log('click Cancel');
    //         alert('annullamento abbandonato dall utente');
    //       })
      }
      if(resp['rc'] === 'nf') {
        this.commandarighedetailCommanda = null;
        this.nRecPr = 0;
        this.enabledRighe = true;
      }
    },
  error => {
      alert('sono in prodCommanda - error');
      this.isVisible = true;
      this.alertSuccess = false;
      console.log('prodCommanda - errore: ' + error);
      this.type = 'error';
      this.Message = error.message;
      this.alertSuccess = false;
      this.showNotification(this.type, this.Message);
  });




        }






   async erroreconsegna(commandariga: Commandariga) {
         // 2021/03/02  utilizzo della popup per gestire la registrazione/modifica Manifestazione
         // alert(' ripristino il prodotto erroneamente lavorato - stato: -----------   merda    ' + this.stato);

         this.msgpopup = new Msgpopup();
         this.msgpopup.header = 'lavorazione';
         this.msgpopup.id = commandariga.id;
         this.msgpopup.txt01 = 'intendi procedere all annullo della lavorazione ';
         this.msgpopup.txt02 = 'del prodotto: ' + commandariga.descrizione_prodotto;

         let rc = await this.commandaService.getbyid(commandariga.idCommanda).subscribe(
          resp => {
              if(resp['rc'] === 'ok') {
                console.log('erroreconsegna .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
                this.commanda = resp['data'];
                this.msgpopup.txt03 = 'commanda: ' + commandariga.idCommanda + ' -- ' + this.commanda.anagrafica_cliente;
                const ref = this.modalService.open(InfoComponent, {size:'lg'});
                ref.componentInstance.selectedUser = this.msgpopup;

                ref.result.then(
                  (yes) => {
                    console.log('Click YES');
                    // alert('risposta ok da popup');

             //  eseguo annullo operatività
                    this.stato = 0;
                    commandariga.stato = 0;
                    commandariga.flag_consegna = 0;
                    commandariga.ora_lavorazione = null;
                    this.aggiornacommandariga(commandariga);
                    this.stato = 1;
                    this.riaggiornaDatiSelezionati();

                  },
                  (cancel) => {
                    console.log('click Cancel');
                    alert('annullamento abbandonato dall utente');
                  })
              }
              if(resp['rc'] === 'nf') {
                this.commandarighe = this.commandarighenull;
                this.trovatoRec = false;
                this.nRecPr = 0;
                this.enabledRighe = true;
              }
            },
          error => {
              alert('sono in erroreconsegna - error');
              this.isVisible = true;
              this.alertSuccess = false;
              console.log('erroreconsegna - errore: ' + error);
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
              this.showNotification(this.type, this.Message);
          });


        }

  async  erroreconsegnato(commandariga: Commandariga) {
          // riporto a da consegnare  se effettuati per errore
        //  alert(' ripristino il prodotto erroneamente consegnato - stato: ' + this.stato);

        this.msgpopup = new Msgpopup();
        this.msgpopup.header = 'consegna';
        this.msgpopup.id = commandariga.id;
        this.msgpopup.txt01 = 'intendi procedere all annullo della Consegna ';
        this.msgpopup.txt02 = 'del prodotto: ' + commandariga.descrizione_prodotto;

        let rc = await this.commandaService.getbyid(commandariga.idCommanda).subscribe(
         resp => {
             if(resp['rc'] === 'ok') {
               console.log('erroreconsegnato .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
               this.commanda = resp['data'];
               this.msgpopup.txt03 = 'commanda: ' + commandariga.idCommanda + ' -- ' + this.commanda.anagrafica_cliente;
               const ref = this.modalService.open(InfoComponent, {size:'lg'});
               ref.componentInstance.selectedUser = this.msgpopup;

               ref.result.then(
                 (yes) => {
                   console.log('Click YES');
                   // alert('risposta ok da popup');

            //  eseguo annullo operatività
                   this.stato = 1;
                   commandariga.stato = 1;
                   commandariga.flag_consegna = 0;
                   commandariga.ora_consegna = null;
                   this.aggiornacommandariga(commandariga);
                   this.stato = 2;
                   this.riaggiornaDatiSelezionati();
                 },
                 (cancel) => {
                   console.log('click Cancel');
                   alert('annullamento abbandonato dall utente');
                 })
             }
             if(resp['rc'] === 'nf') {
               this.commandarighe = this.commandarighenull;
               this.trovatoRec = false;
               this.nRecPr = 0;
               this.enabledRighe = true;
             }
           },
         error => {
             alert('sono in erroreconsegna - error');
             this.isVisible = true;
             this.alertSuccess = false;
             console.log('erroreconsegna - errore: ' + error);
             this.type = 'error';
             this.Message = error.message;
             this.alertSuccess = false;
             this.showNotification(this.type, this.Message);
         });

      }

        openModalPopup(commandariga: Commandariga) {
          alert(' devo aprire il popup della commanda ' + commandariga.idCommanda);
        }


      riaggiornaDatiSelezionati() {

        if(this.selectSelettiva === true) {
          if(this.selectedProd === 0) {
            // non ho selezionato nesusn prodotto specifico  - faccio elenco tuttti i prodotti della tipologia
              this.getProdottibytipologiaeStato(this.tipologia, this.stato, this.orderby);
          } else {
              this.getProdottibyprodottoeStato(this.selectedProd, this.stato);
          }
            } else {
              if(this.selectedProd === 0) {
                // non ho selezionato nesusn prodotto specifico  - faccio elenco tuttti i prodotti della tipologia
                  this.getAllProdottibytipologia(this.tipologia, this.orderby);
              } else {
                  this.getAllProdottibyprodotto(this.selectedProd);
              }
         }
      }

 async    CommandaviewrigheCucina(id: number) {
        // visualizzo le righe dei prodotti della commanda    // merda

        console.log(`CommandaviewrighCucina - appena entrato ` );
        if(this.enabledCucina === true) {
          this.competenza = 1;
         }
        if(this.enabledBevande === true) {
          this.competenza = 2;
         }
        this.tipolavorazione = "Cucina";
        this.faseLavorativa = 'Cu';
        this.getrighebyCommaandaeCompetenza(id, this.competenza, this.faseLavorativa);

      }

      async    CommandaviewrigheConsegna(id: number) {
        console.log(`CommandaviewrighConsegna- appena entrato ` );
        if(this.enabledCucina === true) {
          this.competenza = 1;
         }
        if(this.enabledBevande === true) {
          this.competenza = 2;
         }
        this.tipolavorazione = "Consegna";
        this.faseLavorativa = 'Co';
        this.getrighebyCommaandaeCompetenza(id, this.competenza, this.faseLavorativa);

       }


       async    Commandaviewrighe(id: number) {
        console.log(`Commandaviewrigh- appena entrato ` );
        if(this.enabledCucina === true) {
          this.competenza = 1;
         }
        if(this.enabledBevande === true) {
          this.competenza = 2;
         }
        this.tipolavorazione = "Prodotti Commanda";
        this.getrighebyCommanda(id, this.competenza);

       }

       async getrighebyCommanda(id: number, comp: number) {

        let rc = await this.commandarigaService.getProdbyCommanda(id).subscribe(
          resp => {
              if(resp['rc'] === 'ok') {
                console.log('getrighebyCommanda .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
                this.commandarighe = resp['data'];
                this.nRecPr = resp['number'];
                this.visibleProdottiCommanda = true;
              }
              if(resp['rc'] === 'nf') {
                this.commandarighe = this.commandarighenull;
                this.nRecPr = 0;
                this.visibleProdottiCommanda = true;
              }
            },
          error => {
              alert('sono in getrighebyCommanda - error');
              this.isVisible = true;
              this.alertSuccess = false;
              console.log('getrighebyCommaandaeCompetenza - errore: ' + error);
              this.type = 'error';
              this.Message = error.message;
              this.showNotification(this.type, this.Message);
          });
      }


      async    Commandavisualizzarighe(commanda: Commanda) {
        console.log(`Commandavisualizzarighe- appena entrato ` );
        this.clienteCommanda = commanda.anagrafica_cliente;
        if(this.enabledCucina === true) {
          this.competenza = 1;
         }
        if(this.enabledBevande === true) {
          this.competenza = 2;
         }

        this.getrighefromCommanda(commanda.id, this.competenza);

       }

       async getrighefromCommanda(id: number, comp: number) {

        let rc = await this.commandarigaService.getProdbyCommanda(id).subscribe(
          resp => {
              if(resp['rc'] === 'ok') {
                console.log('getrighefromCommanda .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
                this.commandarighe = resp['data'];
                this.nRecPr = resp['number'];
                this.viewfromCommanda = true;
              }
              if(resp['rc'] === 'nf') {
                this.commandarighe = this.commandarighenull;
                this.nRecPr = 0;
                this.viewfromCommanda = true;
              }
            },
          error => {
              alert('sono in getrighefromCommanda - error');
              this.isVisible = true;
              this.alertSuccess = false;
              console.log('getrighebyCommaandaeCompetenza - errore: ' + error);
              this.type = 'error';
              this.Message = error.message;
              this.showNotification(this.type, this.Message);
          });
      }


    async getrighebyCommaandaeCompetenza(id: number, comp: number, fase: string) {

      let rc = await this.commandarigaService.getrighebyCommandaeCompetenza(id, comp, fase).subscribe(
        resp => {
            if(resp['rc'] === 'ok') {
              console.log('getrighebyCommaandaeCompetenza .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
              this.commandarighe = resp['data'];
              this.trovatoRec = true;
              this.nRecPr = resp['number'];
              this.visibleProdottiCommanda = true;
            }
            if(resp['rc'] === 'nf') {
              this.commandarighe = this.commandarighenull;
              this.trovatoRec = false;
              this.nRecPr = 0;
              this.visibleProdottiCommanda = true;
            }
          },
        error => {
            alert('sono in getrighebyCommaandaeCompetenza - error');
            this.isVisible = true;
            this.alertSuccess = false;
            console.log('getrighebyCommaandaeCompetenza - errore: ' + error);
            this.type = 'error';
            this.Message = error.message;
            this.alertSuccess = false;
            this.showNotification(this.type, this.Message);
        });
    }

    CucinaProdotto(commandariga: Commandariga) {

      commandariga.flag_lavorazione = 1;
      this.message = commandariga.descrizione_prodotto + ' inviato in Cucina !!';
      this.AggiornStatoRigaCommanda(commandariga,  this.message);
    }

    AnnullaCucinaProdotto(commandariga: Commandariga) {
      commandariga.flag_lavorazione = 0;
      this.message = commandariga.descrizione_prodotto + ' tolto dallaCucina !!';
      this.AggiornStatoRigaCommanda(commandariga,  this.message);
    }

    ConsegnaProdotto(commandariga: Commandariga) {
      commandariga.flag_consegna = 1;
      this.message = commandariga.descrizione_prodotto + ' Consegnato !!';
      this.AggiornStatoRigaCommanda(commandariga,  this.message);
    }

    AnnullaConsegnaProdotto(commandariga: Commandariga) {
      commandariga.flag_consegna = 0;
      this.message = commandariga.descrizione_prodotto + ' da consegnare !!';
      this.AggiornStatoRigaCommanda(commandariga,  this.message);
    }



    async AggiornStatoRigaCommanda(commandariga: Commandariga, messaggio: string) {
      console.log('AggiornaStatoRigaommanda - appena entrato : ' + JSON.stringify(commandariga));




      let rc = await this.commandarigaService.updateCommandariga(commandariga).subscribe(
        resp => {
            if(resp['rc'] === 'ok') {
              console.log('aggiornata commandaRiga .... result ' + JSON.stringify(resp['data']));
              this.isVisible = true;
              this.alertSuccess = true;
              this.Message = messaggio;
              this.showNotification(this.type, this.Message);
              if(this.faseLavorativa === 'Co') {
                this.CommandaviewrigheConsegna(commandariga.idCommanda);
              }
              if(this.faseLavorativa === 'Cu') {
                this.CommandaviewrigheCucina(commandariga.idCommanda);
              }
            }
            if(resp['rc'] === 'nf') {
              this.isVisible = true;
              this.alertSuccess = false;
              this.Message = 'Prodotto inesistente - aggiornamento non possibile !!';
              this.showNotification(this.type, this.Message);
            }
          },
        error => {
            alert('sono in AggiornStatoRigaCommanda - error');
            this.isVisible = true;
            this.alertSuccess = false;
            console.log('AggiornStatoRigaCommanda - errore: ' + error);
            this.type = 'error';
            this.Message = error.message;
            this.alertSuccess = false;
            this.showNotification(this.type, this.Message);
        });

    }







      statistica() {
       // alert(' da fare');
      //  this.enabledGrafici = true;
        if(this.idLevel === -1 && this.c2 === 'gestioneCucina' || this.idLevel === 2) {
          this.enabledCucina = true;
         }
        if(this.idLevel === -1 && this.c2 === 'gestioneBevande' || this.idLevel === 3 ) {
          this.enabledBevande = true;
         }
        if(this.enabledCucina === true) {
          this.competenza = 1;
         }
        if(this.enabledBevande === true) {
          this.competenza = 2;
         }

        this.ricreaGrafici(this.competenza);

// alert('-------------------------   finita  statistica');


      }


async ricreaGrafici(competenza) {

   let rc = await this.graphprodService.deleteAllGraph().subscribe(
          resp => {
              if(resp['rc'] === 'ok') {
                this.editdatiGraph();
              // spostarlo su selezione prodotti/commande
                this.PreparaGrafici(competenza);
            }

            },
          error => {
              alert('sono in calcelladatiGrafici - error');
              this.isVisible = true;
              this.alertSuccess = false;
              console.log('calcelladatiGrafici - errore: ' +  JSON.stringify(error));
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
              this.showNotification(this.type, this.Message);
          });

}





 async  PreparaGrafici(competenza: number) {
        const amenu = 'S';
        let rc = await this.prodottoService.getProdottiforMenbyCompetenza(amenu, competenza).subscribe(
          resp => {
              if(resp['rc'] === 'ok') {
                this.prodottibysel = resp['data'];
                 console.log('preparaGrafici - - Prodotto per la competenza: ' + competenza + ' ---- ' + JSON.stringify(this.prodotti));
                this.test = 0;
                this.testok = 0;
                for(let prod of this.prodottibysel) {
                   if(!prod) {
                     alert('non ho la merdaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                   } else {
                    this.test += 1;
                    this.loaddatibyGraph(competenza, prod.id);
                   }

                  }




            /* test
                 let test = 0;
                for(let prod of this.prodotti) {
                  test += 1;
                  if(test === 5) {
                    this.loaddatibyGraph(competenza, prod.id);
                  }  else {
                    alert('dovrei fare insert - test: ' + test);
                  }

               }  */
                   console.log('finito loop per inserimento dati ---- test: ' + this.test + ' testok: ' + this.testok);





                 //  attenzione.  spostato sull'icona dei grafici e edito solo la tabella creata in background con selezione  prodotti/ commanda
                 //  this.editdatiGraph();








                //   setTimeout(this.editdatiGraph(),5000);

                 //  var myTimer = setTimeout(this.editdatiGraph, 5000);
/*
                   window.setTimeout("", 10000);
                   this.editdatiGraph();   */



            //  alert('finito creazione dati per grafico');
            }

            },
          error => {
              alert('sono in aggiornacommandariga - error');
              this.isVisible = true;
              this.alertSuccess = false;
              console.log('aggiornacommandariga - errore: ' +  JSON.stringify(error));
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
              this.showNotification(this.type, this.Message);
          });
      }

async loaddatibyGraph(competenza: number, id: number) {
  console.log('loaddatibyGraph appena entrata - competenza: ' + competenza + ' id: ' + id);

  let rc = await this.commandarigaService.getCountbyprodotto(competenza, id).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {

         // console.log('totale: ' + resp['totale'] + ' per id: ' + id + ' in fase di registrazione');
        //  console.log('descrizione: ' + resp['descprod'] + ' per id: ' + id + ' in fase di registrazione');
        //  console.log('ndacuc: ' + resp['dacucinare'] + ' per id: ' + id + ' in fase di registrazione');
       //   console.log('ndacons : ' + resp['daconsegnare'] + ' per id: ' + id + ' in fase di registrazione');
      //    console.log('nevasi: ' + resp['consegnate'] + ' per id: ' + id + ' in fase di registrazione');

          this.graphprod = new Graphprod();
          this.graphprod.id = resp['idprod'];
          this.graphprod.descrizione = resp['descprod'];
          this.graphprod.ntot = resp['totale'];
          this.graphprod.ndacuc = resp['dacucinare'];
          this.graphprod.ndacons = resp['daconsegnare'];
          this.graphprod.nevasi = resp['consegnate'];
          if(this.graphprod.ntot > 0) {
            this.testok += 1;
            console.log(`loaddatibyGraph: ------- pronto per inserire ---------------->  ${JSON.stringify(this.graphprod)} ----  testok ${this.testok}`);
            this.registranewgraphprod(this.graphprod);
          } else {
            console.log(`loaddatibyGraph: ----- non registro --------- prodotto senza prodotti usati ----------->  ${JSON.stringify(this.graphprod)} `);
          }
        }
      },
    error => {
        alert('sono in loaddatibyGraph( - error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('loaddatibyGraph( - errore: ' +  JSON.stringify(error));
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });

}

async registranewgraphprod(graphprod: Graphprod) {
  console.log('::::::::::::::::::::::::::::::::::::: registranewgraphprod ----   appena entrato ' + JSON.stringify(graphprod));



  let rc = await this.graphprodService.createGraph(graphprod).subscribe(
    resp => {
        if(resp['rc'] === 'ok') {
         //  non faccio nulla
         console.log('----------------------------------------------------------------------------------- inserito dati per grafico  ' + graphprod.id);
         }
      },
    error => {
        alert('sono in registranewgraphprod ( - error' + JSON.stringify(error));
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('registranewgraphprod -  errore: ' +  JSON.stringify(error) + ' dato in inseimento: ' + JSON.stringify(graphprod));
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });
}


async editdatiGraph() {
  console.log('editdatiGraph --------------------------------------------------------------------------- appena entrato');

  //    originale    grapfService
 // let rc = await this.graphprodService.getAll().subscribe(
  let rc = await this.grapfService.getAll().subscribe(
    resp => {
      console.log('non ci credddddddddddddddddddddddddddddddddddddddddddddooooooooooooooooooooooooooooooooooooooooo rc: ' + resp['rc']);
        if(resp['rc'] === 'ok') {
          this.enabledGrafici = true;
          this.graphprods = resp['data'];
          console.log('-----letto dati Grapfprod -----   ' + JSON.stringify(resp['data']));
         }
      },
    error => {
        alert('sono in editdatiGraph ( - error');
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('editdatiGraph -  errore: ' +  JSON.stringify(error));
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
    });

/*

  try {
     //  let response = await this.editdatiGraph();
     let rc = await this.graphprodService.getAll().subscribe(
      resp => {
        console.log('non ci credddddddddddddddddddddddddddddddddddddddddddddooooooooooooooooooooooooooooooooooooooooo rc: ' + resp['rc']);
          if(resp['rc'] === 'ok') {
            this.graphprods = resp['data'];
            console.log('-----letto dati Grapfprod -----   ' + JSON.stringify(resp['data']));
           }
        },
      error => {
          alert('sono in registranewgraphprod ( - error');
          this.isVisible = true;
          this.alertSuccess = false;
          console.log('registranewgraphprod -  errore: ' +  JSON.stringify(error));
          this.type = 'error';
          this.Message = error.message;
          this.alertSuccess = false;
          this.showNotification(this.type, this.Message);
      });
  } catch(e) {
      console.log(e);
      alert('sono in editdatiGraph ( - error');
      this.isVisible = true;
      this.alertSuccess = false;
      console.log('editdatiGraph -  errore: ' +  JSON.stringify(e));
      this.type = 'error';
      this.Message = e.message;
      this.alertSuccess = false;
      this.showNotification(this.type, this.Message);
  }

*/


}






     async  aggiornacommandariga(commandariga: Commandariga) {

      let rc = await this.commandarigaService.updateCommandariga(commandariga).subscribe(
        resp => {
            if(resp['rc'] === 'ok') {
              this.commandarighe = resp['data'];
            }

          },
        error => {
            alert('sono in aggiornacommandariga - error');
            this.isVisible = true;
            this.alertSuccess = false;
            console.log('aggiornacommandariga - errore: ' +  JSON.stringify(error));
            this.type = 'error';
            this.Message = error.message;
            this.alertSuccess = false;
            this.showNotification(this.type, this.Message);
        });
        }



        getDateDiff(date1, date2, interval) {

          const second = 1000;

          const minute = second * 60;

          const hour = minute * 60;

          const day = hour * 24;

          const week = day * 7;

          date1 = new Date(date1).getTime();
          date2 = new Date(date2).getTime();


         // date2 = (date2 == 'now') ? new Date().getTime() : new Date(date2).getTime();

          const timediff = date2 - date1;

          if (isNaN(timediff)) return NaN;

          switch (interval) {
              //  case "years":
             //   return date2.getFullYear() - date1.getFullYear();
            //    case "months":
             //   return ((date2.getFullYear() * 12 date2.getMonth()) - (date1.getFullYear() * 12 date1.getMonth()));
            //    case "weeks":
           //    return Math.floor(timediff / week);
            //    case "days":

            //    return Math.floor(timediff / day);

            //    case "hours":

            //    return Math.floor(timediff / hour);

                case "minutes":

                return Math.floor(timediff / minute);

            //    case "seconds":

            //    return Math.floor(timediff / second);

            //    default:

            //    return undefined;

                }

          }


// gestione delle statistiche utilizzando la modalità promise
    async   statisticaNew() {

            this.enabledGrafici = true;
            if(this.idLevel === -1 && this.c2 === 'gestioneCucina' || this.idLevel === 2) {
              this.enabledCucina = true;
             }
            if(this.idLevel === -1 && this.c2 === 'gestioneBevande' || this.idLevel === 3 ) {
              this.enabledBevande = true;
             }
            if(this.enabledCucina === true) {
              this.competenza = 1;
             }
            if(this.enabledBevande === true) {
              this.competenza = 2;
             }

            const rc = await this.ricreaGraficiNew();

          }





     async ricreaGraficiNew() {
      console.log('------ ricreaGraficiNew   --- appena entrato');
      try {
        const rc: any = await this.graphprodService.deleteAllGraph().toPromise();
        if(rc['rc'] === 'ok') {
            this.PreparaGraficiNew(this.competenza);
        }
      } catch (error) {
        this.isVisible = true;
        this.alertSuccess = false;
        console.log('ricreaGraficiNew - errore: ' +  JSON.stringify(error));
        this.type = 'error';
        this.Message = error.message;
        this.alertSuccess = false;
        this.showNotification(this.type, this.Message);
      }
    }

    async  PreparaGraficiNew(competenza: number) {
             console.log('------------ PreparaGraficiNew   --- appena entrato');
             const amenu = 'S';
             try {
              const rc: any = await this.prodottoService.getProdottiforMenbyCompetenza(amenu, competenza).toPromise();
              if(rc['rc'] === 'ok') {
                this.prodotti =  rc['data'];
                for(let prod of this.prodotti) {
                  if(!prod) {
                    alert('non faccio nulla');
                  } else {
                    this.loaddatibyGraphNew(competenza, prod.id);
                  }
               }
                this.editdatiGraphNew();
              }
            } catch (error) {
                   alert('sono in PreparaGraficiNew - error');
                   this.isVisible = true;
                   this.alertSuccess = false;
                   console.log('PreparaGraficiNew - errore: ' +  JSON.stringify(error));
                   this.type = 'error';
                   this.Message = error.message;
                   this.alertSuccess = false;
                   this.showNotification(this.type, this.Message);
            }

          }


          async loaddatibyGraphNew(competenza: number, id: number) {
              console.log('------------------ loaddatibyGraphNew   --- appena entrato');
              try {
                let rc = await this.commandarigaService.getCountbyprodotto(competenza, id).toPromise();
                if(rc['rc'] === 'ok') {
                  this.graphprod = new Graphprod();
                  this.graphprod.id = rc['idprod'];
                  this.graphprod.descrizione = rc['descprod'];
                  this.graphprod.ntot = rc['totale'];
                  this.graphprod.ndacuc = rc['dacucinare'];
                  this.graphprod.ndacons = rc['daconsegnare'];
                  this.graphprod.nevasi = rc['consegnate'];
                  if(this.graphprod.ntot > 0) {
                    console.log(`loaddatibyGraphNew: ------- pronto per inserire ---------------->  ${JSON.stringify(this.graphprod)} `);
                    this.registranewgraphprodNew(this.graphprod);
                  } else {
                    console.log(`loaddatibyGraphNew: ----- non registro --------- prodotto senza prodotti usati ----------->  ${JSON.stringify(this.graphprod)} `);
                  }
                }
              } catch (error) {
                    alert('sono in loaddatibyGraphNew ( - error');
                    this.isVisible = true;
                    this.alertSuccess = false;
                    console.log('loaddatibyGraphNew ( - errore: ' +  JSON.stringify(error));
                    this.type = 'error';
                    this.Message = error.message;
                    this.alertSuccess = false;
                    this.showNotification(this.type, this.Message);
              }
          }

          async registranewgraphprodNew(graphprod: Graphprod) {
            console.log(':::::   .... .---------:::: registranewgraphprodNew ----   appena entrato ' + JSON.stringify(graphprod));
            try {
              let rc = await this.graphprodService.createGraph(graphprod).toPromise();
              if(rc['rc'] === 'ok') {
                // non faccio nulla
                console.log('-------------------------------------------------------------- inserito dati per grafico  ' + graphprod.id);
              }

            } catch (error) {
                    alert('sono in registranewgraphprodNew ( - error' + JSON.stringify(error));
                    this.isVisible = true;
                    this.alertSuccess = false;
                    console.log('registranewgraphprodNew -  errore: ' +  JSON.stringify(error) + ' dato in inseimento: ' + JSON.stringify(graphprod));
                    this.type = 'error';
                    this.Message = error.message;
                    this.alertSuccess = false;
                    this.showNotification(this.type, this.Message);
            }
       }


     async editdatiGraphNew() {
       console.log('editdatiGraphNew---------------------------------------------- appena entrato');

       try {
        const rc: any = await this.grapfService.getAll().toPromise();
        if(rc['rc'] === 'ok') {
          this.enabledGrafici = true;
          this.graphprods = rc['data'];
          console.log('-----letto dati Grapfprod -----   ' + JSON.stringify(rc['data']));

        }
       } catch(error) {
              alert('sono in editdatiGraphNew ( - error');
              this.isVisible = true;
              this.alertSuccess = false;
              console.log('sono in editdatiGraphNew  -  errore: ' +  JSON.stringify(error));
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
              this.showNotification(this.type, this.Message);
       }
   }



  async   onSelectCommanda(commanda: Commanda) {

    alert('onSelectCommanda - commanda selected: ' + JSON.stringify(commanda));

    let rc = await this.commandarigaService.getrighebyCommanda(commanda.id).subscribe(
     resp => {
         if(resp['rc'] === 'ok') {
           console.log('getAllrigheCommanda .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
           this.commandarighe = resp['data'];
           this.commandatoedit = true;
         }
         if(resp['rc'] === 'nf') {
           this.commandarighe = this.commandarighenull;
         }
       },
     error => {
         alert('sono in onSelectCommanda- error');
         this.isVisible = true;
         this.alertSuccess = false;
         console.log('onSelectCommanda - errore: ' + error);
         this.type = 'error';
         this.Message = error.message;
         this.alertSuccess = false;
         this.showNotification(this.type, this.Message);
     });



      }








          /*     esempio  async await  con promise
async  getAllCommande(order: string) {

  try {
        if(order === '') {
          order = '*';
         }
        const rc: any = await this.commandaService.getCommandeforGiornata(this.idGiornata, order).toPromise();
        if(rc['rc'] === 'ok') {
          this.commande = rc['data'];
          this.trovatoRecRighe = true;
          this.nRec = rc['number'];
        }
      } catch (error) {
            this.isVisible = true;
            this.alertSuccess = false;
            console.log('loadCommandaSelect - errore: ' + error);
            this.type = 'error';
            this.Message = error.message;
            this.alertSuccess = false;
            this.showNotification(this.type, this.Message);
      }
  }

          */








     /*

       try {
          //  let response = await this.editdatiGraph();
          let rc = await this.graphprodService.getAll().subscribe(
           resp => {
             console.log('non ci credddddddddddddddddddddddddddddddddddddddddddddooooooooooooooooooooooooooooooooooooooooo rc: ' + resp['rc']);
               if(resp['rc'] === 'ok') {
                 this.graphprods = resp['data'];
                 console.log('-----letto dati Grapfprod -----   ' + JSON.stringify(resp['data']));
                }
             },
           error => {
               alert('sono in registranewgraphprod ( - error');
               this.isVisible = true;
               this.alertSuccess = false;
               console.log('registranewgraphprod -  errore: ' +  JSON.stringify(error));
               this.type = 'error';
               this.Message = error.message;
               this.alertSuccess = false;
               this.showNotification(this.type, this.Message);
           });
       } catch(e) {
           console.log(e);
           alert('sono in editdatiGraph ( - error');
           this.isVisible = true;
           this.alertSuccess = false;
           console.log('editdatiGraph -  errore: ' +  JSON.stringify(e));
           this.type = 'error';
           this.Message = e.message;
           this.alertSuccess = false;
           this.showNotification(this.type, this.Message);
       }

     */



/*

async loadProdottibyTipologia(id: number) {
  console.log(`loadProdottibyTipologia - appena entrato - id: ${id}` );
  let rc = await this.prodottoService.getProdottiforTipologia1(id).subscribe(
  resp => {
      if(resp['rc'] === 'ok') {
        console.log('loadProdottibyTipologia .... result ' + JSON.stringify(resp['data']) + ' record: ' + resp['number']);
        this.prodotti = resp['data'];
        this.trovatoRec = true;
        this.nRecPr = resp['number'];
      }
      if(resp['rc'] === 'nf') {
        this.prodotti = this.prodottinull;
        this.trovatoRec = false;
        this.nRecPr = 0;
      }
    },
  error => {
      alert('sono in loadProdottibyTipologia - error');
      this.isVisible = true;
      this.alertSuccess = false;
      console.log('loadProdottibyTipologia - errore: ' + error);
      this.type = 'error';
      this.Message = error.message;
      this.alertSuccess = false;
      this.showNotification(this.type, this.Message);
  });

}





*/


     }














// --------------------------------------------------------------------------------------------------------------------

/*

per calcolare il tempo dalla lavorazione alla consegna

leggere la data attuale (data consegna) e metterla in string
fare confronto

          const a = moment('2022-02-11 14:03:25');
          const b = moment('2022-02-11 14:05:25');
          let c = 0;

          c =  b.diff(a, 'minutes');
          console.log(' ---- minuti ----  data maggiore con  data maggiore ---------------  moment .differenza in minuti tra due date in string  ..' + c);
          c = b.diff(a, 'hours');
          console.log(' ---- hours ----  data maggiore con  data maggiore ---------------  moment .differenza in minuti tra due date in string  ..' + c);










*/


