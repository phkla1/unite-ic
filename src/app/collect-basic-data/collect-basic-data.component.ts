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
	inProgress : boolean;

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
		this.inProgress = true;
        let button = document.getElementById('register') as HTMLButtonElement;
		this.showButtonProgress(button);
		if(firstname && surname && phone) {
			from(this.icConnector.updateRecord(firstname, surname, phone))
			.subscribe(
				data => {
					if(data) {
						this.icConnector.name = firstname;
						//inform Unite server about new registration, then goto inbox
						this.uniteConnector.icRegister(this.record.callerId)
						.subscribe();
						this.router.navigateByUrl('/deals');
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
		else {
			this.removeButtonProgress('register');
		}

	}

	showButtonProgress(button : HTMLButtonElement) {
        button.innerHTML = `&#x263A`;
        button.classList.add('spin-button');
		button.disabled = true;
	}

	removeButtonProgress(id) {
		this.inProgress = false;
		let button = document.getElementById(id) as HTMLButtonElement;
   		button.innerHTML = `Complete My Registration`;
        button.classList.remove('spin-button');
	}

}
