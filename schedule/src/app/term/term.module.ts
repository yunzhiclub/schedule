import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermComponent } from './term.component';
import {TermRoutingModule} from './term-routing.module';
import {PageModule} from '../../common/page/page.module';
import {SizeModule} from '../../common/size/size.module';
import {PipeModule} from '../pipe/pipe.module';
import {ReactiveFormsModule} from '@angular/forms';
import { AddComponent } from './add/add.component';
import {DateModule} from '../../common/data/date.module';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [TermComponent, AddComponent, EditComponent],
    imports: [
        CommonModule,
        TermRoutingModule,
        PageModule,
        SizeModule,
        PipeModule,
        ReactiveFormsModule,
        DateModule,
    ]
})
export class TermModule { }
