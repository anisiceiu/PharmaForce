import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Company } from '../../../../models/company';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.scss']
})
export class CompanyDialogComponent {

  isOpenManageCompanySidebar = false;
  companyForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CompanyDialogComponent>,public fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { company: Company }
  ) {
    if(data.company && data.company.company_Id > 0){
      this.companyForm = this.fb.group({
        company_Id: [data.company.company_Id],
        company_Name: [data.company.company_Name, [Validators.required]],
        company_Website_Global: [data.company.company_Website_Global],
        headQuarters: [data.company.headQuarters],
        number_of_Employees: [data.company.number_of_Employees],
        type_of_Entity_Public_Private: [data.company.type_of_Entity_Public_Private],
        sales_Previous_Year: [data.company.sales_Previous_Year],
      });
    }else{
      this.companyForm = this.fb.group({
        company_Id: [null],
        company_Name: ['', [Validators.required]],
        company_Website_Global: [''],
        headQuarters: [''],
        number_of_Employees: [null],
        type_of_Entity_Public_Private: [''],
        sales_Previous_Year: [null],
      });
    }
    this.isOpenManageCompanySidebar = true;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.companyForm.controls; }

}
