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
	confetti;

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private icService: UniteICService, private renderer: Renderer2, private elementRef: ElementRef) { }

	ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe(
			params => {
				this.team = window.history.state;
				//				this.showOldMessages();
				this.setupCanvas();
				this.generateWelcomeMessage();
			},
			err => { },
			() => { }
		);
	}

	adjustHeight() {
		//will use this to automatically adjust height of textarea based on text entered
	}

	setupCanvas() {
		var myCanvas = document.createElement('canvas');
		myCanvas.id = 'canvas';
		let container = document.getElementById('messages');
		container.appendChild(myCanvas);

		this.confetti = confettiLib.create(myCanvas, {
			resize: true,
		});
		this.confetti({
			particleCount: 100,
			spread: 160
		});
	}

	generateMessage(type = 'normal', sender = 'buyer', message = '') {
		let id = Math.floor(Math.random() * 100000).toString();	
		let classes = [], msg;
		let container = document.getElementById('messages');
		switch (type) {
			case 'normal':
				classes = ['chat-box', sender == 'buyer' ? 'buyer-chat' : 'seller-chat'];
				msg = (document.getElementById('sendMessage') as HTMLInputElement).value; 
				break;
			case 'welcome':
				classes = ['chat-box', 'welcome-chat'];
				msg = this.icService.name + ' has just joined the team! Send a welcome message!'; 
				break;
			default:
				break;
		}
		if(sender === 'seller') msg = message;
		let elem = document.createElement('div');
		elem.id = id;
		elem.appendChild(document.createTextNode(msg));
		let canvas = document.getElementById('canvas');
		canvas.before(elem);
		let newElem = document.getElementById(id); 
		classes.forEach(cls => this.addClass(newElem, cls));
	}

	sendMessage() {
		this.generateMessage();
		this.icService.sleep(2000).then(
			ready => {
				this.generateMessage('normal', 'seller', 'Your products have arrived!!!')
				this.celebrate();
		}).then(
			ready => this.icService.sleep(3000)
		).then(ready => this.router.navigateByUrl('/receiveItems'));
	}

	generateWelcomeMessage() {
		//demo what happens when a user joins
		this.generateMessage('welcome');
		this.celebrate();
	}

	addClass(elem: HTMLElement, classname: string) {
		let chatbox = document.createElement('style');
		chatbox.type = 'text/css';
		chatbox.innerHTML = '.chat-box {min-height: 5rem; width: 60%; margin-top: 1rem; padding: 0 0.5rem 0 0.5rem; font-size : 3vh; }';

		let buyerchat = document.createElement('style');
		buyerchat.type = 'text/css';
		buyerchat.innerHTML = '.buyer-chat {align-self: flex-start; border-radius: 2rem 1rem 1rem 0; background-color: mintcream;}';

		let sellerchat = document.createElement('style');
		sellerchat.type = 'text/css';
		sellerchat.innerHTML = '.seller-chat {align-self: flex-end; border-radius: 1rem 2rem 0 1rem; background-color: greenyellow; }';

		let welcomechat = document.createElement('style');
		welcomechat.type = 'text/css';
		welcomechat.innerHTML = '.welcome-chat { align-self: center;	border-radius: 1rem; background-color: yellow; border: 4px solid rgba(152, 193, 81, 0.4); text-align: center; width: 85%; margin : 3px;}';

		document.getElementsByTagName('head')[0].appendChild(chatbox);
		document.getElementsByTagName('head')[0].appendChild(buyerchat);
		document.getElementsByTagName('head')[0].appendChild(sellerchat);
		document.getElementsByTagName('head')[0].appendChild(welcomechat);
		switch (classname) {
			case 'buyer-chat':
				elem.className = 'chat-box buyer-chat';
				break;
			case 'seller-chat':
				elem.className = 'chat-box seller-chat';
				break;
			case 'welcome-chat':
				elem.className = 'chat-box welcome-chat';
				break;
			default:
				break;
		}
	}

	celebrate() {
		this.confetti();
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
