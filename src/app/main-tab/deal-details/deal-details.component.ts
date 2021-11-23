import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Deal, Team, Order } from '../../services/interfaces';

@Component({
	selector: 'app-deal-details',
	templateUrl: './deal-details.component.html',
	styleUrls: ['./deal-details.component.scss']
})
export class DealDetailsComponent implements OnInit {
	deal : Deal;
	teams : Team[] = [
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
	orders : Order[] = [
		{
			dealId : 1,
			orderId : 1,
			teamId : 1,
			user : "Aisha",
			units : 5,
			type : 'retail'
		},
		{
			dealId : 1,
			orderId : 2,
			teamId : 1,
			user : "Fife",
			units : 1,
			type : 'retail'
		},
		{
			dealId : 1,
			orderId : 3,
			teamId : 2,
			user : "Wole",
			units : 3,
			type : 'retail'
		},
		{
			dealId : 1,
			orderId : 4,
			teamId : 2,
			user : "Gboyega",
			units : 3,
			type : 'retail'
		},
		{
			dealId : 1,
			orderId : 5,
			teamId : 3,
			user : "Nene",
			units : 4,
			type : 'retail'
		},
		{
			dealId : 1,
			orderId : 6,
			teamId : 3,
			user : "Nkiru",
			units : 1,
			type : 'retail'
		},
		{
			dealId : 1,
			orderId : 7,
			teamId : 3,
			user : "John",
			units : 1,
			type : 'retail'
		},
		{
			dealId : 1,
			orderId : 8,
			teamId : 3,
			user : "Joyin",
			units : 1,
			type : 'retail'
		},
	];
	totalOrders = 0;

	constructor(private activatedRoute: ActivatedRoute, private router: Router) { 
		this.deal = new Object as Deal;
	}

	ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe(
			() => {
				this.deal = window.history.state;
			}
		);
	}

	numberOfTeams() {
		//get all teams working on this deal (via orders) and return count
		let count = {};
		this.orders.forEach(order => {
			if(order.dealId === this.deal.dealId) {
				count[order.teamId] ? count[order.teamId]++ : count[order.teamId] = 1; 
			}
		});
		return Object.keys(count).length;
	}

	numberOfTeamOrders(teamId : number) {
		//get the list of orders made by the team
		//find details of each order and add the units to the total
		let total = 0;
		this.teams.find(team => team.teamId == teamId).orders.forEach(orderId => {
			total += this.orders.find(order => order.orderId == orderId).units;
		});
		this.totalOrders = total;
		return total;	
	}

	checkout(teamId) {
		let team = teamId ? this.teams.find(team => team.teamId == teamId) : false;
		let totalOrders = teamId ? this.numberOfTeamOrders(teamId) : 0; 
		let state = {
			deal : this.deal,
			team : team,
			totalOrders : totalOrders 
		};
		this.router.navigateByUrl('/checkout', {state : state});
	}
}
