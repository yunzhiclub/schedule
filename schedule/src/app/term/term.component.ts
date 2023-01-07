import { Component, OnInit } from '@angular/core';
import {Term} from '../entity/term';

class Page {
  number = 10;
  size = 2;
  totalElements = 10;
  content = [] as Term[];
}

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit {
  pageData = new Page();

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 13; i++) {
      this.pageData.content.push({
        id: i + 3,
        state: 0,
        name: '测试学期' + i.toString(),
        start_time: '1615478400',
        end_time: '1623427200',
      } as Term);
    }
  }

}
