import { Injectable } from '@angular/core';
import {Http} from '@angular/http'
import 'rxjs/add/operator/toPromise';


@Injectable()
export class LoginService{
	constructor(private http: Http) { }

	login(username: string, password: string): Promise<any> {
		console.log("service")
		var body = {username: username, password: password}
		//return this.http.post('http://localhost:3000/api/login', body)
		return this.http.post('/api/login', body)
		.toPromise()
		.then(response => response.json())
		.catch(error => error.json())
	}
}
