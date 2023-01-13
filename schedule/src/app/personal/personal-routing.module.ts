import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PersonalComponent} from './personal.component';
import {EditComponent} from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalComponent
  },
  {
    path: 'edit',
    component: EditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
