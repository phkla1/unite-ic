import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectBasicDataComponent } from './collect-basic-data/collect-basic-data.component';
import { ConversationComponent } from './conversation/conversation.component';
import { LoginComponent } from './login/login.component';
import { InboxComponent } from './main-tab/inbox/inbox.component';

const routes: Routes = [
	{ path : 'inbox', component : InboxComponent },
	{ path : 'login', component : LoginComponent},
	{ path : 'collectData', component : CollectBasicDataComponent},
	{ path : 'conversation/:userId', component : ConversationComponent},
	{ path : '', component : LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
