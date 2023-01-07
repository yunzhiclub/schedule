import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClazzComponent} from '../clazz/clazz.component';


const routes: Routes = [
  {
    path: '',
    component: ClazzComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimetableRoutingModule { }

