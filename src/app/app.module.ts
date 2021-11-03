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

@NgModule({
  declarations: [
    AppComponent,
    InboxComponent,
    LoginComponent,
    CollectBasicDataComponent,
    ModalbasicComponent,
    ConversationComponent
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
