import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:3000';
  private socket;

  constructor() {
    // this.socket = io(this.url);
  }

  public sendMessage(message) {
    // console.log('sendMessage-->', message);
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        // console.log('getMessages-->', message);
        observer.next(message);
      });
    });
  }

  public sendNotification(message) {
    this.socket.emit('new-message', message);
  }

  public getNotifications = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }
}
