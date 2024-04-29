import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { ManifestazioneService } from '../../../services/manifestazione.service';
// classi
import { Manifestazione} from '../../../classes/Manifestazione';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manifestazioni',
  templateUrl: './manifestazioni.component.html',
  styleUrls: ['./manifestazioni.component.css']
})
export class ManifestazioniComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public manifestazioni: Manifestazione[] = [];
  public manifestazione: Manifestazione;

 /*    legenda typo messaggio esito

  this.type = 'error';    --- operazione in errore
  this.type = 'success';  --- operazione conclusa correttamente
  this.type = 'default';
  this.type = 'info';
  this.type = 'warning';
*/

 // variabili per gestione inqu/edit/new

 public href = '';

// variabili per notifica esito operazione con Notifier
public type = '';
public Message = '';


  errormsg: any;


  public title = "Elenco Manifestazioni";
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

 options = [
    'Tutte',
    'Aperte',
    'Prenotabili',
    'Chiuse'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private manifService: ManifestazioneService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {
             // this.checkFunctionbylevel();


//    originaria fino a 05/01/2022
    //  -- introduco controllo per determinare  la funzione dell'utente


            this.href = this.router.url;
            console.log('href: ..................................  ' + this.href);
            console.log('route - 1 ' + this.route.snapshot.url[0].path);


            // attenzione
            // su navbar dopo login imposto la localstorage
            // in funzione del valore della user_ruolo effettuo la valorizzazione
            // della visibilità del campo


            this.loadManifestazioni();
           }

          async loadManifestazioni() {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.manifService.getAll().subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.manifestazioni = res['data'];
                    this.nRec = res['number'];
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessuna Maninestazione presente';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('Manifestazioni  -- loadManifestazioni - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
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


  Nuovo() {
    this.router.navigate(['manif/new']);
  }

  onSelectionChange(tipo: string)   {

    this.tipoRichiesta = tipo;  //tifedel.substring(0,1);
    this.validSearch = true;

    if(this.tipoRichiesta === '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione del ruolo ,\n ricerca non possibile');
        return;
      }

    switch (this.tipoRichiesta) {
                case 'Tutte':
                this.loadManifestazioni();
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                break;
                case 'Aperte':
                  this.stato = 2;
                  this.loadbyStato(this.stato);
                  break;
                case 'Prenotabili':
                  this.stato = 1;
              //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                  this.loadbyStato(this.stato);
                  break;
                case 'Chiuse':
                  //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                  this.stato = 3;
                  this.loadbyStato(this.stato);
                  break;
                default:
                alert('Scelta errata \n ricerca non possibile');
                break;
       }
    }


    async loadbyStato(stato: number) {


      this.nRec = 0;
      this.isVisible = true;
      let rc = await  this.manifService.getbyStato(stato).subscribe(
           res => {
                this.manifestazioni = res['data'];
                this.nRec = res['number'];
                this.alertSuccess = true;
                if(res['number'] > 0) {
                  this.Message = 'Situazione Attuale';
                } else {
                  this.nRec = 0;
                  this.Message = res['message'];
                }
          },
          error => {
             alert('Manifestazioni  -- loadManifestazionibyStato - errore: ' + error.message);
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
          });
    }


}

