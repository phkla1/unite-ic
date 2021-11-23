import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { Team } from '../services/interfaces';

@Component({
	selector: 'app-team-inbox',
	templateUrl: './team-inbox.component.html',
	styleUrls: ['./team-inbox.component.scss']
})
export class TeamInboxComponent implements OnInit {
	team : Team;
	messages = [
		{messageId: 1, from : 'me', message : "the first message from me", timestamp : 10, replyTo : ''},
		{messageId : 2, from : 'them', message : "the first message from them", timestamp : 10, replyTo : ''},
		{messageId : 3, from : 'them', message : "the first reply message from them", timestamp : 10, replyTo : 1},
		{messageId : 4, from : 'me', message : "the first reply message from me", timestamp : 10, replyTo : 3},
	];

	constructor(private activatedRoute : ActivatedRoute, private router:Router) { }

	ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe(
			params => {
				this.team = window.history.state;
				this.showMessages();
			},
			err => {},
			() => {
			}
		);
	}

	showMessages() {
		let sortedMessages = this.messages.sort((first, second) => second.messageId - first.messageId);
		let container = Array.from(document.getElementsByClassName('messages'))[0] as HTMLElement;
		sortedMessages.forEach(message => {
			//add styles depending on whether it's us or someone else
			let elem = new Object as HTMLElement;
			elem.classList.add('chat-box');
			message.from == 'me' ? elem.classList.add('our-chat') : elem.classList.add('their-chat')
			container.appendChild(elem);	
		});

		this.gotoDeliveryPage().subscribe();

	}

	adjustHeight() {
		//will use this to automatically adjust height of textarea based on text entered
	}

	showLoader() {}

	gotoDeliveryPage() {
	//start delay then show completion and movement to delivery stage
	return of().pipe(
			delay(5000),
			map(() => this.showLoader()),
			delay(3000),
			map(() => this.router.navigateByUrl('/receiveItems'))
		);
	}
}
