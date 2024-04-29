import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// Model
import { Manifestazione} from './../../../../classes/Manifestazione';
import { Prenotazione } from './../../../../classes/Prenotazione';
import { Prenotazioneprodotto } from './../../../../classes/Prenotazioneprodotto';
import { Giornata } from './../../../../classes/Giornata';

// icone
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
// service
// import { PrenotazeventoConfirmService } from '../../../../../services/prenotazevento-confirm.service';

import { ManifestazioneService } from './../../../../services/manifestazione.service';
import { GiornataService } from './../../../../services/giornata.service';
import { PrenotazioneService } from './../../../../services/prenotazione.service';
import { PrenotazioneprodottoService } from './../../../../services/prenotazioneprodotto.Service';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-response-prenotazione',
  templateUrl: './response-prenotazione.component.html',
  styleUrls: ['./response-prenotazione.component.css']
})
export class ResponsePrenotazioneComponent implements OnInit {

  public form = {
    token: '',

};

public title = 'conferma Prenotazione serata ';
public error = [];
public token = '';
public password = '';
public codpren = '';
public cognome = '';
public email = '';

public manif: Manifestazione;
public prenotazione: Prenotazione;
public wprenotazione: Prenotazione;
public giornata: Giornata;
public prenotazioneprodotti: Prenotazioneprodotto[] = [];

public datapre = '';
public datagiaRichiesta = false;
public currencyPipeString = '';
public data1 = '';

public gg = '';
public mm = '';
public yyyy = '';
public dataPren: Date;

// icone
faTrash = faTrash;
faSave = faSave;
faPlus = faPlus;
faUserEdit = faUserEdit;

public isVisible = false;
public alertSuccess = false;
public Message = '';
public type = '';

closeResult = '';
public enabledNewUser = false;
public initialDate: any;
public visibleConferma = true;

public confermataPrenotazione = false;
public emailsend = false;
public importoTotb = 0;
// per paginazone
p: number = 1;

public esitocodpren = '';
public eseguitoVerifica = false;

public delCognome = '';
public delNome = '';
public dataOdierna;
public datadioggi = '';
public numPrenotazioni = 0;
public tokenVerify = false;


constructor(private router: Router,
            private route: ActivatedRoute,
            private datePipe: DatePipe,
            private modalService: NgbModal,
            private manifestazioneService: ManifestazioneService,
            private giornataService: GiornataService,
            private prenotazioneService: PrenotazioneService,
            private prenotazioneprodottoService: PrenotazioneprodottoService,
            private notifier: NotifierService) {
              this.notifier = notifier;
              route.queryParams.subscribe(
                params => {
                  this.form.token = params['token']

                });
            }


  ngOnInit(): void {

    const date = Date();
    this.dataOdierna = new Date(date);
    this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'dd-MM-yyyy');
    this.tokenVerify = false;
    this.eseguitoVerifica = false;
    this.confermataPrenotazione = false;

    this.token = this.form.token;
    this.wprenotazione = new Prenotazione;
    console.log('OnInit - token: ' + this.token);


// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.visibleConferma = true;
    this.enabledNewUser = false;
    this.prenotazioneService.getbytoken(this.token).subscribe(
        resp => {
          if(resp['rc'] === 'ok') {
                this.prenotazione = resp['data'];
                this.loadGiornata(this.prenotazione.idgiornata);
                if(this.prenotazione.tipo = 'P') {
                  this.loadPrenotazioneProdotti(this.prenotazione.id)
                }

           }
          if(resp['rc'] === 'nf') {
            this.Message = 'Conferma prenotazione già eseguita - funzione non eseguibile';
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.showNotification(this.type, this.Message);
            return;
           }
          },
          error => {
                console.log('error in lettura user: ' + error.message);
           });
  }

  async loadPrenotazioneProdotti(id: number) {
    console.log('frontend - loadPrenotazioneProdotti: ' + id);
    let rc = await  this.prenotazioneprodottoService.getallProdbyprenotazione(id).subscribe(
    response => {
          if(response['rc'] === 'ok') {
            this.prenotazioneprodotti = response['data'];
             }

        },
        error => {
            alert('loadPrenotazioneProdotti: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadGiornata' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
}

  async loadGiornata(id: number) {
    console.log('frontend - loadGiornatao: ' + id);
    let rc = await  this.giornataService.getbyId(id).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            this.giornata = response['data'];
            console.log(' dati della giornata: ------  giornata ' + JSON.stringify(response['data']))

            this.loadManifestazione(this.giornata.idManifestazione);
         }

      },
      error => {
          alert('loadGiornata: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore loadGiornata' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
  });

}

  async loadManifestazione(id: number) {
    console.log('frontend - loadManifestazione: ' + id);
    let rc = await  this.manifestazioneService.getbyid(id).subscribe(
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


  controlToken() {
    this.eseguitoVerifica = true;
    if(this.wprenotazione.token !== this.prenotazione.token) {
      this.Message = 'codice di prenotazione non corrisponde  - conferma non consentita';
      this.tokenVerify = false;
      this.esitocodpren = 'ERRATO';
      this.isVisible = true;
      this.alertSuccess = false;
      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    } else {
      this.tokenVerify = true;
      this.esitocodpren = 'VERIFICATO';
      this.Message = 'codice di prenotazione verificato  - Premi conferma per completare operatività';
      this.isVisible = true;
      this.alertSuccess = true;
    }
  }

  async creaPrenotazione(prenotazione: Prenotazione) {

    let rc = await  this.prenotazioneService.create(prenotazione).subscribe(
      response => {
             if(response['rc'] === 'ok') {
              // creata prenotazione  necessario a backoffice di bandiera gialla per emettere biglietto
              // invio email ad ogni utente registrato
              this.inviaemaildiConferma(prenotazione);
            }
      },
      error => {
          alert('confermaeventoPosto: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore confermaeventoPosto' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });
  }


  async inviaemaildiConferma(prenotazione: Prenotazione) {

    let rc = await  this.prenotazioneService.sendemailPrenotazioneConfermata(prenotazione).subscribe(
      response => {
             if(response['rc'] === 'ok') {
              // inviata email ad ogni partecipante serata sanfra

            }
      },
      error => {
          alert('confermaeventoPosto: ' + error.message);
          this.isVisible = true;
          this.alertSuccess = false;
          this.type = 'error';
          this.Message = 'Errore confermaeventoPosto' + '\n' + error.message;
          this.showNotification(this.type, this.Message);
          console.log(error);
      });

  }


  async conferma(prenotazione: Prenotazione) {

    // confermo la prenotazione impostando lo stato = 1 e cambio il token nel caso aprissro la mail
    // dopo la conferma. In tal caso la prenotazione con il token originario non esiste più

    this.prenotazione.idstato = 1;
    this.prenotazione.token = (Math.random() + 1).toString(36).substring(2,7);
   let rc = await  this.prenotazioneService.update(prenotazione).subscribe(
    response => {
           if(response['rc'] === 'ok') {
            this. confermataPrenotazione = true;
            // confermata prenotazione. ora posso effettuare la commanda
            // invio email ad ogni utente registrato
            this.inviaemaildiConferma(prenotazione);
          }
    },
    error => {
        alert('confermaeventoPosto: ' + error.message);
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = 'Errore confermaeventoPosto' + '\n' + error.message;
        this.showNotification(this.type, this.Message);
        console.log(error);
    });






    /*
    this.emailsend = false;
    // eseguo controllo sui campi inseriti
    if(this.wprenotazeventomasterConfirm.codpren !== this.prenotazeventomasterConfirm.codpren) {
      this.Message = 'codice di conferma prenotazione non corrisponde  - conferma non consentita';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }
*/


   }

  handleError(error) {
    this.error = error.error.errors;
  }


  showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }


  deletePreneventmasterConfirmed(token: string) {

    alert('delete da fare')

    /*
    let rc =  this.prenotazeventomasterConfirmService.deletebytoken(token).subscribe(
      resp => {
         if(resp['rc'] === 'ok') {
          this.isVisible = true;
          this.alertSuccess = true;
          this.type = 'success';
          this.Message = 'Prenotazioni evento confermati con successo';
          this.showNotification(this.type, this.Message);
          this.visibleConferma = false;
          this.registratoevento = true;
         }
      },
      error => {
            console.log('error in deletePreneventmasterConfirmed: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'erore in cancellazione master ' + error.message;
            this.showNotification(this.type, this.Message);
          });
          */
  }

  previewCancella(evposto: Prenotazione, content: any) {

alert('previewCancella  --- da fare')

    localStorage.removeItem('delPosto_Cognome');
    localStorage.removeItem('delPosto_Nome');

    localStorage.setItem('delPosto_Cognome', evposto.cognome);
    localStorage.setItem('delPosto_Nome', evposto.nome);

    this.delCognome = localStorage.getItem('delPosto_Cognome');
    this.delNome = localStorage.getItem('delPosto_Nome');
    this.open(content, evposto);
  }




  open(content: any, evposto: Prenotazione) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
      if(result ===  'Cancel click') {
        alert('cancellazione abbandonata dall Utrente');
        // this.cancellazioneAbort();
      }
      if(result ===  'Delete click') {
        alert('eseguire la cancellazione utente');
        this.cancellaPrenotazione(evposto);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
   //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
      this.cancellazioneAbort();
    });

  }

  openMaster(contentMaster: any) {
    this.modalService.open(contentMaster, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
      if(result ===  'Cancel Global click') {
        alert('cancellazione abbandonata dall Utrente');
        // this.cancellazioneAbort();
      }
      if(result ===  'Delete Global click') {
        alert('eseguire  stato eventoposto = 0');
        alert(' cancellazioneeeeeeeeeeeeeeeee  da fare')
       // this.loadEventoPostibyannulloPrenot(this.token);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
   //   alert('controllo la modalità di chiusura della popup ------------------ chiusura su tasto close: ' + reason);
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
    this.isVisible = true;
    this.alertSuccess = false;
    this.showNotification(this.type, this.Message);
  }

  cancellaPrenotazione(evposto: Prenotazione) {

    console.log('cancellaPrenotazione: ' + JSON.stringify(evposto));

    alert('cancellazione prenotazione da fare')

/*

   // alert('sono a cancellaPrenotazione');
   // return;
    let tokenactual = evposto.token;
    evposto.stato = 0;  // rendo nuovamente disponibile il posto
    evposto.cognome = '';
    evposto.token = '';
    evposto.nome = '';
    evposto.cellulare = '';
    evposto.email = '';
    evposto.tipobiglietto = 0;

    this.eventopostoService.update(evposto).subscribe(
        response => {
          if(response['rc'] === 'ok') {
            this.isVisible = true;
            this.alertSuccess = true;
            this.type = 'success';
            this.Message = 'Prenotazione cancellata correttamente';
            this.showNotification(this.type, this.Message);
           }
      },
      error =>
          {
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore cancellazione Prenotazione' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
          });
          */
  }


}
