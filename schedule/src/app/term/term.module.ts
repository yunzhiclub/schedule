import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermComponent } from './term.component';
import {TermRoutingModule} from './term-routing.module';

@NgModule({
  declarations: [TermComponent],
  imports: [
    CommonModule,
    TermRoutingModule
  ]
})
export class TermModule { }
