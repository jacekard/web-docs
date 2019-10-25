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
    this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('/hub')
                              .build();

    this.startConnection();
    this.hubConnection.onclose(() => {
      this.snackBar.open("Refresh page to enable live reloading.", -1);
    });
  }

  public startConnection = () => {
    this.hubConnection
      .start()  
      .catch(err => {
        if(this.initialConnection) {
          this.initialConnection = false;
          this.snackBar.open("Can't connect with the WebDocks server...", -1);
        }
        setTimeout(() => {
          this.startConnection();
        }, this.timeout);
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

  public send(methodName: string, ...args: any[]): void {
    this.hubConnection.send(methodName, ...args);
  }
}
