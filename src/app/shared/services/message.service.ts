import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private notification: NzNotificationService, private message: NzMessageService) {}

  showMessage(type: string, content: string) {
    this.message.create(type, content);
    // this.notification.create(
    //   type,
    //   type === "success" ? "Thank you" : "Opss",
    //   content
    // );
  }
}
