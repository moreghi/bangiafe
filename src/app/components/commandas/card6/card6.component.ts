
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Classe
import { Prodotto} from './../../../classes/Prodotto';
import { Commandawriga } from './../../../classes/Commandawriga';

// service
import { CommandawrigaService } from './../../../services/commandawriga.service'
import { ProdottoService } from './../../../services/prodotto.service'
import { faSearch, faUserEdit} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
// per gestire il popup con esito operazione
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'td[app-card6]',
  templateUrl: './card6.component.html',
  styleUrls: ['./card6.component.css']
})
export class Card6Component implements OnInit {



  @Input('card6-data') prodotto: Prodotto;
// passo dati a giornata-detail (Padre)  per gestire l'elenco del codice selezzionato in card
  @Output('commandaSelect') commandaSelect = new EventEmitter();
 // @Output('prenotazioniSelect') prenotazioniSelect = new EventEmitter();

  faSearch = faSearch;
  faUserEdit = faUserEdit;

  public nprenot = 0;

  public pathimage = environment.APIURL + '/upload/files/prodotti/';
  public pathimageprodotto = environment.APIURL + '/upload/files/prodotti/';

  public commandawriga: Commandawriga;


  // variabili per visualizzazione messaggio di esito con notifier
  public type = '';
  public Message = '';
  public stato = 0;
  public idCommanda = 0;
  public headerMessage = '';

  public dataGiorno: any;
  public dataOdierna = '';
  public anno  = 0;
  public giornataAbilitata = false;
  public giornataAttiva = false;

  constructor(private router: Router,
              private datePipe: DatePipe,
              private commandawrigaService: CommandawrigaService,
              private prodottoService: ProdottoService,
              private notifier: NotifierService) {
                this.notifier = notifier;
            }

      ngOnInit(): void {

        const date = Date();
        this.dataGiorno = new Date();

        this.anno  = this.dataGiorno.getFullYear();
        this.idCommanda = +localStorage.getItem('idCommanda');
        // imposto quanti prodotti con la tipologia selezionata
        this.pathimage = this.pathimageprodotto + this.prodotto.photo;
        this.headerMessage = this.prodotto.descrizione;

        this.loadCommandarigaw(this.idCommanda,this.prodotto.id);

      }


togli(commandawriga: Commandawriga) {
  commandawriga.qta -= 1;
  commandawriga.disponibile_Day -= 1;
  this.aggiornaordinato(commandawriga);
  this.commandaSelect.emit(commandawriga.idCommanda);
}

aggiungi(commandawriga: Commandawriga) {
  commandawriga.qta += 1;
  commandawriga.disponibile_Day -= 1;
  this.aggiornaordinato(commandawriga);
  this.commandaSelect.emit(commandawriga.idCommanda);
}

async aggiornaordinato(commandawriga: Commandawriga) {
  let res = await this.commandawrigaService.updateCommandawriga(commandawriga).subscribe(
    response => {
          //
      },
  error => {
      alert('aggiornaordinato: ' + error.message);
      console.log(error);
      this.type = 'error';
      this.Message = 'Errore aggiornaordinato' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
  });

}

async loadCommandarigaw(id: number, idProd) {
  let res = await this.commandawrigaService.getCommandawrigabyidProd(id, idProd).subscribe(
    response => {
          this.commandawriga = response['data'];
      },
  error => {
      alert('loadCommandarigaw: ' + error.message);
      console.log(error);
      this.type = 'error';
      this.Message = 'Errore loadCommandarigaw' + '\n' + error.message;
      this.showNotification(this.type, this.Message);
  });

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





}
