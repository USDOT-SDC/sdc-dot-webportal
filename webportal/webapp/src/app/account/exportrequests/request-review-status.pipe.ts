import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "requestReviewStatusSeverity", standalone: true })
export class RequestReviewStatusSeverityPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Approved':
      case 'Trusted':
        return 'success';
      case 'Rejected':
      case 'Untrusted':
      case 'Denied':
        return 'danger';
      default:
        return 'primary';
    }
  }
}
