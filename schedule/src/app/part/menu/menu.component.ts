import { Component, OnInit } from '@angular/core';
import {BaseMenu} from '../../../common/base-menu';
import {environment} from '../../../environments/environment';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menus = [] as BaseMenu[];

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.menus = this.commonService.getMenus();
  }

  getBackgroundColor(menu: BaseMenu): string | undefined {
    if (this.commonService.active(menu)) {
      return environment.color;
    }
    return undefined;
  }

  getTextColor(menu: BaseMenu): string | undefined {
    if (this.commonService.active(menu)) {
      return 'white';
    }
    return undefined;
  }
}
