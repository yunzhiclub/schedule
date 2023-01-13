import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalComponent } from './personal.component';
import {PersonalRoutingModule} from './personal-routing.module';
import { EditComponent } from './edit/edit.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [PersonalComponent, EditComponent],
    imports: [
        CommonModule,
        PersonalRoutingModule,
        ReactiveFormsModule,
    ]
})
export class PersonalModule { }
