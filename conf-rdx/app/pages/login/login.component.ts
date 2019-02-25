import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AlertService } from '../../services/alert/alert.service';
import { LogService } from '../../services/log/log.service';


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;
	returnUrl: string;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private alertService: AlertService,
		private logger: LogService
	) {
		// redirect to home if already logged in
		if (this.authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			login: ['', Validators.required],
			password: ['', Validators.required]
		});

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}
	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService.login(this.f.login.value, this.f.password.value)
			.pipe(first())
			.subscribe(
				data => {
					if (data.length == 0) {

						this.alertService.error('Login ou senha Invalidos!');
						this.logger.log("Login ou senha Invalidos", this.f.login.value, "");
						this.loading = false;
						this.submitted = false;
						return;
					} else {
						this.alertService.success('Usuario Logado com Sucesso!');
						localStorage.setItem('currentUser', JSON.stringify(data[0]));
						this.logger.log("Usuário fazendo Login", this.f.login.value, this.returnUrl, "login");

						// this.router.navigate(['/'], {
						//   queryParams: { "refresh": 1 },
						// });
						location.href = this.returnUrl;
						this.loading = false;
					}
				},
				err => {
					this.alertService.error(err);
					this.logger.error("Erro ao Fazer o Login", this.f.login.value, "error-login-bff");
					this.loading = false;
				}
			)
	}
}
