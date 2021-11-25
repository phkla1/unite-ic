import { Inject, Injectable } from '@angular/core';
import { AuthClient } from "@dfinity/auth-client";
import { Identity, HttpAgent } from '@dfinity/agent';
import {DOCUMENT} from '@angular/common'; 
import { from, of, ReplaySubject, Subject, Subscriber, Subscription } from 'rxjs';
import { Deal, Order, Team } from './interfaces';
import { tap } from 'rxjs/operators';
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
	LOCAL_II_URL = "https://ccfa-45-91-22-227.ngrok.io" + "?canisterId=" + this.LOCAL_II_CANISTER;
	iiLoggedIn	= false;
	public loginSubject : Subject<boolean>;
	public name = '';
	unite_actor : any;
	today = new Date().getTime();
	oneDay = 60 * 60 * 24 * 1000;
	dealSubject$ : ReplaySubject<Deal[]>;
	dealSub : Subscription;
	teamSubject$ : Subject<Team[]>;
	teamSub : Subscription;
	orderSubject$ : Subject<Order[]>;
	orderSub : Subscription;
	orderCode = 0;

	constructor(@Inject(DOCUMENT) private document: Document) { 
		this.loginSubject = new Subject<boolean>();
		this.dealSubject$ = new ReplaySubject();
		this.teamSubject$ = new Subject();
		this.orderSubject$ = new Subject();
		this.init();
	}

	async init() {
		this.authClient = await AuthClient.create();

//		this.dealSub = this.getDeals().subscribe(this.dealSubject$);
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

	public daysLeft(datems) : number {
		let timeLeft = datems - this.today;
		return timeLeft / this.oneDay;
	}

	/*
	//subscribed to by this.dealsSubject
	getDeals() {
		let today = new Date().getTime();
		let oneDay = 60 * 60 * 24 * 1000;
		let availableDeals : Deal[] = [
			{
				dealId : 1,
				dealBanner : '../assets/tomato-summary.png', 
				productName : 'Big, Juicy Jos Tomatoes',
				productDescription: 'Organic, freshly-picked Jos tomatoes. Farm to table. Tomatoes are low in calories, high in fiber, and are a good source of vitamin A, C, and B2.',
				dealDescription : 'Minimum order 1 paint. Each paint contains 10-12 fresh tomatoes depending on size & harvest.',
				sellerLocality : 'Lekki',
				unit : 'Paint',
				unitPrice : 2000,
				retailPrice : 3000,
				dealTargetUnits : 10,
				deadline : today + 5 * oneDay,
				totalInventoryBalance : 50,
				sellerName : 'Moji Alabi'	
			},
			{
				dealId : 2,
				dealBanner : '../assets/apples-summary.png', 
				productName : 'Fresh Organic Red Apples',
				productDescription: 'Benin red apples. Grown with only organic and natural fertilizers.',
				dealDescription : 'Minimum order 1 pack. Each pack contains 10 apples',
				sellerLocality : 'Lekki',
				unit : 'Pack',
				unitPrice : 1000,
				retailPrice : 2000,
				dealTargetUnits : 10,
				deadline : today + 7 * oneDay,
				totalInventoryBalance : 50,
				sellerName : 'Taiwo Adegoke'
			},	
			{
				dealId : 3,
				dealBanner : '../assets/beef-summary.png', 
				productName : 'High Quality Beef',
				productDescription: 'Organic longhorn cattle. Freshly slaughtered.',
				dealDescription : 'Minimum order 10KG',
				sellerLocality : 'Lekki',
				unit : '10KG',
				unitPrice : 15000,
				retailPrice : 26000,
				dealTargetUnits : 5,
				deadline : today + 6 * oneDay,
				totalInventoryBalance : 50,
				sellerName : 'Oseni Moruf'	
			},
			{
				dealId : 4,
				dealBanner : '../assets/corn-summary.png', 
				productName : 'Fresh Soft Corn',
				productDescription: 'Freshly harvested corn from our farm in Epe',
				dealDescription : 'Minimum order 20 Ears',
				sellerLocality : 'Lekki',
				unit : 'Ear',
				unitPrice : 1800,
				retailPrice : 2000,
				dealTargetUnits : 200,
				deadline : today + 3 * oneDay,
				totalInventoryBalance : 1000,
				sellerName : 'Hakeem Folami'	
			}
		];

		return of(availableDeals);
	}
	*/
	public async getDeals() {
		let rawDeals : Deal [];
		if(this.iiLoggedIn) {
			rawDeals = await this.unite_actor.listDeals();
		}
		else {
			rawDeals = await unite_default_actor.listDeals();
		}
		let deals = this.formatData(rawDeals);
		console.log("GOT DEALS", deals);
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
		if(this.teamSub) this.teamSub.unsubscribe();
		this.teamSub = of(teams).subscribe(this.teamSubject$);
		return this.teamSubject$;
	}

	/*
	getTeams(dealId) {
		let teams : Team[] = [
			{
				teamId : 1,
				creator : 'Aisha',
				orders : [1 , 2]
			},
			{
				teamId : 2,
				creator : 'Wole',
				orders : [3, 4]
			},
			{
				teamId : 3,
				creator : 'Nene',
				orders : [5, 6, 7, 8]
			},
		];

		if(this.teamSub) {
			return this.teamSubject$;
		}
		else {
			this.teamSub = of(teams).subscribe(this.teamSubject$);
			return this.teamSubject$;
		}
	}
	*/

	public async getOrders(dealId) {
		console.log("GETTING ORDERS", dealId)
		let rawOrders : Order[];
		if(this.iiLoggedIn) {
			rawOrders = await this.unite_actor.listOrders(dealId);
		}
		else {
			rawOrders = await unite_default_actor.listOrders(dealId);
		}	
		let orders = this.formatData(rawOrders);
		console.group("GOT ORDERS", orders);
		this.orderSub = of(orders).subscribe(this.orderSubject$);
		return this.orderSubject$;
	}

	/*
	getOrders(dealId) {
		let	orders : Order[] = [
			{
				dealId : 1,
				orderId : 1,
				teamId : 1,
				user : "Aisha",
				units : 5,
				orderType : 'retail'
			},
			{
				dealId : 1,
				orderId : 2,
				teamId : 1,
				user : "Fife",
				units : 1,
				orderType : 'retail'
			},
			{
				dealId : 1,
				orderId : 3,
				teamId : 2,
				user : "Wole",
				units : 3,
				orderType : 'retail'
			},
			{
				dealId : 1,
				orderId : 4,
				teamId : 2,
				user : "Gboyega",
				units : 3,
				orderType : 'retail'
			},
			{
				dealId : 1,
				orderId : 5,
				teamId : 3,
				user : "Nene",
				units : 4,
				orderType : 'retail'
			},
			{
				dealId : 1,
				orderId : 6,
				teamId : 3,
				user : "Nkiru",
				units : 1,
				orderType : 'retail'
			},
			{
				dealId : 1,
				orderId : 7,
				teamId : 3,
				user : "John",
				units : 1,
				orderType : 'retail'
			},
			{
				dealId : 1,
				orderId : 8,
				teamId : 3,
				user : "Joyin",
				units : 1,
				orderType : 'retail'
			},
			{
				dealId : 2,
				orderId : 9,
				teamId : 4,
				user : "Mfon",
				units : 3,
				orderType : 'retail'
			},
			{
				dealId : 2,
				orderId : 10,
				teamId : 4,
				user : "Oke",
				units : 1,
				orderType : 'retail'
			},
			{
				dealId : 2,
				orderId : 11,
				teamId : 5,
				user : "Jaja",
				units : 2,
				orderType : 'retail'
			},
			{
				dealId : 3,
				orderId : 12,
				teamId : 6,
				user : "Agogo",
				units : 2,
				orderType : 'retail'
			},
			{
				dealId : 3,
				orderId : 13,
				teamId : 6,
				user : "Doctor",
				units : 2,
				orderType : 'retail'
			},
			{
				dealId : 3,
				orderId : 14,
				teamId : 6,
				user : "Emeka",
				units : 2,
				orderType : 'retail'
			},
		];
		if(this.orderSub) {
			return this.orderSubject$;
		}
		else {
			this.orderSub = of(orders).subscribe(this.orderSubject$);
			return this.orderSubject$;
		}
	}
	*/

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
