import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<a [routerLink]="buttonRoute" class="btn">{{ buttonText }}</a>`,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() buttonText: string;
  @Input() buttonRoute: string;

  constructor () { }

  ngOnInit() { }

}
