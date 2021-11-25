import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { max } from 'rxjs/operators';
import { Deal, Order, Team } from '../services/interfaces';
import { UniteICService } from '../services/unite-ic.service';

@Component({
	selector: 'app-buying-options',
	templateUrl: './buying-options.component.html',
	styleUrls: ['./buying-options.component.scss']
})
export class BuyingOptionsComponent implements OnInit {
	deal : Deal;
	order : Order;
	team : Team;
	totalOrders = 0;
	curUnits = 1;
	newTeam = false;

	constructor(private activatedRoute : ActivatedRoute, private router: Router, private icService : UniteICService) { 
		this.deal = new Object as Deal;
		this.order = new Object as Order;
		this.order.units = 1;
	}

	ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe(
			() => {
				this.deal = window.history.state.deal;
				this.team = window.history.state.team;
				this.order.orderType = this.team ? 'retail' : 'wholesale'; 
				this.totalOrders = window.history.state.totalOrders;
			}
		);
	}

	getMaxOfType() {
		return this.order.orderType === 'wholesale' ? this.maxWholesaleUnits() : this.maxRetailUnits();
	}

	maxWholesaleUnits() {
		return Math.floor(this.deal.totalInventoryBalance / this.deal.dealTargetUnits);
	}

	maxRetailUnits() {
		//balance of team order
		return this.deal.dealTargetUnits - this.totalOrders;
	}

	selectOption(opt:string) {
		if(opt == 'wholesale') {
			this.order.orderType = 'wholesale';
		}
		else {
			this.order.orderType = 'retail';
			this.newTeam = true;
		}
	}

	updateUnits() {
		this.curUnits = this.order.orderType == 'retail' ? 
			parseInt((document.getElementById('units') as HTMLInputElement).value) :
			parseInt((document.getElementById('units') as HTMLInputElement).value) * this.deal.dealTargetUnits;	
	}

	calculateUnits() : number {
		return this.order.orderType == 'wholesale' ? this.order.units * this.deal.dealTargetUnits : this.order.units; 
	}

	finalizePurchase() {
		this.icService.makeOrder();
		this.router.navigateByUrl('/receiveItems', {state : this.order});
	}

	gotoInbox() {
		this.icService.makeOrder();
		this.router.navigateByUrl('/teambox', {state : this.team});
	}

}
