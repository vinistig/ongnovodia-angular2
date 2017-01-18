import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InscricaoService } from './inscricao.service'

@Component({
	moduleId: module.id,
    selector: 'inscricao',
    templateUrl: './inscricao.component.html'
})

export class InscricaoComponent {
	constructor(private loginService: InscricaoService, private router: Router) {}
	inscricao = {rg:""};

	public cpfMask = [/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
	public rgMask = [/\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '-', /[0-9-X]/]
	public emissorMask = [/[A-Z]/, /[A-Z]/, /[A-Z]/,'-', /[A-Z]/, /[A-Z]/]
	public cepMask = [/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-', /\d/, /\d/,/\d/]
	public telefoneMask = ['(',/\d/,/\d/,')',/\d/,/\d/,/\d/,/\d/,'-', /\d/, /\d/,/\d/,/\d/]
	public celularMask = ['(',/\d/,/\d/,')',/\d/,/\d/,/\d/,/\d/,/\d/,'-', /\d/, /\d/,/\d/,/\d/]


	makeInscricao() {
		this.inscricao.rg = this.inscricao.rg.replace(/\D+/g, '');
	}
}
