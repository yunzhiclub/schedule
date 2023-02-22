import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalComponent } from './personal.component';
import {PersonalRoutingModule} from './personal-routing.module';
import { EditComponent } from './edit/edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ModifyPasswordComponent} from './modify-password/modify-password.component';
import {YzModalModule} from '../../common/yz-modal/yz-modal.module';



@NgModule({
  declarations: [PersonalComponent, EditComponent, ModifyPasswordComponent],
    imports: [
        CommonModule,
        PersonalRoutingModule,
        ReactiveFormsModule,
        YzModalModule,
    ]
})
export class PersonalModule { }
