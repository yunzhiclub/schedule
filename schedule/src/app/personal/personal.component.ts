import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';
import {User} from '../../entity/user';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  public user = new User();
  isShowQrCode = false;
  qrCodeSrc: string | undefined;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getCurrentLoginUser()
      .subscribe(currentLoginUser => {
        this.user = currentLoginUser;
      });
  }

  onBindWeChat(): void {
    this.userService.generateBindQrCode()
      .subscribe(src => {
        this.qrCodeSrc = src;
        this.isShowQrCode = true;
        this.userService.onScanBindUserQrCode$
          .pipe(first())
          .subscribe(stomp => {
            this.user!.weChatUser = {openid: stomp.body};
            this.isShowQrCode = false;
          });
      });
  }


  onClose(): void {
    this.isShowQrCode = false;
  }
}
