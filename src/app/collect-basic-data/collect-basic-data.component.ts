import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { from } from 'rxjs';
import {UserRecord} from '../services/interfaces'; 
import { UniteICService } from '../services/unite-ic.service';

@Component({
  selector: 'app-collect-basic-data',
  templateUrl: './collect-basic-data.component.html',
  styleUrls: ['./collect-basic-data.component.scss']
})
export class CollectBasicDataComponent implements OnInit {
	missingFields = '';
	showFirstname = 'visible';
	showSurname = 'visible';
	showPhone = 'visible';
	record : UserRecord;

	constructor(private activatedRoute : ActivatedRoute, private router : Router, private uniteConnector: UniteICService) { }

	ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe(
			() => {
				this.record = window.history.state;
//				this.showConsole(this.record.callerId + this.record.counter + this.record.firstname + this.record.surname + this.record.phone + this.record.timestamp );
				this.record.firstname ? this.showFirstname = 'hidden' : this.missingFields = 'first name';
				this.record.surname ? this.showSurname = 'hidden' : this.missingFields += '/ surname';
				this.record.phone ? this.showPhone = 'hidden' : this.missingFields += '/ phone';
			}
		)	
	}

	showConsole(msg) {
		let console = document.getElementById('console');
		console.innerText += msg;
	}

	completeRegistration(firstname, surname, phone) {
		//send the relevant fields to the backend, and then navigate to inbox 
		firstname ? this.showConsole(firstname) : Function.prototype();
		surname ? this.showConsole(surname) : Function.prototype();
		phone ? this.showConsole(phone) : Function.prototype(); 

		from(this.uniteConnector.updateRecord(firstname, surname, phone)).subscribe(
			data => {
				let msg = 'response from updateRecord is:' + data;
				this.showConsole(msg);	
			},
			err => {
				this.showConsole(err);
			}
		)
	}

}
