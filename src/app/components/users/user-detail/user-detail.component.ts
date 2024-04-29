// tabelle e service commentati per creazione modello  -- logica corretta  -- mettere tabelle corrette




import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// ------------------------------------------------------------------------------  class
import { User } from '../../../classes/User';
// import { Truolo } from '../../../classes/T_ruolo';
import { TstatoUtente } from '../../../classes/T_stato_utente';
import { Userlevel } from '../../../classes/UserLevel';
// ------------------------------------------------------------------------------  service
import { UserService } from './../../../services/user.service';
import { UploadFilesService } from './../../../services/upload-files.service';
import { UserlevelService } from './../../../services/userlevel.service';
// service da fare
// import { TruoloService } from './../../../services/truolo.service';
// import { TstatoutenteService  } from './../../../services/tstatoutente.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { faPlusSquare, faSearch, faSave, faUserEdit, faMinus, faPlus, faWindowClose, faTrash, faTimes, faReply } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
// seconda soluzione con popup component
// import { UploadpopComponent } from './../../../components/popups/uploadpop/uploadpop.component';
import { environment } from '../../../../environments/environment';

// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
// per upload image
selectedFiles?: FileList;
currentFile?: File;
progress = 0;
message = '';
fileInfos?: Observable<any>;
messageupload = '';

public IMGURL = environment.IMGURL;

public users: User[] = [];
public user: User;
public userlevels: Userlevel[] = [];

// public ruoli: Truolo[] = [];
// public ruolo: Truolo;
public stati: TstatoUtente[] = [];
public stato: TstatoUtente;

public title = "Gestione Users new version";

// icone
faPlusSquare = faPlusSquare;
faSearch = faSearch;
faSave = faSave;
faUserEdit = faUserEdit;
faMinus = faMinus;
faPlus = faPlus;
faWindowClose = faWindowClose;
faTrash = faTrash;
faTimes = faTimes;
faReply = faReply;

// variabili per editazione messaggio
public alertSuccess = false;
public savechange = false;
public isVisible = false;

public nRecMan = 0;
public nRec = 0;
public trovatoRec = false;
public Message = '';
public Message1 = '';
public Message2 = '';
public Message3 = '';
public Message1err = 'Contattare il gestore dell applicazione.';

public type = '';
public isSelected = false;

public saveValueStd: boolean;

public nRecRuoloSearch = 0;
public selectedCorrect = false;
public isLoading = false;
public isValid = false;
public fase = '';
public pathImage =  'assets/images/users/';
public displayedImage = '';


public selectedRuoloValue = 0;
public selectedStatoValue = 0;
public selectedRuolowebValue = 0;
public selectedLevelValue = 0;

public href = '';
public idUser = 0;



public functionSelected = '';

public selectedTit = 0;
public selectedRuo = 0;
public selectedweb = 0;
public selectedSta = 0;
public selectedLvl = 0;

closeResult = '';

public testpippo = '';
public confirmPassword = '';
public folderImage = '';   // salvo la cartella in cui salvare immagine

// per gestione abilitazione funzioni con service Moreno

public functionUser = '';
public functionUrl = '';
public rotta = '';
public rottaId = 0;
public level = 0;

public functionInqu =  false;
public functionEdit = false;
public functionEdits = false;
public functionNew = false;

public searchInqu = 'Inqu';
public searchEdit = 'Edit';
public searchEdits = 'Edits';
public searchNew = 'New';

public functionUrlUp = '';
public functionUserUp = '';
public pathimage = '';

 constructor(  private modalService: NgbModal,
               private userService: UserService,
               private userlevelService: UserlevelService,
           //    private ruoloService: TruoloService,
           //    private tstatoutenteService: TstatoutenteService,
               private uploadService: UploadFilesService,
               private router: Router,
               private route: ActivatedRoute,
               private notifier: NotifierService) {
                   this.notifier = notifier;
                }


 ngOnInit(): void {

  // this.Message = 'sono in onInit';
  // this.type = 'error';

   this.functionInqu =  false;
   this.functionEdit = false;
   this.functionEdits = false;
   this.functionNew = false;

   console.log('user-detail - sono in oninit - preparato messaggio ' + this.Message);

   //  this.checkFunctionbylevel();     da eliminare
   this.goApplication();

 }

 goApplication() {
  // parte personalizzata
  this.loadRuoli();
  this.loadStati();
  this.loadlevels();
  this.user = new User();
  this.user.key_utenti_operation = +localStorage.getItem('id');

  this.type = 'success';
  this.showNotification(this.type, this.Message);
}







 loadUser(id: number) {
   this.userService.getuser(id).subscribe(
     resp => {
           console.log('loadUser:    .....              ' + JSON.stringify(['data']));
           this.user = resp['data'];
           this.user.key_utenti_operation = +localStorage.getItem('id');
           this.pathimage = environment.APIURL + '/upload/files/users/' + this.user.photo;
           this.selectedRuo = this.user.idRuolo;
           this.selectedweb = this.user.idruoloweb;
           this.selectedSta = this.user.idStato;
           this.selectedLvl = this.user.idLevel;
           console.log('fatto lettura user: ' + this.user.cognome);
        },
     error => {
          alert('sono in loadUser');
          this.isVisible = true;
          this.alertSuccess = false;
          console.log(error);
          this.type = 'error';
          this.Message = 'Errore loadUser' + '\n' + error.message;
          this.showNotification(this.type, this.Message);

        });
   }

 loadRuoli() {
   console.log('loadRuoli-----  ');

//  metodo commentato per la creazione modello  -- corretto

/*
   this.ruoloService.getRuoli().subscribe(
     res => {
           this.ruoli = res['data'];
        },
       error => {
          alert('user-detail  -- loadRuoli - errore: ' + error.message);
          console.log(error);
          this.Message = error.message;
          this.alertSuccess = false;
       });
       */
   }


 loadStati() {
  //  metodo commentato per la creazione modello  -- corretto

/*
   this.tstatoutenteService.getAll().subscribe(
     res => {
           this.stati = res['data'];
        },
       error => {
          alert('user-detail  -- loadStatiUtente - errore: ' + error.message);
          console.log(error);
          this.Message = error.message;
          this.alertSuccess = false;
       });
       */
 }

 loadlevels() {
  console.log('loadRuoli-----  ');
  this.userlevelService.getAlls().subscribe(
    res => {
          this.userlevels = res['data'];
       },
      error => {
         alert('loadLevels - errore: ' + error.message);
         console.log(error);
         this.Message = error.message;
         this.alertSuccess = false;
      });
  }


 selectedRuolo(selectedValue: number) {
   // alert('selezionato: ' + selectedValue);
   if(selectedValue ===  0) {
     this.type = 'error';
     this.Message = 'selezione non corrette';
     this.showNotification(this.type, this.Message);
     this.alertSuccess = false;
     this.isVisible = true;
     return;
    } else {
     this.selectedRuoloValue = selectedValue;
    }
 }

  selectedStato(selectedValue: number) {
     //  alert('selezionato: ' + selectedValue);
       if(selectedValue ===  0) {
         this.type = 'error';
         this.Message = 'selezione non corrette';
         this.showNotification(this.type, this.Message);
         this.alertSuccess = false;
         this.isVisible = true;
         return;
      } else {
       this.selectedStatoValue = selectedValue;
      }
  }


  selectedLevel(selectedValue: number) {
    // alert('selezionato: ' + selectedValue);
    if(selectedValue ===  0) {
      this.type = 'error';
      this.Message = 'selezione non corrette';
      this.showNotification(this.type, this.Message);
      this.alertSuccess = false;
      this.isVisible = true;
      return;
     } else {
      this.selectedLevelValue = selectedValue;
     }
  }

 async conferma() {
   console.log('conferma - fase: ' + this.fase);
   console.log('conferma - photo: ----------------------------------------------------------  ' + this.user.photo);
   switch (this.fase)  {
       case 'N':
         let rc = await  this.userService.createUser(this.user).subscribe(
         res => {
               this.user = res['data'];
               this.type = 'success';
               this.Message =  res['message'];                               //'utente  creato con successo';
               this.alertSuccess = true;
            },
           error => {
              console.log(error);
              this.type = 'error';
              this.Message = error.message;
              this.alertSuccess = false;
           });
         break;
     case 'M':
         let rc1 = this.userService.updateUser(this.user, this.user.id).subscribe(
         res => {
               this.user = res['data'];
               this.type = 'success';
               this.Message = res['message'];          //'utente aggiornato con successo del cazzo';
               this.alertSuccess = true;
               this.router.navigate(['/users']);
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
       this.user = new User();
       this.type = 'success';
       this.Message = 'Inserire i dati Utente';
       this.alertSuccess = true;
       break;
     case 'M':
       this.userService.getuser(this.user.id).subscribe(
       res => {
             this.user = res['data'];
             this.type = 'success';
             this.Message = 'situazione attuale utente';
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
   this.router.navigate(['users']);
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
       this.cancellaUser(this.user);
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


 cancellaUser(user: User) {

   this.userService.deleteuser(user.id).subscribe(
       response => {
         if(response['ok']) {
           this.isVisible = true;
           this.alertSuccess = true;
           this.type = 'success';
           this.Message = 'User cancellato correttamente';
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


 // --------------   metodi per upload

 selectFile(event: any): void {
   this.selectedFiles = event.target.files;
   console.log('selectfile - nome file: ' + JSON.stringify(this.selectedFiles));
 }

 upload(): void {
   this.progress = 0;

   if (this.selectedFiles) {
     const file: File | null = this.selectedFiles.item(0);
     console.log('.............................................. upload - file pronto per upload in backend: ' + file.name);


     if (file) {
       this.user.photo = file.name;   // salvo su record il nome del file selezionato
       this.folderImage = 'users';    // imposto la cartella in cui passare
       this.currentFile = file;

       this.uploadService.upload(this.currentFile, this.folderImage).subscribe(
         (event: any) => {
           if (event.type === HttpEventType.UploadProgress) {
             this.progress = Math.round(100 * event.loaded / event.total);
           } else if (event instanceof HttpResponse) {
             this.message = event.body.message;
             this.fileInfos = this.uploadService.getFiles();
           }
         },
         (err: any) => {
           console.log(err);
           this.progress = 0;

           if (err.error && err.error.message) {
             this.message = err.error.message;
           } else {
             this.message = 'Could not upload the file!';
           }

           this.currentFile = undefined;
         });
     }

     this.selectedFiles = undefined;
   }
 }





/*

 checkFunctionbylevel() {
   //  ----- parte comune a tutti i moduli
  this.rotta = this.route.snapshot.url[0].path;
  this.level = parseInt(localStorage.getItem('user_ruolo'));
  this.functionUrl = this.route.snapshot.url[1].path;

  if(this.route.snapshot.url[1].path !== 'new') {
    this.rottaId =  parseInt(this.route.snapshot.url[2].path);
   } else {
    this.rottaId =  0;
   }


 // console.log('frontend - checkFunctionbylevel -- step_01');

  this.ctrfuncService.checkFunctionbylevelDetail(this.rotta, this.level, this.functionUrl).subscribe(
    response =>{

     // console.log('frontend - checkFunctionbylevel -- step_02 ' + response['rc']);

      if(response['rc'] === 'ko') {
        this.isVisible = true;
        this.alertSuccess = false;
        this.type = 'error';
        this.Message = response['message'];
        this.showNotification(this.type, this.Message);
        return;
      }
      if(response['rc'] === 'ok') {
        this.functionUser = response['data'];
//  ----- fine parte comune a tutti i moduli



  //  parte personalizzabile
     //   console.log('frontend - checkFunctionbylevelDetail - funzione determinata: ' + this.functionUser);
     //   console.log('messaggio: ' + response['message']);
        this.loadRuoli();
        this.loadStati();
        this.loadRuoliweb();


        this.functionInqu =  false;
        this.functionEdit = false;
        this.functionEdits = false;
        this.functionNew = false;

        if(this.level === -1) {
         if(this.functionUser === this.searchEdit) {
           this.functionEdit = true;
         }
         if(this.functionUser === this.searchEdits) {
           this.functionEdits = true;
         }
         if(this.functionUser === this.searchNew) {
           this.functionNew = true;
         }
        } else {
         if(this.functionUser === this.searchInqu) {
           this.functionInqu = true;
         }
        }

        this.isVisible = true;
        this.alertSuccess = true;

        if(this.functionNew) {
          this.user = new User();
          this.user.key_utenti_operation = +localStorage.getItem('id');
          this.title = 'Inserimento User';    // funziona non gestita in questa fase - gli inserimenti si fanno con registra
          this.fase = 'N';
          this.Message = `Inserire i dati dell' utente`;
        } else {
            this.route.paramMap.subscribe(p => {
              this.idUser = +p.get('id');
              console.log('id recuperato: ' + this.idUser);
              // -------  leggo i dati della giornata
              this.loadUser(this.idUser);
              if(this.functionEdit || this.functionEdits) {
                this.title = 'Aggiornamento User';
                this.fase = 'M';
               } else {
                this.title = 'Visualizzazione User';
                this.fase = 'I';
               }
              this.Message = 'Situazione Attuale utente';
           });

            //  fine parte personalizzabile
      }
        this.type = 'success';
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


*/


}





