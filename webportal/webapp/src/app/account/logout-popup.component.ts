// logout-popup.component.ts
import { Component, EventEmitter, Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-logout-popup",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Idle Timeout Warning</h4>
    </div>
    <div class="modal-body">
      <p>
        You will be logged out in {{ countdown }} seconds due to inactivity.
      </p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="close()">
        Stay Logged In
      </button>
    </div>
  `,
})
export class LogoutPopupComponent {
  @Output() onClose = new EventEmitter<void>();
  countdown: number = 60;

  constructor(public bsModalRef: BsModalRef) {
    // Start countdown
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.close();
      }
    }, 1000);
  }

  close() {
    this.onClose.emit();
    this.bsModalRef.hide();
  }
}
