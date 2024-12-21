import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CitationPopupComponent } from '../citation-popup/citation-popup.component';
import { notes } from '../../../../models/notes';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '../../../../services/common/storage.service';
import { ApiService } from '../../../../services/Api/api.service';
import { getNotes } from '../../../../constants/api.constant';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-notes-popup',
  templateUrl: './notes-popup.component.html',
  styleUrls: ['./notes-popup.component.scss']
})
export class NotesPopupComponent implements OnInit {

  isOpenManageDMNotesSidebar = false;
  notesForm: FormGroup;
  notesItems: notes[] = [];
  @ViewChild('notePaginator') paginator!: MatPaginator;
  @ViewChild('noteSort') sort: MatSort = new MatSort();
  notesdataSource = new MatTableDataSource<notes>(this.notesItems);
  currentUser: any;
  salesforceId: string = '';
  product_id: string = '';
  displayedNotesColumns: string[] = [
    'column_name',
    'description',
    'full_Name',
    'company_Name',
    'country_Name',
    'salesforce_Name',
    'period_Year',
    'period_Quarter',
    'added_Dt'
  ];

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

  isExpandedNoteListExpansionPanel: boolean = false;
  constructor(public dialogRef: MatDialogRef<NotesPopupComponent>, private apiService: ApiService, public fb: FormBuilder, private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { columDetail: any }) { 
    this.isOpenManageDMNotesSidebar = true;
    this.notesForm = this.fb.group({
      daDatabase_Salesforce_Id: [data.columDetail.salesforceId],
      daDatabase_Product_Id : [data.columDetail.productId],
      column_name: [data.columDetail.column_name],
      description: ['',[Validators.required]]
    });

    this.product_id = data.columDetail.productId;
    this.salesforceId = data.columDetail.salesforceId

    this.currentUser = this.storageService.UserDetails;
  }

  toggleNoteListExpansionPanel() {
    this.isExpandedNoteListExpansionPanel =
      !this.isExpandedNoteListExpansionPanel;
  }

  ngOnInit() {

    if (this.data.columDetail.productId) {
      this.getProductsNotes();
    }
    else {
      this.getSalesForceNotes();
    }
  }


  getSalesForceNotes() {
    let data = {
      user_id: this.currentUser.id,
      daDatabase_Salesforce_Id: this.salesforceId,
      daDatabase_Product_id: "",
      security_Token: ""
    }

    this.apiService.PostAll(getNotes, data, true).subscribe(response => {
      if (response.status) {
        this.notesItems = this.getStandardizeNoteList(response.result);
        this.notesdataSource = new MatTableDataSource<notes>(this.notesItems);
        this.notesdataSource.paginator = this.paginator;
        this.notesdataSource.sort = this.sort;
      }
    });
  }


  getProductsNotes() {
    let data = {
      user_id: this.currentUser.id,
      daDatabase_Salesforce_Id: "",
      daDatabase_Product_id: this.product_id,
      security_Token: ""
    }

    this.apiService.PostAll(getNotes, data, true).subscribe(response => {
      if (response.status) {
        this.notesItems = this.getStandardizeNoteList(response.result);
        this.notesdataSource = new MatTableDataSource<notes>(this.notesItems);
      }
    });
  }

  getStandardizeColumnName(columnName: string) {
    let col = this.standardColumnList.filter(c => c.key.toLowerCase() == columnName.toLowerCase());
    if (col && col.length)
      return col[0].value;
    else
      return columnName;
  }

  getStandardizeNoteList(list: any[]) {
    let noteList = list.map(item => ({ ...item, column_name: this.getStandardizeColumnName(item.column_name) }));
    return noteList;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
