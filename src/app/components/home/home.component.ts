import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public title = 'Sanfra in festa ...... finalmente un pò di vita';
  public p1: number;
  public p2: number;
  public p3: number;
  public nRec1 = 0;
  public nRec2 = 0;
  public nRec3 = 0;
  public Message = '';
  public ruolo = '';
  public filepdf = 'statuto.pdf'
  constructor(private route: Router) { }


   ngOnInit(): void {
    // cancello i localstorage



  }


}
