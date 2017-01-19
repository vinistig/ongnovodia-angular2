import { Injectable } from '@angular/core';
import {Http} from '@angular/http'
import 'rxjs/add/operator/toPromise';


@Injectable()
export class InscricaoService{
	constructor(private http: Http) { }

	makeInscricao(inscricao: Object): Promise<any> {
		console.log(inscricao)
		var body = inscricao
		return this.http.post('http://localhost:3000/api/inscricao', body)
		//return this.http.post('/api/inscricao', body)
		.toPromise()
		.then(response => response.json())
		.catch(error => error.json())
	}
}
