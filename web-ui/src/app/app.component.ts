import { Component, OnInit, HostListener } from '@angular/core';

import { AppService } from './app.service';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import {map} from 'rxjs/operator/map';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {distinctUntilChanged} from 'rxjs/operator/distinctUntilChanged';

@Component({
  selector: '[app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	
	loading: boolean = false;

    constructor(private router: Router) {

        router.events.subscribe( (event: Event) => {

            if (event instanceof NavigationStart) {
                // Show loading indicator
                this.loading = true;
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
