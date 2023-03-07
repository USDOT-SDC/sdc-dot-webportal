import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {NavigationEnd, Router, ActivatedRoute} from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule],
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
    constructor(
        private router: Router, private _activeRouter: ActivatedRoute) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const tree = router.parseUrl(router.url);
                if (tree.fragment) {
                    const element = document.querySelector("#" + tree.fragment);
                    console.log('document' + document);
                    if (element) { element.scrollIntoView(true); }
                }
            }
        });
    }

  ngOnInit() {
  }
};
