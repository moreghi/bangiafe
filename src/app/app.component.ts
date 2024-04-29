import { Component } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'frontend';
  public version = environment.version;
  public api = environment.APIURL;

  public dProfile = localStorage.getItem('Druolo');
}
