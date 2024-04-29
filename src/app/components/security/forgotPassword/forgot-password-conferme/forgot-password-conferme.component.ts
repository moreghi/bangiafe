import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { faUserEdit, faTrash, faInfo, faEuroSign, faUtensils, faStream, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../../../classes/User';
import { ForgotPassword } from '../../../../classes/Forgot-password';

// service
import { ForgotconfirmedService } from '../../../../services/forgotconfirmed.service';
import { ForgotconfirmedtestService } from '../../../../services/forgotconfirmedtest.service';      // test
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { formatCurrency } from '@angular/common';
import { NotifierService } from 'angular-notifier';



@Component({
  selector: 'app-forgot-password-conferme',
  templateUrl: './forgot-password-conferme.component.html',
  styleUrls: ['./forgot-password-conferme.component.css']
})
export class ForgotPasswordConfermeComponent implements OnInit {

  public form = {
    resetEmail: null,
    resetToken: null,
    cognome: null,
    nome: null,
    username: null,
    email: null,
    token: null,
    password: '',
    newpassword: '',
    confirmPassword: ''
  };

  public error = null;

  public user: User;
  public forg: ForgotPassword;
  public email = '';
  public token = '';
  public newpassword = '';
  // icone
  faTrash = faTrash;

  public isVisible = false;
  public alertSuccess = false;
  public Message = '';
  public type = '';
  public tokenCorrect = false;
  public emailCorrect = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private userService: UserService,
              private forgotconfirmedService: ForgotconfirmedService,
              private testService: ForgotconfirmedtestService,
              private notifier: NotifierService) {
                this.notifier = notifier;
                route.queryParams.subscribe(
                  params => {
                    this.form.resetEmail = params['email'],
                    this.form.resetToken = params['token']
                            });
    }

  ngOnInit(): void {

    this.forg  = new ForgotPassword();

    this.email = this.form.resetEmail;
    this.token = this.form.resetToken;
    console.log('OnInit - email: ' + this.email);
// leggo la tabella 'register_confirmed' per recuperare email
//  originale  ----------------- getRegConfirmbyTokenProm
    this.forgotconfirmedService.getby(this.email).subscribe(
    resp => {
      console.log(`letto forgot ${resp['data']}`);
      this.forg = resp['data'];
      this.form.cognome = this.forg.cognome;
      this.form.nome = this.forg.nome;
      this.form.username = this.forg.username;
      this.form.email = '';
      this.form.token = '';
      this.form.newpassword = this.newpassword;
      },
      error => {
            console.log('error in lettura forgott : ' + error.message);
          }
      );

  }

 async onSubmit(form: NgForm) {
   // alert('sono in submit');
    console.log('sono in submit ---------  email --  ' + form.value.email);
    // eseguo controllo sui campi inseriti
    if(form.value.email !== this.email) {
      this.Message = 'email di conferma non corrisponde a quella di richiesta - ripristino non consentito';
      this.isVisible = true;
      this.alertSuccess = false;

      this.type = 'error';
      this.showNotification(this.type, this.Message);
      return;
    }

    // verificate le credenziali per richiesta nuovo utente

    console.log('ok forgotpasswordConfirm ' + form.value.email + ' ' + this.form.newpassword + ' dati passati a backend ' );


   //  const resp = await this.testService.resetpassword(form.value.email, this.newpassword);
/*
    this.user = new User();
    this.user.email = form.value.email;
    this.user.password = form.value.newpassword;   */

    /////////   const resp = await this.forgotconfirmedService.resetpassword(form.value.email, this.newpassword);
   // const resp = await this.auth.confresetPassword(form.value.email, this.newpassword);  // non funziona
  //  const resp = await this.forgotconfirmedService.confresetPassword(form.value.email, this.newpassword);

 /* const resp = await this.auth.confchangePassword(form.value.email, this.form.newpassword);  // confresetPassword

  if (resp) {
          if(resp['rc'] == 'ok') {
            console.log('Ripristinata password iniziale ');
            this.Message = 'password utente ' + this.forg.cognome + ' ' + this.forg.nome + ' Ripristinata con successo';
            this.isVisible = true;
            this.alertSuccess = true;

            this.type = 'success';
            this.showNotification(this.type, this.Message);
          }

       }  */


       let rc = await  this.auth.confchangePassword(form.value.email, this.form.newpassword).subscribe(
        response => {
          if(response['rc'] === 'ok') {
             this.Message = 'password utente ' + this.forg.cognome + ' ' + this.forg.nome + ' Ripristinata con successo';
             this.isVisible = true;
             this.alertSuccess = true;
             this.type = 'success';
             this.showNotification(this.type, this.Message);
          }
       },
          error => {
          alert('cambio password: ' + error.message);
          console.log(error);
          this.alertSuccess = false;
          this.Message = error.message;
          this.type = 'error';
          this.showNotification( this.type, this.Message);
          });
        }


handleError(error) {
  this.error = error.error.errors;
}


showNotification( type: string, message: string ): void {
  this.notifier.notify( type, message );
}

verificaToken() {

  if(this.form.resetToken === this.form.token) {
        this.tokenCorrect = true;
        this.Message = 'token verificato -- Procedere con inserimento email';
        this.isVisible = true;
        this.alertSuccess = true;
  } else {
        this.tokenCorrect = false;
        this.Message = 'token NON verificato -- inserisci il valore ricevute nella email';
        this.isVisible = true;
        this.alertSuccess = false;
  }
}

controlloEmail() {

  if(this.form.resetEmail === this.form.email) {
    this.emailCorrect = true;
    this.Message = 'email verificata -- Procedere con inserimento nuova password';
    this.isVisible = true;
    this.alertSuccess = true;
} else {
    this.emailCorrect = false;
    this.Message = 'email NON verificata -- inserisci indirizzo email corretto';
    this.isVisible = true;
    this.alertSuccess = false;
}



}



}
