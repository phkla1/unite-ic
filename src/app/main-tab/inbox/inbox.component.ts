import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ModalService } from 'src/app/modalbasic/modal.service';
import { UniteICService } from 'src/app/services/unite-ic.service';

type UserRecord = {
	callerId : string,
	timestamp : number,
	counter : string,
	firstname : string,
	surname : string,
	phone : number,
};
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})

export class InboxComponent implements OnInit {
	chatMessages = [];
	emptyInboxMessage = "You have no new inbox messages or broadcasts. They will appear here when sent by admins or users."
	events : string[] = [];
	sidenavOpen: boolean = false;
	otherUsers : UserRecord[] = [];
	connections : UserRecord[] = [];
	thisUser : UserRecord;

	constructor(private modalService : ModalService, private uniteConnector: UniteICService) { 
		this.thisUser = new Object as UserRecord;
	}

	ngOnInit(): void {
		let name = this.uniteConnector.name ? this.uniteConnector.name : '';
		from(this.uniteConnector.getConnections()).pipe(
			//get connections
			map(connectedUsers => {
				this.connections = connectedUsers ? connectedUsers : [];
				console.log("CONNECTED USERS:", connectedUsers);
				return true;
			}),
			//pull in all potential connections in advance 
			switchMap(() => this.uniteConnector.getUsers()),
			switchMap(allUsers => {
				this.otherUsers = allUsers;	
				return this.uniteConnector.whoami();
			}),
			//identify this user so we can remove him from otherUsers
			map((me : UserRecord) => {
				let ind = this.otherUsers.findIndex(elem => JSON.stringify(elem.callerId) == JSON.stringify(me.callerId));
				this.thisUser = me;
				return ind;
			})
		).subscribe({
			next : (index) => {
				if(index >= 0) {
					this.otherUsers.splice(index); 
				}
				else {
					console.log("INVALID INDEX", index)
				}
			},
			error : (err) => {
				console.log("ERROR IN WHOAMI:", err);
			}
		});
	}

	toggleSidenav() {
		this.sidenavOpen = !this.sidenavOpen;
	}

	openModal(id : string) {
		this.modalService.open(id);
	}

	closeModal(id : string) {
		this.modalService.close(id);
	}

	async addConnection(principal) {
		console.log("CALLED ADDCONNECTION:", principal);
		await this.uniteConnector.connectToUser(principal);
		this.uniteConnector.getConnections().then(
			data => {
				console.log("CONNECTIONS ARE:", data);
				this.connections = data;
			},
			fail => {
				console.log("FAILED:", fail);
			}
		);
	}

	openConversation(userId) {
		console.log("OPENING CHAT BOX")
	}
}
