import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private snackbar:MatSnackBar){}

  showWarning(message:string){
    this.snackbar.open(message, 'close',{
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'app-notification-warning'
      });
  }

  showError(message:string){
    this.snackbar.open(message, 'close',{
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'app-notification-error'
      });
  }

  showSuccess(message:string){
    this.snackbar.open(message, 'close',{
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'app-notification-success'
      });
  }


  showStickySuccess(message:string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'end';
    config.duration = 0;
    config.panelClass = 'app-notification-success';
    this.snackbar.open(message, 'close', config);
  }
}
