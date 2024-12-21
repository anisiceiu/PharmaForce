import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection?: signalR.HubConnection;

  public startConnection = () => {

    let url = '';

    if (window.location && window.location.hostname.includes('localhost')) {
        url = 'https://localhost:7097';
    } else {
        url = window.location.origin;
    }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url + '/notificationHub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public addTaskCompletedListener = (callback:any) => {
    this.hubConnection?.on('TaskCompleted', (response:any) => {
      callback(response);
    });
  }
}
