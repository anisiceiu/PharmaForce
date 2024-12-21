import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { notes } from '../../../models/notes';
import { ApiService } from '../../../services/Api/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { GetDMSalesforceRecordsFilters, getNotes } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';
import { StorageService } from '../../../services/common/storage.service';
import { IdNamePair, dropdowncollection } from '../../../models/salesforcedata';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Observable, map, of, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  
 
  currentUser: any;

  all_data: dropdowncollection | undefined;
  countries_Names: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  salesforce_Names: IdNamePair[] = [];
  period_Years: IdNamePair[] = [];
  period_Quarters: IdNamePair[] = [
    { id: 4, name: '4' },
    { id: 3, name: '3' },
    { id: 2, name: '2' },
    { id: 1, name: '1' },
  ];
 
  salesforce_type: IdNamePair[] = [];

  showFilter = false;
  searchForm: FormGroup;
  sortField = '';
  sortDirection = '';
  accordion = viewChild.required(MatAccordion);
  isReset = false;
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

  filteredOptionsCountry_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsCompany_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsSalesForce_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsPeriodYear_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsPeriodQuarter_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  
  notes: notes[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<notes>(true, []);
  dataSource = new MatTableDataSource<notes>(this.notes);
   
  displayedColumns: string[] = ['daDatabase_Salesforce_Id', 'daDatabase_Product_Id',  
    'column_name', 'company_Name', 'country_Name',
    'salesforce_Name', 'period_Year', 'period_Quarter', 'description', 'full_Name',
    'added_Dt', 'uS_Product_Name_Product_Promoted'];

  filteredOptionsSearchText: string[] = [];
  searchTextOptions: string[] = [];

  constructor(private dialog: MatDialog, private apiService: ApiService, public fb: FormBuilder,
    private toasterService:ToasterService,private _liveAnnouncer: LiveAnnouncer,
    private storageService:StorageService
  ) {
    this.searchForm = this.fb.group({
      country_Name: [''],
      company_Name: [''],
      salesForce_Name: [''],
      period_Year: [''],
      period_Quarter: [''],
      qcq_status: [null],
      has_citation: [null],
      search_text: [null],
      country_NameAuto: [''],
      company_NameAuto: [''],
      salesForce_NameAuto: [''],
      dadatabase_id: [''],
      qcq_statusAuto: [null],
      has_citationAuto: [null],
      search_NameAuto: [null]
    });

    
  }

  onSearchTextChange(event: MatAutocompleteSelectedEvent) {
    this.searchForm.controls['search_text'].setValue(event.option.value);
    this.onSearch();
  }

  resetAllFilters() {
    this.isReset = true;

    this.accordion().closeAll();
    this.searchForm.reset({
      country_Name: '',
      company_Name: '',
      salesForce_Name: '',
      dadatabase_id: '',
      period_Year: '',
      period_Quarter: '',
      search_text: '',
      country_NameAuto: '',
      company_NameAuto: '',
      salesForce_NameAuto: '',
      qcq_status: null,
      has_citation: false
    });
    this.searchForm.controls['country_NameAuto'].setValue(null);
    this.searchForm.controls['company_NameAuto'].setValue(null);
    this.searchForm.controls['salesForce_NameAuto'].setValue(null);
    this.searchForm.controls['search_NameAuto'].setValue(null);
    this.sort.direction = '';
    this.sort.active = '';
    this.sortDirection = '';
    this.sortField = '';
    this.onSearch();
  }

  getStandardizeColumnName(columnName: string) {
    let col = this.standardColumnList.filter(c => c.key.toLowerCase() == columnName?.toLowerCase());
    if (col && col.length)
      return col[0].value;
    else
      return columnName;
  }

  removeToppings(name: string) {
    switch (name) {
      case 'country':
        this.searchForm.get('country_Name')?.setValue(null);
        this.searchForm.controls['country_NameAuto'].setValue(null);
        break;
      case 'company':
        this.searchForm.get('company_Name')?.setValue(null);
        this.searchForm.controls['company_NameAuto'].setValue(null);
        break;
      case 'salesforce':
        this.searchForm.get('salesForce_Name')?.setValue(null);
        this.searchForm.controls['salesForce_NameAuto'].setValue(null);
        break;
      case 'period_Year':
        this.searchForm.get('period_Year')?.setValue(null);
        break;
      case 'period_Quarter':
        this.searchForm.get('period_Quarter')?.setValue(null);
        break;
      case 'qcq_status':
        this.searchForm.get('qcq_status')?.setValue(null);
        break;
      case 'dadatabase_id':
        this.searchForm.get('dadatabase_id')?.setValue(null);
        break;
      case 'has_citation':
        this.searchForm.get('has_citation')?.setValue(null);
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    

    this.filteredOptionsPeriodYear_Name = this.searchForm.controls['period_Year'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterPeriodYear(name as string) : this.period_Years.slice();
      }),
    );

    this.filteredOptionsPeriodQuarter_Name = this.searchForm.controls['period_Quarter'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filterPeriodQuarter(name as string) : this.period_Quarters.slice();
      }),
    );

    this.searchForm.controls['search_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => this.filteredOptionsSearchText = this._filterSearchText(value || '')),
    ).subscribe();

    this.initializeSearchFilterData();

    /*this.loadNotes();*/
  }

  private _filterSearchText(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchTextOptions.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  populateSearchTextOptions(salesForces: IdNamePair[], companies: IdNamePair[], products: IdNamePair[]) {
    let list: string[] = new Array<string>();

    if (salesForces && salesForces.length) {
      let s_list = salesForces.map(o => o['name']);
      list = [...new Set(list.concat(s_list))];
    }
    if (companies && companies.length) {
      let s_list = companies.map(o => o['name']);
      list = [...new Set(list.concat(s_list))];
    }
    if (products && products.length) {
      let s_list = products.map(o => o['name']);
      list = [...new Set(list.concat(s_list))];
    }

    this.searchTextOptions = list.sort(function (a, b) {
      if (a < b) return 1;
      if (b < a) return -1;
      return 0;
    });

  }

  bindFilterEvents() {
    this.filteredOptionsCountry_Name = this.searchForm.controls['country_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterCountry(name as string) : this.countries_Names.slice();
      }),
    );

    this.filteredOptionsCompany_Name = this.searchForm.controls['company_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterCompany(name as string) : this.companies_Names.slice();
      }),
    );

    this.filteredOptionsSalesForce_Name = this.searchForm.controls['salesForce_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterSalesForce(name as string) : this.salesforce_Names.slice();
      }),
    );
  }

  displayFn(item: IdNamePair): string {
    return item && item.name ? item.name : '';
  }

  private _filterCountry(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.countries_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterCompany(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.companies_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterSalesForce(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.salesforce_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterPeriodYear(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.period_Years.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterPeriodQuarter(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.period_Quarters.filter(option => option.id.toString().toLowerCase().startsWith(filterValue));
  }

  onSelectedCountryChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['country_Name'].setValue(event.option.value.name);
    }
  }

  onSelectedCompanyChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['company_Name'].setValue(event.option.value.name);
    }
  }

  onSelectedSalesForceChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['salesForce_Name'].setValue(event.option.value.name);
    }
  }



  onSearch() {
    this.accordion().closeAll();
    let data = {
      user_id: this.currentUser.id,
      caller: '',
      pageSize: 0,
      page: 1,
      company: this.searchForm.get('company_Name')?.value
        ? this.searchForm.get('company_Name')?.value
        : null,
      country: this.searchForm.get('country_Name')?.value
        ? this.searchForm.get('country_Name')?.value
        : null,
      salesforce: this.searchForm.get('salesForce_Name')?.value
        ? this.searchForm.get('salesForce_Name')?.value
        : null,
      product: null,
      period_Year: this.searchForm.get('period_Year')?.value
        ? this.searchForm.get('period_Year')?.value
        : null,
      period_Quarter: this.searchForm.get('period_Quarter')?.value
        ? this.searchForm.get('period_Quarter')?.value
        : null,
      qcq_status: this.searchForm.get('qcq_status')?.value
        ? this.searchForm.get('qcq_status')?.value
        : null,
      dadatabase_id: this.searchForm.get('dadatabase_id')?.value
        ? this.searchForm.get('dadatabase_id')?.value
        : null,
      has_citation: this.searchForm.get('has_citation')?.value
        ? (this.searchForm.get('has_citation')?.value ? 1 : 0)
        : null,
      search_text: this.searchForm.get('search_text')?.value
        ? this.searchForm.get('search_text')?.value
        : null,
      security_Token: '',
      sortField: this.sortField ? this.sortField.toLowerCase() : '',
      sortDirection: this.sortDirection,
    };

      this.apiService.PostAll(getNotes,data).subscribe((response:ApiResponse) => {

        if(response.status){
          this.notes = this.getStandardizeNoteList(response.result);
          this.dataSource = new MatTableDataSource<notes>(this.notes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
          this.toasterService.showError(response.message);
        }
      });

    this.paginator.firstPage();
  }

  getStandardizeNoteList(list: any[]) {
    let noteList = list.map(item => ({ ...item, column_name: this.getStandardizeColumnName(item.column_name) }));
    return noteList;
  }

  filterDisplay() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }

  initializeSearchFilterData() {
    let data = {};
    this.apiService
      .PostAll(GetDMSalesforceRecordsFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.all_data = response.result;
          this.companies_Names = response.result.company_Name;
          this.countries_Names = response.result.country_Name;
          this.salesforce_Names = response.result.salesForce_Name;
          this.period_Years = response.result.period_Year;
          let product_Names = response.result.us_Brand_Name;

          this.filteredOptionsCountry_Name = of(response.result.country_Name);
          this.filteredOptionsCompany_Name = of(response.result.company_Name);
          this.filteredOptionsSalesForce_Name = of(response.result.salesForce_Name);
          this.filteredOptionsPeriodYear_Name = of(this.period_Years);

          this.populateSearchTextOptions(this.salesforce_Names, this.companies_Names, product_Names);

          this.bindFilterEvents();

          if (this.countries_Names && this.countries_Names.length && this.searchForm.controls['country_Name'].value) {
            let selected = this.countries_Names.filter(c => c.name == this.searchForm.controls['country_Name'].value);
            if (selected && selected.length)
              this.searchForm.controls['country_NameAuto'].setValue(selected[0]);
          }

          if (this.companies_Names && this.companies_Names.length && this.searchForm.controls['company_Name'].value) {
            let selected = this.companies_Names.filter(c => c.name == this.searchForm.controls['company_Name'].value);
            if (selected && selected.length)
              this.searchForm.controls['company_NameAuto'].setValue(selected[0]);
          }

          if (this.salesforce_Names && this.salesforce_Names.length && this.searchForm.controls['salesForce_Name'].value) {
            let selected = this.salesforce_Names.filter(c => c.name == this.searchForm.controls['salesForce_Name'].value);
            if (selected && selected.length)
              this.searchForm.controls['salesForce_NameAuto'].setValue(selected[0]);
          }

          this.onSearch();
        }
      });
  }


  //loadNotes() {

  //  let data = {
  //    user_id : this.currentUser.id, 
  //    daDatabase_Salesforce_Id : "",
  //    daDatabase_Product_Id : "" 
  //  }

  //  this.apiService.PostAll(getNotes,data).subscribe((response:ApiResponse) => {

  //    if(response.status){
  //      this.notes = response.result;
  //      this.dataSource = new MatTableDataSource<notes>(this.notes);
  //      this.dataSource.paginator = this.paginator;
  //      this.dataSource.sort = this.sort;
  //    }else{
  //      this.toasterService.showError(response.message);
  //    }
  //  });
  //}
  
  filterNotes(data:Event){
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
