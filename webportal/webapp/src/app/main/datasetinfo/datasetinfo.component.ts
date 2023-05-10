import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule],
  selector: 'app-datasetinfo',
  templateUrl: './datasetinfo.component.html',
  styleUrls: ['./datasetinfo.component.css']
})
export class DatasetinfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
