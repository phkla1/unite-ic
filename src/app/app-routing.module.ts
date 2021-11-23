import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyingOptionsComponent } from './buying-options/buying-options.component';
import { CollectBasicDataComponent } from './collect-basic-data/collect-basic-data.component';
import { ConversationComponent } from './conversation/conversation.component';
import { LoginComponent } from './login/login.component';
import { DealDetailsComponent } from './main-tab/deal-details/deal-details.component';
import { FeaturedDealsComponent } from './main-tab/featured-deals/featured-deals.component';
import { InboxComponent } from './main-tab/inbox/inbox.component';
import { ReceiveItemsComponent } from './receive-items/receive-items.component';
import { TeamInboxComponent } from './team-inbox/team-inbox.component';

const routes: Routes = [
	{ path : 'inbox', component : InboxComponent },
	{ path : 'login', component : LoginComponent},
	{ path : 'collectData', component : CollectBasicDataComponent},
	{ path : 'conversation/:userId', component : ConversationComponent},
	{ path : 'deals', component : FeaturedDealsComponent},
	{ path : 'dealDetail', component : DealDetailsComponent},
	{ path : 'checkout' , component : BuyingOptionsComponent},
	{ path : 'receiveItems', component : ReceiveItemsComponent},
	{ path : 'teambox', component : TeamInboxComponent},
	{ path : '', component : LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
