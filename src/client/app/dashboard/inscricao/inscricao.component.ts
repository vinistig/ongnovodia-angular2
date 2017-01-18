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
	inscricao() {

	}
}
