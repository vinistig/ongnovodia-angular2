import { Injectable } from '@angular/core';
import {Http} from '@angular/http'
import 'rxjs/add/operator/toPromise';


@Injectable()
export class InscricaoService{
	constructor(private http: Http) { }
}
