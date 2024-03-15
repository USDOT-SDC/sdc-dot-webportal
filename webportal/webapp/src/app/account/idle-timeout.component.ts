// idle-timeout.component.ts
import { Component, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { LogoutPopupComponent } from "./logout-popup.component";

@Component({
  selector: "app-idle-timeout",
  template: "",
})
export class IdleTimeoutComponent implements OnInit {
  private timer: any;
  private readonly TIMEOUT_DURATION = 20000; // 5 minutes in milliseconds
  private readonly WARNING_TIME = 10000; // 1 minute in milliseconds

  constructor(private modalService: BsModalService) {}

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timer = setTimeout(() => {
      this.showPopup();
    }, this.TIMEOUT_DURATION - this.WARNING_TIME);
  }

  resetTimer() {
    clearTimeout(this.timer);
    this.startTimer();
  }

  showPopup() {
    const modalRef: BsModalRef = this.modalService.show(LogoutPopupComponent, {
      class: "modal-dialog-centered",
    });

    modalRef.content.onClose.subscribe(() => {
      // User closed the popup, reset the timer
      this.resetTimer();
    });
  }
}
