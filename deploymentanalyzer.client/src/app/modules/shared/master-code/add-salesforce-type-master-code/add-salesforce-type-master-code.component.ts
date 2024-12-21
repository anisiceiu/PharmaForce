import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterCode } from '../../../../models/mastercode';

@Component({
  selector: 'app-add-salesforce-type-master-code',
  templateUrl: './add-salesforce-type-master-code.component.html',
  styleUrl: './add-salesforce-type-master-code.component.css'
})
export class AddSalesforceTypeMasterCodeComponent {
  isOpenManageSalesforceTypeSidebar = false;
  masterCodeForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddSalesforceTypeMasterCodeComponent>, public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { mastercode: MasterCode }
  ) {
    if (data.mastercode && data.mastercode.id > 0) {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
      });
    } else {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
      });
    }
    this.isOpenManageSalesforceTypeSidebar = true;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
