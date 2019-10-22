import { Injectable } from '@angular/core';
import { OverlayModule } from "@angular/cdk/overlay";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  snackBarConfig: MatSnackBarConfig;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private snackBar: MatSnackBar) { }

  /** snackBarAutoHide: indicates duration of displaying message in milliseconds.
   *  value -1 means infinity. */ 
  open(message: string, snackBarAutoHide: number = 3000) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = this.horizontalPosition;
    this.snackBarConfig.verticalPosition = this.verticalPosition;
    this.snackBarConfig.duration = snackBarAutoHide;
    this.snackBarConfig.panelClass = 'snackbar';
    this.snackBar.open(message, 'Close', this.snackBarConfig);
  }
}