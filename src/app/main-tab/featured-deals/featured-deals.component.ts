import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { UniteICService } from 'src/app/services/unite-ic.service';
import {Deal} from '../../services/interfaces'; 

@Component({
	selector: 'app-featured-deals',
	templateUrl: './featured-deals.component.html',
	styleUrls: ['./featured-deals.component.scss']
})
export class FeaturedDealsComponent implements OnInit {
	dealSubject$ : ReplaySubject<Deal[]>;

	constructor(private router : Router, private icService : UniteICService) { 
	}

	ngOnInit(): void { 
		this.icService.getDeals();
		this.dealSubject$ = this.icService.dealSubject$;
	}

	showDeal(dealId) {
		let deal;
		let subscriber = this.dealSubject$.subscribe(
			(deals : Deal[]) => {
				deal = deals.find(elem => elem.dealId === dealId)
			},
			err => {},
			() => {
				this.router.navigateByUrl('/dealDetail', {state : deal});
			}
		);
	}

	daysLeft(datems) : number {
		return this.icService.daysLeft(datems);
	}

}
