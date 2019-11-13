import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  timeout = 5000;
  initialConnection = true;
  private hubConnection: signalR.HubConnection

  constructor(private snackBar: SnackBarService) {
    this.buildConnection();

    this.hubConnection.onclose(() => {
      setTimeout(function() {
        if(!this.hubConnection) {
          this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl('/hub')
          .build();
        }
        this.hubConnection.start();
        console.log("reconnecting to hub.");
    }, 10);
      console.log("disconnected from hub.");
    });
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
      //   setTimeout(() => {
      //     this.startConnection();
      //   }, this.timeout);
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
