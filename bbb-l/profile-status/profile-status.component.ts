import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-status',
  templateUrl: './profile-status.component.html',
  styleUrls: ['./profile-status.component.scss']
})
export class ProfileStatusComponent implements OnInit {
  @Input() status: string;

  constructor() { }

  ngOnInit() {
  }

}
