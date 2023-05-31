import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, ButtonModule, CheckboxModule, DialogModule, FormsModule, InputTextModule, InputTextareaModule, FieldsetModule, PanelModule, ],
  selector: 'app-datasetinfo',
  templateUrl: './datasetinfo.component.html',
  styleUrls: ['./datasetinfo.component.css']
})
export class DatasetinfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  displayDialog = false;
  isNoticeChecked: boolean = false;

  showDialog() {
    this.displayDialog = true;
  }

}
