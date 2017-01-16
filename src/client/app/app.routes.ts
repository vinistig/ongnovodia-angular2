import { Routes } from '@angular/router';



import { LoginComponent } from './login/index';


import { LoginRoutes } from './login/index';
import { DashboardRoutes } from './dashboard/index';



export const routes: Routes = [
	...LoginRoutes,
	...DashboardRoutes,
	{ path: '**', component: LoginComponent },
];
