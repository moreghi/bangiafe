import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { ManifestazioneService } from '../../../services/manifestazione.service';
import { GiornataService } from '../../../services/giornata.service';
import { PrenotazioneService } from '../../../services/prenotazione.service';

// classi
import { Manifestazione} from '../../../classes/Manifestazione';
import { Giornata} from '../../../classes/Giornata';
import { Prenotazione} from '../../../classes/Prenotazione';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prenotazioni1',
  templateUrl: './prenotazioni1.component.html',
  styleUrls: ['./prenotazioni1.component.css']
})
export class  Prenotazioni1Component implements OnInit {

  public isVisible = false;
  public alertSuccess = false;


  public manifestazione: Manifestazione;
  public giornata: Giornata;
  public prenotazioni: Prenotazione[] = [];

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


  public title = "elenco Prenotazioni ";
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;
  public idPassed = 0;

 options = [
    'Tutte',
    'Da Confermare',
    'Confermate'
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
            private giornataService: GiornataService,
            private prenotazioneService: PrenotazioneService,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {

            this.route.paramMap.subscribe(p => {
              this.idPassed = +p.get('id');
              console.log('id recuperato: ' + this.idPassed);
              // -------  leggo i dati della giornata
              this.loadGiornata(this.idPassed);
            });
            this.loadPrenotazioni(this.idPassed);
            this.title = 'Situazione Prenotazioni';
            this.Message = 'Situazione Attuale Prenotazioni';
            this.isVisible = true;
            this.alertSuccess = true;
           }

           async loadGiornata(id: number) {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.giornataService.getbyId(id).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.giornata = res['data'];
                    console.log('giornata: --------------------' + JSON.stringify(this.giornata))
                    this.loadManifestazione(this.giornata.idManifestazione);
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessuna giornata presente';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadGiornata - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }

         async loadManifestazione(id: number) {

            let rc =  await  this.manifService.getbyid(id).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.manifestazione = res['data'];
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessuna Maninestazione presente';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadManifestazione - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }

          async loadPrenotazioni(id: number) {

            let rc =  await  this.prenotazioneService.getAllbyday(id).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.prenotazioni = res['data'];
                    console.log('loadPrenotazioni: ' + JSON.stringify(this.prenotazioni))
                    this.nRec = res['number'];
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessuna Prenotazione presente';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadPrenotazioni - errore: ' + error.message);
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


  onSelectionChange(tipo: string)   {

    this.tipoRichiesta = tipo;  //tifedel.substring(0,1);
    this.validSearch = true;

    if(this.tipoRichiesta === '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione del tipo Prenotazione ,\n ricerca non possibile');
        return;
      }

    switch (this.tipoRichiesta) {
                case 'Tutte':
                this.loadPrenotazioni(this.giornata.id);
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                break;
                case 'Da Confermare':
                  this.stato = 0;
                  this.loadbyStato(this.giornata.id, this.stato);
                  break;
                case 'Confermate':
                  this.stato = 1;
              //  alert(' devo attivare rotta con n.ro messa e tipo fedeli');
                  this.loadbyStato(this.giornata.id, this.stato);
                  break;
                default:
                alert('Scelta errata \n ricerca non possibile');
                break;
       }
    }


    async loadbyStato(id: number, stato: number) {


      this.nRec = 0;
      this.isVisible = true;
      let rc = await  this.prenotazioneService.getAllbystato(id, stato).subscribe(
           res => {
                this.prenotazioni = res['data'];
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
             alert('loadbyStato - errore: ' + error.message);
             console.log(error);
             this.Message = error.message;
             this.alertSuccess = false;
          });
    }

}


