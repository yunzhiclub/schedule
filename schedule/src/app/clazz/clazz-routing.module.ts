import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ClazzComponent} from './clazz.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {MembersComponent} from './members/members.component';
import { EditComponent as membersEditComponent } from './members/edit/edit.component';
import { AddComponent as membersAddComponent } from './members/add/add.component';

const routes: Routes = [
  {
    path: '',
    component: ClazzComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:clazzId',
    component: EditComponent
  },
  {
    path: 'members/:clazzId',
    component: MembersComponent
  },
  {
    path: 'members/:clazzId/add',
    component: membersAddComponent
  },
  {
    path: 'members/:clazzId/edit/:studentId',
    component: membersEditComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClazzRoutingModule { }
