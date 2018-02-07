import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';

import { AppService } from './app.service';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import {map} from 'rxjs/operator/map';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {distinctUntilChanged} from 'rxjs/operator/distinctUntilChanged';

declare var jQuery;

@Component({
  selector: '[app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  previousUrl: string;
	loading: boolean = false;

  constructor(private renderer: Renderer2, private router: Router) {
    router.events.subscribe( (event: Event) => {

      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.loading = true;
        if (this.previousUrl) {
          this.renderer.removeClass(document.body, this.previousUrl);
        }
        let currentUrlSlug = event.url.slice(1)
        let className = currentUrlSlug || 'home'
        this.renderer.addClass(document.body, className);
        this.previousUrl = className;
        jQuery('.dropdown-menu.show, .collapse.show').removeClass('show')
        jQuery(window).scrollTop(0)
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        setTimeout(()=>{
	        this.loading = false;
        }, 0);
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user
        setTimeout(()=>{
	        this.loading = false;
        }, 0);
      }
    });
  }
}
