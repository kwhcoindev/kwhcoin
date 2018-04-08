import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';

import { AppService } from './app.service';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import {map} from 'rxjs/operator/map';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {distinctUntilChanged} from 'rxjs/operator/distinctUntilChanged';

//declare var jQuery;
declare var document;

@Component({
  selector: '[app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public previousUrl: string;
	public loading: boolean = false;
  public navIsFixed: boolean = false;
  isKycForm: boolean = false;

  currentUrl: string = "";

  constructor(protected renderer: Renderer2, protected router: Router, private activatedRoute: ActivatedRoute) {

    this.isKycForm = document.location.href.indexOf('kyc.html') != -1;

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
        //jQuery('.dropdown-menu.show, .collapse.show').removeClass('show')
        //jQuery(window).scrollTop(0)

        this.currentUrl = event.url;
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

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 80) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < 10) {
      this.navIsFixed = false;
    }
  }  

  scrollTop(): void {
    if(document.documentElement) {
      document.documentElement.scrollTop = 0;
    }else {
      document.body.scrollTop = 0;
    }
  }
}
