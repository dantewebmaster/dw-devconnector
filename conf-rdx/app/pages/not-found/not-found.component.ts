import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log/log.service';

@Component({
	selector: 'app-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

	constructor(private logger: LogService) { }

	ngOnInit() {
		this.logger.info("Página não Encontrada", "page-not-found");
	}

}
