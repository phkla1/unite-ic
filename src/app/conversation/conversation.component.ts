import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
	userId : string;
	messages = [
		{messageId: 1, from : 'me', message : "the first message from me", timestamp : 10, replyTo : ''},
		{messageId : 2, from : 'them', message : "the first message from them", timestamp : 10, replyTo : ''},
		{messageId : 3, from : 'them', message : "the first reply message from them", timestamp : 10, replyTo : 1},
		{messageId : 4, from : 'me', message : "the first reply message from me", timestamp : 10, replyTo : 3},
	];

	constructor(private route : ActivatedRoute, private router : Router) { }

	ngOnInit(): void {
		this.route.paramMap.subscribe(
			params => {
				this.userId = params.get('userId');
				console.log("USER ID NOW SET TO :", this.userId);
				this.showMessages();
			},
			err => {},
			() => {
			}
		);
	}

	showMessages() {
		console.log("SHOW MESSAGES CALLED");
		let sortedMessages = this.messages.sort((first, second) => second.messageId - first.messageId);
		let container = Array.from(document.getElementsByClassName('messages'))[0] as HTMLElement;
		console.log("CONTAINER IS:", container);
		sortedMessages.forEach(message => {
			//add styles depending on whether it's us or someone else
			let elem = new Object as HTMLElement;
			elem.classList.add('chat-box');
			message.from == 'me' ? elem.classList.add('our-chat') : elem.classList.add('their-chat')
			container.appendChild(elem);	
		});
	}

	adjustHeight() {
		//will use this to automatically adjust height of textarea based on text entered
	}
}
