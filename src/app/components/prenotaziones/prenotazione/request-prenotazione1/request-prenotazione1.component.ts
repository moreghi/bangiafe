import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Classe

import { Prodotto } from './../../../../classes/Prodotto';
import { Prenotazionework } from './../../../../classes/Prenotazionework';
import { Prenotazioneprodwork } from './../../../../classes/Prenotazioneprodwork';
import { Prenotazione } from './../../../../classes/Prenotazione';
import { Prenotazioneprod } from './../../../../classes/Prenotazioneprod';  // buttare
import { Prenotazioneprodotto } from './../../../../classes/Prenotazioneprodotto'
import { Manifestazione} from './../../../../classes/Manifestazione';
import { Giornata } from './../../../../classes/Giornata';
import { Listino } from '../../../../classes/Listino';
import { Listinoprod } from '../../../../classes/Listinoprod'
import { Listinowork } from '../../../../classes/Listinowork';
import { Listinoprodwork } from '../../../../classes//listinoprodwork'
import { Ttipologia } from '../../../../classes/T_tipologia';


import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash} from '@fortawesome/free-solid-svg-icons';
// service
import { ProdottoService } from './../../../../services/prodotto.service';
import { PrenotazioneworkService } from './../../../../services/prenotazionework.service';
import { PrenotazioneprodworkService } from './../../../../services/prenotazioneprodwork.service';
import { PrenotazioneService } from './../../../../services/prenotazione.service';
import { PrenotazioneprodService } from './../../../../services/prenotazioneprod.service';
import { GiornataService } from './../../../../services/giornata.service';
import { ManifestazioneService} from './../../../../services/manifestazione.service';
import { ListinoService } from './../../../../services/listino.service';
import { ListinoprodService } from '../../../../services/listinoprod.service'
import { ListinoworkService } from './../../../../services/listinowork.service';
import { ListinoprodworkService } from '../../../../services/listinoprodwork.service'
import { TtipologiaService } from '../../../../services/ttipologia.service';
import { PrenotazioneprodottoService} from '../../../../services/prenotazioneprodotto.Service'

import { AuthService } from './../../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-prenotazione1',
  templateUrl: './request-prenotazione1.component.html',
  styleUrls: ['./request-prenotazione1.component.css']
})

export class RequestPrenotazione1Component implements OnInit {

  public error = [];

  public giornate: Giornata[] = [];
  public giornata: Giornata;
  public manif: Manifestazione;
  public prenotazioni: Prenotazione[] = [];
  public prenotazione: Prenotazione;
  public prenotazioneprod: Prenotazioneprod;
  public prenotazionework: Prenotazionework;

  public prenotazioneprodotto: Prenotazioneprodotto;
  public prenotazioneprodotti: Prenotazioneprodotto[] = [];

  //
  public prenotazioneprodwork: Prenotazioneprodwork;
  public prenotazioniprodwork: Prenotazioneprodwork[]=[];
  public prodotti: Prodotto[]=[];
  public listino: Listino;
  public listinoprodotti: Listinoprod[] = [];

  public listinowork: Listinowork;
  public listinoprodworks: Listinoprodwork[]= [];
  public listinoprodottiwork: Listinoprodwork[]= [];
  public listinoprodwork: Listinoprodwork;
  public tipologie: Ttipologia[] = [];

  public datapre = '';
  public datagiaRichiesta = false;
  public selectedGiornataValue = 0;
  public dataSelected = '';
  public dataPrenotata: string;       //Date;
  public numPre = 0;
  public stato = 0;
  // icone
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;
  faMinus = faMinus;
  faSearch = faSearch;

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';
  public manifActive = 1;
  public manAct = 0;
  public sanfraActive = false;

  public cognome = '';
  public nome = '';
  public email = '';
  public iddayPassed = 0;
  public idprenotazPassed = 0;
  public title = '';
  public nRec = 0;
  public nRecOrdinati = 0;
  public nRecTipologie = 0;
  public nRecbyTipologia = 0;
  public visibleTipologie;
  public visibleConferma = true;

  public searchText = '';
  public searchText1 = '';
  public searchText2 = '';
// per paginazone
  p = 1;
  p1 = 1;
  p2 = 1;

  public tipoRichiesta = '';
  public activateChiusuraSoloPrenotazione = false;
  public activateSelezioneProdotti = false;
  public activateNuovaPrenotazione = false;
  public token = '';
  public tokenlong = '';
  public prodamenu = '';
  public idListinoprodwork = 1;

  public dataOdierna;
  public datadioggi = '';

  constructor(private router: Router,
              private datePipe: DatePipe,
              private route: ActivatedRoute,
              private prenotazioneService: PrenotazioneService,
              private prenotazioneprodService: PrenotazioneprodService,
              private prenotazioneworkService: PrenotazioneworkService,
              private prenotazioneprodworkService: PrenotazioneprodworkService,
              private prenotazioneprodottoService: PrenotazioneprodottoService,
              private listinoService: ListinoService,
              private listinoworkService: ListinoworkService,
              private ttipologiaService: TtipologiaService,
              private listinoprodworkService: ListinoprodworkService,
              private listinoprodService: ListinoprodService,
              private prodottoService: ProdottoService,
              private giornataService: GiornataService,
              private manifService: ManifestazioneService,
              private auth: AuthService,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }


              ngOnInit(): void {
                this.goApplication();
             }

             goApplication() {

              this.eliminalistprodwork();
              this.isVisible = true;
              this.alertSuccess = true;
              this.activateNuovaPrenotazione = false;

              const date = Date();
              this.dataOdierna = new Date(date);
              this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');

              this.visibleConferma = true;
              this.visibleTipologie = false;

              this.route.paramMap.subscribe(p => {
                 this.iddayPassed = +p.get('idday');
                console.log('id recuperato: ' + this.iddayPassed);
                // -------  leggo i dati della giornata
                this.loadGiornata(this.iddayPassed);
                this.Message = 'Selezionare i prodotti';
              });

              this.route.paramMap.subscribe(p  => {
                this.idprenotazPassed = +p.get('id');
                console.log('id recuperato: ' + this.idprenotazPassed);
                // -------  leggo i dati della giornata
                this.loadPrenotazionework(this.idprenotazPassed);
             });

            this.type = 'success';
            this.showNotification(this.type, this.Message);
         }

         async eliminalistprodwork() {

          let res = await this.listinoprodworkService.deleteAll().subscribe(
           res => {
                  if(res['rc'] === 'ok') {
                    // non faccio nulla
                   }
              },
             error => {
                alert('eliminalistprodwork - errore: ' + error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                console.log(error);
                this.Message = error.message;
                this.type = 'error';
                this.showNotification(this.type, this.Message);
             }
           )
        }

         async loadGiornata(id: number) {

          console.log('request-prenotazione -------  loadGiornata ' + id);
          let res = await this.giornataService.getbyId(id).subscribe(
           res => {
                  if(res['rc'] === 'ok') {
                    this.giornata = res['data'];
                    this.loadListinoprodamenu(this.giornata.idlistino);
                    // this.createListinowork
                    // this.nuovaPrenotazione(this.giornata);
                    this.title = 'Prenotazione per Giornata del ' + this.giornata.dtGiornata1;
                   }
              },
             error => {
                alert('Request-Prenotazione  -- loadGiornata - errore: ' + error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                console.log(error);
                this.Message = error.message;
                this.type = 'error';
                this.showNotification(this.type, this.Message);
             }
           )
        }

        async loadPrenotazionework(id: number) {
// leggo l'ultima inserita
          console.log('request-prenotazione1 -------  loadPrenotazionework ' + id);
          let res = await this.prenotazioneworkService.getlast(id).subscribe(
           res => {
                  if(res['rc'] === 'ok') {
                      this.prenotazionework = res['data'];
                   }
              },
             error => {
                alert('Request-Prenotazione1  -- loadPrenotazionework - errore: ' + error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                console.log(error);
                this.Message = error.message;
                this.type = 'error';
                this.showNotification(this.type, this.Message);
             }
           )
        }

        async loadListinoprodamenu(id: number) {
             this.prodamenu = 'S';
                    console.log('request-prenotazione1 -------  loadPrenotazionework ' + id);
                    let res = await this.listinoprodService.getallProdbylistinoamenu(id,this.prodamenu ).subscribe(
                     res => {
                            if(res['rc'] === 'ok') {
                              this.listinoprodotti = res['data'];
                              for(let prod of this.listinoprodotti) {
                                this.listinoprodwork = new Listinoprodwork();
                                this.listinoprodwork.categoria = prod.categoria;
                                this.listinoprodwork.amenu = prod.amenu;
                                this.listinoprodwork.competenza = prod.competenza;
                                this.listinoprodwork.descrizione = prod.descrizione;
                                this.listinoprodwork.idlistino = 1;
                                this.listinoprodwork.idprodotto = prod.idprodotto;
                                this.listinoprodwork.photo = prod.photo;
                                this.listinoprodwork.prezzo = prod.prezzo;
                                this.listinoprodwork.tipologia = prod.tipologia;
                                       console.log('-----   sto creando listinoprodwork: ' +  JSON.stringify(this.listinoprodwork))
                                this.crealistinoprodwork(this.listinoprodwork) ;
                             }
                             this.loadlistinoprodwork();
                             this.loadProdottiordinati();
                         }
                       },
                       error => {
                          alert('Request-Prenotazione1  -- loadPrenotazionework - errore: ' + error.message);
                          this.isVisible = true;
                          this.alertSuccess = false;
                          console.log(error);
                          this.Message = error.message;
                          this.type = 'error';
                          this.showNotification(this.type, this.Message);
                       }
                     )
                  }

                  async loadlistinoprodwork() {

                    let res = await this.listinoprodworkService.getAll().subscribe(
                     res => {
                              if(res['rc']  === 'ok')  {
                                this.listinoprodworks = res['data'];
                                this.nRec = res['number'];
                                this.loadtipologie();
                               }
                               if(res['rc']  === 'nf')  {
                                  this.nRec = 0;
                               }
                       },
                       error => {
                          alert('loadlistinoprodwork - errore: ' + error.message);
                          this.isVisible = true;
                          this.alertSuccess = false;
                          console.log(error);
                          this.Message = error.message;
                          this.type = 'error';
                          this.showNotification(this.type, this.Message);
                       }
                     )
                  }

              async crealistinoprodwork(listinoprodwork: Listinoprodwork) {

                    let res = await this.listinoprodworkService.create(listinoprodwork).subscribe(
                     res => {
                              if(res['rc']  === 'ok')  {
                              //  non faccio nulla
                               }
                       },
                       error => {
                          alert('crealistinoprodwork - errore: ' + error.message);
                          this.isVisible = true;
                          this.alertSuccess = false;
                          console.log(error);
                          this.Message = error.message;
                          this.type = 'error';
                          this.showNotification(this.type, this.Message);
                       }
                     )
                  }

          async loadProdottiordinati() {

                 let res = await this.listinoprodworkService.getProdottiordinati().subscribe(
                     res => {
                              if(res['rc']  === 'ok')  {
                                this.listinoprodworks = res['data'];
                                this.nRecOrdinati = res['number'];
                               }
                               if(res['rc']  === 'nf')  {
                                  this.nRec = 0;
                               }
                       },
                       error => {
                          alert('crealistinoprodwork - errore: ' + error.message);
                          this.isVisible = true;
                          this.alertSuccess = false;
                          console.log(error);
                          this.Message = error.message;
                          this.type = 'error';
                          this.showNotification(this.type, this.Message);
                       }
                     )
                  }

                  async  loadtipologie() {
                    this.stato = 1;
                    let rc = await this.ttipologiaService.getAllbyStato(this.stato).subscribe(
                        resp => {
                              console.log('statiprodotto: ' + JSON.stringify(resp['data']));
                              if(resp['rc'] === 'ok') {
                                this.tipologie = resp['data'];
                                this.nRecTipologie = resp['number'];;
                                this.visibleTipologie = true;
                              }
                           },
                        error => {
                             alert('sono in loadcompetenze');
                             this.isVisible = true;
                             this.alertSuccess = false;
                             console.log('loadcompetenze - errore: ' + error.error);
                             this.type = 'error';
                             this.Message = error.message;
                             this.alertSuccess = false;
                             this.showNotification(this.type, this.Message);
                         });
                     }

async  conferma(prenotazionework: Prenotazionework) {

    this.token = (Math.random() + 1).toString(36).substring(2,7);

    this.prenotazione = new Prenotazione();
    this.prenotazione.idgiornata = this.giornata.id;
    this.prenotazione.datagiornata = this.giornata.dtGiornata1;
    this.prenotazione.datapren = this.datadioggi;
    this.prenotazione.cognome = prenotazionework.cognome;
    this.prenotazione.nome = prenotazionework.nome;
    this.prenotazione.persone = prenotazionework.persone;
    this.prenotazione.email = prenotazionework.email;
    this.prenotazione.telefono = prenotazionework.telefono;
    this.prenotazione.token = this.token;
    this.prenotazione.tipo = 'P';

    let res = await this.prenotazioneService.create(this.prenotazione).subscribe(
      res => {
               if(res['rc']  === 'ok')  {
                  this.prenotazione = res['data'];
                  this.creoProdottiPrenotazione(this.prenotazione);
             }
        },
        error => {
           alert('creaprenotazione - errore: ' + error.message);
           this.isVisible = true;
           this.alertSuccess = false;
           console.log(error);
           this.Message = error.message;
           this.type = 'error';
           this.showNotification(this.type, this.Message);
        }
      )

  }


  async creoProdottiPrenotazione(prenotazione: Prenotazione) {
    console.log('creoProdottiPrenotazioneProvvisoria ----   sto passando idPrenotazione;   ' + prenotazione.id)
     let res = await this.listinoprodworkService.getProdottiordinati().subscribe(
       res => {
                if(res['rc']  === 'ok')  {
                  this.listinoprodottiwork = res['data'];
                  for(let prod of this.listinoprodottiwork) {
                       if(prod.qta > 0) {
                         this.prenotazioneprodotto = new  Prenotazioneprodotto();
                         this.prenotazioneprodotto.categoria = prod.categoria;
                         this.prenotazioneprodotto.competenza = prod.competenza;
                         this.prenotazioneprodotto.descrizione = prod.descrizione;
                         this.prenotazioneprodotto.idprenot = prenotazione.id;
                         this.prenotazioneprodotto.idprodotto = prod.idprodotto;
                         this.prenotazioneprodotto.photo = prod.photo;
                         this.prenotazioneprodotto.prezzo = prod.prezzo;
                         this.prenotazioneprodotto.qta = prod.qta;
                         this.prenotazioneprodotto.tipologia = prod.tipologia;
                         console.log('------------------------------ creo prenotazioneprodott ------------ ' + JSON.stringify(this.prenotazioneprodotto));
                         this.creaprenotazioneprodotto(this.prenotazioneprodotto) ;
                       }
                   }
                   this.InviaConfermaPrenotazione(prenotazione);
               }
         },
         error => {
            alert('creoProdottiPrenotazione - errore: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            console.log(error);
            this.Message = error.message;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
         })
    }

    async creaprenotazioneprodotto(prenotazioneprodotto: Prenotazioneprodotto) {

      // let res = await this.prenotazioneprodService.create(prenotazioneprod).subscribe(
       let res = await this.prenotazioneprodottoService.create(prenotazioneprodotto).subscribe(
         res => {
                  if(res['rc']  === 'ok')  {
                    //  non faccio nulla
                 }
           },
           error => {
              alert('creaprenotazioneprod - errore: ' + error.message);
              this.isVisible = true;
              this.alertSuccess = false;
              console.log(error);
              this.Message = error.message;
              this.type = 'error';
              this.showNotification(this.type, this.Message);
           })
      }


  async   InviaConfermaPrenotazione(prenotazione: Prenotazione) {

    //alert('InviaConfermaPrenotazione  -- appena entrato')

    let res =  await this.prenotazioneService.sendemailPrenotazionedaConfermareMoreno(prenotazione).subscribe(
     resp => {
        if(resp['rc'] === 'ok') {
                console.log('effettuata la send email per ' + prenotazione.email);
               // this.visibleConferma = false;
                this.type = 'success';
                this.Message = 'utente ' + prenotazione.cognome + ' ' + prenotazione.nome + '  inviata mail di richiesta conferma prenotazione';
                this.isVisible = true;
                this.alertSuccess = true;
                this.showNotification(this.type, this.Message);
                this.router.navigateByUrl('requestConfirmPrenotazione/' + this.giornata.id);
             }
     },
     error => {
          alert('InviaConfermaPrenotazione  -- errore in invio email - errore: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.Message = error.message;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
   });

  }


  async eliminatutto() {

    let res = await this.listinoprodworkService.getAll().subscribe(
     res => {
              if(res['rc']  === 'ok')  {
                this.listinoprodottiwork = res['data'];
                for(let prod of this.listinoprodottiwork) {
                  prod.qta = 0;
                  this.annullaordinework(prod) ;
                }
           }
       },
       error => {
          alert('eliminatutto - errore: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.Message = error.message;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
       }
     )
  }

  async annullaordinework(listinoprodwork: Listinoprodwork) {

    let res = await this.listinoprodworkService.update(listinoprodwork).subscribe(
     res => {
              if(res['rc']  === 'ok')  {
           // non faccio nulla
           }
       },
       error => {
          alert('annullaordinework - errore: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.Message = error.message;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
       }
     )
  }

  togli(listinoprodwork: Listinoprodwork) {
    listinoprodwork.qta -= 1;
    this.aggiornaprodottoalistino(listinoprodwork);
    this.nRecbyTipologia = 0;
  }

   elimina(listinoprodwork: Listinoprodwork) {
    listinoprodwork.qta = 0;
    this.aggiornaprodottoalistino(listinoprodwork)
    this.nRecbyTipologia = 0;
   }
   aggiungi(listinoprodwork: Listinoprodwork) {
    listinoprodwork.qta += 1;
    this.aggiornaprodottoalistino(listinoprodwork)
   }


   async  aggiornaprodottoalistino(listinoprodwork: Listinoprodwork) {
    let rc = await this.listinoprodworkService.update(listinoprodwork).subscribe(
      resp => {
               if(resp['rc'] === 'ok') {
                  this.loadProdottiordinati();
                  this.loadtipologie();
               }
         },
      error => {
           alert('sono in aggiornaprodottoalistino -- error');
           this.isVisible = true;
           this.alertSuccess = false;
           console.log('aggiornaprodottoalistino - errore: ' + error.error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
           this.showNotification(this.type, this.Message);
         });
    }


 loadGiornate(id: number) {

    console.log('request-prenotazione -------  loadGiornate ' + id);
    this.giornataService.getAllGiornatebyManif(id).subscribe(
     res => {
           if(res['rc'] === 'ok')
           this.giornate = res['data'];
        },
       error => {
          alert('Request-Prenotazione  -- loadGiornate - errore: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.Message = error.message;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
       }
     )
  }

  tipologiaSelect(id: number) {
   // il listino prodotti woork di gikornata è sempre con id=1
   // alert('codice passato dal figlio card a giornata-detail -- padre: ' + id)
    this.loadprodottibytipologia(id, this.idListinoprodwork);
  }

  async loadprodottibytipologia(idtipologia: number, id: number) {
    console.log('loadprodottibytipologia-----------------   da card3 - appena entrato -- tipologia: ' + idtipologia + ' id: ' + id );
    let rc = await this.listinoprodworkService.getallProdbylistbytipologia(idtipologia,id).subscribe(
     resp => {

        console.log(`loadprodottibytipologia: ----------------------->  ${JSON.stringify(resp['data'])} `);
           if(resp['rc'] === 'ok') {
              this.listinoprodottiwork = resp['data'];
              this.nRecbyTipologia = resp['number'];
            }
            if(resp['rc'] === 'nf') {
              this.nRecbyTipologia = 0;
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


  getColor(qta: number) {
    switch (qta) {
      case 0:
        return 'green';
      default:
        return 'red';
    }
  }

  handleResponse(data) {
  //  this.Token.handle(data.access_token);
    this.router.navigateByUrl('/profile');
  }

  handleError(error) {
    this.error = error.error.errors;
  }


/**
* Show a notification
*
* @param {string} type    Notification type
* @param {string} message Notification message
*/

showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}


  /*
  show() {
    this.type = "text"
  }
  hide() {
    this.type = "password"
  }
  */


// importante

/*
 la fase di creazione effettiva utente va spostata nella form di conferma (response-signup)

*/
            /*
                let resp =  this.auth.signUp(form.value.cognome, form.value.name, form.value.username, form.value.email, form.value.password);
                if (resp) {
                     console.log('resp - dopo creazione utente ' + resp.);
                     let res =  this.auth.sendAccountConfirmedLink(form.value.email);
                    this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                    this.isVisible = true;
                    this.alertSuccess = true;

                    this.type = 'success';
                    this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                    this.showNotification(this.type, this.Message);
                   }
                     */
// metodi non più  usati

  //   let res =  this.prenotazioneConfirmService.registerConfermetPrenotazioneMoreno
  //             (cognome, nome, email, telefono, dataserata , persone, giornata, token).subscribe(
  //    resp => {
  //      console.log('effettuata la send email per ' + form.value.email);
  //      this.visibleConferma = false;
  //      this.Message = 'utente ' + form.value.cognome + ' inviata mail di richiesta registrazione --------------';
  //      this.isVisible = true;
  //      this.alertSuccess = true;

  //      this.type = 'success';
  //      this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
  //      this.showNotification(this.type, this.Message);
  //    },
  //    error => {
  //         alert('Request-Prenotazione  -- errore in invio email - errore: ' + error.message);
  //         this.isVisible = true;
  //         this.alertSuccess = false;
  //         console.log(error);
  //         this.Message = error.message;
  //         this.type = 'error';
  //         this.showNotification(this.type, this.Message);
  //  });



    // ---------------------   attenzione


/*
async  inviataMail(form.value.email: NgForm) {

    const resp = await this.auth.sendAccountConfirmedLink(form.value.email).subscribe(
      resp => {
                this.handleResponse(resp);
           console.log(' -------------1------ ?' + resp);
                this.type = 'success';
           this.Message = 'inviata richiesta di reset password per utente ';
           this.showNotification(this.type, this.Message);

//alert(resp.cognome + ' loggatao correttamente');
           this.Message = 'inviata richiesta di reset password per utente ';
           this.isVisible = true;
           this.alertSuccess = true;
      },
      error => {
           this.Message = error.error.error;
           this.type = 'error';
           this.showNotification(this.type, this.Message);
//  messaggio sulla barra

           this.isVisible = true;
           this.alertSuccess = false;

      });

  }

*/


/*    metodo  non più usato

   async crearigaprodottoprenotazionework(prenotazioneprodwork: Prenotazioneprodwork) {

  //  console.log('------------------    urca -------- crearigaprodottoprenotazionework ' + JSON.stringify(prenotprodwork));
     let res = await this.prenotazioneprodworkService.create(prenotazioneprodwork).subscribe(
      res => {
               if(res['rc']  === 'ok')  {
               // non faccio nulla
             }
         },
        error => {
           alert('Request-Prenotazione  -- creaprenotazioneprodwork - errore: ' + error.message);
           this.isVisible = true;
           this.alertSuccess = false;
           console.log(error);
           this.Message = error.message;
           this.type = 'error';
           this.showNotification(this.type, this.Message);
        }
      )
   }

*/



/*
  async creaprodprenotazionework(id: number) {

     console.log('creaprenotazioneprodwork ------------------------------- id -- id -- id --------  ' + id);
     let res = await this.prodottoService.getAll().subscribe(
      res => {
               if(res['rc']  === 'ok')  {
                 this.prodotti = res['data'];
                 for(let prod of this.prodotti) {
                  this.prenotazioneprodwork = new Prenotazioneprodwork();
                  this.prenotazioneprodwork.idPrenotazione = id;
                  this.prenotazioneprodwork.idProdotto = prod.id;
                  console.log('-----   sto creando prenProdottiwork: ' +  JSON.stringify(this.prenotazioneprodwork))
                  this.crearigaprodottoprenotazionework(this.prenotazioneprodwork) ;
                }
             }
         },
        error => {
           alert('Request-Prenotazione  -- creaprenotazioneprodwork - errore: ' + error.message);
           this.isVisible = true;
           this.alertSuccess = false;
           console.log(error);
           this.Message = error.message;
           this.type = 'error';
           this.showNotification(this.type, this.Message);
        }
      )
   }

   async crearigaprodottoprenotazionework(prenotazioneprodwork: Prenotazioneprodwork) {

  //  console.log('------------------    urca -------- crearigaprodottoprenotazionework ' + JSON.stringify(prenotprodwork));
     let res = await this.prenotazioneprodworkService.create(prenotazioneprodwork).subscribe(
      res => {
               if(res['rc']  === 'ok')  {
               // non faccio nulla
             }
         },
        error => {
           alert('Request-Prenotazione  -- creaprenotazioneprodwork - errore: ' + error.message);
           this.isVisible = true;
           this.alertSuccess = false;
           console.log(error);
           this.Message = error.message;
           this.type = 'error';
           this.showNotification(this.type, this.Message);
        }
      )
   }

*/

/*    metodo non più usato   -  lavoro su listinoprodwork
        async creaprodprenotazionework(id: number) {

          console.log('creaprenotazioneprodwork ------------------------------- id -- id -- id --------  ' + id);
          let res = await this.prodottoService.getAll().subscribe(
           res => {
                    if(res['rc']  === 'ok')  {
                      this.prodotti = res['data'];
                      for(let prod of this.prodotti) {
                       this.prenotazioneprodwork = new Prenotazioneprodwork();
                       this.prenotazioneprodwork.idPrenotazione = id;
                       this.prenotazioneprodwork.idProdotto = prod.id;
                       console.log('-----   sto creando prenProdottiwork: ' +  JSON.stringify(this.prenotazioneprodwork))
                       this.crearigaprodottoprenotazionework(this.prenotazioneprodwork) ;
                     }
                  }
              },
             error => {
                alert('Request-Prenotazione  -- creaprenotazioneprodwork - errore: ' + error.message);
                this.isVisible = true;
                this.alertSuccess = false;
                console.log(error);
                this.Message = error.message;
                this.type = 'error';
                this.showNotification(this.type, this.Message);
             }
           )
        }
*/
// ------------------------------------------------------------------------------


/*   metodi non più usati
  async   creaprenotconfirm(prennotconfirm: PrenotazioneConfirm) {

    let res = await  this.prenotazioneConfirmService.create(prennotconfirm).subscribe(
     res => {
           if(res['rc'] === 'ok')
           this.InviaConfermaPrenotazione(
                prennotconfirm.cognome, prennotconfirm.nome, prennotconfirm.email,
                prennotconfirm.telefono, prennotconfirm.datapren, prennotconfirm.persone,
                prennotconfirm.idgiornata, prennotconfirm.token);
        },
       error => {
          alert('creaprenotconfirm - errore: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.Message = error.message;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
       }
     )
  }

   InviaConfermaPrenotazione(cognome: string, nome: string, email: string, telefono: string,
                                  dataserata: string, persone: number, giornata: number, token: string) {

    alert('debug  ---   salvato confirm  -- controllare metodo di send email')
    return;
  }
*/

  /*   metodo non più usato
  async creoPrenotazioneProvvisoria(prenotazionework: Prenotazionework) {


    this.prenotazione = new  Prenotazione();
    this.prenotazione.cognome = prenotazionework.cognome;
    this.prenotazione.nome = prenotazionework.nome;
    this.prenotazione.datagiornata = this.giornata.dtGiornata1;
    this.prenotazione.datapren = this.datadioggi;
    this.prenotazione.dataconf = '';
    this.prenotazione.email = prenotazionework.email.toLowerCase();
    this.prenotazione.idgiornata = prenotazionework.idgiornata;
    this.prenotazione.persone = prenotazionework.persone;
    this.prenotazione.telefono = prenotazionework.telefono;
    this.prenotazione.key_utenti_operation = +localStorage.getItem('id');

    let res = await this.prenotazioneService.create(this.prenotazione).subscribe(
     res => {
              if(res['rc']  === 'ok')  {
                this.prenotazione = res['data'];
                this.creoProdottiPrenotazioneProvvisoria(this.prenotazione.id);
               }
       },
       error => {
          alert('creoPrenotazioneProvvisoria - errore: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.Message = error.message;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
       }
     )
  }
  */


/*
  //  da fare
  onSubmit(form: NgForm) {
   // alert('sono in submit');
    console.log('sono in submit -------- ----    tutto da fare ---  ' );
// determino la giornata
*/

/*

   // preparo invio del file di conferma
   this.prennotconfirm = new  PrenotazioneConfirm();
   this.prennotconfirm.token = this.token;
   this.prennotconfirm.cognome = form.value.cognome[0].toUpperCase() + form.value.cognome.slice(1);
   this.prennotconfirm.nome = form.value.name[0].toUpperCase() + form.value.name.slice(1);
   this.prennotconfirm.datapren = this.giornata.dtGiornata1;
   this.prennotconfirm.email = form.value.email.toLowerCase();
   this.prennotconfirm.idgiornata = this.giornata.id;
   this.prennotconfirm.persone = form.value.persone;
   this.prennotconfirm.telefono = form.value.telefono;
   this.creaprenotconfirm(this.prennotconfirm)

   this.type = 'success';
   this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
   this.showNotification(this.type, this.Message);

*/



}
