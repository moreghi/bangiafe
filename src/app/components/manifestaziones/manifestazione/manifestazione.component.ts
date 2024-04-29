
// -------------------------

import { Component, Input, OnInit } from '@angular/core';
import { ManifestazioneService} from '../../../services/manifestazione.service';
import { Manifestazione} from '../../../classes/Manifestazione';
import { Router } from '@angular/router';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faInfo,
         faInfoCircle, faList, faChartPie } from '@fortawesome/free-solid-svg-icons';
// popup per avviso cancellazione
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tr[app-manifestazione]',
  templateUrl: './manifestazione.component.html',
  styleUrls: ['./manifestazione.component.css']
})
export class ManifestazioneComponent implements OnInit {

   // variabili passate dal componente padre
   @Input('manif-data') manif: Manifestazione;
   @Input('manif-prog') i: number;




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

   public utenteFedele = false;

    // variabili per gestione inqu/edit/new

   public href = '';
   public functionInqu = false;
   public functionEdit = false;
   public functionNew = false;
   public functionElenco = false;

   public searchInqu = 'show';
   public searchEdit = 'edit';
   public searchNew = 'new';
   public searchElenco = 'read';

   // funzioni di navigazione
   public navigateInqu = 'Inqu';
   public navigateEdit = 'Edit';
   public navigateEdits = 'Edits';
   public navigateNew = 'New';
   public navigateDays = 'Days';
   public navigateGraficoDays = 'GraphDays';

   public messagenull = 'Nessun record presente !!!';

   closeResult = '';

// variabili per notifica esito operazione con Notifier
  public type = '';
  public dataStart: Date;
  public dataEnd: Date;
  public dataStart_str = '';
  public dataEnd_str = '';
  public yyyy: any;
  public mm: any;
  public dd: any;
  public timestamp = 0;
  public dateParts: any;

   constructor(private manifService: ManifestazioneService,
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

      // normalizzazione data start
    //  this.dataStart = new Date(this.manif.dtInizio);


    this.dateParts = this.manif.dtInizio.split("-");

    this.dataStart=  new Date(Date.UTC(this.dateParts[2], this.dateParts[1]-1, this.dateParts[0]));




    console.log('this.dataStart : ' + this.dataStart )


   //   this.dataStart = new Date(this.manif.dtInizio);

      console.log('manifestazione ---1---- dataStart' + JSON.stringify(this.dataStart))


      this.yyyy = this.dataStart.getFullYear();
      this.mm = this.dataStart.getMonth() + 1; // Months start at 0!
      this.dd = this.dataStart.getDate();

      console.log('manifestazione ---2---- yyyy' + JSON.stringify(this.yyyy))
      console.log('manifestazione ---3---- mm' + JSON.stringify(this.mm))
      console.log('manifestazione ---4---- mm' + JSON.stringify(this.dd))


      if (this.dd < 10) this.dd = '0' + this.dd;
      if (this.mm < 10) this.mm = '0' + this.mm;

      this.dataStart_str = this.dd + '/' + this.mm + '/' + this.yyyy;



    // date.ToString("dddd, " + CurrentCultureInfo.DateTimeFormat.ShortDatePattern);


   }

  grafico(manif: Manifestazione) {
let aa = 'manif/grafico/day/' + manif.id;
console.log('path per grafico: ' + aa);
return;
    this.route.navigate(['manif/grafico/day/' + manif.id]);
  }

  viewgiornate(manif: Manifestazione) {
        this.route.navigate(['giornate/' + manif.id]);
    }

      modifica(manif: Manifestazione) {

        console.log('da fare ' );
        return;
            this.route.navigate(['manif/grafico/day/' + manif.id]);
          }



// -------------------------------------------

open(content:any, manif:Manifestazione) {
  console.log(`open_content - user ${manif.descManif}`);
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
  if(result === 'Cancel click') {
  this.cancellazioneAbort();
  }
  if(result === 'Delete click') {
    console.log('fare routine di cancellazione: ' + manif.id + ' - ' + manif.descManif );
   //this.cancellaProdotto(this.prodotto);
   this.delete(manif.id);
   this.cancellazioneCompleted(manif);
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

  cancellazioneCompleted(manif:Manifestazione) {
    this.type = 'success';
    this.Message = `cancellazione della Manifestazione ${manif.descManif}  eseguita con successo `;
    this.showNotification(this.type, this.Message);
  }

  delete(id:any) {
    console.log(id,'cancelllllllllllllllllllllllo --->');
    this.manifService.delete(id).subscribe((res)=> {
      console.log(res,'res- delete -->');

      this.type = 'error';
      this.Message = res['message'];
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



}
