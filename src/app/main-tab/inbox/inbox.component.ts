import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
	chatMessages = [];
	emptyInboxMessage = "You have no new inbox messages or broadcasts. They will appear here when sent by admins or users."

	constructor() { }

	ngOnInit(): void {
	}



}
