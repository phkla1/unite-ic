import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { find, map, mergeMap, scan, switchMap, takeLast, tap } from 'rxjs/operators';
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
	orders$ : Subject<Order[]>; //orders for this deal
	allSubs : Subscription;
	numOfTeams = 0;
	numOfTeamUnits = {};

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private icService : UniteICService) { 
		this.deal = new Object as Deal;
		this.allSubs = new Subscription();
	}

	ngOnInit(): void {
		let sub = this.activatedRoute.paramMap.subscribe(
			() => {
				this.deal = window.history.state;
				this.icService.getTeams(this.deal.dealId); 
				this.teams$ = this.icService.teamSubject$;
				this.icService.getOrders(this.deal.dealId); 
				this.orders$ = this.icService.orderSubject$;
				this.numberOfTeams$().subscribe();
				this.numberOfTeamUnits$().subscribe();
			}
		);
		this.allSubs.add(sub);
	}

	numberOfTeams$() {
		return this.orders$.pipe(
			map((orders : Order[]) => {
				let count = {};
				orders.forEach(order => {
					if(order.dealId === this.deal.dealId) {
						count[order.teamId] ? count[order.teamId]++ : count[order.teamId] = 1; 
					}	
				});
				this.numOfTeams = Object.keys(count).length; 
				return Object.keys(count).length;
			}),
		);
	}

	numberOfTeamUnits$() {
		return this.teams$.pipe(
			mergeMap((teams: Team[]) => {
				console.log("PROCESSING: TEAMS:", teams);
				let count = {};
				//foreach team get units for all orders in the array 
				return this.orders$.pipe(
					map((orders:Order[]) => {
				console.log("PROCESSING: ORDERS:", orders);
						teams.forEach(team => {
							team.orders.forEach(orderId => {
								let units = orders.find(elem => elem.orderId == orderId).units;
								count[team.teamId] = count[team.teamId] ? count[team.teamId] + units : units; 
							})
						});
						console.log("FINAL COUNT IS:", count);
						this.numOfTeamUnits = count;
						return count;
					})
				);
			}),
		);
	}

	// balanceLeft$(teamId) {
	// 	return of(teamId).pipe(
	// 		switchMap(teamId => {
	// 			return this.numberOfTeamOrders$(teamId)
	// 		}),
	// 		map(total => this.deal.dealTargetUnits - total)
	// 	);
	// }

	daysLeft(datems) : number {
		return this.icService.daysLeft(datems);
	}

	checkout(teamId) {
		let sub = of(teamId).pipe(
			switchMap(teamId => {
				if(teamId) {
					let team ;
					return this.teams$.pipe(
						switchMap((teams : Team[]) => {
							team = teams.find(team => team.teamId == teamId);	
							return this.numberOfTeamUnits$().pipe(
//							return this.numberOfTeamOrders$(teamId).pipe(
								map(totalOrders => {
									return {team : team, totalOrders : totalOrders, deal : this.deal};
								})
							)
						})
					);
				}
				else {
					return of({team : false, totalOrders : 0, deal : this.deal})
				}
			})
		).subscribe(
			data => this.router.navigateByUrl('/checkout', {state : data}) 
		);
		this.allSubs.add(sub);
		/*
		let team = teamId ? this.teams.find(team => team.teamId == teamId) : false;
		let totalOrders = teamId ? this.numberOfTeamOrders(teamId) : 0; 
		let state = {
			deal : this.deal,
			team : team,
			totalOrders : totalOrders 
		};
		this.router.navigateByUrl('/checkout', {state : state});
		*/
	}

	ngOnDestroy() {
		console.log("ON DESTROY")
		this.allSubs.unsubscribe();
	}
}
