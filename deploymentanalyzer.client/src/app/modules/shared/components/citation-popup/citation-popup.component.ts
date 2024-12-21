import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../services/Api/api.service';
import { ToasterService } from '../../../../services/common/toaster.service';
import { GetAllCitation } from '../../../../constants/api.constant';
import { citation } from '../../../../models/citation';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '../../../../services/common/storage.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-citation-popup',
  templateUrl: './citation-popup.component.html',
  styleUrls: ['./citation-popup.component.scss']
})
export class CitationPopupComponent implements OnInit {

  isOpenManageDMCitationSidebar = false;
  isEnabledCitationPrimarySearch = true;
  isEnabledCitationSecondarySearch = false;
  isEnabledCitationAnalystComment = false;

  citationForm: FormGroup;

  salesforceId: string = '';
  productId:string = '';
  columnName: string = '';

  citationItems: citation[] = [];
  displayedColumns: string[] = ['column_name', 'comments', 'type', 'added_by_name', 'added_dt'];
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


  currentUser: any;
  isExpandedCitationListExpansionPanel: boolean = false;

  citationdataSource = new MatTableDataSource<citation>(this.citationItems);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(public dialogRef: MatDialogRef<CitationPopupComponent>,public fb:FormBuilder,
    private apiService: ApiService,  private toasterService: ToasterService, private storageService:StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { columDetail: any }) { 
      
      this.salesforceId = data.columDetail.salesforceId;
      this.productId = data.columDetail.productId;
      this.columnName = data.columDetail.column_name;
     
      this.citationForm = this.fb.group({
        id: [data.columDetail.id || null],
        user_id: [data.columDetail.user_id || null],
        daDatabase_Salesforce_Id: [data.columDetail.salesforceId],
        daDatabase_Product_Id: [data.columDetail.productId],
        column_name: [data.columDetail.column_name],
        date: [''],
        url: [''],
        description: [''],
        type: [data.columDetail.productId ? 'product' : 'Salesforce'],
        source_function: [''],
        source_type: [''],
        company_overview: [''],
        interview_date: [''],
        comments: [''],
        analyst_comments: [''],
        status:  [data.columDetail.productId ? 'product' : 'Salesforce'],
        primary: [this.isEnabledCitationPrimarySearch],
        secondary: [this.isEnabledCitationSecondarySearch],
        analyst: [this.isEnabledCitationAnalystComment],

    });
    
    this.isOpenManageDMCitationSidebar = true;
    
  }

  getStandardizeColumnName(columnName:string)
  {
    let col = this.standardColumnList.filter(c => c.key.toLowerCase() == columnName.toLowerCase());
    if (col && col.length)
      return col[0].value;
    else
      return columnName;
  }

  toggleCitationListExpansionPanel() {
    this.isExpandedCitationListExpansionPanel =
      !this.isExpandedCitationListExpansionPanel;
  }

  ngOnInit() {
    this.currentUser = this.storageService.UserDetails;
    this.bindCitationData();
  }

  bindCitationData(){
    let request = {
      user_id: this.currentUser.id,
      topn: 100,
      daDatabase_Salesforce_Id: this.salesforceId,
      daDatabase_Product_Id: this.productId,
      column_List: this.columnName,
      security_Token: ""
    }

    this.apiService.PostAll(GetAllCitation,request,true).subscribe(result=>{
      if (result.status) {
        this.citationItems = result.result;
        this.citationdataSource = new MatTableDataSource<citation>(this.citationItems);
        this.citationdataSource.paginator = this.paginator;
        this.citationdataSource.sort = this.sort;
      }else{
        this.toasterService.showError(result.message);
      }
    });
  }

  onPrimaryChange(event: MatCheckboxChange) {
    this.isEnabledCitationPrimarySearch = event.checked;
    this.citationForm.get('primary')?.setValue(this.isEnabledCitationPrimarySearch ? 'primary' : '');
  }

  onSecondaryChange(event: MatCheckboxChange) {
      this.isEnabledCitationSecondarySearch = event.checked;
      this.citationForm.get('secondary')?.setValue(this.isEnabledCitationSecondarySearch ? 'secondary' : '');
  }

  onAnalystChange(event: MatCheckboxChange) {
      this.isEnabledCitationAnalystComment = event.checked;
      this.citationForm.get('analyst')?.setValue(this.isEnabledCitationAnalystComment ? 'analyst' : '');
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
