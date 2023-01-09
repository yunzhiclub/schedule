import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room.component';
import {RoomRoutingModule} from './room-routing.module';
import {SizeModule} from "../../common/size/size.module";
import {PageModule} from "../../common/page/page.module";
import {ReactiveFormsModule} from "@angular/forms";
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';



@NgModule({
  declarations: [RoomComponent, AddComponent, EditComponent],
    imports: [
        CommonModule,
        RoomRoutingModule,
        SizeModule,
        PageModule,
        ReactiveFormsModule
    ]
})
export class RoomModule { }
