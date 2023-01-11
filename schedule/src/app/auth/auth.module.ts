import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {AuthRoutingModule} from './auth-routing.module';
import {YzSubmitButtonModule} from '../func/yz-submit-button/yz-submit-button.module';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [LoginComponent],
  exports: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    YzSubmitButtonModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
