import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Classe
import { Prodotto } from './../../../../classes/Prodotto';
import { Prenotazionework } from './../../../../classes/Prenotazionework';
import { Prenotazioneprodwork } from './../../../../classes/Prenotazioneprodwork';
import { Prenotazione } from './../../../../classes/Prenotazione';
import { PrenotazioneConfirm } from './../../../../classes/PrenotazioneConfirm';
import { Manifestazione} from './../../../../classes/Manifestazione';
import { Giornata } from './../../../../classes/Giornata';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
import { ProdottoService } from './../../../../services/prodotto.service';
import { PrenotazioneworkService } from './../../../../services/prenotazionework.service';
import { PrenotazioneprodworkService } from './../../../../services/prenotazioneprodwork.service';
import { PrenotazioneService } from './../../../../services/prenotazione.service';
import { PrenotazioneConfirmService } from './../../../../services/prenotazione-confirm.service';
import { GiornataService } from './../../../../services/giornata.service';
import { ManifestazioneService} from './../../../../services/manifestazione.service';
import { AuthService } from './../../../../services/auth.service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-request-prenotazione',
  templateUrl: './request-prenotazione.component.html',
  styleUrls: ['./request-prenotazione.component.css']
})
export class RequestPrenotazioneComponent implements OnInit {

  public error = [];

  public prens: PrenotazioneConfirm[] = [];
  public pren: PrenotazioneConfirm;
  public giornate: Giornata[] = [];
  public giornata: Giornata;
  public manif: Manifestazione;
  public prenotazioni: Prenotazione[] = [];
  public prenotazionework: Prenotazionework;
  //
  public prenotazioneprodwork: Prenotazioneprodwork;
  public prenotazioniprodwork: Prenotazioneprodwork[]=[];
   public prodotti: Prodotto[]=[];

  public datapre = '';
  public datagiaRichiesta = false;
  public selectedGiornataValue = 0;
  public dataSelected = '';
  public dataPrenotata: string;       //Date;
  public numPre = 0;
  // icone
  faTrash = faTrash;
  faSave = faSave;
  faPlus = faPlus;

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
  public idPassed = 0;
  public title = '';
  public nRec = 0;

  public visibleConferma = true;

  options = [
    'No',
    'Si'
  ];

  public tipoRichiesta = '';
  public activateChiusuraSoloPrenotazione = false;
  public activateSelezioneProdotti = false;




  constructor(private router: Router,
              private datePipe: DatePipe,
              private route: ActivatedRoute,
              private prenotazioneConfirmService: PrenotazioneConfirmService,
              private prenotazioneService: PrenotazioneService,
              private prenotazioneworkService: PrenotazioneworkService,
              private prenotazioneprodworkService: PrenotazioneprodworkService,
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

              this.isVisible = true;
              this.alertSuccess = true;

              this.visibleConferma = true;

              this.route.paramMap.subscribe(p => {
                this.idPassed = +p.get('id');
                console.log('id recuperato: ' + this.idPassed);
                // -------  leggo i dati della giornata
                this.loadGiornata(this.idPassed);
                this.loadprenotazioni(this.idPassed);

                this.Message = 'Inserire i dati per la prenotazione';

              });


            this.type = 'success';
            this.showNotification(this.type, this.Message);
         }


  //  --------------------------------

  nuovaPrenotazione(giornata: Giornata) {
    this.prenotazionework = new Prenotazionework();
    this.prenotazionework.idgiornata = giornata.id;
    this.prenotazionework.datapren = giornata.dtGiornata1;
    this.creaprenotazionework(this.prenotazionework);
  }

  async creaprenotazionework(prenotazionework: Prenotazionework) {

    let res = await this.prenotazioneworkService.create(prenotazionework).subscribe(
     res => {
              if(res['rc']  === 'ok')  {
                 this.prenotazionework = res['data'];
                 this.creaprodprenotazionework(this.prenotazionework.id)
              }
       },
       error => {
          alert('Request-Prenotazione  -- creaprenotazionework - errore: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.Message = error.message;
          this.type = 'error';
          this.showNotification(this.type, this.Message);
       }
     )
  }



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

  async loadGiornata(id: number) {

    console.log('request-prenotazione -------  loadGiornata ' + id);
    let res = await this.giornataService.getbyId(id).subscribe(
     res => {
           this.giornata = res['data'];
           this.nuovaPrenotazione(this.giornata);
           this.title = 'Prenotazione per Giornata del ' + this.giornata.dtGiornata1;
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

  async loadprenotazioni(id: number) {

    let res = await this.prenotazioneService.getAllbyday(id).subscribe(
     res => {
           this.prenotazioni = res['data'];
           this.title = 'Prenotazione per Giornata del ' + this.giornata.dtGiornata1;
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

  selectedGiornata(selectedValue: number) {
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
      this.giornataService.getbyId(selectedValue).subscribe(
          resp => {
            this.giornata = resp['data'];
            this.dataSelected = this.datePipe.transform(this.giornata.dtGiornata, 'dd-MM-yyyy');  //this.giornata.dtGiornata;
            this.dataPrenotata = this.giornata.dtGiornata;
            console.log('data selezionata: ' + this.dataSelected + ' dataPrenotata: ' + this.dataPrenotata);
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


  onSubmit(form: NgForm) {
   // alert('sono in submit');
    console.log('sono in submit -----------  ' );
// determino la giornata








    // effettuo una verifica su user se presenti utenti con la stessa mail
    this.prenotazioneConfirmService.getPreConfirmbyEmail(form.value.email).subscribe(
        resp => {
               if(resp['rc'] === 'ok') {
                this.datagiaRichiesta  = false;
                console.log('onsubmit - verifica se posso inviare mail: ' + JSON.stringify(resp['data']));
                this.prens = resp['data'];
                this.numPre = resp['number'];
                if(this.numPre !== 0) {
                   console.log('n.ro di prenotazioni trovate con la mail ' + this.numPre);
                   for(let pren of this.prens) {
                      this.datapre = this.datePipe.transform(pren.datapren, 'dd-MM-yyyy');
                      console.log('data selezionata: ' + this.dataSelected);
                      console.log('datapre: ' + this.datapre);
                      if(this.datapre === this.dataSelected) {
                        this.datagiaRichiesta  = true;
                      }
                   }
                   if(this.datagiaRichiesta  === true) {
                    this.Message = 'Prenotazione già eseguita  - inserimento non consentito';
                    this.isVisible = true;
                    this.alertSuccess = false;

                    this.type = 'error';
                    this.showNotification(this.type, this.Message);

                    return;
                  }  else  {
                   console.log('vado a invaire la mail e creare laa prenotazione da confermare poi  -----   da fare ----->  2');

                  }
                 }

               else {

                 console.log('vado a invaire la mail e creare laa prenotazione da confermare poi  -----   da fare');



                 let res =  this.auth.sendAccountConfirmedLink
                                 (form.value.email, form.value.cognome, form.value.name, form.value.username, form.value.password)
                                 .subscribe(
                     resp => {
                           console.log('effettuata la send email per ' + form.value.email);
                     },
                   error => {
                     console.log('errore in invio email ' + error.message);
                   }
                 );
                 this.Message = 'utente ' + form.value.cognome + ' inviata mail di richiesta registrazione --------------';
                 this.isVisible = true;
                 this.alertSuccess = true;

                 this.type = 'success';
                 this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                 this.showNotification(this.type, this.Message);
               }
          }
               if(resp['rc'] === 'nf') {

                this.cognome = form.value.cognome;
                this.nome = form.value.name;
                this.email = form.value.email;

                console.log('merda   -------------------        vado a invaire la mail e creare laa prenotazione da confermare poi  -----   da fare');
/*
                console.log('merda   ---- cognome ---------------  ' + this.cognome);
                console.log('merda   ---- nome ---------------  ' + this.cognome);
                console.log('merda   ---- email ---------------  ' + form.value.email);
                console.log('merda   ---- telefono ---------------  ' + form.value.telefono);
                console.log('merda   ---- persone ---------------  ' + form.value.persone);
                console.log('merda   ---- datapren ---------------  ' + this.dataPrenotata);
*/

            // utilizzo da api/autu   --->  inspiegabilmente non va
         //   const res =  this.auth.registerConfermetPrenotazioneMoreno(form.value.cognome, form.value.name, form.value.email,
        //                                                             form.value.telefono, this.dataPrenotata , form.value.persone);

                const res =  this.prenotazioneConfirmService.registerConfermetPrenotazioneMoreno
                              (this.cognome.toLowerCase(), this.nome.toLowerCase(), this.email.toLowerCase(),
                              form.value.telefono, this.dataSelected , form.value.persone, this.giornata.id)
                              .subscribe(
                     resp => {
                             console.log('effettuata la send email per ' + form.value.email);
                             this.visibleConferma = false;
                             this.Message = 'utente ' + form.value.cognome + ' inviata mail di richiesta registrazione --------------';
                             this.isVisible = true;
                             this.alertSuccess = true;

                             this.type = 'success';
                             this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                             this.showNotification(this.type, this.Message);
                          },
                     error => {
                            console.log('errore in invio email ' + error.message);
                      });
                      /*
            if(res) {
                    console.log('effettuata la send email per ' + form.value.email);
                                console.log('res: ' + JSON.stringify(res));
                    this.Message = 'utente ' + form.value.cognome + ' inviata mail di richiesta registrazione --------------';
                    this.isVisible = true;
                    this.alertSuccess = true;

                    this.type = 'success';
                    this.Message = 'utente ' + form.value.cognome + ' Registrato con successo - inviata mail di conferma';
                    this.showNotification(this.type, this.Message);
               }
                 */
          }


        },
        error => {
          this.handleError(error);
          console.log(error.message);

          this.type = 'error';
          this.Message = 'errore in registrazione: ' + error.message;
          this.showNotification(this.type, this.Message);
        });





   // this.router.navigate(['users']);



    /*
    this.Jarwis.signup(this.form).subscribe(
      data => {
        console.log('merda - fatto signup');
        console.log(data);
        this.handleResponse(data);
      },
      error => this.handleError(error)
    );
    */
  }

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

controlloNome(campo: string, minlen: number, maxlen: number) {
  this.alertSuccess = true;
  this.isVisible = true;

 alert('lunghezza campo da controllare: ' + campo.length)

 if(campo.length == 0) {
  this.alertSuccess = false;
  this.Message = "il campo nome è obbligatorio "
  return;
}
if(campo.length < minlen) {
  this.alertSuccess = false;
  this.Message = "il campo nome è troppo corto - minimo " + minlen + " caratteri"
  return;
}
if(campo.length > maxlen) {
  this.alertSuccess = false;
  this.Message = "il campo nome è troppo lungo - massimo " + maxlen + " caratteri"
  return;
}
if(campo.length > minlen && campo.length < maxlen) {
  alert('campo corretto')
  return;
}

}

controlloCognome(campo: string, minlen: number, maxlen: number) {
    this.alertSuccess = true;
    this.isVisible = true;

   alert('lunghezza campo da controllare: ' + campo.length)

   if(campo.length == 0) {
    this.alertSuccess = false;
    this.Message = "il campo cognome è obbligatorio "
    return;
  }
  if(campo.length < minlen) {
    this.alertSuccess = false;
    this.Message = "il campo cognome è troppo corto - minimo " + minlen + " caratteri"
    return;
  }
  if(campo.length > maxlen) {
    this.alertSuccess = false;
    this.Message = "il campo cognome è troppo lungo - massimo " + maxlen + " caratteri"
    return;
  }
  if(campo.length > minlen && campo.length < maxlen) {
    alert('campo corretto')
    return;
  }
}

controlloEmail(campo: string) {
        this.alertSuccess = true;
        this.isVisible = true;

        if(campo.length == 0) {
          this.alertSuccess = false;
          this.Message = "il campo email è obbligatorio "
          return;
        }

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(campo))
        {
           alert("L'indirizzo email che hai inserito e' valido")
        }
        else {
           alert("L'indirizzo email che hai inserito non e' valido");
         //  document.getElementById('email').focus


           /*
           if (!prenotazione.email.value.includes('@')) { // non si tratta di una email
            input.classList.add('invalid');
            error.innerHTML = 'Per favore inserire un indirizzo email valido.'
          }
           var textbox = document.getElementById("email");
           textbox.focus();  */


          // document.getElementById("email").focus();
             }



      // alert('lunghezza campo da controllare: ' + campo.length)

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

confermaSolaPrenotazione(prenotazionework: Prenotazionework) {
  alert('creo prenotazione semplice con invio email')
}


onSelectionChange(tipo: string)   {

  // alert('onSelectionChange - Tipo Richiesta: ' + tipo);

   this.tipoRichiesta = tipo.substring(0, 1);

   this.isVisible = true;
   this.activateChiusuraSoloPrenotazione = false;
   this.activateSelezioneProdotti = false;

   switch (this.tipoRichiesta) {
    case 'N':
      this.activateChiusuraSoloPrenotazione = true;
      this.activateSelezioneProdotti = true;
 //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
    break;
    case 'S':
      this.activateChiusuraSoloPrenotazione = false;
      this.activateSelezioneProdotti = true;
      break;
     default:
    alert('Scelta errata \n ricerca non possibile');
    break;
  }
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


}
