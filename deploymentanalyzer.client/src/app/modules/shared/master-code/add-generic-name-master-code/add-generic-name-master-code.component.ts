import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterCode } from '../../../../models/mastercode';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-generic-name-master-code',
  templateUrl: './add-generic-name-master-code.component.html',
  styleUrl: './add-generic-name-master-code.component.css'
})
export class AddGenericNameMasterCodeComponent {
  isOpenManageGeneric_NameSidebar = false;
  masterCodeForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddGenericNameMasterCodeComponent>, public fb: FormBuilder,
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
    this.isOpenManageGeneric_NameSidebar = true;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
