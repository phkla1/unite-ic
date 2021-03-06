import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { EMPTY, from, Subscription } from "rxjs";
import {switchMap} from 'rxjs/operators'; 
import { UniteICService } from "../services/unite-ic.service";
import {UserRecord} from '../services/interfaces'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	public title = 'login';
	public response = '';
	loginSub : Subscription;
	loginInProgress = false;
	profile : UserRecord;
	phone : string;
	password : string;

	constructor(private icConnector: UniteICService, private router:Router) {
		this.profile = new Object as UserRecord;
	}

	ngOnInit() : void {}

	showButtonProgress(button : HTMLButtonElement) {
        button.innerHTML = `&#x263A`;
        button.classList.add('spin-button');
		button.disabled = true;
	}

	removeButtonProgress(id) {
		this.loginInProgress = false;
		let button = document.getElementById(id) as HTMLButtonElement;
		switch (id) {
			case 'iiLogin':
        		button.innerHTML = `Login With Face, Touch, Security Key`;
				break;
			case 'trad-login':
        		button.innerHTML = `LOGIN`;
				break;	
			default:
				break;
		}
        button.classList.remove('spin-button');
	}

	//authclient login gives a success message once the II login page opens, so we need loginSub to tell us when the login is actually successful
	async iiLogin(id) {
		this.loginInProgress = true;
        let button = document.getElementById(id) as HTMLButtonElement;
		this.showButtonProgress(button);
		let response = await this.icConnector.iilogin();
		this.loginSub = this.icConnector.loginSubject
		.pipe(
			switchMap(data => {
				if(data) {
					//get user record
					return from(this.icConnector.checkRegistration());
				}
				else {
					return EMPTY;
				}
			}),
		)
		.subscribe(
			(data:UserRecord) => {
				if(!data.firstname || !data.surname || !data.phone) {
					this.router.navigateByUrl('/collectData', {state : data});
				}
				else {
					this.icConnector.name = data.firstname;
					this.router.navigateByUrl('/deals');
				}
			},
			err => {
				this.loginInProgress = false;
			},
			() => {
				//we don't expect this to happen
				this.loginInProgress = false;	
			}
		)
	}

	loginByName(id) {
		this.loginInProgress = true;
        let button = document.getElementById(id) as HTMLButtonElement;
		this.showButtonProgress(button);

		if(this.phone && this.password) {
			this.icConnector.phoneLogin(this.phone).then(
				value => {
					if(value.firstname) {
						this.icConnector.name = value.firstname;
						this.router.navigateByUrl('/deals');
					}
					else {
						console.log("EMPTY RECORD")
					}
				},
				fail => {
					console.log("FAILED TO LOGIN:", fail)
				}
			);
		}
	}

	async logout() {
		this.icConnector.logout();
		document.getElementById('greeting').innerText = '';
		this.loginSub.unsubscribe();
	}
}