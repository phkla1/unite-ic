import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { from } from 'rxjs';
import {UserRecord} from '../services/interfaces'; 
import { UniteHttpService } from '../services/unite-http.service';
import { UniteICService } from '../services/unite-ic.service';
declare var require : any;

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

	constructor(private activatedRoute : ActivatedRoute, private router : Router, private icConnector: UniteICService, private uniteConnector: UniteHttpService ) { }

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
		console.log("CONMPLETING REGISTRATION", firstname, surname, phone);
		if(firstname && surname && phone) {
			from(this.icConnector.updateRecord(firstname, surname, phone))
			.subscribe(
				data => {
					console.log("DATA FROM IC:", data);
					if(data) {
						//inform Unite server about new registration, then goto inbox
						this.uniteConnector.icRegister(this.record.callerId)
						.subscribe();
						this.router.navigateByUrl('/inbox');
					}
					else {
						this.router.navigateByUrl('/login');
					}
				},
				err => {
					console.log("registration ERROR:" + err);
				}
			);
		}
		//send the relevant fields to the backend, and then navigate to inbox 

	}

}
