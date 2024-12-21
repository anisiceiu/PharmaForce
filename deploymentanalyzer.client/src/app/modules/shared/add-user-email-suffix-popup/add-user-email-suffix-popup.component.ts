import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserEmailSuffix } from '../../../models/UserEmailSuffix';
import { User } from '../../../models/user';

@Component({
  selector: 'app-add-user-email-suffix-popup',
  templateUrl: './add-user-email-suffix-popup.component.html',
  styleUrl: './add-user-email-suffix-popup.component.css'
})
export class AddUserEmailSuffixPopupComponent {
  isOpenManageUserEmailSuffixSidebar = false;
  userEmailSuffixForm: FormGroup;
  userList: User[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddUserEmailSuffixPopupComponent>, public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {selectedUser:User, userList: User[] }
  ) {
    this.userList = data.userList;

    this.userEmailSuffixForm = this.fb.group({
      emailSuffixId: [null],
      userID: [data.selectedUser.id, [Validators.required]],
      emailSuffix: ['', [Validators.required]]
      });
    
    this.isOpenManageUserEmailSuffixSidebar = true;
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.userEmailSuffixForm.controls; }
}

