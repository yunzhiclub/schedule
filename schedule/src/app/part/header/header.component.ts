import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import {UserService} from '../../../service/user.service';

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
        this.username = currentLoginUser.name;
        console.log(this.username);
      });
  }
  a(): void {
    window.location.reload();
  }
}
