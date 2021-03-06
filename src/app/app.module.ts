import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InboxComponent } from './main-tab/inbox/inbox.component';
import { LoginComponent } from './login/login.component';
import { CollectBasicDataComponent } from './collect-basic-data/collect-basic-data.component';
import { ModalbasicComponent } from './modalbasic/modalbasic.component'; 
import {FormsModule} from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './conversation/conversation.component';
import { FeaturedDealsComponent } from './main-tab/featured-deals/featured-deals.component';
import { DealDetailsComponent } from './main-tab/deal-details/deal-details.component';
import { BuyingOptionsComponent } from './buying-options/buying-options.component';
import { ReceiveItemsComponent } from './receive-items/receive-items.component';
import { TeamInboxComponent } from './team-inbox/team-inbox.component';

@NgModule({
  declarations: [
    AppComponent,
    InboxComponent,
    LoginComponent,
    CollectBasicDataComponent,
    ModalbasicComponent,
    ConversationComponent,
    FeaturedDealsComponent,
    DealDetailsComponent,
    BuyingOptionsComponent,
    ReceiveItemsComponent,
    TeamInboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule,
	FormsModule,
	CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
