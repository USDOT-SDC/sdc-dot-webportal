import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class HomeFaqComponent implements OnInit {
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
