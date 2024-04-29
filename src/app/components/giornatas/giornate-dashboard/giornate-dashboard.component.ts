import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { GiornataService } from '../../../services/giornata.service';
import { SanfraService } from '../../../services/sanfra.service';
import { ManifestazioneService } from '../../../services/manifestazione.service';

// classi
import { Giornata} from '../../../classes/Giornata';
import { Sanfra} from '../../../classes/Sanfra';
import { Manifestazione} from '../../../classes/Manifestazione';

// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-giornate-dashboard',
  templateUrl: './giornate-dashboard.component.html',
  styleUrls: ['./giornate-dashboard.component.css']
})
export class GiornateDashboardComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public giornate: Giornata[] = [];
  public giornata: Giornata;
  public sanfra: Sanfra;
  public manif: Manifestazione;

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


  public title = "elenco Giornate Prenotabili";
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;
  public idSanfra = 0;

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

  public dataGiorno: any;
  public dataOdierna = '';
  public anno  = 0;

constructor(private giornataService: GiornataService,
            private sanfraService: SanfraService,
            private router: Router,
            private manifestazioneService: ManifestazioneService,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {

            const date = Date();
            this.dataGiorno = new Date();

            this.anno  = this.dataGiorno.getFullYear();

            this.loadSanfra();
            this.loadManifestazione(this.anno)

           }

           async loadSanfra() {

            this.nRec = 0;
            this.isVisible = true;
            this.idSanfra = 1;
            let rc =  await  this.sanfraService.getbyId(this.idSanfra).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.sanfra = res['data'];
                    this.nRec = res['number'];
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessuna associazione prenotasbil';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadSanfra - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }

          async loadManifestazione(anno: number) {

            this.isVisible = true;
            let rc =  await  this.manifestazioneService.getbyAnno(anno).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.manif = res['data'];

                    this.loadGiornate(this.manif.id);
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessun Sanfra in festa èrevisto per anno in corso';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadSanfra - errore: ' + error.message);
                   console.log(error);
                   this.Message = error.message;
                   this.alertSuccess = false;
                });
          }


          async loadGiornate(id: number) {

            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.giornataService.getGiornateforManif(id).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.giornate = res['data'];
                    this.nRec = res['number'];
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessuna Giornata prevista';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadGiornate - errore: ' + error.message);
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

  serataSelect(id: number) {
    // alert('passato prenotazione per la giornata:' + id)
    this.router.navigate(['requestConfirmPrenotazione/' + id]);
  }

  prenotazioniSelect(id: number) {
  //  alert('passato prenotazione per la gvisualizzare il dettaglio delle prenotazioni di giornata:' + id)
    this.router.navigate(['PrenotazionidelGiorno/' + id]);

  }




}

