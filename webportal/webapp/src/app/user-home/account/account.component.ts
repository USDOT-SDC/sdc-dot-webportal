import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  selectedStack = "Please select";
  stacks: any = [];

  constructor() { }

  ngOnInit() {
    this.getAssociatedStacks();
  }

  getAssociatedStacks() {
    // TODO: Add logic to fetch stacks associated with the user group
    this.stacks = [
      "R&D stack",
      "Admin stack"
    ]
  }

  launchWorstation() {
    // TODO: Add logic to launch workstation from the selected stack
    
  }

}
