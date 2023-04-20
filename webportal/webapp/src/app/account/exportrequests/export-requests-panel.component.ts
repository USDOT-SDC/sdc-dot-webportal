import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PanelModule } from "primeng/panel";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { RequestReviewStatusSeverityPipe } from "./request-review-status.pipe";

@Component({
  selector: "app-export-requests-panel",
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    ButtonModule,
    TagModule,
    RequestReviewStatusSeverityPipe,
  ],
  template: `
    <p-panel style="margin-top: 40px" [toggleable]="true" [header]="header">
      <div *ngIf="!requests">No {{ header }}</div>
      <span class="text-600"
        >This section displays the list of {{ header }}</span
      >
      <hr />
      <!-- <div><button class="btn btn-primary dotBtn" (click)="uploadFilesToS3('Upload Files To S3')">Upload Files</button></div>-->
      <p-table
        #dt
        [columns]="columns"
        [value]="requests"
        [paginator]="true"
        [rows]="10"
        [totalRecords]="requests.length"
        [dataKey]="dataKey"
        styleClass="p-datatable-striped"
      >
        <ng-template pTemplate="header" let-columns>
          <tr>
            <th *ngFor="let col of columns" [pSortableColumn]="col.field">
              {{ col.header }} <p-sortIcon [field]="col.field"></p-sortIcon>
              <br />
              <input
                size="40"
                *ngIf="col.header == 'Filename'"
                pInputText
                type="text"
                (input)="dt.filter($event.target.value, col.field, 'contains')"
              />
            </th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-request let-columns="columns">
          <tr>
            <td *ngFor="let column of columns">
              <ng-container [ngSwitch]="column.field">
                <div *ngSwitchCase="statusField">
                  <div *ngIf="request[statusField] === 'Submitted'">
                    <p-button
                      icon="pi pi-check"
                      styleClass="p-button-rounded p-button-text"
                      (onClick)="onApprove.emit(request)"
                    ></p-button>

                    <p-button
                      icon="pi pi-times"
                      styleClass="p-button-rounded p-button-danger p-button-text"
                      (onClick)="onReject.emit(request)"
                    ></p-button>
                  </div>

                  <div *ngIf="request[statusField] !== 'Submitted'">
                    <p-tag
                      [severity]="
                        request[statusField] | requestReviewStatusSeverity
                      "
                      [value]="request[statusField]"
                    ></p-tag>
                  </div>
                </div>

                <p-button
                  *ngSwitchCase="'details'"
                  icon="pi pi-file"
                  styleClass="p-button-rounded p-button-text"
                  (onClick)="onDetails.emit(request)"
                ></p-button>

                <p-button
                  *ngSwitchCase="'exportFileForReview'"
                  icon="pi pi-cloud-download"
                  styleClass="p-button-rounded p-button-text"
                  (onClick)="onDownload.emit(request)"
                ></p-button>

                <span *ngSwitchDefault>{{ request[column.field] }}</span>
              </ng-container>
            </td>
          </tr>
        </ng-template>
      </p-table>
      <hr />
    </p-panel>
  `,
})
export class ExportRequestsPanelComponent {
  @Input() header: string;
  @Input() columns: Array<any>;
  @Input() requests: Array<any>;
  @Input() dataKey: string;
  @Input() statusField: string;
  @Output() onApprove = new EventEmitter<any>();
  @Output() onReject = new EventEmitter<any>();
  @Output() onDetails = new EventEmitter<any>();
  @Output() onDownload = new EventEmitter<any>();
}
