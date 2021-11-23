import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Deal} from '../../services/interfaces'; 

@Component({
	selector: 'app-featured-deals',
	templateUrl: './featured-deals.component.html',
	styleUrls: ['./featured-deals.component.scss']
})
export class FeaturedDealsComponent implements OnInit {
	today = new Date().getTime();
	oneDay = 60 * 60 * 24 * 1000;
	availableDeals : Deal[] = [
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
			deadline : this.today + 5 * this.oneDay,
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
			deadline : this.today + 7 * this.oneDay,
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
			deadline : this.today + 6 * this.oneDay,
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
			deadline : this.today + 3 * this.oneDay,
			totalInventoryBalance : 1000,
			sellerName : 'Hakeem Folami'	
		}
	];

	constructor(private router : Router) { }

	ngOnInit(): void { }

	showDeal(dealId) {
		let deal = this.availableDeals.find(elem => elem.dealId === dealId);
		this.router.navigateByUrl('/dealDetail', {state : deal});
	}

	daysLeft(datems) : number {
		let timeLeft = datems - this.today;
		return timeLeft / this.oneDay;
	}

}
