import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutComponent} from './layout.component';
import {HeaderModule} from '../header/header.module';
import {MenuModule} from '../menu/menu.module';
import {NavModule} from '../nav/nav.module';
import {DashboardRoutingModule} from '../../dashboard/dashboard-routing.module';



@NgModule({
  declarations: [LayoutComponent],
    imports: [
        CommonModule,
        HeaderModule,
        MenuModule,
        NavModule,
        DashboardRoutingModule
    ],
  exports: [LayoutComponent]
})
export class LayoutModule { }
