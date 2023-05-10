import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule,  } from '@angular/router';
import { CardModule } from 'primeng/card'


@Component({
  standalone: true,
  imports: [MatCardModule, RouterModule, CommonModule, CardModule],
  selector: 'app-accounthome',
  templateUrl: './accounthome.component.html',
  styleUrls: ['./accounthome.component.css']
})
export class AccountHomeComponent implements OnInit {

  constructor( public router: Router ) { }

  ngOnInit() {
  }
}
