
// classe e service commentatai per la creazione del  moldello  -- sostituire con classi e service corretti

// componente per la gestione dei test

import { Component, OnInit } from '@angular/core';
import { TestUploadService } from './../../services/test-upload.service';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
// -------------------------------------------------------------------------- service
// import { EventoService } from './../../services/evento.service';
// -------------------------------------------------------------------------- classi
// import { Evento} from './../../classes/Evento';
import { ActivatedRoute, Data, Router, RouterStateSnapshot } from '@angular/router';
@Component({
  selector: 'app-testupload',
  templateUrl: './testupload.component.html',
  styleUrls: ['./testupload.component.css']
})
export class TestuploadComponent implements OnInit {

  public nRec = 0;
  file: File = null;
 // icone
 faPlusSquare = faPlusSquare;
 faSearch = faSearch;

// array per salvare i dati da pubblicare sulle Card
public nameevento: string[] = [];
public dispevento: number[] = [];
public idevento: number[] = [];

 public isVisible = false;
 public alertSuccess = false;
 public Message = '';

// public eventi: Evento[] = [];
// public evento: Evento;
public nCard = 0;
public rigaCompleta = false;

public cardarray = false;
public cardtd = false;

//public filexx: File = 'PallinoRossovvvv.jpg'

statuto = {
  name: 'Mobile Cross-Platform from a Progressive Perspective',
  url: 'https://nils-mehlhorn.de/slides/mobile_cp_progessive_mehlhorn_pottjs.pdf',
};

// https://codepen.io/anon/pen/YMBOem
// https://it.quora.com/Qual-%C3%A8-il-modo-migliore-per-incorporare-un-documento-PDF-in-una-pagina-HTML

  constructor(private router: Router,
              private testUploadService: TestUploadService,
            //  private eventoService: EventoService

            ) { }

  ngOnInit(): void {
    this.goApplication();
  }


  goApplication() {

  }




  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }


  downloadMoreno() {
  alert('devo effettuare il download dello statuto')

  }



  upload() {



    if (this.file) {
      this.testUploadService.uploadfile(this.file).subscribe(resp => {
        alert("Uploaded")
      })
    } else {
      alert("Please select a file first")
    }

  }

  creaCardtd() {
    alert('effettuo la creazione della tabella con le card dentro a td')
    this.loadeventiAttivitd();
  }

  async loadeventiAttivitd() {
    console.log('loadeventiAttivitd --- appena entrato ');
    //  metodo commentato per la creazione del Modello
    /*

    this.nRec = 0;

    let rc =  await  this.eventoService.getAllActive().subscribe(
         res => {
          if(res['rc'] === 'ok') {
            console.log('loadeventiAttivitd - ok: ' + JSON.stringify(res['data']))
            this.eventi = res['data'];
            this.nRec = res['number'];;
            this.nCard = 0;
            this.Message = 'situazione attuale ';
             this.isVisible = true;
             this.alertSuccess = true;

             this.cardarray = false;
             this.cardtd = true;




          }
          if(res['rc'] === 'nf') {
            console.log('loadeventiAttivi - nf: ' )
            this.nRec = 0;
            this.Message = 'Nessun Evento presente';
            this.alertSuccess = false;
          }
        },
        error => {
           alert('loadeventiAttivi - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        });
        */
  }





  creaCard() {
    alert('effettuo la creazione della tabella con le card')
      this.loadeventiAttivi();
  }

  async loadeventiAttivi() {
    console.log('loadprenMaster --- appena entrato ');
     //  metodo commentato per la creazione del Modello
    /*
    this.nRec = 0;

    let rc =  await  this.eventoService.getAllActive().subscribe(
         res => {
          if(res['rc'] === 'ok') {
            console.log('loadeventiAttivi - ok: ' + JSON.stringify(res['data']))
            this.eventi = res['data'];
            this.nRec = res['number'];;
            this.nCard = 0;
// nuovo metodo
            for(let evento of this.eventi) {
              this.nameevento.push(evento.descbreve);
              this.dispevento.push(evento.nposti - evento.npostipren - evento.nbiglietti);
              this.idevento.push(evento.id);
              }


              let inx;
              const tappo = 30;
              const campovuoto = '';
              this.nRec += 1;
              for(inx = this.nRec; inx < tappo; inx++) {
               this.nameevento.push(campovuoto);
             }
             this.Message = 'situazione attuale ';
             this.isVisible = true;
             this.alertSuccess = true;

             this.cardarray = true;
             this.cardtd = false;



         // vecchia modalità con tabella
            for(let evento of this.eventi) {
               this.nCard += 1;
               if(this.nCard > 4) {
                this.rigaCompleta = true;
                this.nCard = 0;
               }

          }




            this.nRec = res['number'];
            this.Message = 'Situazione Attuale Prenotazioni da confermare';
            this.alertSuccess = true;
          }
          if(res['rc'] === 'nf') {
            console.log('loadeventiAttivi - nf: ' )
            this.nRec = 0;
            this.Message = 'Nessun Evento presente';
            this.alertSuccess = false;
          }
        },
        error => {
           alert('loadeventiAttivi - errore: ' + error.message);
           console.log(error);
           this.Message = error.message;
           this.alertSuccess = false;
        });

        */
  }





  gestione(id: number) {
    this.router.navigate(['evento/dashboard/' + id]);

  }


}
