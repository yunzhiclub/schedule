import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {NgSelectConfig} from '@ng-select/ng-select';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = environment.title;
  isEr = true;

  constructor() {
  }

  ngOnInit(): void {
  }
}
