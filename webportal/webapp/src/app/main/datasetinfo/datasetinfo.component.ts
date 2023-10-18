import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { ApiGatewayService } from "../../../services/apigateway.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import * as $ from "jquery";
import { Injectable, Inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule, MatHint } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DropdownModule } from "primeng/dropdown";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";

import { MatIconModule } from "@angular/material/icon";
import {
  MatCommonModule,
  MatLineModule,
  MatNativeDateModule,
} from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DialogModule } from "primeng/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { CdkTableModule } from "@angular/cdk/table";
import { FileUploadModule } from "primeng/fileupload";
import { MarkdownModule, MarkdownService } from "ngx-markdown";

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    MatExpansionModule,
    CommonModule,
    TableModule,
    DropdownModule,
    RouterModule,
    //BrowserAnimationsModule,
    MatDialogModule,
    DialogModule,

    // MatCardModule,
    // MatExpansionModule,

    ButtonModule,
    InputTextModule,
    FormsModule,
    MarkdownModule,
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
  templateUrl: "./datasetinfo.component.html",
  styleUrls: ["./datasetinfo.component.css"],
})
export class DatasetinfoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  displayDialog: boolean = false;
  showDatalakeDropdown: boolean = false;
  checklistItems: any[] = [
    { name: "Team Bucket", checked: false },
    { name: "Datalake", checked: false },
  ];

  datalakeOptions: any[] = [
    { name: "2022", checked: false },
    { name: "2023", checked: false },
  ];
  fileUploaded: boolean = false; // Add this variable

  showDialog() {
    this.displayDialog = true;
  }

  onFileUpload(event: any) {
    // Handle file upload here
    console.log("Uploaded File:", event.files[0]);
    this.fileUploaded = true; // Set to true after file upload
  }

  goBack() {
    this.fileUploaded = false; // Set to false to go back to file upload section
  }

  saveCheckedItems() {
    const checkedItems = this.checklistItems.filter((item) => item.checked);
    const datalakeSelected = this.checklistItems.find(
      (item) => item.name === "Datalake"
    )?.checked;

    // Logic to save the checked items
    console.log("Checked items:", checkedItems);
    if (datalakeSelected) {
      const datalakeExtraOptions = this.datalakeOptions.filter(
        (option) => option.checked
      );
      console.log("Datalake Extra Options:", datalakeExtraOptions);
    }

    this.displayDialog = false;
  }

  closeDialog() {
    this.displayDialog = false;
    this.showDatalakeDropdown = false;
    this.datalakeOptions.forEach((option) => (option.checked = false));
  }

  onCheckboxChange(item: any) {
    if (item.name === "Datalake") {
      this.showDatalakeDropdown = item.checked;
    }
  }
}
