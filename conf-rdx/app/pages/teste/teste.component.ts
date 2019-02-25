import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogService } from '../../services/log/log.service';
import { debug } from 'util';
import { InternalFormsSharedModule, NG_FORM_SELECTOR_WARNING } from '@angular/forms/src/directives';

@Component({
	selector: 'app-teste',
	templateUrl: './teste.component.html',
	styleUrls: ['./teste.component.scss']
})
export class TesteComponent implements OnInit {
	testeForm: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;

	typeLevel = ["all", "debug", "info", "warnnig", "error"];

	constructor(
		private formBuilder: FormBuilder,
		private logger: LogService,
	) { }

	ngOnInit() {
		this.testeForm = this.formBuilder.group({
			msg: ['', Validators.required],
			extraMsg: ['', Validators.nullValidator],
			typeLevel: []
		});
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.testeForm.controls;
	}

	onSubmit() {
		console.group("onSubmit()");

		this.submitted = true;

		// stop here if form is invalid
		if (this.testeForm.invalid) {
			return;
		}
		console.log("if this.testeForm.invalid: ", this.testeForm.invalid);
		console.log("msg: ", this.f.msg.value);
		console.log("extraMsg: ", this.f.extraMsg.value);

		// Salvar Log
		this.saveLog();

		this.submitted = false;
		this.loading = false;

		console.groupEnd();
		return false;
	}

	saveLog() {
		switch (this.f.typeLevel.value) {
			case "debug": {
				this.logger.debug("Página Teste: " + this.f.msg.value, this.f.extraMsg.value);
				break;
			}
			case 'error': {
				this.logger.error("Página Teste: " + this.f.msg.value, this.f.extraMsg.value);
				break;
			}
			case 'info': {
				this.logger.info("Página Teste: " + this.f.msg.value, this.f.extraMsg.value);
				break;
			}
			case 'warnning': {
				this.logger.warn("Página Teste: " + this.f.msg.value, this.f.extraMsg.value);
				break;
			}
			default: {
				// All
				this.logger.log("Página Teste: " + this.f.msg.value, this.f.extraMsg.value);
				break;
			}
		}
	}
	getTypeSelected(value) {
		if (this.f.typeLevel.value == '' || this.f.typeLevel.value == value) {
			return true;
		} else {
			return false;
		}
	}
}
