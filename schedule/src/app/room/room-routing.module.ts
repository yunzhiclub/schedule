import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomComponent} from './room.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent,
    data: {
      title: '首页'
    }
  },
  {
    path: 'add',
    component: AddComponent,
    data: {
      title: '新增'
    }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: {
      title: '编辑'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
