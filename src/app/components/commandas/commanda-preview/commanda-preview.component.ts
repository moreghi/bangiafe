import { Component, OnInit, ViewChild } from '@angular/core';

import { jsPDF } from 'jspdf';
import html2canvas  from 'html2canvas';
// Model
import { Commanda } from '../../../classes/Commanda';
import { Commandariga } from '../../../classes/Commandariga';
import { Giornata } from '../../../classes/Giornata';
import { Cassac } from '../../../classes/cassac';
import { ActivatedRoute, Router } from '@angular/router';
// Services
import { CommandaService } from './../../../services/commanda.service';
import { CommandarigaService } from './../../../services/commandariga.service';
import { GiornataService } from './../../../services/giornata.service';
import { CassacService } from './../../../services/cassac.service';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-commanda-preview',
  templateUrl: './commanda-preview.component.html',
  styleUrls: ['./commanda-preview.component.css']
})
export class CommandaPreviewComponent implements OnInit {

   // per gestire la stampa con jsPdf
   @ViewChild('content') content: any;



  public commanda: Commanda;
  public commandariga: Commandariga;
  public commandarighe: Commandariga[] = [];
  public cassec: Cassac[] = [];
  public cassac: Cassac;
  public giornata: Giornata;

  public keyCommanda = 0;
  public title = 'Sanfra in Festa';
  public cassiere = '';

  public isVisible = true;
  public alertSuccess = false;
  public type = '';
  public Message = '';



  constructor(private router: Router,
              private route: ActivatedRoute,
              private commandaService: CommandaService,
              private commandarigaService: CommandarigaService,
              private giornataService: GiornataService,
              private datePipe: DatePipe,
              private cassacService: CassacService,
              private notifier: NotifierService) {
                this.notifier = notifier;
              }


  ngOnInit(): void {
    this.cassiere = 'Moreno'; //localStorage.getItem('cognome');
    this.route.paramMap.subscribe(p => {
    this.keyCommanda = +p.get('id');
    // -------  leggo i dati della commanda di lavoro
    this.loadCommanda(this.keyCommanda);
     });
  }

  async loadCommanda(id: number) {

    alert('loadCommanda : ' + id);

    await this.commandaService.getbyid(id).subscribe(
      response => {
        this.commanda = response['data'];
        this.loadGiornata(this.commanda.idGiornata);
        this.loadCommandarighe(this.commanda.id);
        this.loadCassac(this.commanda.id);
       },
      error => {
      alert('Print-Layout  --loadCommanda: ' + error.message);
      console.log(error);
      }
    )
  }

  async loadGiornata(id: number) {
   //    alert('loadGiornata - id:' + id);
    await this.giornataService.getbyId(id).subscribe(
    response => {
      this.giornata = response['data'];
       },
    error => {

    alert('Print-Layout  --loadGiornata: ' + error.message);
    console.log(error);
    }
  )
 }


 async loadCommandarighe(id: number) {
   // crea le righe commanda da commandawrighe   con qta > 0
   await this.commandarigaService.getrighebyCommanda(id).subscribe(
     response => {
         if(response['number'] > 0) {            //  response['success']
           this.commandarighe = response['data'];
         }
     },
     error =>
     {
       console.log(error);
     }
   );
 }

 async loadCassac(id: number)  {
  await this.cassacService.getbyidCommanda(id).subscribe(
    response => {
        if(response['number'] > 0) {
          console.log('---------------------------------------------------------  loadCassac: ' + JSON.stringify(response['data']));
          this.cassec = response['data'];
        }
    },
    error =>
    {
      console.log(error);
    }
  );
 }

 /*

per stampare co jpdf


 */


convertToPdf(commanda: Commanda) {
  console.log('convertToPdf  ---  appena entrato ' + JSON.stringify(commanda));
  this.aggiornacommamndabyjspdf(commanda);
}

async aggiornacommamndabyjspdf(commanda: Commanda) {

        commanda.stampaEseguita = 'S';
        let rc = await  this.commandaService.update(commanda).subscribe(
        response => {
            if(response['rc'] === 'ok') {
              this.eseguiStampa();
             }
        },
        error => {
            alert('loadFila: ' + error.message);
            this.isVisible = true;
            this.alertSuccess = false;
            this.type = 'error';
            this.Message = 'Errore loadtipoBiglietto' + '\n' + error.message;
            this.showNotification(this.type, this.Message);
            console.log(error);
        });
      }


eseguiStampa() {

        var data = document.getElementById('contentToConvert');

        console.log('form da stampare -- ' + JSON.stringify(data));


        html2canvas(data).then(canvas => {
        // Few necessary setting options
              var imgWidth = 208;
              var pageHeight = 295;
              var imgHeight = canvas.height * imgWidth / canvas.width;
              var heightLeft = imgHeight;

              const contentDataURL = canvas.toDataURL('image/png')
              let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
              var position = 0;
              pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)

              let namedocPdf = 'commanda_' + this.commanda.id + '.pdf';
              pdf.save(namedocPdf); // Generated PDF  personalizzato

           //   pdf.save('commanda.pdf'); // Generated PDF  standard
          //    this.router.navigateByUrl('/evento/' + this.evento.id + '/tipobiglietti');
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
                  console.log(`sono in showNotification  ${type}`);

                  }



}

