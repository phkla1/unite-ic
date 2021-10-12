import { Inject, Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'; 
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from '@dfinity/agent';
import {DOCUMENT} from '@angular/common'; 
import { Subject } from 'rxjs';
const unite_default_actor = require('src/declarations/unite').unite;
const canisterId = require('src/declarations/unite').canisterId; 
const createActor = require('src/declarations/unite').createActor; 

@Injectable({
	providedIn: 'root'
})
export class UniteICService {
	http : HttpClient;
	authClient : AuthClient;
	currentIdentity : Identity;
	DFX_NETWORK = null;
	LOCAL_II_CANISTER = 'r7inp-6aaaa-aaaaa-aaabq-cai';
	LOCAL_II_URL = "https://e075-197-211-58-61.ngrok.io" + "?canisterId=" + this.LOCAL_II_CANISTER;
	loggedIn	= false;
	public loginSubject : Subject<boolean>;

	constructor(http : HttpClient, @Inject(DOCUMENT) private document: Document) { 
		this.http = http;
		this.init();
		this.loginSubject = new Subject<boolean>();
	}

	//console logs can be difficult to see when using mobile phones with small screens, so this function logs to the UI
	renderConsole(msg) {
		let box = this.document.getElementById('console');
		if(msg) {
			box.innerText += 
			`
			CONSOLE.LOG : ${msg}
			`;	
		}
		else {
			box.innerText = '';
		}
	}

	async init() {
		this.authClient = await AuthClient.create();
	}

	public iilogin() {
		return this.authClient.login({
			identityProvider : this.DFX_NETWORK === "ic" 
								? "https://identity.ic0.app/#authorize" 
								: this.LOCAL_II_URL,
			onSuccess : async () => {
				this.currentIdentity = await this.authClient.getIdentity(); 
				this.loggedIn = true;
//				this.renderConsole(JSON.stringify(this.currentIdentity));
				this.loginSubject.next(true);
				return true;
			},
			onError : async () => {
				this.loginSubject.next(false);
				return false;
			}
		});
	}

	//register if not registered, and send a response indicating if there are any missing fields that the user needs to supply
	public async checkRegistration() {
		if(this.loggedIn) {
			return await this.connectToIc('register');
		}
		else {
			return false;
		}
	}

	async connectToIc(fn : string, args?) {
		let result;
		let identity = this.currentIdentity;
		let unite_actor = createActor(
			canisterId as string, {
				agentOptions : {
					identity
				} 
			}
		);

		switch (fn) {
			case 'listUsers':
				result = await unite_actor.listUsers();
				break;
			case 'register':
				result = await unite_actor.registerLogin();
				break;
			case 'updateUserRecord':
				result = await unite_actor.updateUserRecord(args);
				break;
			default:
				break;
		}
		try {
			let res = JSON.stringify(result, (key, value) =>
				typeof value === "bigint" ? value.toString()  : value
			);
			this.renderConsole('RESULT FROM ' + fn + ' ' + res);
		} catch (error) {
			this.renderConsole(error);	
		}

		return result;
	}


	public async getUsers() {
		if(!this.loggedIn) {
			this.renderConsole("NOT LOGGED IN. CALLING DEFAULT ACTOR")
			let list = await unite_default_actor.listUsers();
			return list;
		}
		else {
			let userlist = this.connectToIc('listUsers');
			this.renderConsole(JSON.stringify(userlist));
			return userlist;
		}
	}

	public async updateRecord(firstname, surname, phone) {
		let recordToAdd = { firstname, surname, phone };
		return await this.connectToIc('updateUserRecord', recordToAdd);
	}

	public logout() { 
		this.loggedIn = false;
		this.renderConsole(null);
	}

	public httpEcho() {
		let params = new HttpParams();
		params.set('foo', 'bar');
		return this.http.get('https://ictest.free.beeceptor.com', {params});
	}
}
