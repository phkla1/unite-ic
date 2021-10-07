import { Component } from "@angular/core";
import { UniteICService } from "./unite-ic.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public title = 'unite-ic';
	public response = '';

	constructor(private uniteConnector: UniteICService, ) {
	}

	postmanEcho() {
		let greeting = document.getElementById('greeting');
		this.uniteConnector.httpEcho()
		.subscribe(
			data => {
				greeting!.innerText = JSON.stringify(data);
			},
			err => {
				greeting!.innerText = JSON.stringify(err);
			}
		);
	}

	async listAllUsers() {
		let greeting = document.getElementById('greeting');
		greeting.innerText = '......';
		let users = this.uniteConnector.getUsers();
		greeting? greeting.innerText += users 
				: greeting.innerText= 'UNDEFINED GREETING:' + greeting;
	}

	async iiLogin() {
		let greeting = document.getElementById('greeting');
		//the connector login should return an identity
		const id = await this.uniteConnector.login();
		const message = "LOGIN MESSAGE IS: " + id;
		greeting ? greeting!.innerText = message : Function.prototype();
	}

	registerThisUser() {
		let greeting = document.getElementById('greeting');
		let response = this.uniteConnector.register();
		const message = "REGISTER MESSAGE IS: " + response;
		greeting ? greeting!.innerText = message : Function.prototype();
	}

	async logout() {
		this.uniteConnector.logout();
		document.getElementById('greeting').innerText = '';
	}
}
