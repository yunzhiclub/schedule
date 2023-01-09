import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ClazzComponent} from './clazz.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {MembersComponent} from './members/members.component';

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
    path: 'edit/:id',
    component: EditComponent
  },
  {
    path: 'members/:clazzId',
    component: MembersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClazzRoutingModule { }
