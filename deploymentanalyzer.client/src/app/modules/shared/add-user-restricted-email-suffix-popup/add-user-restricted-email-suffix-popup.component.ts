import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUserEmailSuffixPopupComponent } from '../add-user-email-suffix-popup/add-user-email-suffix-popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/user';

@Component({
  selector: 'app-add-user-restricted-email-suffix-popup',
  templateUrl: './add-user-restricted-email-suffix-popup.component.html',
  styleUrl: './add-user-restricted-email-suffix-popup.component.css'
})
export class AddUserRestrictedEmailSuffixPopupComponent {
  isOpenManageUserEmailSuffixSidebar = false;
  userEmailSuffixForm: FormGroup;
  userList: User[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddUserEmailSuffixPopupComponent>, public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { selectedUser: User, userList: User[] }
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
