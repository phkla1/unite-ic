import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-receive-items',
	templateUrl: './receive-items.component.html',
	styleUrls: ['./receive-items.component.scss']
})
export class ReceiveItemsComponent implements OnInit {

	deliveryCode = 654123; //generated when an order is made, stored locally

	constructor() { }

	ngOnInit(): void {
	}

	generateCode() {
		let code = this.deliveryCode.toString().split('');
		code.forEach((char, ind) => {
			console.log("IND:", ind);
			console.log("CHAR:", char);
			(document.getElementById(ind.toString()) as HTMLInputElement).value = char;
		});
	}
}
