import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/user';

@Component({
  selector: 'app-add-client-popup',
  templateUrl: './add-client-popup.component.html',
  styleUrl: './add-client-popup.component.css'
})
export class AddClientPopupComponent {
  isOpenManageClientSidebar = false;
  clientForm: FormGroup;
  userList: User[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddClientPopupComponent>, public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { selectedUser: User, userList: User[] }
  ) {
    this.userList = data.userList;

    this.clientForm = this.fb.group({
      userID: [data.selectedUser.id, [Validators.required]],
      emailID: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    });

    this.isOpenManageClientSidebar = true;
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.clientForm.controls; }
}
