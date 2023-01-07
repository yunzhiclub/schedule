import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermComponent } from './term.component';
import {TermRoutingModule} from './term-routing.module';
import {PageModule} from '../../common/page/page.module';
import {SizeModule} from '../../common/size/size.module';
import {PipeModule} from '../pipe/pipe.module';

@NgModule({
  declarations: [TermComponent],
  imports: [
    CommonModule,
    TermRoutingModule,
    PageModule,
    SizeModule,
    PipeModule,
  ]
})
export class TermModule { }
