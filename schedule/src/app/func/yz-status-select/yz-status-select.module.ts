import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {YzStatusSelectComponent} from './yz-status-select.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [YzStatusSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [YzStatusSelectComponent]
})
export class YzStatusSelectModule {
}
