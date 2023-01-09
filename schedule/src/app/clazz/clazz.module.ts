import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClazzComponent } from './clazz.component';
import {ClazzRoutingModule} from './clazz-routing.module';
import {SizeModule} from '../../common/size/size.module';
import {PageModule} from '../../common/page/page.module';
import {ReactiveFormsModule} from '@angular/forms';
import { AddComponent } from './add/add.component';
import {DateModule} from '../../common/data/date.module';
import { EditComponent } from './edit/edit.component';
import { MembersComponent } from './members/members.component';
import {PipeModule} from '../pipe/pipe.module';



@NgModule({
  declarations: [ClazzComponent, AddComponent, EditComponent, MembersComponent],
    imports: [
        CommonModule,
        ClazzRoutingModule,
        SizeModule,
        PageModule,
        ReactiveFormsModule,
        DateModule,
        PipeModule
    ]
})
export class ClazzModule { }
