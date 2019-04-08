import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import { AuthenticationService } from '../../_services/authentication.service';
import { ChatService } from '../services/fw-chat/chat.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent  implements OnInit {

    count = 0;
    constructor(
        public app: AppComponent,
        public authen: AuthenticationService,
        private chatService: ChatService) { }

    ngOnInit() {
        // this.getNotification();
    }

    sendNotification() {
        this.chatService.sendNotification('Call Websocket...');
        // this.message = '';
    }

    getNotification() {
        this.chatService
            .getNotifications()
            .subscribe((message: string) => {
                console.log('New => ' + message);
                // this.messages.push(message);
                this.count = this.count + 1;
            });
    }

}
