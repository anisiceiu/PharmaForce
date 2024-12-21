import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterCode } from '../../../../models/mastercode';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-therapeutic-category-master-code',
  templateUrl: './add-therapeutic-category-master-code.component.html',
  styleUrl: './add-therapeutic-category-master-code.component.css'
})
export class AddTherapeuticCategoryMasterCodeComponent {
  isOpenManageTherapeutic_CategorySidebar = false;
  masterCodeForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddTherapeuticCategoryMasterCodeComponent>, public fb: FormBuilder,
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
    this.isOpenManageTherapeutic_CategorySidebar = true;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
