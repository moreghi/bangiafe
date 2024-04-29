import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// service
import { RouteGuardService } from './services/route-guard.service';
// componenti utente
import { LoginComponent } from './components/security/login/login.component';
import { RegistrazioneComponent } from './components/security/registrazione/registrazione.component';
import { UsersComponent } from './components/users/users/users.component';
import { SignupComponent } from './components/security/signup/signup.component';
import { SignupConfermeComponent } from './components/security/signup-conferme/signup-conferme.component';
import { ForgotPasswordComponent } from './components/security/forgotPassword/forgot-password/forgot-password.component';
import { ForgotPasswordConfermeComponent } from './components/security/forgotPassword/forgot-password-conferme/forgot-password-conferme.component';
import { ChangePasswordNewUserComponent } from './components/security/change-password-new-user/change-password-new-user.component';
import { ChangePasswordConfermeComponent } from './components/security/changePassword/change-password-conferme/change-password-conferme.component';
import { ChangePasswordComponent } from './components/security/changePassword/change-password/change-password.component';
import { Page404Component } from './components/page404/page404.component';
import { HomeComponent } from './components/home/home.component';
// import { UserDetail1Component } from './components/users/user-detail1/user-detail1.component';  // test
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { TabelleComponent } from './components/tabelles/tabelle/tabelle.component';
import { AbilitazioneComponent } from './components/security/abilitazione/abilitazione.component';
import { TestuploadComponent } from './components/testupload/testupload.component';
import { ManifestazioniComponent } from './components/manifestaziones/manifestazioni/manifestazioni.component';
import { ManifestazioneDetailComponent } from './components/manifestaziones/manifestazione-detail/manifestazione-detail.component';
import { GiornateComponent } from './components/giornatas/giornate/giornate.component';
import { GiornataDetailComponent } from './components/giornatas/giornata-detail/giornata-detail.component';
import { PrenotazioniComponent } from './components/prenotaziones/prenotazioni/prenotazioni.component';
import { RequestPrenotazioneComponent } from './components/prenotaziones/prenotazione/request-prenotazione/request-prenotazione.component';
import { ResponsePrenotazioneComponent } from './components/prenotaziones/prenotazione/response-prenotazione/response-prenotazione.component';
import { RequestPrenotazione1Component } from './components/prenotaziones/prenotazione/request-prenotazione1/request-prenotazione1.component';
import { Prenotazioni1Component } from './components/prenotaziones/prenotazioni1/prenotazioni1.component';
import { GiornataDetailProdottiComponent } from './components/giornatas/giornata-detail-prodotti/giornata-detail-prodotti.component';
import { GiornataDetailPersoneComponent } from './components/giornatas/giornata-detail-persone/giornata-detail-persone.component';
import { VolontariComponent } from './components/volontaris/volontari/volontari.component';
import { VolontarioDetailComponent } from './components/volontaris/volontario-detail/volontario-detail.component';
import { CassasinteticaDetailComponent } from './components/cassasinteticas/cassasintetica-detail/cassasintetica-detail.component';
import { GiornateDashboardComponent } from './components/giornatas/giornate-dashboard/giornate-dashboard.component';
import { CommandaRegistrazioneAnagraficaComponent } from './components/commandas/commanda-registrazione-anagrafica/commanda-registrazione-anagrafica.component';
import { CommandaRegistrazioneComponent } from './components/commandas/commanda-registrazione/commanda-registrazione.component';
import { CommandaRegistrazioneProdottiComponent } from './components/commandas/commanda-registrazione-prodotti/commanda-registrazione-prodotti.component';
import { GiornataCassaEditComponent } from './components/giornatas/giornata-cassa-edit/giornata-cassa-edit.component';
import { CommandaRegistrazioneCassaComponent } from './components/commandas/commanda-registrazione-cassa/commanda-registrazione-cassa.component';
import { CommandaPreviewComponent } from './components/commandas/commanda-preview/commanda-preview.component';
import { CommandaGestioneComponent } from './components/commandas/commanda-gestione/commanda-gestione.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrazioneComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'signupConferme',
    component: SignupConfermeComponent
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'forgotpasswordConferme',
    component: ForgotPasswordConfermeComponent
  },

// ----------------------------------------------------------------  Tabelle
{
  path: 'tabella',
  component: TabelleComponent
},
 {
    path: 'users',
    component: UsersComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/inqu/:id',
    component: UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/edit/:id',
    component:  UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/edits/:id',
    component: UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/new',
    component: UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  //  ------------------------------------------------------------------------------------ Manifestazione
  {
    path: 'manif',
    component: ManifestazioniComponent
  },
  {
    path: 'manif/edit/:id',
    component: ManifestazioneDetailComponent
  },
  {
    path: 'manif/new',
    component: ManifestazioneDetailComponent
  },
  // -------------------------------------------------------------------------  Cassa sintetica
  {
    path: 'cassasintetica/new/:id',
    component: CassasinteticaDetailComponent
  },
  {
    path: 'cassasintetica/edit/:id',
    component: CassasinteticaDetailComponent
  },
  // ---------------------------------------------------- Giornate
  {
    path: 'GiornateDashboard',
    component: GiornateDashboardComponent
  },
  {
    path: 'giornate/:idManif',
    component: GiornateComponent
  },
  {
    path: 'giornata/edit/:id/:idManif',
    component: GiornataDetailComponent
  },
  {
    path: 'giornata/new/:idManif',
    component: GiornataDetailComponent
  },
  // dettaglio giornata della manifestazione  -- dettaglio Prodotti
  {
    path: 'giornata/Prod/:id',
    component: GiornataDetailProdottiComponent
  },
  // dettaglio giornata della manifestazione  -- dettaglio Perone
  {
    path: 'giornata/Pers/:id',
    component: GiornataDetailPersoneComponent
  },
  // dettaglio cassa di giornata
  {
    path: 'giornata/CassaDett/:id',
    component: GiornataCassaEditComponent
  },


  // -------------------------------------------------------------------------------------   commanda
  {
    path: 'commanda/RegistraAnag/new/:idGiornata',
    component: CommandaRegistrazioneAnagraficaComponent
  },
  {
    path: 'commanda/Registrazione/new/:idGiornata',
    component: CommandaRegistrazioneComponent
  },
  // Registrazione Commanda - Prodotti
  {
    path: 'commanda/RegistraProd/new/:idCommanda',
    component: CommandaRegistrazioneProdottiComponent
  },
  // Registrazione Commanda - Prodotti
  {
    path: 'commanda/RegistraCassa/:idCommanda',
    component: CommandaRegistrazioneCassaComponent
  },
  {
    path: 'prewcommanda/:id',
    component: CommandaPreviewComponent,
   // canActivate: [RouteGuardService]
  },
// ----------------------------------------------------------------  Gestione Bevance / Cucina

{
  path: 'commanda/gestioneCucina/:idGiornata',
  component: CommandaGestioneComponent,
 // canActivate: [RouteGuardService]
},
{
  path: 'commanda/gestioneBevande/:idGiornata',
  component: CommandaGestioneComponent,
 // canActivate: [RouteGuardService]
},





  // -------------------------------------------------------------------------------------   Volontari
  {
    path: 'volontari',
    component: VolontariComponent
  },
  {
    path: 'volontario/new',
    component: VolontarioDetailComponent
  },
  {
    path: 'volontario/:id',
    component: VolontarioDetailComponent
  },

  // -------------------------------------------------------------------------------------   Prenotazioni
  {
    path: 'prenotazioni',
    component: PrenotazioniComponent
  },
  {
    path: 'requestConfirmPrenotazione/:id',
     component: RequestPrenotazioneComponent
  },
  {
    path: 'requestConfirmPrenotazione1/:idday/:id',
     component: RequestPrenotazione1Component
  },
  {
    path: 'prenotazioneConferma',
     component: ResponsePrenotazioneComponent
  },
  {                                  // prenotazioni di giornata
    path: 'PrenotazionidelGiorno/:id',
     component: Prenotazioni1Component
  },
  // -------------------------------------------------------------------------------------   abilitazione
  {
    path: 'users/abil/:id',
    component: AbilitazioneComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'chgpswnuwuser',
    component: ChangePasswordNewUserComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent
  },
  {
    path: 'changepasswordConferme',
    component: ChangePasswordConfermeComponent
  },
  {
    path: 'page404',
    component: Page404Component
  },
  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'testupload',
    component: TestuploadComponent
  },
  {
    path: '',
    redirectTo: 'home',  //home   // login
    pathMatch: 'full'
  },

  //  ultimo
  {
    path: '**',
    redirectTo: 'page404',
    pathMatch: 'full'
  },

 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



