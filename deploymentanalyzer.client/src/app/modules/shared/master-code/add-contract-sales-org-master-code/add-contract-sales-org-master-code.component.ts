import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterCode } from '../../../../models/mastercode';

@Component({
  selector: 'app-add-contract-sales-org-master-code',
  templateUrl: './add-contract-sales-org-master-code.component.html',
  styleUrl: './add-contract-sales-org-master-code.component.css'
})
export class AddContractSalesOrgMasterCodeComponent {
  isOpenManageCSOSidebar = false;
  masterCodeForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddContractSalesOrgMasterCodeComponent>, public fb: FormBuilder,
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
    this.isOpenManageCSOSidebar = true;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
