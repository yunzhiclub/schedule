import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username = 'username';
  title= '排课系统欢迎您';

  constructor() { }

  ngOnInit(): void {
  }

}
