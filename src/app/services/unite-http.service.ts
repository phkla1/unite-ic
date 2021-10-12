import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniteHttpService {
	server = 'http://localhost:3113';
	registerEndpoint = '/api/v2/account/iiaccount';
	httpOptionsBasicAuth = {
		headers: new HttpHeaders({
		  'Content-Type':  'application/json',
		  'Accept' : '*/*',
		}),
		responseType: 'text' as 'json'
	};

	constructor(private http: HttpClient) { }
	
	icRegister(caller) {
		let url = this.server + this.registerEndpoint;
		let body = JSON.stringify({callerId : caller});
		return this.http.post(url, body, this.httpOptionsBasicAuth);
	}
}
