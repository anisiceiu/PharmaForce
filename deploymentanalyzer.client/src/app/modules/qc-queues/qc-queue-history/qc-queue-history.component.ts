import { animate, state, style, transition, trigger } from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, viewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import * as _ from 'underscore';
import { GetDMSalesforceRecordsFilters, GetQCHistories, getDMCompaniesForCountry, getDMPeriodSalesforceForCompany } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { SalesforceOption } from '../../../models/SalesforceOption';
import { qcqueues, qcqueuesChildRecord } from '../../../models/qcqueues';
import { IdNamePair, dropdowncollection } from '../../../models/salesforcedata';
import { ApiService } from '../../../services/Api/api.service';
import { CommonMethodService } from '../../../services/common/common-method.service';
import { StorageService } from '../../../services/common/storage.service';
import { ToasterService } from '../../../services/common/toaster.service';

@Component({
  selector: 'app-qc-queue-history',
  templateUrl: './qc-queue-history.component.html',
  styleUrl: './qc-queue-history.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class QcQueueHistoryComponent implements OnInit {

  currentUser: any;
  qcqueues: qcqueues[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;
  accordion = viewChild.required(MatAccordion);
  dataSource = new MatTableDataSource<qcqueues>(this.qcqueues);
  totalRecords: number = 0;
  resultsLength = 0;
  pageSize: number = 10; // Default page size
  pageIndex: number = 0;
  isReset = false;
  showFilter = false;
  searchForm: FormGroup;
  sortField = '';
  sortDirection = '';

  all_data: dropdowncollection | undefined;
  countries_Names: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  salesforce_Names: SalesforceOption[] = [];
  period_Years: IdNamePair[] = [];

  salesforce_NameNarrow: IdNamePair[] = [];
  companies_NamesNarrow: IdNamePair[] = [];
  period_YearsNarrow: IdNamePair[] = [];
  period_QuartersNarrow: IdNamePair[] = [];
  periodSalesforceForCompany: any = [];


  period_Quarters: IdNamePair[] = [
    { id: 4, name: '4' },
    { id: 3, name: '3' },
    { id: 2, name: '2' },
    { id: 1, name: '1' },
  ];
  qcq_Status: IdNamePair[] = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Rejected' }
  ];
  salesforce_type: IdNamePair[] = [];

  filteredOptionsCountry_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsCompany_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsSalesForce_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsPeriodYear_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsPeriodQuarter_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();

  @ViewChild('outerSort', { static: true }) sort!: MatSort;
  @ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<qcqueuesChildRecord>>;

  innerDisplayedColumns = ['daDatabase_Product_id', 'column_Name', 'message', 'previous_value', 'date_added', 'added_by','qcq_note'];
  expandedElement!: qcqueues | null;


  displayedColumns: string[] = [
    'select',
    'qcq_status',
    'has_citation',
    'country_Name',
    'company_Name',
    'period_Year',
    'period_Quarter',
    'salesforce_Name',
    'type_of_Salesforce',
    'number_Of_Sales_Representatives',
    'number_Of_District_Managers',
    'number_Of_Regional_Managers',
    'uS_Product_Name_Product_Promoted',
    'country_Specific_Product_Name_Product_Promoted',
    'generic_Name',
    'therapeutic_Category',
    'product_Promotion_Priority_Order',
    'total_Number_of_Full_Time_Equivalents_FTEs',
    'primary_Care_Full_Time_Equivalents_FTEs',
    'specialty_Full_Time_Equivalents_FTEs',
    'physicians_Focus_Primary_Care_Physicians_Specialty_Physicians',
    'specialty_Physicians_Targeted',
    'co_Promotion_YesNo',
    'name_of_a_Partner_Company',
    'contract_Sales_Force_YesNo',
    'name_of_a_CSO_Contract_Sales_Organization',
    'salary_Low',
    'salary_High',
    'target_Bonus',
    'reach',
    'pct_Split_Between_Primary_Care_And_Specialty',
    'frequency',
    'additional_Notes_Product',
    'additional_Notes_Salesforce',
    'added_date',
    'added_by_name',
    'modified_date',
    'modified_by_name',
    'daDatabase_Salesforce_id',
    'product_promoted',
  ];
  filteredOptionsSearchText: string[] = [];
  searchTextOptions: string[] = [];
  constructor(private dialog: MatDialog, private apiService: ApiService, public fb: FormBuilder,
    private commonMethodService: CommonMethodService, private storageService: StorageService, private cd: ChangeDetectorRef,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) {
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

  private _filterCountry(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.countries_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterCompany(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.companies_NamesNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterSalesForce(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.salesforce_NameNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterPeriodYear(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.period_YearsNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterPeriodQuarter(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.period_Quarters.filter(option => option.id.toString().toLowerCase().startsWith(filterValue));
  }

  onSearch() {
    //this.accordion().closeAll();
    this.initializeDataSource();
    this.paginator.firstPage();
  }


  initializeDataSource() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          if (!this.isReset) {
            this.pageIndex = this.paginator.pageIndex;
            this.pageSize = this.paginator.pageSize;
            this.sortField = this.sort?.active;
            this.sortDirection = this.sort?.direction;
          }
          return this.fetchData();
        }),
        map((data) => {
          this.qcqueues = data.result.records;
          this.totalRecords = data.result.totalRecords;
          this.dataSource = new MatTableDataSource<qcqueues>(this.mapQcQueuesDataForNestedTable(this.qcqueues));
          this.paginator.length = this.totalRecords;
        }),
        catchError(() => {
          // Handle error, e.g., show error message
          return of(null);
        })
      )
      .subscribe();
  }

  fetchData(): Observable<any> {
    this.isReset = false;
    let data = {
      user_id: this.currentUser.id,
      caller: '',
      pageSize: this.pageSize,
      page: this.pageIndex + 1,
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
    return this.apiService.PostAll(GetQCHistories, data);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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

          this.filteredOptionsCountry_Name = of(this.countries_Names);

          this.populateSearchTextOptions(this.salesforce_Names, this.companies_Names, product_Names);

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

  displayFn(item: IdNamePair): string {
    return item && item.name ? item.name : '';
  }

  onSelectedCountryChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['country_Name'].setValue(event.option.value.name);
    }

    this.apiService.PostAll(getDMCompaniesForCountry, { user_id: this.currentUser.id, security_token: '', country_name: event.option.value.name }).subscribe(response => {
      if (response && response.status) {
        this.companies_NamesNarrow = this.companies_Names.filter(i => response.result.findIndex((c: { company_Name: string; }) => c.company_Name == i.name) > -1);
        this.filteredOptionsCompany_Name = of(this.companies_NamesNarrow);
        this.filteredOptionsCompany_Name = this.searchForm?.controls['company_NameAuto']?.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filterCompany(name as string) : this.companies_NamesNarrow?.slice();
          }),
        );
      }
    });


  }

  onSelectedCompanyChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['company_Name'].setValue(event.option.value.name);
    }

    this.apiService.PostAll(getDMPeriodSalesforceForCompany, { user_id: this.currentUser.id, security_token: '', country_Name: this.searchForm.controls['country_Name'].value, company_name: event.option.value.name }).subscribe(response => {
      if (response && response.status) {
        this.periodSalesforceForCompany = response.result;
        this.period_YearsNarrow = this.period_Years.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; }) => c.period_Year == i.name) > -1);
        const currentYear = new Date().getFullYear().toString();
        this.period_YearsNarrow.forEach((year) => {
          if (year.name === currentYear) {
            year.name = `${year.name} - current`;
          }
        });
        this.salesforce_NameNarrow = this.salesforce_Names.filter(c => this.periodSalesforceForCompany.findIndex((u: { salesForce_Name: string; }) => u.salesForce_Name == c.name && c.company == event.option.value.name && c.country == this.searchForm.controls['country_Name'].value) > -1);
        if (this.searchForm.controls['salesForce_Name'].value && this.salesforce_NameNarrow.findIndex(c => c.name == this.searchForm.controls['salesForce_Name'].value) == -1) {
          this.searchForm.controls['salesForce_Name'].setValue(null);
        }

        this.filteredOptionsPeriodYear_Name = of(this.period_YearsNarrow);
        this.filteredOptionsSalesForce_Name = of(this.salesforce_NameNarrow);
        this.filteredOptionsSalesForce_Name = this.searchForm.controls['salesForce_NameAuto'].valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filterSalesForce(name as string) : this.salesforce_NameNarrow.slice();
          }),
        );
      }
    });

  }

  onSelectedSalesForceChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['salesForce_Name'].setValue(event.option.value.name);
    }
  }

  resetAllFilters() {
    this.isReset = true;

    this.accordion().closeAll();
    this.pageIndex = 0;
    this.pageSize = 10;
    this.searchForm.reset({
      country_Name: '',
      company_Name: '',
      salesForce_Name: '',
      dadatabase_id: '',
      search_text: '',
      period_Year: '',
      period_Quarter: '',
      qcq_status: null,
      has_citation: false
    });
    this.searchForm.controls['country_NameAuto'].setValue(null);
    this.searchForm.controls['company_NameAuto'].setValue(null);
    this.searchForm.controls['salesForce_NameAuto'].setValue(null);
    this.searchForm.controls['search_NameAuto'].setValue(null);
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    //this.sort!.direction = '';
    //this.sort!.active = '';
    this.sortDirection = '';
    this.sortField = '';
    this.initializeDataSource();
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
    this.commonMethodService.setTitle("QC Queues");
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
    this.accordion().openAll();
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


  filterDisplay() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }

  //loadQCQueue() {
  //  this.apiService.PostAll(GetQCHistories, {
  //    user_id: this.currentUser.id,
  //    company_id: this.searchForm.controls['company_Id'].value,
  //    is_pending: Boolean(this.searchForm.controls['is_pending'].value),
  //    is_reviewed: Boolean(this.searchForm.controls['is_reviewed'].value),
  //    is_approved: Boolean(this.searchForm.controls['is_approved'].value),
  //    is_rejected: Boolean(this.searchForm.controls['is_rejected'].value),
  //    DADatabase_Salesforce_id:null,
  //  }).subscribe((response: ApiResponse) => {

  //    if (response.status) {
  //      this.qcqueues = response.result;
  //      this.dataSource = new MatTableDataSource<qcqueues>(this.mapQcQueuesDataForNestedTable(this.qcqueues));
  //      this.dataSource.paginator = this.paginator;
  //      this.dataSource.sort = this.sort;
  //    } else {
  //      this.toasterService.showError(response.message);
  //    }
  //  });
  //}

  toggleRow(element: qcqueues) {
    element.childRecords && (element.childRecords as MatTableDataSource<qcqueuesChildRecord>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<qcqueuesChildRecord>).sort = this.innerSort.toArray()[index]);
  }

  mapQcQueuesDataForNestedTable(qcqueueList: qcqueues[]) {
    let newQcQueueList: qcqueues[] = [];
    //sf with no product ids
    let sf_no_products = qcqueueList.filter(c => !c.daDatabase_Product_id);

    let sfGrouppeddata = _.chain(sf_no_products).groupBy('daDatabase_Salesforce_id').map(function (items, sfid) {
      return {
        sfId: sfid,
        records: _.sortBy(items, 'added_Dt').reverse()
      };
    });

    sfGrouppeddata.forEach(item => {
      let record: qcqueues = _.first(_.sortBy(item.records, 'added_Dt').reverse()) ?? {} as qcqueues;
      record!.childRecords = new MatTableDataSource(item.records.map(function (rowItem) {
        return {
          daDatabase_Product_id: rowItem.daDatabase_Product_id,
          column_Name: rowItem.column_Name,
          message: rowItem.message,//new_value
          previous_value: rowItem.previous_value,
          date_Added: rowItem.date_Added,
          added_by: rowItem.added_by,
          qcq_note: rowItem.qcq_note,
        } as qcqueuesChildRecord;
      }));
      

      newQcQueueList.push(record);

    });

    qcqueueList = qcqueueList.filter(c => c.daDatabase_Product_id);
    let grouppedData = _.chain(qcqueueList).groupBy('daDatabase_Product_id').map(function (items, productId) {
      return {
        productId: productId,
        records: _.sortBy(items, 'added_Dt').reverse()
      };
    });

    grouppedData.forEach(item => {
      let record: qcqueues = _.first(_.sortBy(item.records, 'added_Dt').reverse()) ?? {} as qcqueues;
      record!.childRecords = new MatTableDataSource(item.records.map(function (rowItem) {
        return {
          daDatabase_Product_id: rowItem.daDatabase_Product_id,
          column_Name: rowItem.column_Name,
          message: rowItem.message,//new_value
          previous_value: rowItem.previous_value,
          date_Added: rowItem.date_Added,
          added_by: rowItem.added_by,
          qcq_note: rowItem.qcq_note,
        } as qcqueuesChildRecord;
      }));

      newQcQueueList.push(record);

    });

    //newQcQueueList = newQcQueueList.concat(sf_no_products);
    newQcQueueList = _.sortBy(newQcQueueList, 'added_Dt').reverse();

    return newQcQueueList;
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
