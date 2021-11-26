import { Inject, Injectable } from '@angular/core';
import { AuthClient } from "@dfinity/auth-client";
import { Identity, HttpAgent } from '@dfinity/agent';
import {DOCUMENT} from '@angular/common'; 
import { of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { Deal, Order, Team } from './interfaces';
const unite_default_actor = require('src/declarations/unite').unite;
const canisterId = require('src/declarations/unite').canisterId; 
const createActor = require('src/declarations/unite').createActor; 

@Injectable({
	providedIn: 'root'
})
export class UniteICService {
	authClient : AuthClient;
	currentIdentity : Identity;
//	DFX_NETWORK = "ic";
	DFX_NETWORK = "null";
	LOCAL_II_CANISTER = 'rwlgt-iiaaa-aaaaa-aaaaa-cai';
	LOCAL_II_URL = "https://fdb9-197-211-58-122.ngrok.io" + "?canisterId=" + this.LOCAL_II_CANISTER;
	iiLoggedIn	= false;
	public loginSubject : Subject<boolean>;
	public name = '';
	unite_actor : any;
	today = new Date().getTime();
	oneDay = 60 * 60 * 24 * 1000;
	dealSubject$ : ReplaySubject<Deal[]>;
	dealSub : Subscription;
	teamSub : Subscription;
	orderSub : Subscription;
	orderCode = 0;

	constructor(@Inject(DOCUMENT) private document: Document) { 
		this.loginSubject = new Subject<boolean>();
		this.dealSubject$ = new ReplaySubject();
		this.init();
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

	public async getMessages(teamId) {
		let last24hrsNs = (this.today - 60*60*24*1000) * 1000000;
		if(this.iiLoggedIn) {
			return await this.unite_actor.getLatestGroupChats(last24hrsNs);
		}
		else {
			return await unite_default_actor.getLatestGroupChats(last24hrsNs);
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

	public daysLeft(datems) : number {
		let timeLeft = datems - this.today;
		return timeLeft / this.oneDay;
	}

	public async getDeals() {
		let rawDeals : Deal [];
		if(this.iiLoggedIn) {
			rawDeals = await this.unite_actor.listDeals();
		}
		else {
			rawDeals = await unite_default_actor.listDeals();
		}
		let deals = this.formatData(rawDeals);
		if(this.dealSub) this.dealSub.unsubscribe();
		this.dealSub = of(deals).subscribe(this.dealSubject$);
	}

	public async getTeams(dealId) {
		let rawTeams : Team[];
		if(this.iiLoggedIn) {
			rawTeams = await this.unite_actor.listTeams(dealId);
		}
		else {
			rawTeams = await unite_default_actor.listTeams(dealId);
		}	
		let teams = this.formatData(rawTeams);
		return teams;
	}

	public async getOrders(dealId) {
		let rawOrders : Order[];
		if(this.iiLoggedIn) {
			rawOrders = await this.unite_actor.listOrders(dealId);
		}
		else {
			rawOrders = await unite_default_actor.listOrders(dealId);
		}	
		let orders = this.formatData(rawOrders);
		return orders;
	}

	public makeOrder() {
		this.orderCode = Math.floor(Math.random() * 8999999 + 1000000);
	}

	public formatData(data) {
		let res;
		try {
			res = JSON.stringify(data, (key, value) =>
				typeof value === "bigint" ? parseInt(value.toString())  : value
			);
		} catch (error) {
			console.log("ERROR IN FORMATDATA:", error);
		}
		return JSON.parse(res);
	}

	public sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
