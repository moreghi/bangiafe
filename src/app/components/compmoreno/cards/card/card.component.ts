
/*
 attenzione:   le righe commenate sono solo per problema di classi e service non attivi
               ricreare l'oggetto card inserendo le tabelle necessarie

*/

import { Component, Input, OnInit } from '@angular/core';
// ----------------   Classe
// import { Evento} from './../../../../classes/Evento';
//import { Prenotazione } from './../../../../classes/Prenotazione';
//import { PrenotazeventomasterConfirm } from './../../../../classes/PrenotazeventomasterConfirm';
//  ---------------------  service
// import { PrenotazioneService } from './../../../../services/prenotazione.service'
// import { PrenotazeventomasterConfirmService} from './../../../../services/prenotazeventomaster-confirm.service';

import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'td[app-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit {

//  @Input('card-data') evento: Evento;

  faSearch = faSearch;

// mettere le tabelle necessarie  (classe e service)

//  public prenotazione: Prenotazione;
//  public prenotazioni: Prenotazione[]=[];
//  public prenotazionieventomasterConfirm: PrenotazeventomasterConfirm[] = [];
//  public prenotazioneMaster:  PrenotazeventomasterConfirm;

  public nprenMasterTot = 0;
  public nprenTot = 0;
  public nprenEvase = 0;
  public nprendaEvadere = 0;

//  public eventon: Evento;
  public eventoHelp = false;
  public disp = 0;
  public eventoNormal = false;
  public eventoSoldout = false;

  // calcolo i giorni alla scadenza evento
  public date = Date();
  public dataOdierna: any;
  public millibyday = 0;
  public datadioggi = '';
  public datagg = '';
  public datamm = '';
  public datayyyy = '';
  public datayyyyMMdd = '';
  public diff = 0;
  public diffNormal = false;
  public diffLow = false;
  public diffSos = false;

  public pathevento = environment.APIURL + '/upload/files/eventos_locandina/';
  public patheventoimage = '';

  constructor(private router: Router,
              private datePipe: DatePipe,
           //   private prenotazioneService: PrenotazioneService
          //    private prenotazeventomasterConfirmService: PrenotazeventomasterConfirmService,
              ) {
             }


      ngOnInit(): void {

        // conteggio dei giorni da oggi alla data evento

        const date = Date();
        this.dataOdierna = new Date(date);
        this.datadioggi =  this.datePipe.transform(this.dataOdierna, 'yyyy-MM-dd');   // data in formato stringa
        // ----------------------------------------   normalizzo la data da gg-mm-aaaa  a  aaaa-mm-gg
      //  this.datagg = this.evento.data.substring(0,2);
      //  this.datamm = this.evento.data.substring(3,5);
      //  this.datayyyy = this.evento.data.substring(6);

        this.datayyyyMMdd = this.datayyyy + '-' + this.datamm + '-' + this.datagg;


        //alert('oggi: ' + this.datadioggi + ' datapren: ' + this.prenotazeventomasterConfirm.datapren  + ' datayyyyMMdd: ' + this.datayyyyMMdd);

        const data1mill = new Date(this.datayyyyMMdd).getTime();
        const data2mill = new Date(this.datadioggi).getTime();

        this.diffNormal = false;
        this.diffLow = false;
        this.diffSos = false;
        this.diff = 0;
        if(data1mill > data2mill) {
          this.diff = data1mill - data2mill;
          this.diff = this.diff / (1000 * 60 * 60 * 24 )
          if(this.diff > 50) {
            this.diffNormal = true;
          }
          if(this.diff < 10) {
            this.diffSos = true;
          }
          if(this.diff < 50  && this.diff >= 10) {
            this.diffLow = true;
          }

        }

      //  this.patheventoimage = this.pathevento + this.evento.photo;

        this.eventoHelp = false;
        this.eventoNormal = false;
        this.eventoSoldout = false;

      //  this.disp = this.evento.nposti - this.evento.npostipren - this.evento.nbiglietti;
        if(this.disp > 10) {
          this.eventoNormal = true;
        }
        if(this.disp <= 0) {
          this.eventoSoldout = true;
        }
        if(this.disp < 10  && this.disp >= 1) {
          this.eventoHelp = true;
        }

      //  this.totalipren(this.evento);
      //   this.eventon = new Evento();
      //   this.eventon.nposti = this.evento.nposti - this.evento.npostipren - this.evento.nbiglietti

     //   this.totaliMasterConfirm(this.evento);



      }

      gestione(id: number) {
        this.router.navigate(['evento/dashboard/' + id]);

      }

      /*
      async totalipren(evento: Evento) {
        console.log('totalipren --- appena entrato ');

        let rc =  await  this.prenotazioneService.getbyevento(evento.id).subscribe(
             res => {
              if(res['rc'] === 'ok') {
                this.prenotazioni = res['data'];
                this.nprenTot = 0;
                this.nprenEvase = 0;
                this.nprendaEvadere = 0;
                for(let prenotazione of this.prenotazioni) {
                    this.nprenTot += 1;
                    if(prenotazione.idstato == 0) {
                      this.nprendaEvadere += 1;
                    }
                    if(prenotazione.idstato == 1) {
                      this.nprenEvase += 1;
                    }
                }
              }
              if(res['rc'] === 'nf') {
                this.nprenTot = 0;
                this.nprenEvase = 0;
                this.nprendaEvadere = 0;
              }
            },
            error => {
               alert('totalipren - errore: ' + error.message);
               console.log(error);

            });
          }



      async totaliMasterConfirm(evento: Evento) {
            console.log('totaliMasterConfirm --- appena entrato ');

            let rc =  await  this.prenotazeventomasterConfirmService.getAllbyEvento(evento.id).subscribe(
                 res => {
                  if(res['rc'] === 'ok') {
                    this.prenotazionieventomasterConfirm = res['data'];
                    this.nprenMasterTot = 0;

                    for(let prenotazioneMaster of this.prenotazionieventomasterConfirm) {
                        this.nprenMasterTot += 1;
                    }
                  }
                  if(res['rc'] === 'nf') {
                    this.nprenMasterTot = 0;
                   }
                },
                error => {
                   alert('totalipren - errore: ' + error.message);
                   console.log(error);

                });
          }
*/

}
