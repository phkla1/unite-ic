import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { EMPTY, from, of, Subscription } from "rxjs";
import {map, switchMap} from 'rxjs/operators'; 
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
	showSpinner : boolean = false;

	constructor(private uniteConnector: UniteICService, private router:Router) {
		this.profile = new Object as UserRecord;
	}

	ngOnInit() : void {}

	//authclient login gives a success message once the II login page opens, so we need loginSub to tell us when the login is actually successful
	async iiLogin() {
		this.loginInProgress = true;
		let response = await this.uniteConnector.iilogin();
		this.loginSub = this.uniteConnector.loginSubject
		.pipe(
			switchMap(data => {
				if(data) {
					//get user record
					return from(this.uniteConnector.checkRegistration());
				}
				else {
					return EMPTY;
				}
			}),
		)
		.subscribe(
			(data:UserRecord) => {
				if(!data.firstname || !data.surname || !data.phone) {
//					this.showSpinner = false;
					this.router.navigateByUrl('/collectData', {state : data});
				}
				else {
//					this.showSpinner = false;
					this.router.navigateByUrl('/inbox');
				}
				/*
				let console = document.getElementById('console');
				console.innerText = data.callerId + data.counter + data.firstname + data.surname + data.phone + data.timestamp 
				*/
			},
			err => {
				this.loginInProgress = false;
//				this.showSpinner = false;
				//Add Toast message about login error...
			},
			() => {
				//we don't expect this to happen
				this.loginInProgress = false;	
				this.showSpinner = false;
			}
		)
	}


	async logout() {
		this.uniteConnector.logout();
		document.getElementById('greeting').innerText = '';
		this.loginSub.unsubscribe();
	}

}

