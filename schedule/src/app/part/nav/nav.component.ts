import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../service/common.service';
import {Subscription} from 'rxjs';
import {TitleService} from '../../../service/title.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  title: string | undefined;
  show: boolean | undefined;
  private titleSubscription: Subscription | undefined;
  private backSubscription: Subscription | undefined;

  constructor(private commonService: CommonService,
              private titleService: TitleService) { }

  ngOnInit(): void {
    /** 订阅标题 */
    this.titleSubscription = this.titleService.title()
      .subscribe((title: string) => this.title = title);
    this.backSubscription = this.commonService.canBack()
      .subscribe((canBack: boolean) => this.show = canBack);
  }

  back(): void {
    this.commonService.back();
  }
}
