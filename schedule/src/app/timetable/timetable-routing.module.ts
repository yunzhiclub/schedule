import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClazzComponent} from '../clazz/clazz.component';
import {TimetableComponent} from './timetable.component';


const routes: Routes = [
  {
    path: '',
    component: TimetableComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimetableRoutingModule { }

