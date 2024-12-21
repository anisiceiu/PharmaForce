import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-timeout-dialog',
  templateUrl: './session-timeout-dialog.component.html',
  styleUrl: './session-timeout-dialog.component.css'
})
export class SessionTimeoutDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SessionTimeoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { result: any }
  ) {

  }

  onStayClick(): void {
    if (typeof this.data.result.stay === 'function') {
      this.data.result.stay();
    }
    this.dialogRef.close();
  }

  onLogOutClick(): void {
    if (typeof this.data.result.logout === 'function') {
      this.data.result.logout();
    }
    this.dialogRef.close();
  }

}
