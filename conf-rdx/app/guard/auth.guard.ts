import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { LogService } from '../services/log/log.service'

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private logger: LogService
	) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		const currentUser = this.authenticationService.currentUserValue;
		if (currentUser) {
			// authorised so return true
			return true;
		}

		this.logger.info("Usuario não logado tentando acessar a Aplicação", state.url, "not-permission");
		// not logged in so redirect to login page with the return url
		this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
		return false;
	}
}
