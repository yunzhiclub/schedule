import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomComponent} from './room.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {RoomDetailComponent} from './room-detail/room-detail.component';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent,
    data: {
      title: '首页'
    }
  },
  {
    path: 'roomDetail/:roomId',
    component: RoomDetailComponent,
    data: {
      title: '教室详情'
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
