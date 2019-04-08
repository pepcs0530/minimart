import { NgModule } from '@angular/core';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FwMessageComponent } from './fw-message.component';
import { MessagesModule, MessageModule, MessageService } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [DialogModule, MessagesModule, MessageModule, ToastModule],
    exports: [FwMessageComponent],
    declarations: [FwMessageComponent],
    providers: [MessageService]
  })
export class FwMessageModule {}
