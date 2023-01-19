import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PersonalComponent} from './personal.component';
import {EditComponent} from './edit/edit.component';
import {ModifyPasswordComponent} from './modify-password/modify-password.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalComponent
  },
  {
    path: 'edit',
    component: EditComponent,
    data: {
      title: '修改个人信息'
    }
  },
  {
    path: 'modifyPassword',
    component: ModifyPasswordComponent,
    data: {
      title: '修改密码'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
