import { Component, OnInit } from '@angular/core';
import { UniteICService } from '../services/unite-ic.service';

@Component({
	selector: 'app-receive-items',
	templateUrl: './receive-items.component.html',
	styleUrls: ['./receive-items.component.scss']
})
export class ReceiveItemsComponent implements OnInit {

	deliveryCode = 0;

	constructor(private icService : UniteICService) { 
		this.deliveryCode = this.icService.orderCode;
	}

	ngOnInit(): void {
	}

	generateCode() {
		let code = this.deliveryCode.toString().split('');
		code.forEach((char, ind) => {
			(document.getElementById(ind.toString()) as HTMLInputElement).value = char;
		});
	}
}
