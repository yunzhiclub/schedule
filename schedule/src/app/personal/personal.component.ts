import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user.service';
import {User} from '../../entity/user';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  public user = new User();

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.userService.getCurrentLoginUser()
      .subscribe(currentLoginUser => {
        this.user = currentLoginUser;
      });
  }

}
