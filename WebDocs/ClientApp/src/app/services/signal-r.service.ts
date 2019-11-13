import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  timeout = 120000; // 120 seconds
  initialConnection = true;
  private hubConnection: signalR.HubConnection

  constructor(private snackBar: SnackBarService) {
    this.buildConnection();

    this.hubConnection.onclose(() => {
      setTimeout(() => this.startSignalRConnection(), 2000);
        console.log("reconnecting to hub.");
    });

    this.hubConnection.serverTimeoutInMilliseconds = this.timeout; 
  }

  startSignalRConnection() {
    this.hubConnection.start()
    .then(() => console.info('Websocket Connection Established'))
    .catch(err => console.error('SignalR Connection Error: ', err));
  }

  public buildConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('/hub')
    .build();
  }

  public startConnection() : Promise<void> {
    if(!this.hubConnection) {
      this.buildConnection();
    }
    else if (this.hubConnection.state == signalR.HubConnectionState.Connected) {
      return Promise.resolve();
    }
    return this.hubConnection
      .start()
      .catch(err => {
        if(this.initialConnection) {
          this.initialConnection = false;
          this.snackBar.open("Can't connect with the WebDocks server...", -1);
          console.log(err);
        }
       });
  }

  public connectionEstablished() : signalR.HubConnectionState {
    return this.hubConnection.state;
  }

  public registerHandler(methodName: string, method: (...args: any[]) => void): void {
    this.hubConnection.on(methodName, method);
  }

  public removeHandler(methodName: string, method: (...args: any[]) => void): void {
    this.hubConnection.off(methodName, method);
  }

  public send(methodName: string, ...args: any[]): Promise<void> {
    return this.hubConnection.send(methodName, ...args);
  }
}
