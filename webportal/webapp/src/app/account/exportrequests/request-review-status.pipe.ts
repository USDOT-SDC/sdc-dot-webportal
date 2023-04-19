import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "requestReviewStatusSeverity", standalone: true })
export class RequestReviewStatusSeverityPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case "Rejected":
        return "danger";
      case "Approved":
        return "success";
      default:
        return "primary";
    }
  }
}
