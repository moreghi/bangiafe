import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Service
import { EventoService } from './../../../services/evento.service';
// Model
import { Evento } from '../../../classes/Evento';
// icone
import { faPlusSquare, faSearch, faInfoCircle, faUserEdit, faSave, faPlus, faTrash, faReply, faMinus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
// varie
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-eventonotepop',
  templateUrl: './eventonotepop.component.html',
  styleUrls: ['./eventonotepop.component.css']
})
export class EventonotepopComponent implements OnInit {

  public evento: Evento;

  public title = "Gestione Note Evento";

  // icone
   faPlusSquare = faPlusSquare;
   faSearch = faSearch;
   faSave = faSave;
   faUserEdit = faUserEdit;
   faMinus = faMinus;
   faPlus = faPlus;
   faWindowClose = faWindowClose;
   faInfoCircle = faInfoCircle;
   faTrash = faTrash;
   faReply = faReply;

   // variabili per editazione messaggio
   public alertSuccess = false;
   public savechange = false;
   public isVisible = false;

   public nRecMan = 0;
   public nRec = 0;
   public trovatoRec = false;
   public Message = '';
   public type = '';
   public isSelected = false;

   public saveValueStd: boolean;

   public nRecRuoloSearch = 0;
   public selectedCorrect = false;
   public selectedUser: Evento;
   public editForm: FormGroup;
   public isLoading = false;
   public fase = '';
   public pathimage = '';
   public test_note = '';

   constructor(public modal: NgbActiveModal,
               private eventoService: EventoService,
               private router: Router,
               private formBuilder: FormBuilder,
               private modalService: BsModalService,
               private notifier: NotifierService) {
                  this.notifier = notifier;
              }


              ngOnInit(): void {

                // alert('sono in oninit - title: ' + this.title);
                 console.log('Eventopop -----------------------------     dati passati da chiamante: ' + this.selectedUser.id );
               //  alert('sono in oninit - title ...................................................... : ' + this.title);
                 this.evento = this.selectedUser;   // salvo la località ricevuta.
                 this.pathimage = environment.APIURL + '/upload/files/eventos/evento/' + this.evento.photo;




                 console.log('Eventopop ------ selectUser ---------     dati ricevuti da chiamante: ' + JSON.stringify(this.selectedUser) );


                 // alert('popup - OnInit');
                 if (this.selectedUser.id === 0) {
                    this.title = 'Inserimento Evento';
                //    alert('trovato record nuovo per inserimento');
                    this.fase = 'I';
                   } else {
                    this.title = 'Gestione Note Evento';
                    this.fase = 'M';
                  }

                 this.saveValueStd = false;
                 this.isLoading = false;
                  //  console.log('popup-oninit - giornata.id' + this.giornata.id + ' manif - ' + this.giornata.idManifestazione + ' statoGiornata ' + this.giornata.stato);
                 this.setForm();

                 this.alertSuccess = true;
                 this.isVisible = true;
                 this.Message = 'Situazione attuale Note evento';


               }

               get editFormData() {
                 return this.editForm.controls;
               }

              //  versione in cui gestisc solo la tabella
              private setForm() {

                console.log(this.selectedUser);
               // carico le combo
               // this.loadLogistica(this.selectedUser.id);   non serve

               /*
                this.editForm = this.formBuilder.group({
                    id: [this.selectedUser.id],
                    localita: [this.selectedUser.localita, Validators.required],
                    luogo: [this.selectedUser.luogo, Validators.required],
                    photo: [this.pathimage]
                    });
*/

                this.editForm = this.formBuilder.group({
                    id: [this.selectedUser.id],
                    notaev: [this.selectedUser.notaev, Validators.required]
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
  }

  closeModal(modalId?: number){

    alert('idModal: ' + modalId);
    if(modalId === 2) {
    alert('premuto Annulla su modalDelete')
    }
    if(modalId === 1) {
    alert('premuto Conferma dalla prima modal- opero la cncellazione e chiudo le form')
    this.modalService.hide();
    }
    alert('chiuso la seconda modal');
    this.modalService.hide(modalId);
}

onSubmit() {

this.evento.notaev = this.editForm.get('notaev').value;
alert('testo delle note con ' + this.evento.notaev.length + ' caratteri')
if(this.evento.notaev.length > 256) {
  this.type = 'error';
  this.Message = "Note troppo lunghe - massimo 256 caratteri";
  this.showNotification(this.type, this.Message);
  return;
}





 // console.log('onSubmit -- prima diaggiornare le note: ' + JSON.stringify(this.evento));

 // this.test_note = this.editForm.get('notaev').value          // t
 // console.log('onSubmit -------------------------- pronto per aggiornare le note  ' + this.test_note)
  this.evento.notaev = this.editForm.get('notaev').value;

 // console.log('onSubmit -- aggiornato le note: ' + JSON.stringify(this.evento));
 // return;
  this.aggiornaNote(this.evento);



  //   this.modal.dismiss('Cross click');
  this.modal.close('yes')
  }


  async aggiornaNote(evento: Evento) {
    let rc = await this.eventoService.update(evento).subscribe(
      resp => {
            console.log('loadLocandina: ' + JSON.stringify(resp['data']));
            if(resp['rc'] === 'ok') {

            }
          },
      error => {
               alert('sono in loadLocandin');
               console.log('loadLocandin - errore: ' + error);
               this.type = 'error';
               this.Message = error.message;
               this.showNotification(this.type, this.Message);
           });
     }






}
