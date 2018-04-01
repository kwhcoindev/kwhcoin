import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClientModule }    from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  // <-- #1 import module

import { AppComponent } from './app.component';
import { AppService, EmitterService } from './app.service';
import { AppConstants } from './app.constants';

import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { IcdcPipe, IcdcPctPipe, LargeCurrencyPipe, MediumCurrencyPipe, LargeNumberPipe, IcdcChangePipe, CurrencySymbolPipe, TimeFormatPipe } from './utils/pipes';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { TheCryptocurrencyBlockchainComponent } from './the-cryptocurrency-blockchain/the-cryptocurrency-blockchain.component';
import { IcoInformationComponent } from './ico-information/ico-information.component';
import { OurMissionComponent } from './our-mission/our-mission.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TheKwhTeamComponent } from './the-kwh-team/the-kwh-team.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { KnowYourCustomerComponent } from './know-your-customer/know-your-customer.component';
import { TokenComponent } from './token/token.component';

import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { TrackCoinComponent } from './track-coin/track-coin.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { FaqComponent } from './faq/faq.component';
import { WhitePaperComponent } from './white-paper/white-paper.component';
import { IcoParticipationGuideComponent } from './ico-participation-guide/ico-participation-guide.component';
import { KycForm2Component } from './kyc-form2/kyc-form2.component';
import { EventsComponent } from './events/events.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';


export class NgbDateMomentParserFormatter extends NgbDateParserFormatter {
    private momentFormat: string = "MM/DD/YYYY";

    constructor() {
        super();
    };
    format(date: NgbDateStruct): string {
        if (date === null) {
            return '';
        }
        let d = moment({ year: date.year,
                         month: date.month - 1,
                         date: date.day });
        return d.isValid() ? d.format(this.momentFormat) : '';
    }

    parse(value: string): NgbDateStruct {
        if (!value) {
            return null;
        }
        let d = moment(value, this.momentFormat);
        return d.isValid() ? { year: d.year(),
                               month: d.month() + 1,
                               day: d.date() } : null;
    }
}

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'the-cryptocurrency-blockchain', component: TheCryptocurrencyBlockchainComponent},
  { path: 'ico-information', component: IcoInformationComponent},
  { path: 'our-mission', component: OurMissionComponent},
  { path: 'about-us', component: AboutUsComponent},
  { path: 'the-kwh-team', component: TheKwhTeamComponent},
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'join-us', component: JoinUsComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'events', component: EventsComponent},
  { path: 'know-your-customer', component: KnowYourCustomerComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'verify', component: VerifyComponent},
  { path: 'ico-participation-guide', component: IcoParticipationGuideComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    IcdcPipe,
    IcdcChangePipe,
    IcdcPctPipe,
    CurrencySymbolPipe,
    TimeFormatPipe,
    LargeCurrencyPipe,
    MediumCurrencyPipe,
    LargeNumberPipe,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CountdownTimerComponent,
    TheCryptocurrencyBlockchainComponent,
    IcoInformationComponent,
    OurMissionComponent,
    AboutUsComponent,
    TheKwhTeamComponent,
    ContactUsComponent,
    KnowYourCustomerComponent,
    TokenComponent,
    TrackCoinComponent,
    JoinUsComponent,
    FaqComponent,
    WhitePaperComponent,
    IcoParticipationGuideComponent,
    KycForm2Component,
    EventsComponent,
    SigninComponent,
    SignupComponent,
    VerifyComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    JsonpModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false, useHash: true } // <-- debugging purposes only
    ),
    NgbModule.forRoot()
  ],
  providers: [AppService,
              AppConstants,
              PercentPipe,
              EmitterService,
              {provide: NgbDateParserFormatter, useClass: NgbDateMomentParserFormatter }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
