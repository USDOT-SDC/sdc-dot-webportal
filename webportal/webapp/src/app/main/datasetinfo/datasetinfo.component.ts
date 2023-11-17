import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ApiGatewayService } from "../../../services/apigateway.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import * as $ from "jquery";
import { Injectable, Inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";

import { TableModule } from "primeng/table";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { FieldsetModule } from "primeng/fieldset";
import { PanelModule } from "primeng/panel";
import { DialogModule } from "primeng/dialog";
import { CheckboxModule } from "primeng/checkbox";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { CdkTableModule } from "@angular/cdk/table";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DropdownModule } from "primeng/dropdown";

import { MatDatepickerModule } from "@angular/material/datepicker";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import {
  MatCommonModule,
  MatLineModule,
  MatNativeDateModule,
} from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";

import { MatToolbarModule } from "@angular/material/toolbar";

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";

import { MatTableModule } from "@angular/material/table";

import { CardModule } from "primeng/card";
import { FileUploadModule } from "primeng/fileupload";
import { RadioButtonModule } from "primeng/radiobutton";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    FieldsetModule,
    PanelModule,
    CommonModule,
    CdkTableModule,
    RadioButtonModule,
    TableModule,
    FileUploadModule,
    InputTextModule,
    DialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatRadioModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    CheckboxModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    RouterModule,
    // MatButtonModule,
    // MatCheckboxModule,
    // MatMenuModule,
    // MatTooltipModule,
    // MatToolbarModule,
    // MatIconModule,
    // MatRadioModule,
    // MatTabsModule,
    // MatProgressSpinnerModule,
    // MatDialogModule,
    // MatInputModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    CdkTableModule,
    FileUploadModule,
    // MatFormFieldModule,
    // MatSelectModule,
    // MatTableModule,
    // MatSnackBarModule,
    // //BrowserAnimationsModule,
    // MatDialogModule,
  ],
  selector: "app-datasetinfo",
  providers: [MessageService],
  templateUrl: "./datasetinfo.component.html",
  styleUrls: ["./datasetinfo.component.css"],
})
export class DatasetinfoComponent implements OnInit {
  constructor(private messageService: MessageService) {}
  mailType: string;
  displayDialog = false;
  isNoticeChecked: boolean = false;
  form: FormGroup;
  isFormVisible = false;

  ngOnInit() {
    // this.mailType == "Dataset export Mail";
    // this.form = new FormGroup({
    //   name: new FormControl("", Validators.required),
    //   address1: new FormControl("", Validators.required),
    //   address2: new FormControl(""),
    //   city: new FormControl("", Validators.required),
    //   state: new FormControl("", Validators.required),
    //   zipcode: new FormControl("", Validators.required),
    //   phone: new FormControl("", Validators.required),
    //   fax: new FormControl(""),
    //   email: new FormControl("", [Validators.required, Validators.email]),
    //   confirm_email: new FormControl("", [
    //     Validators.required,
    //     Validators.email,
    //   ]),
    //   // Add other form controls here
    // });
  }

  //   displayDialog: boolean = false;
  //   showDatalakeDropdown: boolean = false;
  //   checklistItems: any[] = [
  //     { name: "Team Bucket", checked: false },
  //     { name: "Datalake", checked: false },
  //   ];

  //   datalakeOptions: any[] = [
  //     { name: "2022", checked: false },
  //     { name: "2023", checked: false },
  //   ];
  //   fileUploaded: boolean = false; // Add this variable

  //   showDialog() {
  //     this.displayDialog = true;
  //   }

  //   onFileUpload(event: any) {
  //     // Handle file upload here
  //     console.log("Uploaded File:", event.files[0]);
  //     this.fileUploaded = true; // Set to true after file upload
  //   }

  //   goBack() {
  //     this.fileUploaded = false; // Set to false to go back to file upload section
  //   }

  //   saveCheckedItems() {
  //     const checkedItems = this.checklistItems.filter((item) => item.checked);
  //     const datalakeSelected = this.checklistItems.find(
  //       (item) => item.name === "Datalake"
  //     )?.checked;

  //     // Logic to save the checked items
  //     console.log("Checked items:", checkedItems);
  //     if (datalakeSelected) {
  //       const datalakeExtraOptions = this.datalakeOptions.filter(
  //         (option) => option.checked
  //       );
  //       console.log("Datalake Extra Options:", datalakeExtraOptions);
  //     }

  //     this.displayDialog = false;
  //   }

  //   closeDialog() {
  //     this.displayDialog = false;
  //     this.showDatalakeDropdown = false;
  //     this.datalakeOptions.forEach((option) => (option.checked = false));
  //   }

  //   submitForm() {
  //     if (this.form.valid) {
  //       // Form is valid, you can access the form values here
  //       const name = this.form.value.name;
  //       const address1 = this.form.value.address1;
  //       const address2 = this.form.value.address2;
  //       const city = this.form.value.city;
  //       const state = this.form.value.state;
  //       const zipcode = this.form.value.zipcode;
  //       const phone = this.form.value.phone;
  //       const fax = this.form.value.fax;
  //       const email = this.form.value.email;
  //       const confirmEmail = this.form.value.confirm_email;
  //       // Access other form values as needed

  //       console.log(name);

  //       this.messageService.add({
  //         severity: "success",
  //         summary: "Success",
  //         detail: "Data Request Form Submitted",
  //       });

  //       this.isFormVisible = false;
  //       // Perform any desired logic with the form data
  //       // For example, you could send the form data to an API
  //       console.log("Form submitted");
  //     } else {
  //       // Form is not valid, handle the error or provide user feedback
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: "Please fill in all required fields",
  //       });
  //       console.log("Form is not valid");
  //     }
  //   }
}
