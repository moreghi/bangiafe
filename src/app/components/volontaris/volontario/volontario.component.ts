import { Component, Input, OnInit } from '@angular/core';
import { VolontarioService} from '../../../services/volontario.service';
import { Volontario} from '../../../classes/Volontario';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tr[app-volontario]',
  templateUrl: './volontario.component.html',
  styleUrls: ['./volontario.component.css']
})
export class VolontarioComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('volontario-data') volontario: Volontario;
   @Input('volontario-prog') i: number;

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
   faChartPie = faChartPie;

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

    // variabili per gestione inqu/edit/new

   public href = '';

   public messagenull = 'Nessun record presente !!!';

   closeResult = '';

// variabili per notifica esito operazione con Notifier
  public type = '';

   constructor(private volontarioService: VolontarioService,
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

     // this.loadManifestazioni();

   }


open(content:any, volontario: Volontario) {
  console.log(`open_content - user ${volontario.cognome}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + volontario.id + ' - ' + volontario.cognome + ' ' + volontario.nome );
   //this.cancellaProdotto(this.prodotto);
   this.delete(volontario);
   this.cancellazioneCompleted(volontario);
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

  cancellazioneCompleted(volontario: Volontario) {
    this.type = 'success';
    this.Message = `cancellazione del Volontario ${volontario.cognome} &nbsp; ${volontario.nome} eseguita con successo `;
    this.showNotification(this.type, this.Message);
  }

  delete(volontario: Volontario) {

    this.volontarioService.delete(volontario).subscribe(
      resp => {
            if(resp['rc'] === 'ok') {
               this.type = 'success';
               this.alertSuccess = true;
               this.Message = 'volontario cancellato correttamente';
               this.showNotification(this.type, this.Message);
             }
      },
      error => {
           alert('sono in delete');
           this.isVisible = true;
           this.alertSuccess = false;
           console.log('delete - errore: ' + error.error);
           this.type = 'error';
           this.Message = error.message;
           this.alertSuccess = false;
           this.showNotification(this.type, this.Message);
         });
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

  modifica(volontario: Volontario) {
        this.route.navigate(['volontario/' + volontario.id]);
      }

}
