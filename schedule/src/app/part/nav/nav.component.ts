import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  title: string | undefined = '';

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
  }

  Back(): void {
  }
}
