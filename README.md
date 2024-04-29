# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# per creare componente senza il file .spec

ng g c components/manifestaziones/manifestazioni --skip-tests=true
ng g s services/manifestazione --skip-tests=true

#  gestione passaggio dati dal componente figlio al padre

padre  evento-posti

sulla maschera html dove passo i dati al figlio mettere i dati per passare dal figlio al padre
ci sarà sul padre un metodo chiamato "totalefileposti" in cui ricevo i dati dal figlio e faccio qualcosa
(totalefileposti) ="totalefileposti($event)"


sul figlio     evento-settfila
// passo dati a evento-posti (padre)  
 @Output('totalefileposti') totalefileposti = new EventEmitter();

in un  metodo se voglio passare i dati al padre
this.totalefileposti.emit(response['tot']);

# per convertire file ,csv in file .sql  per importare dati
https://www-convertcsv-com.translate.goog/csv-to-sql.htm?_x_tr_sl=auto&_x_tr_tl=it&_x_tr_hl=it&_x_tr_pto=wapp
