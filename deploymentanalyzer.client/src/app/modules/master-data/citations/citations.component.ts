import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { citation } from '../../../models/citation';
import { ApiService } from '../../../services/Api/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { GetAllCitation, getAdminUsers } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';
import { StorageService } from '../../../services/common/storage.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IdNamePair } from '../../../models/salesforcedata';
import { MatAccordion } from '@angular/material/expansion';
import { User } from '../../../models/user';
import moment from 'moment';
import { toPascalCase } from '../../../services/common/utility';


@Component({
  selector: 'app-citation',
  templateUrl: './citations.component.html',
  styleUrls: ['./citations.component.scss']
})
export class CitationComponent implements OnInit {


  currentUser: any;

  citations: citation[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<citation>(true, []);
  dataSource = new MatTableDataSource<citation>(this.citations);
  showFilter = false;
  searchForm: FormGroup;
  isReset = false;
  accordion = viewChild.required(MatAccordion);

  columnChooserList = [
    { key: 'country_Name', value: 'Country Name' },
    { key: 'company_Name', value: 'Company Name' },
    { key: 'period_Year', value: 'Peiod Year' },
    { key: 'period_Quarter', value: 'Period Quarter' },
    { key: 'salesforce_Name', value: 'Salesforce Name' },
    { key: 'type_of_Salesforce', value: 'Type Of Salesforce' },
    { key: 'number_Of_Sales_Representatives', value: 'Number Of Sales Representatives' },
    { key: 'number_Of_District_Managers', value: 'Number Of District Managers' },
    { key: 'number_Of_Regional_Managers', value: 'Number Of Regional Managers' },
    { key: 'uS_Product_Name_Product_Promoted', value: 'US Product Name Product Promoted' },
    { key: 'country_Specific_Product_Name_Product_Promoted', value: 'Country Specific Product Name' },
    { key: 'generic_Name', value: 'Generic Name' },
    { key: 'therapeutic_Category', value: 'Therapeutic Category' },
    { key: 'product_Promotion_Priority_Order', value: 'product Promotion Priority Order' },
    { key: 'primary_Care_Full_Time_Equivalents_FTEs', value: 'Primary Care Full Time Equivalents FTEs' },
    { key: 'specialty_Full_Time_Equivalents_FTEs', value: 'Specialty Full Time Equivalents FTEs' },
    { key: 'physicians_Focus_Primary_Care_Physicians_Specialty_Physicians', value: 'Physicians Focus Primary Care' },
    { key: 'specialty_Physicians_Targeted', value: 'Specialty Physicians Targeted' },
    { key: 'co_Promotion_YesNo', value: 'Co Promotion YesNo' },
    { key: 'name_of_a_Partner_Company', value: 'Name OF A Partner Company' },
    { key: 'contract_Sales_Force_YesNo', value: 'Contract Sales Force YesNo' },
    { key: 'name_of_a_CSO_Contract_Sales_Organization', value: 'Contract Sales Organization' },
    { key: 'salary_Low', value: 'Salary low' },
    { key: 'salary_High', value: 'Salary High' },
    { key: 'target_Bonus', value: 'Target Bonus' },
    { key: 'reach', value: 'Reach' },
    { key: 'frequency', value: 'Frequency' },
    { key: 'additional_Notes', value: 'Additional Notes' }
  ];

  typeChooserList = ["Product", "Salesforce"];

  addedByList: User[] = [];

 // displayedColumns: string[] = ['select','DADatabase_Salesforce_Id', 'DADatabase_Product_Id', 'column_name', 'url', 'type', 'description','added_by','added_dt'];
  displayedColumns: string[] = ['daDatabase_Salesforce_Id', 'daDatabase_Product_Id', 'column_name', 'url', 'type', 'description','added_by_name','added_dt'];

  constructor(private dialog: MatDialog, private apiService: ApiService, public fb: FormBuilder,
    private toasterService:ToasterService,private _liveAnnouncer: LiveAnnouncer,
    private storageService:StorageService
  ) {
    this.searchForm = this.fb.group({
      column_name: [null],
      type: [null],
      added_by: [null],
      added_from: [null],
      added_to:[null],
      dadatabase_id: ['']
    });
  }

  resetAllFilters() {
    this.isReset = true;

    this.accordion().closeAll();
    this.searchForm.reset({
      column_name: null,
      type: null,
      added_by: null,
      added_from: null,
      added_to: null,
      dadatabase_id: ''
    });

    this.onSearch();
  }

  updateAdded_from(event: any) {
    if (event.value) {
      const added_from = moment(event.value).format("YYYY-MM-DD");
      this.searchForm.controls['added_from'].setValue(added_from);
    }
  }

  updateAdded_to(event: any) {
    if (event.value) {
      const added_to = moment(event.value).format("YYYY-MM-DD");
      this.searchForm.controls['added_to'].setValue(added_to);
    }
  }

  onSearch() {
    this.accordion().closeAll();
    this.loadCitations();
  }

  filterDisplay() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    //this.loadCitations();
    this.loadAddedByUserList();
  }

  loadAddedByUserList() {
    this.apiService.GetAll(getAdminUsers).subscribe(response => {
      if (response && response.status) {
        this.addedByList = response.result;
        this.onSearch();
      }
    });
  }

  loadCitations() {

    let data = {
      user_id: this.currentUser.id,
      caller: '',
      Column_List: this.searchForm.get('column_name')?.value
        ? this.searchForm.get('column_name')?.value.join()
        : '',
      type: this.searchForm.get('type')?.value
        ? this.searchForm.get('type')?.value.join()
        : null,
      added_by: this.searchForm.get('added_by')?.value
        ? this.searchForm.get('added_by')?.value
        : null,
      added_from: this.searchForm.get('added_from')?.value
        ? this.searchForm.get('added_from')?.value
        : null,
      added_to: this.searchForm.get('added_to')?.value
        ? this.searchForm.get('added_to')?.value
        : null,
      dadatabase_id: this.searchForm.get('dadatabase_id')?.value
        ? this.searchForm.get('dadatabase_id')?.value
        : null,
      security_Token: ''
    };

    this.apiService.PostAll(GetAllCitation,data).subscribe((response:ApiResponse) => {

      if (response.status) {
        this.citations = response.result;
        this.citations = this.citations.map(citation => ({
          ...citation,
          column_name: toPascalCase(citation.column_name)
        }));
        this.dataSource = new MatTableDataSource<citation>(this.citations);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }
  
  filterCitation(data:Event){
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
