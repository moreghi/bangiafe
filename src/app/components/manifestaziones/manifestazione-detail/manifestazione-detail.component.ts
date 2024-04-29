

import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faReply, faTimes } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// Model
import { Manifestazione } from '../../../classes/Manifestazione';
// service
import { ManifestazioneService } from './../../../services/manifestazione.service';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-manifestazione-detail',
  templateUrl: './manifestazione-detail.component.html',
  styleUrls: ['./manifestazione-detail.component.css']
})
export class ManifestazioneDetailComponent implements OnInit {

  manif: Manifestazione;

  public title = "Gestione Manifestazione";

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
  faTimes = faTimes;

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
  public fase = '';


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

  public statoModulo  = '?';
  public ricercaIniziale = '';

  closeResult = '';

  public level = 0;
  public nRecord = 0;
  public enabledFunc = false;
  public rotta = '';
  public rottafase = '';
  public rottaId = 0;
  public rottaFunz = '';


// variabili per editazione messaggio

public Message1 = '';
public Message2 = '';
public Message3 = '';


public isValid = false;
public idManif = 0;
public functionSelected = '';

public selectedTit = 0;
public selectedRuo = 0;
public selectedweb = 0;
public selectedSta = 0;

// per gestione abilitazione funzioni con service Moreno

public functionUrl = '';


public searchInqu = 'Inqu';
public searchEdit = 'Edit';
public searchEdits = 'Edits';
public searchNew = 'New';

public functionUrlUp = '';
public functionUserUp = '';



constructor(public modalService: NgbModal,
            private manifestazioneService: ManifestazioneService,
            private route: ActivatedRoute,
            private router: Router,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

            ngOnInit(): void {
               this.goApplication();
            }

            goApplication() {

             this.isVisible = true;
             this.alertSuccess = true;

             this.rotta = this.route.snapshot.url[0].path;
             this.rottafase = this.route.snapshot.url[1].path;
       //      this.idManif = +this.route.snapshot.url[2].path;

             console.log('manifestazione-detail - rotta: ' + this.rotta);
             console.log('manifestazione-detail - rottafase: ' + this.rottafase);



             if(this.rottafase === 'new') {
              this.manif = new Manifestazione();
              this.manif.key_utenti_operation = +localStorage.getItem('id');
              this.title = 'Inserimento Manifestazione';
              this.fase = 'N';
              this.Message = `Inserire i dati della manifestazione`;
            } else {
                this.route.paramMap.subscribe(p => {
                  this.idManif = +p.get('id');
                  console.log('id recuperato: ' + this.idManif);
                  // -------  leggo i dati della giornata
                  this.loadManif(this.idManif);
                  this.title = 'Aggiornamento Manifestazione';
                  this.fase = 'M';
                  this.Message = 'Situazione Attuale Manifestazione';
               });
           }
           this.type = 'success';
           this.showNotification(this.type, this.Message);
        }

        loadManif(id: number) {
              console.log(`loadManif - appena entrato`);
              this.manifestazioneService.getbyid(id).subscribe(
               resp => {
                     if(resp['rc'] === 'ok') {
                      this.manif = resp['data'];
                      this.manif.key_utenti_operation = +localStorage.getItem('id');
                      if(this.manif.stampeBackOffice === 'S') {
                        this.statoStampa = "Impostazione ATTIVA";
                      }
                      if(this.manif.stampeBackOffice === 'N') {
                       this.statoStampa = "Impostazione Disattiva";
                     }
                      console.log('fatto lettura manif: ' + this.manif.id);
                      this.type = 'success';
                      this.Message = 'situazione attuale Manifestazione';
                      this.alertSuccess = true;
                     }
                     if(resp['rc'] === 'nf') {
                        this.type = 'error';
                        this.Message = 'Manifestazione inesistente';
                        this.alertSuccess = false;
                     }
               },
               error => {
                    alert('sono in loadManif');
                    this.isVisible = true;
                    this.alertSuccess = false;
                    console.log('loadManif - errore: ' + error);
                    this.type = 'error';
                    this.Message = error.message;
                    this.alertSuccess = false;

                  });
         }

 async conferma() {
   console.log('conferma - fase: ' + this.fase);

   this.manif.anno = new Date().getFullYear();
   this.manif.key_utenti_operation = +localStorage.getItem('id');
   switch (this.fase)  {
       case 'N':
        let rc =  await  this.manifestazioneService.create(this.manif).subscribe(
         res => {
               this.manif = res['data'];
               this.type = 'success';
               this.Message =  res['message'];
               this.alertSuccess = true;
               this.router.navigate(['/manif']);
            },
           error => {
              console.log(error);
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
           });
         break;
     case 'M':

     console.log(`Manifestazione-detail -- conferma (upd) : ${JSON.stringify(this.manif)}`);


     let rc1 = this.manifestazioneService.update(this.manif).subscribe(
         res => {
               this.manif = res['data'];
               this.type = 'success';
               this.Message = res['message'];          //'utente aggiornato con successo del cazzo';
               this.alertSuccess = true;
               this.router.navigate(['/manif']);
            },
           error => {
              console.log(error);
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
           });
         break;
     default:
       alert('nav - funzione non ancora attivata');
       break;
   }
   this.showNotification(this.type, this.Message);
 }

 reset() {
   switch (this.fase)  {
       case 'N':
       this.manif = new Manifestazione();
       this.type = 'success';
       this.Message = 'Inserire i dati della Manifestazione';
       this.alertSuccess = true;
       break;
     case 'M':
       this.manifestazioneService.getbyid(this.manif.id).subscribe(
       res => {
             this.manif = res['data'];
             this.type = 'success';
             this.Message = 'situazione attuale Manifestazione';
             this.alertSuccess = true;
          },
         error => {
            console.log(error);
            this.type = 'error';
            this.Message = error.message;
            this.alertSuccess = false;
         });
       break;
     default:
       alert('nav - funzione non ancora attivata');
       break;
   }
   this.showNotification(this.type, this.Message);
 }

 goback() {
   this.router.navigate(['manif']);
 }

/**
 * Show a notification
 *
 * @param {string} type    Notification type
 * @param {string} message Notification message
 */

showNotification( type: string, message: string ): void {
   // alert('sono in showNot - ' + message);
    this.notifier.notify( type, message );
    console.log(`sono in showNotification  ${type}`);
 //   alert('sono in notifier' + message);
  }



  open(content) {
   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     this.closeResult = `Closed with: ${result}`;
     // alert('controllo la modalità di chiusura della popup - chiusura su tasto save: ' + result);
     if(result ===  'Cancel click') {
        this.cancellazioneAbort();
     }
     if(result ===  'Delete click') {
       // gestire uscita da popup
       this.cancellaUser(this.manif);
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
   this.showNotification(this.type, this.Message);
 }


 cancellaUser(manif: Manifestazione) {

   this.manifestazioneService.delete(manif).subscribe(
       response => {
         if(response['ok']) {
           this.isVisible = true;
           this.alertSuccess = true;
           this.type = 'success';
           this.Message = 'Manifestazione cancellata correttamente';
           this.showNotification(this.type, this.Message);
         }
     },
     error =>
         {
           this.isVisible = true;
           this.alertSuccess = false;
           this.type = 'error';
           this.Message = 'Errore cancellazione User' + '\n' + error.message;
           this.showNotification(this.type, this.Message);
           console.log(error);
         });
 }

 changeStampa(e) {

  this.manif.stampeBackOffice = e.target.value;
  if(this.manif.stampeBackOffice === 'S') {
    this.statoStampa = "Impostazione ATTIVA";
  }
  if(this.manif.stampeBackOffice === 'N') {
   this.statoStampa = "Impostazione Disattiva";
  }
}


}
