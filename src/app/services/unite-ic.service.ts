import { Inject, Injectable } from '@angular/core';
import { AuthClient } from "@dfinity/auth-client";
import { Identity, HttpAgent } from '@dfinity/agent';
import {DOCUMENT} from '@angular/common'; 
import { Subject } from 'rxjs';
const unite_default_actor = require('src/declarations/unite').unite;
const canisterId = require('src/declarations/unite').canisterId; 
const createActor = require('src/declarations/unite').createActor; 

@Injectable({
	providedIn: 'root'
})
export class UniteICService {
	authClient : AuthClient;
	currentIdentity : Identity;
	DFX_NETWORK = null;
	LOCAL_II_CANISTER = 'rwlgt-iiaaa-aaaaa-aaaaa-cai';
	LOCAL_II_URL = "https://3bea-197-211-58-120.ngrok.io" + "?canisterId=" + this.LOCAL_II_CANISTER;
	iiLoggedIn	= false;
	public loginSubject : Subject<boolean>;
	public name = '';
	unite_actor : any;

	constructor(@Inject(DOCUMENT) private document: Document) { 
		this.init();
		this.loginSubject = new Subject<boolean>();
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
			this.iiLoggedIn = true;
//	this.renderConsole(JSON.stringify(this.currentIdentity));
			this.registerActor(this.currentIdentity);
			this.loginSubject.next(true);
			return true;
		},
		onError : async () => {
			this.loginSubject.next(false);
			return false;
		}});
	}

	public async phoneLogin(phone) {
		let result = await unite_default_actor.nameLogin(phone);
		console.log("RESULT OF NAME LOGIN:", result);
		return result;
	}

	//create the actor
	registerActor(identity) {
		this.unite_actor = createActor(
			canisterId as string, {
				agentOptions : {
					identity
				} 
			}
		);
	}

	//register if not registered, and send a response indicating if there are any missing fields that the user needs to supply
	public async checkRegistration() {
		if(this.iiLoggedIn) {
//			return await this.connectToIc('register');
			let result = await this.unite_actor.registerLogin();
			this.consoleLog(result, 'CHECKREGISTRATION');
			return result;
		}
		else {
			return false;
		}
	}

	public async getUsers() {
		if(!this.iiLoggedIn) {
//	this.renderConsole("NOT LOGGED IN. CALLING DEFAULT ACTOR")
			let list = await unite_default_actor.listUsers(this.name);
			console.log("NOT LOGGED IN. USERS:", list);
			return list;
		}
		else {
			let userList = await this.unite_actor.listUsers('');
			this.consoleLog(userList, 'GETUSERS');
			return userList;
		}
	}

	public async updateRecord(firstname, surname, phone) {
		let recordToAdd = { firstname, surname, phone };
		let result = await this.unite_actor.updateUserRecord(recordToAdd);
		this.consoleLog(result, 'UPDATERECORD');
		return result;
	}

	public async whoami() {
		if(this.iiLoggedIn) {
			return await this.unite_actor.getMyRecord('');
		}
		else {
			return await unite_default_actor.getMyRecord(this.name);
		}
	}

	public async connectToUser(to) {
		if(this.iiLoggedIn) {
			return await this.unite_actor.connect(to);
		}
		else {
			return await unite_default_actor.connect(to);
		}
	}

	public async getConnections() {
		if(this.iiLoggedIn) {
			return await this.unite_actor.getConnections('');
		}
		else {
			return await unite_default_actor.getConnections(this.name);
		}
	}

	public async sendMessage(message) {
		if(this.iiLoggedIn) {
			return await this.unite_actor.putChat('', message);
		}
		else {
			return await unite_default_actor.getConnections(this.name, message);
		}	
	}

	public logout() { 
		this.iiLoggedIn = false;
		//clear the phone screen 
		this.renderConsole(null);
	}

	public consoleLog(data, caller) {
		try {
			let res = JSON.stringify(data, (key, value) =>
				typeof value === "bigint" ? value.toString()  : value
			);
			console.log('RESULT FROM ' + caller + res);
		} catch (error) {
			console.log("ERROR IN CONNECTTOIC:", error);
		}
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


}
