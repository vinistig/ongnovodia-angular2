import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service'
import { Messages } from "./messages"

/**
*	This class represents the lazy loaded LoginComponent.
*/

@Component({
	moduleId: module.id,
	selector: 'login-cmp',
	templateUrl: 'login.component.html',
	styleUrls: ['login.css']
})

export class LoginComponent {
	constructor(private loginService: LoginService, private router: Router) {}
	username: string = ""
	password: string = ""
	loginError: boolean = false
	loginErrorMsg: string = ""

	login() {
		this.loginService.login(this.username, this.password)
			.then(res => {
				if(res.erro){
					this.loginError = true;
					this.loginErrorMsg = ""
					this.loginErrorMsg = res.message
				} else{
					this.loginError = false;
					sessionStorage.clear();
					sessionStorage.setItem('user', JSON.stringify({"nome": res.name, "username": res.username}));
					this.router.navigate(['dashboard', 'home']);
				}
			}).catch(error => {
				console.log("error")
				this.loginError = true;
				this.loginErrorMsg = "SERVER ERROR, PLEASE TRY AGAIN"
			});
	}
}
