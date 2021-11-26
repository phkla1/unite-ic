import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { ChatMessage, Team } from '../services/interfaces';
import { UniteICService } from '../services/unite-ic.service';
import * as confettiLib from 'canvas-confetti';

@Component({
	selector: 'app-team-inbox',
	templateUrl: './team-inbox.component.html',
	styleUrls: ['./team-inbox.component.scss']
})
export class TeamInboxComponent implements OnInit {
	team: Team;
	messages$: Subject<ChatMessage>;
	canvas: HTMLCanvasElement;
	confettiCanvas;
	/*
	messages = [
		{messageId: 1, from : 'me', message : "the first message from me", timestamp : 10, replyTo : ''},
		{messageId : 2, from : 'them', message : "the first message from them", timestamp : 10, replyTo : ''},
		{messageId : 3, from : 'them', message : "the first reply message from them", timestamp : 10, replyTo : 1},
		{messageId : 4, from : 'me', message : "the first reply message from me", timestamp : 10, replyTo : 3},
	];
	*/

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private icService: UniteICService, private renderer: Renderer2, private elementRef: ElementRef) { }

	ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe(
			params => {
				this.team = window.history.state;
				//				this.showOldMessages();
				this.generateWelcomeMessage();
			},
			err => { },
			() => { }
		);
	}

	/*
	showOldMessages() {
		let sortedMessages = this.messages.sort((first, second) =>  first.messageId - second.messageId);
		let container = Array.from(document.getElementsByClassName('messages'))[0] as HTMLElement;

		sortedMessages.forEach((message, ind) => {
			//add styles depending on whether it's buyer or seller 
			let elem = document.createElement('div');
			elem.id = ind.toString(); 
			elem.appendChild(document.createTextNode(message.message));
			container.appendChild(elem);	
			let newElem = document.getElementById(ind.toString());
			//classlist.add isn't working, hence this other approach
			message.from == 'me' ? this.addClass(newElem, 'buyer-chat'): this.addClass(newElem, 'seller-chat');
		});
		this.gotoDeliveryPage().subscribe();
	}
	*/


	adjustHeight() {
		//will use this to automatically adjust height of textarea based on text entered
	}

	generateWelcomeMessage() {
		//demo what happens when a user joins
		let container = document.getElementById('messages');
		let elem = document.createElement('div');
		elem.id = 'welcome-message';
		elem.appendChild(document.createTextNode(this.icService.name + ' has joined the team! Send them a welcome message!'))
		container.appendChild(elem);
		let welcome = document.getElementById('welcome-message');
		this.addClass(welcome, 'chat-box');
		this.addClass(welcome, 'welcome-chat');
		this.celebrate();
	}

	addClass(elem: HTMLElement, classname: string) {
		let chatbox = document.createElement('style');
		chatbox.type = 'text/css';
		chatbox.innerHTML = '.chat-box {min-height: 3rem; width: 60%; background-color: whitesmoke; margin-top: 0.5rem; padding: 0 0.5rem 0 0.5rem; }';

		let buyerchat = document.createElement('style');
		buyerchat.type = 'text/css';
		buyerchat.innerHTML = '.buyer-chat {align-self: flex-start; border-radius: 0.5rem 0.2rem 0.2rem 0; background-color: mintcream;}';

		let sellerchat = document.createElement('style');
		sellerchat.type = 'text/css';
		sellerchat.innerHTML = '.seller-chat {align-self: flex-end; border-radius: 0.2rem 1rem 0 0.2rem; background-color: greenyellow; }';

		document.getElementsByTagName('head')[0].appendChild(chatbox);
		document.getElementsByTagName('head')[0].appendChild(buyerchat);
		document.getElementsByTagName('head')[0].appendChild(sellerchat);
		switch (classname) {
			case 'buyer-chat':
				elem.className = 'chat-box buyer-chat';
				break;
			case 'seller-chat':
				elem.className = 'chat-box seller-chat';
				break;
			default:
				break;
		}
	}

	celebrate() {
		var myCanvas = document.createElement('canvas');
		let container = document.getElementById('messages');
		container.appendChild(myCanvas);

		var myConfetti = confettiLib.create(myCanvas, {
			resize: true,
		});
		myConfetti({
			particleCount: 100,
			spread: 160
		});
		myConfetti();
	}

	sendMessage() {
		let message = (document.getElementById('sendMessage') as HTMLInputElement).value;
	}

	showLoader() { }

	gotoDeliveryPage() {
		//start delay then show completion and movement to delivery stage
		return of().pipe(
			delay(2000),
			map(() => this.generateWelcomeMessage()),
			delay(2000),
			map(() => this.showLoader()),
			delay(3000),
			map(() => this.router.navigateByUrl('/receiveItems'))
		);
	}
}
