import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

    constructor(
        private router: Router) {
        // router.events.subscribe(event => {
        //     if (event instanceof NavigationEnd) {
        //         const tree = router.parseUrl(router.url);
        //         if (tree.fragment) {
        //             const element = document.querySelector("#" + tree.fragment);
        //             if (element) { element.scrollIntoView(); }
        //         }
        //     }
        // });
    }

  ngOnInit() {
  }
}
