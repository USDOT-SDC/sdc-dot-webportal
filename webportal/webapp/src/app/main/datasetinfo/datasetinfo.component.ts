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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, ButtonModule, CheckboxModule, DialogModule, FormsModule, InputTextModule, InputTextareaModule, FieldsetModule, PanelModule, ],
  selector: 'app-datasetinfo',
  templateUrl: './datasetinfo.component.html',
  styleUrls: ['./datasetinfo.component.css']
})
export class DatasetinfoComponent implements OnInit {

  displayDialog = false;
  isNoticeChecked: boolean = false;
  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      // Add other form controls here
    });
  }



  

  showDialog() {
    this.displayDialog = true;
  }

  submitForm() {
    if (this.form.valid) {
      // Form is valid, you can access the form values here
      const name = this.form.value.name;
      // Access other form values as needed

      // Perform any desired logic with the form data
      // For example, you could send the form data to an API
      console.log('Form submitted');
    } else {
      // Form is not valid, handle the error or provide user feedback
      console.log('Form is not valid');
    }
  }

}
