import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import {UserService} from '../../../service/user.service';
import {User} from "../../../entity/user";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string | undefined = '';
  title = environment.title;

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.userService.getCurrentLoginUser()
      .subscribe(currentLoginUser => {
        // todo: 更改
        if (currentLoginUser && currentLoginUser.name) {
          this.username = currentLoginUser.name;
          console.log(this.username);
        } else {
          this.username = '无';
        }
      });
  }
  a(): void {
    window.location.reload();
  }
}
