
import { Component, OnInit, Input, Injectable } from '@angular/core';

import { Message, MessageService } from 'primeng/components/common/api';

@Component({
  selector: 'app-fw-message',
  templateUrl: './fw-message.component.html',
})

export class FwMessageComponent {

  constructor(private messageService: MessageService) {}

  @Input() msgStr: string;
  @Input() msgType: string;
  @Input() msgs: Message[] = [];

  visibleError: Boolean = false;
  loading: Boolean = false;

  messageSuccess(messages) {
    // Messages
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: '', detail: messages});
    this.visibleError = true;

    // Toast
    this.messageService.add({severity: 'success', summary: '', detail: messages});
  }

  messageInfo(messages) {
    // Messages
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: '', detail: messages});
    this.visibleError = true;

    // Toast
    this.messageService.add({severity: 'info', summary: '', detail: messages});
  }

  messageWarning(messages) {
    // Messages
    this.msgs = [];
    this.msgs.push({severity: 'warn', summary: '', detail: messages});
    this.visibleError = true;

    // Toast
    this.messageService.add({severity: 'warn', summary: '', detail: messages});
  }

  messageError(messages) {
    // Messages
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: '', detail: messages});
    this.visibleError = true;

    // Toast
    this.messageService.add({severity: 'error', summary: '', detail: messages});
  }

  close() {
   this.msgs = [];
   this.loading = false;
  }

  toggleLoadingIndicator(display: boolean) {

  }
}
