import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../../../services/common/storage.service';

@Component({
  selector: 'app-qcq-note-popup',
  templateUrl: './qcq-note-popup.component.html',
  styleUrl: './qcq-note-popup.component.css'
})
export class QcqNotePopupComponent {
  isOpenManageDMNotesSidebar = false;
  notesForm: FormGroup;
  currentUser: any;
  salesforceId: string = '';
  product_id: string = '';
  standardColumnList = [
    { key: 'qcq_status', value: 'QCQ Status' },
    { key: 'has_citation', value: 'Has Citation' },
    { key: 'country_Name', value: 'Country Name' },
    { key: 'company_Name', value: 'Company Name' },
    { key: 'period_Year', value: 'Period Year' },
    { key: 'period_Quarter', value: 'Period Quarter' },
    { key: 'salesforce_Name', value: 'Salesforce Name' },
    { key: 'type_of_Salesforce', value: 'Type Of Salesforce' },
    { key: 'number_Of_Sales_Representatives', value: 'Number Of Sales Representatives' },
    { key: 'number_Of_District_Managers', value: 'Number Of District Managers' },
    { key: 'number_Of_Regional_Managers', value: 'Number Of Regional Managers' },
    { key: 'uS_Product_Name_Product_Promoted', value: 'US Brand Name Product Promoted' },
    { key: 'country_Specific_Product_Name_Product_Promoted', value: 'Country Specific Brand Name Product Promoted' },
    { key: 'generic_Name', value: 'Generic Name' },
    { key: 'therapeutic_Category', value: 'Therapeutic Category' },
    { key: 'product_Promotion_Priority_Order', value: 'Product Promotion Priority Order' },
    { key: 'total_Number_of_Full_Time_Equivalents_FTEs', value: 'Total Number of Full Time Equivalents FTEs' },
    { key: 'primary_Care_Full_Time_Equivalents_FTEs', value: 'Primary Care Full Time Equivalents FTEs' },
    { key: 'specialty_Full_Time_Equivalents_FTEs', value: 'Specialty Full Time Equivalents FTEs' },
    { key: 'physicians_Focus_Primary_Care_Physicians_Specialty_Physicians', value: 'Physicians Focus Primary Care' },
    { key: 'specialty_Physicians_Targeted', value: 'Specialty Physicians Targeted' },
    { key: 'co_Promotion_YesNo', value: 'Co Promotion YesNo' },
    { key: 'name_of_a_Partner_Company', value: 'Name Of a Partner Company' },
    { key: 'contract_Sales_Force_YesNo', value: 'Contract Sales Force YesNo' },
    { key: 'name_of_a_CSO_Contract_Sales_Organization', value: 'Contract Sales Organization' },
    { key: 'salary_Low', value: 'Salary low' },
    { key: 'salary_High', value: 'Salary High' },
    { key: 'target_Bonus', value: 'Target Bonus' },
    { key: 'reach', value: 'Reach' },
    { key: 'pct_Split_Between_Primary_Care_And_Specialty', value: 'Pct Split Between Primary Care And Specialty' },
    { key: 'frequency', value: 'Frequency' },
    { key: 'additional_Notes', value: 'Additional Notes' },
    { key: 'additional_Notes_Product', value: 'Additional Notes Product' },
    { key: 'additional_Notes_Salesforce', value: 'Additional Notes Salesforce' },
    { key: 'daDatabase_Salesforce_Id', value: 'Database Salesforce Id' },
    { key: 'modified_date', value: 'Modified Date' },
    { key: 'modified_by_name', value: 'Modified By' },
    { key: 'added_date', value: 'Added Date' },
    { key: 'added_by_name', value: 'Added By' }
  ];


  constructor(public dialogRef: MatDialogRef<QcqNotePopupComponent>, public fb: FormBuilder, private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { columDetail: any }) {
    this.isOpenManageDMNotesSidebar = true;
    this.notesForm = this.fb.group({
      daDatabase_Salesforce_Id: [data.columDetail.salesforceId],
      daDatabase_Product_Id: [data.columDetail.productId],
      column_name: [data.columDetail.column_name],
      description: ['', [Validators.required]]
    });

    this.product_id = data.columDetail.productId;
    this.salesforceId = data.columDetail.salesforceId

    this.currentUser = this.storageService.UserDetails;
  }


  getStandardizeColumnName(columnName: string) {
    let col = this.standardColumnList.filter(c => c.key.toLowerCase() == columnName.toLowerCase());
    if (col && col.length)
      return col[0].value;
    else
      return columnName;
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }
}
