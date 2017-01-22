import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InscricaoService } from './inscricao.service'

@Component({
	moduleId: module.id,
    selector: 'inscricao',
    templateUrl: './inscricao.component.html'
})

export class InscricaoComponent {

	constructor(private inscricaoService: InscricaoService, private router: Router) {}
	seleted_src_item = [""]
	inscricaoError: boolean = false
	inscricaoErrorMsg: string = ""
	inscricaoSuccess: boolean = false
	inscricao = {projetos:[""],rg:"",cep:"",deficiencia:"", observacoes:"", rg_responsavel:"", nome_pai:"", nome_mae:"", encaminhado_por:"", nome_responsavel:"", cpf:"", telefone:"", celular:"", image:""};

	public cpfMask = [/\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
	public rgMask = [/\d/, /\d/,'.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '-', /[0-9-X]/]
	public emissorMask = [/[A-Z]/, /[A-Z]/, /[A-Z]/,'-', /[A-Z]/, /[A-Z]/]
	public cepMask = [/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-', /\d/, /\d/,/\d/]
	public telefoneMask = ['(',/\d/,/\d/,')',/\d/,/\d/,/\d/,/\d/,'-', /\d/, /\d/,/\d/,/\d/]
	public celularMask = ['(',/\d/,/\d/,')',/\d/,/\d/,/\d/,/\d/,/\d/,'-', /\d/, /\d/,/\d/,/\d/]

	makeInscricao() {
		this.inscricao.rg = this.inscricao.rg.replace(/\D+/g, '');
		this.inscricao.cpf = this.inscricao.cpf.replace(/\D+/g, '');
		this.inscricao.cep = this.inscricao.cep.replace(/\D+/g, '');
		this.inscricao.image = (<HTMLImageElement>document.getElementById('imgInscricao')).src;
		(<HTMLButtonElement>document.getElementById('btnCancel')).disabled = true;
		(<HTMLButtonElement>document.getElementById('btnSuccess')).disabled = true;
		this.inscricaoService.makeInscricao(this.inscricao)
			.then(res => {
				console.log(res)
				if(res.errors || res.mongoError){
					this.inscricaoError = true;
					this.inscricaoErrorMsg = "";
					this.inscricaoErrorMsg = res.message;
					(<HTMLButtonElement>document.getElementById('btnCancel')).disabled = false;
					(<HTMLButtonElement>document.getElementById('btnSuccess')).disabled = false;
				} else{
					this.inscricaoError = false;
					this.inscricaoSuccess = true;
					//this.router.navigate(['dashboard', 'home']);
					setTimeout(()=>{
						(<HTMLButtonElement>document.getElementById('btnCancel')).disabled = false;
						(<HTMLButtonElement>document.getElementById('btnSuccess')).disabled = false;
						this.router.navigate(['dashboard', 'home']);
					}, 5000);
				}
			}).catch(error => {
				console.log("error");
				(<HTMLButtonElement>document.getElementById('btnCancel')).disabled = false;
				(<HTMLButtonElement>document.getElementById('btnSuccess')).disabled = false;
				this.inscricaoError = true;
				this.inscricaoErrorMsg = "SERVER ERROR, PLEASE TRY AGAIN";
			});
	}

	cancel() {
		this.router.navigate(['dashboard', 'home']);
	}

	srcValueChange(event: any){
        this.seleted_src_item=[];
        for(var i in event.target.selectedOptions){
            if(event.target.selectedOptions[i].label){
                this.seleted_src_item.push(event.target.selectedOptions[i].label);
            }
        }
    }
}
