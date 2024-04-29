import { NgModule, Component } from '@angular/core';                                                //
import { BrowserModule } from '@angular/platform-browser';                               //
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';                                 //
// da sistema
import { RouterModule, Routes} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';                                //
import { HttpClientModule } from '@angular/common/http';                                //
import { DatePipe } from '@angular/common';
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome';                    //
import { FormsModule, ReactiveFormsModule } from '@angular/forms';                      //

// component utente
import { AppComponent } from './app.component';                                                           //
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/security/login/login.component';
import { RegistrazioneComponent } from './components/security/registrazione/registrazione.component';
import { UserComponent } from './components/users/user/user.component';
import { UsersComponent } from './components/users/users/users.component';
import { SignupComponent } from './components/security/signup/signup.component';
// per gestione messaggio esito operazione tipo popup a tempo
import { NotifierModule, NotifierOptions } from 'angular-notifier';                                         //
// utility
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPrintModule } from 'ngx-print';    // per fare la stampa commanda da Angular
import { ModalModule } from 'ngx-bootstrap/modal';  // per aprire una seconda popup dentro alla prima  (conferma Cancellazione)
import { NgxImageZoomModule } from 'ngx-image-zoom';  // per fare zoom su foto
import { ImgMagnifier } from 'ng-img-magnifier';  // per fare zoom su foto  - con resize whidt e heigth della foto
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { TabsModule} from 'ngx-bootstrap/tabs';

// services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TokenStorageService } from './services/token-storage.service';
import { ForgotconfirmedService } from './services/forgotconfirmed.service';
import { ForgotconfirmedtestService } from './services/forgotconfirmedtest.service';
import { ChangepassService } from './services/changepass.service';
import { RouteGuardService } from './services/route-guard.service';
import { UploadFilesService } from './services/upload-files.service';
import { UserlevelService } from './services/userlevel.service';
import { RegisterconfirmedService } from './services/registerconfirmed.service';

// component
import { SignupConfermeComponent } from './components/security/signup-conferme/signup-conferme.component';
import { ForgotPasswordComponent } from './components/security/forgotPassword/forgot-password/forgot-password.component';
import { ForgotPasswordConfermeComponent } from './components/security/forgotPassword/forgot-password-conferme/forgot-password-conferme.component';
import { ChangePasswordConfermeComponent } from './components/security/changePassword/change-password-conferme/change-password-conferme.component';
import { ChangePasswordNewUserComponent } from './components/security/change-password-new-user/change-password-new-user.component';
import { ChangePasswordComponent } from './components/security/changePassword/change-password/change-password.component';
import { Page404Component } from './components/page404/page404.component';
import { HomeComponent } from './components/home/home.component';
import { User1Component } from './components/users/user1/user1.component';
import { User2Component } from './components/users/user2/user2.component';
import { UserDetail1Component } from './components/users/user-detail1/user-detail1.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { InfoComponent } from './components/popups/info/info.component';
import { MessageComponent } from './components/popups/message/message.component';
import { TabelleComponent } from './components/tabelles/tabelle/tabelle.component';
import { TabellaComponent } from './components/tabelles/tabella/tabella.component';
import { TabellaTwDettComponent } from './components/tabelles/tabella-tw-dett/tabella-tw-dett.component';
import { TabellaTwDettPopComponent } from './components/popups/tabella-tw-dett-pop/tabella-tw-dett-pop.component';
import { AbilitazioneComponent } from './components/security/abilitazione/abilitazione.component';
import { TestuploadComponent } from './components/testupload/testupload.component';   // test - per provare upload
import { CardComponent } from './components/compmoreno/cards/card/card.component';
import { ManifestazioniComponent } from './components/manifestaziones/manifestazioni/manifestazioni.component';
import { ManifestazioneComponent } from './components/manifestaziones/manifestazione/manifestazione.component';
import { ManifestazioneDetailComponent } from './components/manifestaziones/manifestazione-detail/manifestazione-detail.component';
import { GiornateComponent } from './components/giornatas/giornate/giornate.component';
import { GiornataComponent } from './components/giornatas/giornata/giornata.component';
import { Giornata9Component } from './components/giornatas/giornata9/giornata9.component';
import { GiornataDetailComponent } from './components/giornatas/giornata-detail/giornata-detail.component';
import { Card1Component } from './components/tabellevarie/tipologia/card1/card1.component';
import { PrenotazioniComponent } from './components/prenotaziones/prenotazioni/prenotazioni.component';
import { Card2Component } from './components/prenotaziones/card2/card2.component';
import { RequestPrenotazioneComponent } from './components/prenotaziones/prenotazione/request-prenotazione/request-prenotazione.component';
import { ResponsePrenotazioneComponent } from './components/prenotaziones/prenotazione/response-prenotazione/response-prenotazione.component';
import { RequestPrenotazione1Component } from './components/prenotaziones/prenotazione/request-prenotazione1/request-prenotazione1.component';
import { CommandawrigaComponent } from './components/commandawrigas/commandawriga/commandawriga.component';
import { Card3Component } from './components/prenotaziones/card3/card3.component';
import { Prenotazioni1Component } from './components/prenotaziones/prenotazioni1/prenotazioni1.component';
import { Prenotazione1Component } from './components/prenotaziones/prenotazione1/prenotazione1.component';
import { GiornataDetailProdottiComponent } from './components/giornatas/giornata-detail-prodotti/giornata-detail-prodotti.component';
import { Card4Component } from './components/giornatas/card4/card4.component';
import { GiornataDetailPersoneComponent } from './components/giornatas/giornata-detail-persone/giornata-detail-persone.component';
import { VolontariComponent } from './components/volontaris/volontari/volontari.component';
import { VolontarioComponent } from './components/volontaris/volontario/volontario.component';
import { VolontarioDetailComponent } from './components/volontaris/volontario-detail/volontario-detail.component';
import { CassasinteticaDetailComponent } from './components/cassasinteticas/cassasintetica-detail/cassasintetica-detail.component';
import { GiornateDashboardComponent } from './components/giornatas/giornate-dashboard/giornate-dashboard.component';
import { Card5Component } from './components/giornatas/card5/card5.component';
import { CommandaComponent } from './components/commandas/commanda/commanda.component';
import { CommandaRegistrazioneAnagraficaComponent } from './components/commandas/commanda-registrazione-anagrafica/commanda-registrazione-anagrafica.component';
import { Persona1Component } from './components/personas/persona1/persona1.component';
import { CommandaRegistrazioneComponent } from './components/commandas/commanda-registrazione/commanda-registrazione.component';
import { CommandaRegistrazioneProdottiComponent } from './components/commandas/commanda-registrazione-prodotti/commanda-registrazione-prodotti.component';
import { Card6Component } from './components/commandas/card6/card6.component';
import { GiornataCassaEditComponent } from './components/giornatas/giornata-cassa-edit/giornata-cassa-edit.component';
import { Prenotazione2Component } from './components/prenotaziones/prenotazione2/prenotazione2.component';
import { CommandaRegistrazioneCassaComponent } from './components/commandas/commanda-registrazione-cassa/commanda-registrazione-cassa.component';
import { CommandaPreviewComponent } from './components/commandas/commanda-preview/commanda-preview.component';
import { CommandaGestioneComponent } from './components/commandas/commanda-gestione/commanda-gestione.component';
/*
 * Custom angular notifier options
 */

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 90,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 8000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegistrazioneComponent,
    UserComponent,
    UsersComponent,
    SignupComponent,
    SignupConfermeComponent,
    ForgotPasswordComponent,
    ForgotPasswordConfermeComponent,
    ChangePasswordConfermeComponent,
    ChangePasswordNewUserComponent,
    ChangePasswordComponent,
    Page404Component,
    HomeComponent,
    User1Component,
    User2Component,
    UserDetail1Component,
    UserDetailComponent,
    InfoComponent,
    MessageComponent,
    TabelleComponent,
    TabellaComponent,
    TabellaTwDettComponent,
    TabellaTwDettPopComponent,
    AbilitazioneComponent,
    TestuploadComponent,
    CardComponent,
    ManifestazioniComponent,
    ManifestazioneComponent,
    ManifestazioneDetailComponent,
    GiornateComponent,
    GiornataComponent,
    Giornata9Component,
    GiornataDetailComponent,
    Card1Component,
    PrenotazioniComponent,
    Card2Component,
    RequestPrenotazioneComponent,
    ResponsePrenotazioneComponent,
    RequestPrenotazione1Component,
    CommandawrigaComponent,
    Card3Component,
    Prenotazioni1Component,
    Prenotazione1Component,
    GiornataDetailProdottiComponent,
    Card4Component,
    GiornataDetailPersoneComponent,
    VolontariComponent,
    VolontarioComponent,
    VolontarioDetailComponent,
    CassasinteticaDetailComponent,
    GiornateDashboardComponent,
    Card5Component,
    CommandaComponent,
    CommandaRegistrazioneAnagraficaComponent,
    Persona1Component,
    CommandaRegistrazioneComponent,
    CommandaRegistrazioneProdottiComponent,
    Card6Component,
    GiornataCassaEditComponent,
    Prenotazione2Component,
    CommandaRegistrazioneCassaComponent,
    CommandaPreviewComponent,
    CommandaGestioneComponent

   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    Ng2SearchPipeModule,
    NgxPrintModule,
    NgxImageZoomModule,
    ModalModule.forRoot(),
    ImgMagnifier,
    BsDatepickerModule.forRoot(),
  //  TabsModule.forRoot(),


  ],
  providers: [AuthService, DatePipe, UserService, TokenStorageService, ForgotconfirmedService, ForgotconfirmedtestService,
              ChangepassService, RouteGuardService, UploadFilesService,
              UserlevelService, RegisterconfirmedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
