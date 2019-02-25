import { Component, OnInit } from '@angular/core';
import { IStep } from '../../models/stepper.interface';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  steps: IStep[] = [
    { title: 'Cliente', completed: false, active: true },
    { title: 'Loja', completed: false, active: false },
    { title: 'Passo 3', completed: false, active: false },
    { title: 'Passo 4', completed: false, active: false },
  ];

  constructor() { }

  ngOnInit() { }

}
