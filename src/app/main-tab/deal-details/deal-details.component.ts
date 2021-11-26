import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, of, Subject, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UniteICService } from 'src/app/services/unite-ic.service';
import { Deal, Team, Order } from '../../services/interfaces';

@Component({
	selector: 'app-deal-details',
	templateUrl: './deal-details.component.html',
	styleUrls: ['./deal-details.component.scss']
})
export class DealDetailsComponent implements OnInit, OnDestroy {
	deal : Deal;
	teams$ : Subject<Team[]>; //teams on this deal
	allSubs : Subscription;
	numOfTeams$ : Subject<any>;
	numOfTeamUnits = {};
	state = {};

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private icService : UniteICService) { 
		this.deal = new Object as Deal;
		this.allSubs = new Subscription();
		this.numOfTeams$ = new Subject();
		this.teams$ = new Subject();
	}

	ngOnInit(): void {
		let sub = this.activatedRoute.paramMap.subscribe(
			() => {
				this.deal = window.history.state;

				//process data that depends on teams...
				this.numOfTeams$.next('***');
				this.icService.getTeams(this.deal.dealId).then(
				(teams:Team[]) => {
					//provide the list of teams
					this.teams$.next(teams);

					//provide number of active teams
					this.numOfTeams$.next(teams.length);

					//calculate and store number of units purchased by teams 
					let sub1 = of(teams).pipe(
						mergeMap((teams: Team[]) => {
							let count = {};
							//foreach team get units for all orders in the array 
							return from(this.icService.getOrders(this.deal.dealId)).pipe(
								map((orders:Order[]) => {
									if(orders) {
										teams.forEach(team => {
											team.orders.forEach(orderId => {
												let units = orders.find(elem => elem.orderId == orderId).units;
												count[team.teamId] = count[team.teamId] ? count[team.teamId] + units : units; 
											})
										});
										//update global variable
										this.numOfTeamUnits = count;
										return count;
									}
									else {
										console.log("NO ORDERS")
										return {};
									}
								})
							);
						}),
					).subscribe();
					this.allSubs.add(sub1);
				});
			},
			err => {
				console.log("ACTIVATED ROUTE PROBLEM")
			},
			() => { }
		);
		this.allSubs.add(sub);
	}

	daysLeft(datems) : number {
		return this.icService.daysLeft(datems);
	}

	stillLoading() : boolean {
		return Object.keys(this.numOfTeamUnits).length == 0;
	}

	checkout(team) {
		let state = {};
		if(team && team.teamId) {
			//retail order
			state = {
				team : team, 
				totalOrders : this.numOfTeamUnits[team.teamId], 
				deal : this.deal	
			}
		}
		else {
			//wholesale order
			state = {team : false, totalOrders : 0, deal : this.deal};	
		}
		this.router.navigateByUrl('/checkout', {state});
	}

	ngOnDestroy() {
		this.allSubs.unsubscribe();
	}
}
