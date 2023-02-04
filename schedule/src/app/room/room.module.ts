import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room.component';
import {RoomRoutingModule} from './room-routing.module';
import {SizeModule} from '../../common/size/size.module';
import {PageModule} from '../../common/page/page.module';
import {ReactiveFormsModule} from '@angular/forms';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import {YzModalModule} from '../../common/yz-modal/yz-modal.module';



@NgModule({
  declarations: [RoomComponent, AddComponent, EditComponent, RoomDetailComponent],
    imports: [
        CommonModule,
        RoomRoutingModule,
        SizeModule,
        PageModule,
        ReactiveFormsModule,
        YzModalModule
    ]
})
export class RoomModule { }
