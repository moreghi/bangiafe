import { Component, OnInit } from '@angular/core';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// service
import { VolontarioService } from '../../../services/volontario.service';
// classi
import { Volontario} from '../../../classes/Volontario';
// per gestire la notifica esito
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-volontari',
  templateUrl: './volontari.component.html',
  styleUrls: ['./volontari.component.css']
})
export class VolontariComponent implements OnInit {

  public isVisible = false;
  public alertSuccess = false;

  public volontari: Volontario[] = [];
  public volontario: Volontario;

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


  public title = "elenco Volontari";
  public nRec = 0;
  // icone
  faPlusSquare = faPlusSquare;
  faSearch = faSearch;

  public tipoRichiesta = '?';
  public validSearch = false;
  public stato = 0;

 options = [
    'Tutti',
    'Non Attivi'
  ];

  public searchText = '';
  // per paginazone
  p = 1;

  public rotta = '';
  public level = 0;
  public enabledFunc = false;
  public ruoloSearch = 0;
  public testRuoloday = 0;     // test per simulare il ruolo web utente

constructor(private volontarioService: VolontarioService,
            private router: Router,
            private route: ActivatedRoute,
            private modal: NgbModal,
            private notifier: NotifierService) {
              this.notifier = notifier;
            }

           ngOnInit(): void {

              this.loadVolontari();

           }

          async loadVolontari() {

            //alert('Manifestazioni   -- loadManifestazioni :  inizio ');
            this.nRec = 0;
            this.isVisible = true;
            let rc =  await  this.volontarioService.getAll().subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.volontari = res['data'];
                    this.nRec = res['number'];
                    this.Message = 'Situazione Attuale';
                    this.alertSuccess = true;
                  }
                  if(res['rc'] === 'nf') {
                    this.nRec = 0;
                    this.Message = 'Nessun Volontario presente';
                    this.alertSuccess = true;
                  }
                },
                error => {
                   alert('loadVolontari - errore: ' + error.message);
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
    this.router.navigate(['volontario/new']);
  }

  onSelectionChange(tipo: string)   {

    this.tipoRichiesta = tipo;  //tifedel.substring(0,1);
    this.validSearch = true;

    if(this.tipoRichiesta === '?') {
        this.validSearch = false;
        alert('effettuare prima la selezione dello stato ,\n ricerca non possibile');
        return;
      }

    switch (this.tipoRichiesta) {
                case 'Tutti':
                this.loadVolontari();
             //   this.router.navigate(['getpersoneforMessa', this.messa.id]);
                break;
                case 'Non Attivi':
                  this.stato = 99;
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
      let rc = await  this.volontarioService.getbystato(stato).subscribe(
           res => {
                this.volontari = res['data'];
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

