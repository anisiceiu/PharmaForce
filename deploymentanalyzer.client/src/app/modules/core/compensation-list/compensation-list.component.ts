import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { IdNamePair, SalesforceData } from '../../../models/salesforcedata';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, catchError, filter, map, merge, of, startWith, switchMap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ToasterService } from '../../../services/common/toaster.service';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/common/storage.service';
import { GetBrandGroupFilters, GetCustomerDropdowns, GetRegionListHavingCountry, GetSalesforceList, addUserPreference, getAdminPeriods, getAdminTherapeuticCategories, getCompensationRecordsFilters, getCompensationSalesForceRecords, getUserPreferences } from '../../../constants/api.constant';
import { UserPreference } from '../../../models/userPreference';
import { ApiResponse } from '../../../models/ApiResponse';
import { CustomerDropdownGroupModel } from '../../../models/CustomerDropdown';
import { Period } from '../../../models/period';
import { Salesforce } from '../../../models/Salesforce';
import { TherapeuticCategory } from '../../../models/therapeuticCategory';
import * as XLSX from 'xlsx';
import { UserPermissionModel } from '../../../models/AppFunction';


@Component({
  selector: 'app-compensation-list',
  templateUrl: './compensation-list.component.html',
  styleUrl: './compensation-list.component.css'
})
export class CompensationListComponent implements OnInit {
  userPermission: UserPermissionModel = {
    canAccessReport: true,
    canExportExcel: true,
    canSaveSearch: true
  } as UserPermissionModel;
  userPreferences: UserPreference = {} as UserPreference;
  region_Names: IdNamePair[] = [];
  countries_Names: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  salesforce_Names: IdNamePair[] = [];
  period_Names: IdNamePair[] = [];
  theraptic_category_Names: IdNamePair[] = [];
  product_Names: IdNamePair[] = [];
  countries_NamesBase: IdNamePair[] = [];
  companies_NamesBase: IdNamePair[] = [];
  salesforce_NamesBase: Salesforce[] = [];
  periodListBase: Period[] = [];
  theraptic_category_NamesBase: TherapeuticCategory[] = [];
  product_NamesBase: IdNamePair[] = [];
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;

  filteredOptionsCountry_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsCompany_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsSalesForce_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsPeriod_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionstherapticCategory_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsProduct_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();

  dataItems: SalesforceData[] = [];
  showFilter = false;
  searchForm: FormGroup;
  sortField = '';
  sortDirection = '';
  exportExcelFileName: string = "Call Compensation Grid Data.xlsx";

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  accordion = viewChild.required(MatAccordion);

  dataSource = new MatTableDataSource<SalesforceData>(this.dataItems);
  totalRecords: number = 0;
  resultsLength = 0;
  pageSize: number = 5; // Default page size
  pageIndex: number = 0;
  isReset = false;
  user_id = 0;
  currentUser: any;

  displayedColumns: string[] = [
    'company_Name',
    'country_Name',
    'salesforce_Name',
    'type_of_Salesforce',
    // 'period_Year',
    // 'therapeutic_Category',
    // 'period_Quarter',
    'salary_Low',
    'salary_High',
    'target_Bonus',
    // 'reach',
    // 'frequency',
    // 'generic_Name',
    // 'number_Of_Sales_Representatives',
    // 'number_Of_District_Managers',
    // 'number_Of_Regional_Managers',
  ];
  adminFunctionList = "";
  FN_ExportExcel = "54";
  FN_SaveSearch = "55";
  constructor(
    public fb: FormBuilder,
    private apiService: ApiService,
    private _liveAnnouncer: LiveAnnouncer,
    private toasterService: ToasterService,
    private storageService: StorageService
  ) {
    this.searchForm = this.fb.group({
      region_id: [0],
      country_id: [0],
      company_id: [0],
      salesforce_id: [0],
      period_id: [0],
      product_id: [0],
      theraptic_category_id: [0],
      country_NameAuto: [''],
      company_NameAuto: [''],
      salesForce_NameAuto: [''],
      product_NameAuto: [null],
      period_NameAuto: [null],
      therapticCategory_NameAuto: [null]
    });

    this.user_id = this.storageService.UserDetails.id;
    this.currentUser = this.storageService.UserDetails;
    this.adminFunctionList = this.currentUser.adminFunctions.split(",");
    this.getUserPreferences();
    this.setUserPermission();
  }

  setUserPermission() {
    if (this.storageService.UserDetails && this.storageService.UserDetails.userType == 'U' && this.storageService.UserDetails.userRights) {
      this.userPermission.canAccessReport = this.storageService.UserDetails.userRights.reportAccess;
      this.userPermission.canExportExcel = this.storageService.UserDetails.userRights.excelDownloadRights;
      this.userPermission.canSaveSearch = this.storageService.UserDetails.userRights.saveSearchAccess;
    } else {
      if (this.storageService.UserDetails.userType != 'U') {
        if (this.checkAccess(this.FN_ExportExcel)) {
          this.userPermission.canExportExcel = true;
        }
        else {
          this.userPermission.canExportExcel = false;
        }

        if (this.checkAccess(this.FN_SaveSearch)) {
          this.userPermission.canSaveSearch = true;
        }
        else {
          this.userPermission.canSaveSearch = false;
        }
      }
    }
  }

  exportToexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('tblCallCompensation');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.exportExcelFileName);

  }

  getFilterName(type:string) {

    let result: any = null;

    switch (type) {
      case 'region':
        if (this.searchForm.get('region_id')?.value && this.region_Names.length) {
          result = this.region_Names.find(c => c.id == this.searchForm.get('region_id')?.value)?.name;
        }
        break;
      case 'country':
        if (this.searchForm.get('country_id')?.value && this.countries_Names.length) {
          result = this.countries_Names.find(c => c.id == this.searchForm.get('country_id')?.value)?.name;
        }
        break;
      case 'company':
        if (this.searchForm.get('company_id')?.value && this.companies_Names.length) {
          result = this.companies_Names.find(c => c.id == this.searchForm.get('company_id')?.value)?.name;
        }
        break;
      case 'salesforce':
        if (this.searchForm.get('salesforce_id')?.value && this.salesforce_Names.length) {
          result = this.salesforce_Names.find(c => c.id == this.searchForm.get('salesforce_id')?.value)?.name;
        }
        break;
      case 'period':
        if (this.searchForm.get('period_id')?.value && this.period_Names.length) {
          result = this.period_Names.find(c => c.id == this.searchForm.get('period_id')?.value)?.name;
        }
        break;
      case 'theraptic_category':
        if (this.searchForm.get('theraptic_category_id')?.value && this.theraptic_category_Names.length) {
          result = this.theraptic_category_Names.find(c => c.id == this.searchForm.get('theraptic_category_id')?.value)?.name;
        }
        break;
      case 'product':
        if (this.searchForm.get('product_id')?.value && this.product_Names.length) {
          result = this.product_Names.find(c => c.id == this.searchForm.get('product_id')?.value)?.name;
        }
        break;
      default:
        break;
    }

    return result;
  }

  saveUserPreferences() {
    this.userPreferences.userID = this.user_id;
    this.userPreferences.pageId = 2;
    this.userPreferences.gridId = 1;
    this.userPreferences.columnSettings = JSON.stringify(this.displayedColumns);
    this.userPreferences.filterSettings = JSON.stringify(this.searchForm.value);
    this.apiService.Create(addUserPreference, this.userPreferences).subscribe(response => {
      if (response && response.status) {
        this.toasterService.showSuccess(response.message);
      }
      else {
        this.toasterService.showError(response.message);
      }
    });

  }

  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }


  getUserPreferences() {
    this.apiService.PostAll(getUserPreferences, { UserId: this.user_id, PageId: 2 }).subscribe(response => {
      if (response && response.status && response.result?.length) {
        this.userPreferences = response.result[0];
        // if (this.userPreferences.columnSettings && this.isJsonString(this.userPreferences.columnSettings)) {
        //   this.displayedColumns = JSON.parse(this.userPreferences.columnSettings);
        // }

        if (this.userPreferences.filterSettings && this.isJsonString(this.userPreferences.filterSettings)) {
          let filters = JSON.parse(this.userPreferences.filterSettings);
          this.searchForm.patchValue({
            region_id: filters.region_id,
            country_id: filters.country_id,
            company_id: filters.company_id,
            salesforce_id: filters.salesforce_id,
            period_id: filters.period_id,
            theraptic_category_id: filters.theraptic_category_id,
            // peek value by Id then assign to auto
            //country_NameAuto: filters.country_Name,
            //company_NameAuto: filters.company_Name,
            //salesForce_NameAuto: filters.salesForce_Name,
            //product_NameAuto: filters.qcq_status,
            //dadatabase_id: filters.dadatabase_id,
            //has_citationAuto: filters.has_citation,
            //period_Year: filters.period_Year,
            //period_Quarter: filters.period_Quarter
          });
        }
        this.onSearch();
      }
      else {
        this.userPreferences = {} as UserPreference;
        this.onSearch();
      }
    });
  }

  resetAllFilters() {
    this.isReset = true;

    this.accordion().closeAll();
    this.pageIndex = 0;
    this.pageSize = 5;
    this.searchForm.reset({
      region_id: 0,
      country_id: 0,
      company_id: 0,
      salesforce_id: 0,
      period_id: 0,
      product_id: 0,
      theraptic_category_id: 0,
    });

    this.searchForm.controls['country_NameAuto'].setValue(null);
    this.searchForm.controls['company_NameAuto'].setValue(null);
    this.searchForm.controls['salesForce_NameAuto'].setValue(null);
    this.searchForm.controls['product_NameAuto'].setValue(null);
    this.searchForm.controls['period_NameAuto'].setValue(null);
    this.searchForm.controls['therapticCategory_NameAuto'].setValue(null);

    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.sort.direction = '';
    this.sort.active = '';
    this.sortDirection = '';
    this.sortField = '';
    this.initializeDataSource();
  }

  removeToppings(name: string) {
    switch (name) {
      case 'region':
        this.searchForm.get('region_id')?.setValue(0);
        break;
      case 'country':
        this.searchForm.get('country_id')?.setValue(0);
        this.searchForm.controls['country_NameAuto'].setValue(null);
        break;
      case 'company':
        this.searchForm.get('company_id')?.setValue(0);
        this.searchForm.controls['company_NameAuto'].setValue(null);
        break;
      case 'salesforce':
        this.searchForm.get('salesforce_id')?.setValue(0);
        this.searchForm.controls['salesForce_NameAuto'].setValue(null);
        break;
      case 'period':
        this.searchForm.get('period_id')?.setValue(0);
        this.searchForm.controls['period_NameAuto'].setValue(null);
        break;
      case 'theraptic_category':
        this.searchForm.get('theraptic_category_id')?.setValue(0);
        this.searchForm.controls['therapticCategory_NameAuto'].setValue(null);
        break;
      case 'product':
        this.searchForm.get('product_id')?.setValue(0);
        this.searchForm.controls['product_NameAuto'].setValue(null);
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    
    this.currentUser = this.storageService.UserDetails;

    this.getCustomerDropdowns();
    this.initializeSearchFilterData();
    this.initializeDataSource();
    this.loadAllFilters();
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

    this.filteredOptionsPeriod_Name = this.searchForm.controls['period_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterPeriod(name as string) : this.period_Names.slice();
      }),
    );

    this.filteredOptionstherapticCategory_Name = this.searchForm.controls['therapticCategory_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterTherapticCategory(name as string) : this.theraptic_category_Names.slice();
      }),
    );

    this.filteredOptionsProduct_Name = this.searchForm.controls['product_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterProduct(name as string) : this.product_Names.slice();
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

  private _filterPeriod(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.period_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterTherapticCategory(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.theraptic_category_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterProduct(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.product_Names.filter(option => option.id.toString().toLowerCase().startsWith(filterValue));
  }

  onSelectedRegionChange(regiodId: number) {
    if (regiodId) {
      //this.searchForm.controls['country_Name'].setValue(event.option.value.name);
      this.getCountryFilters();
    }
  }

  onSelectedCountryChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['country_id'].setValue(event.option.value.id);
      this.getCompanyFilters();
    }
  }

  onSelectedCompanyChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['company_id'].setValue(event.option.value.id);
      this.getPeriodFilters();
      this.getSalesForceFilters();
      this.getTherapeuticCategoryFilters();
    }
  }

  onSelectedPeriodChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['period_id'].setValue(event.option.value.id);
      this.getTherapeuticCategoryFilters();
    }
  }

  onSelectedTherapeuticCategoryChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['theraptic_category_id'].setValue(event.option.value.id);
      this.getSalesForceFilters();
      this.getProductFilters();
    }
  }

  onSelectedSalesForceChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['salesforce_id'].setValue(event.option.value.id);
      this.getProductFilters();
    }
  }

  onSelectedProductChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['product_id'].setValue(event.option.value.id);
    }
  }

  ngAfterViewInit() {
   this.dataSource.sort = this.sort;
  }

  onSearch() {
    this.accordion().closeAll();
    this.initializeDataSource();
    this.paginator.firstPage();
  }

  filterDisplay() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }

  fetchData(): Observable<any> {
    this.isReset = false;
    let data = {
      user_id: this.user_id,
      caller: '',
      pageSize: this.pageSize,
      page: this.pageIndex + 1,
      regionId: this.searchForm.get('region_id')?.value
        ? this.searchForm.get('region_id')?.value
        : 0,
      countryId: this.searchForm.get('country_id')?.value
        ? this.searchForm.get('country_id')?.value
        : 0,
      companyId: this.searchForm.get('company_id')?.value
        ? this.searchForm.get('company_id')?.value
        : 0,
      periodId: this.searchForm.get('period_id')?.value
        ? this.searchForm.get('period_id')?.value
        : 0,
      salesforceName: this.searchForm.get('salesforce_id')?.value
        ? this.getFilterName('salesforce')
        : null,
      productName: this.searchForm.get('product_id')?.value
        ? this.getFilterName('product')
        : null,
      therapeuticCategory_Id: this.searchForm.get('theraptic_category_id')?.value
        ? this.searchForm.get('theraptic_category_id')?.value
        : 0,
      security_Token: '',
      sortField: this.sortField ? this.sortField.toLowerCase() : '',
      sortDirection: this.sortDirection,
    };
    return this.apiService.PostAll(getCompensationSalesForceRecords, data);
  }

  initializeSearchFilterData() {
    let data = { type: 0 };
    this.apiService
      .PostAll(GetRegionListHavingCountry, {})
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          if (response.result && response.result.length)
            this.region_Names = response.result.map((r: any) => ({ id: r.region_Id, name: r.region_Name }));

          if (this.countries_Names && this.countries_Names.length && this.searchForm.controls['country_id'].value) {
            let selected = this.countries_Names.filter(c => c.id == this.searchForm.controls['country_id'].value);
            if (selected && selected.length)
              this.searchForm.controls['country_NameAuto'].setValue(selected[0]);
          }

          if (this.companies_Names && this.companies_Names.length && this.searchForm.controls['company_id'].value) {
            let selected = this.companies_Names.filter(c => c.id == this.searchForm.controls['company_id'].value);
            if (selected && selected.length)
              this.searchForm.controls['company_NameAuto'].setValue(selected[0]);
          }

          if (this.salesforce_Names && this.salesforce_Names.length && this.searchForm.controls['salesforce_id'].value) {
            let selected = this.salesforce_Names.filter(c => c.id == this.searchForm.controls['salesforce_id'].value);
            if (selected && selected.length)
              this.searchForm.controls['salesForce_NameAuto'].setValue(selected[0]);
          }

        }
      });
  }

  loadAllFilters() {
    this.getCountryFilters();
    this.getCompanyFilters();
    this.getPeriodFilters();
    this.getTherapeuticCategoryFilters();
    this.getProductFilters();
    this.getSalesForceFilters();
  }

  getCountryFilters() {
    let data = {
      type: 1,
      regionId: Number(this.searchForm.controls['region_id'].value)
    };
    this.apiService
      .PostAll(getCompensationRecordsFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.countries_NamesBase = response.result;
          this.filterDropdownListByCustomerDropdowns('country');
          //this.filteredOptionsCountry_Name = of(this.countries_Names);
        }
      });
  }

  getCompanyFilters() {
    if (this.companies_NamesBase && this.companies_NamesBase.length) {
      let data = {
        user_id: this.user_id,
        companies: null,
        countries: this.searchForm.controls['country_id'].value.toString(),
        periods: null,
        brands: null,
        therapeuticcategories: null,
      };

      this.getSpecificCustomerData('company', data);
    }
    else {
      let data = {
        type: 2,
        regionId: Number(this.searchForm.controls['region_id'].value),
        countryId: Number(this.searchForm.controls['country_id'].value)
      };
      this.apiService
        .PostAll(getCompensationRecordsFilters, data)
        .subscribe((response: ApiResponse) => {
          if (response.status) {
            this.companies_NamesBase = response.result;
            this.filterDropdownListByCustomerDropdowns('company');
            //this.filteredOptionsCompany_Name = of(this.companies_Names);
          }
        });

    }


  }

  getPeriodFilters() {

    if (this.periodListBase && this.periodListBase.length) {

      let data = {
        user_id: this.user_id,
        companies: this.searchForm.controls['company_id'].value.toString(),
        countries: this.searchForm.controls['country_id'].value.toString(),
        periods: null,
        brands: null,
        therapeuticcategories: null,
      };

      this.getSpecificCustomerData('period', data);
      
    }
    else {
      let data = {
        type: 3,
        regionId: Number(this.searchForm.controls['region_id'].value),
        countryId: Number(this.searchForm.controls['country_id'].value),
        companyId: Number(this.searchForm.controls['company_id'].value)
      };
      this.apiService.GetAll(getAdminPeriods, true).subscribe((response: ApiResponse) => {
        if (response.status) {
          this.periodListBase = response.result;
          this.filterDropdownListByCustomerDropdowns('period');
        } else {
          this.toasterService.showError(response.message);
        }

      });
    }



  }


  getTherapeuticCategoryFilters() {

    if (this.theraptic_category_NamesBase && this.theraptic_category_NamesBase.length) {
      let data = {
        user_id: this.user_id,
        companies: this.searchForm.controls['company_id'].value.toString(),
        countries: this.searchForm.controls['country_id'].value.toString(),
        periods: this.searchForm.controls['period_id'].value.toString(),
        brands: null,
        therapeuticcategories: null,
      };

      this.getSpecificCustomerData('therapeuticCategory', data);
    }
    else {
      
        this.apiService.GetAll(getAdminTherapeuticCategories)
          .subscribe((response: ApiResponse) => {
            if (response.status) {
              this.theraptic_category_NamesBase = response.result;
              this.filterDropdownListByCustomerDropdowns('therapeuticCategory');
            }
          });
      
    }

  }

  getSalesForceFilters() {
    if (this.salesforce_NamesBase && this.salesforce_NamesBase.length) {
      let data = {
        user_id: this.user_id,
        companies: this.searchForm.controls['company_id'].value.toString(),
        countries: this.searchForm.controls['country_id'].value.toString(),
        periods: this.searchForm.controls['period_id'].value.toString(),
        brands: null,
        therapeuticcategories: this.searchForm.controls['theraptic_category_id'].value.toString(),
      };
      this.getSpecificCustomerData('salesforce', data);
    }
    else {
      let data = {
        type: 5,
        regionId: Number(this.searchForm.controls['region_id'].value),
        countryId: Number(this.searchForm.controls['country_id'].value),
        companyId: Number(this.searchForm.controls['company_id'].value),
        periodId: Number(this.searchForm.controls['period_id'].value),
        therapeuticCategory_Id: Number(this.searchForm.controls['theraptic_category_id'].value),
      };

      this.apiService.PostAll(GetSalesforceList, { companyId: data.companyId, countryId: data.countryId, salesforceTypeId: 0 }).subscribe(response => {
        if (response.status) {
          this.salesforce_NamesBase = response.result;
          this.filterDropdownListByCustomerDropdowns('salesforce');
        }
      });
    }

  }

  getProductFilters() {

    if (this.product_NamesBase && this.product_NamesBase.length) {
      let data = {
        user_id: this.user_id,
        companies: this.searchForm.controls['company_id'].value.toString(),
        countries: this.searchForm.controls['country_id'].value.toString(),
        periods: this.searchForm.controls['period_id'].value.toString(),
        brands: null,
        therapeuticcategories: this.searchForm.controls['theraptic_category_id'].value.toString(),
      };
      this.getSpecificCustomerData('brand', data);
    }
    else {
      let data = {
        type: 6,
        regionId: Number(this.searchForm.controls['region_id'].value),
        countryId: Number(this.searchForm.controls['country_id'].value),
        companyId: Number(this.searchForm.controls['company_id'].value),
        periodId: Number(this.searchForm.controls['period_id'].value),
        therapeuticCategory_Id: Number(this.searchForm.controls['theraptic_category_id'].value),
        salesforce_Id: Number(this.searchForm.controls['salesforce_id'].value),
      };

      this.apiService.PostAll(GetBrandGroupFilters, {
        type: 2,
        user_id: this.user_id,
        companyId: data.companyId,
        therapeuticCategory_Id: data.therapeuticCategory_Id
      }).subscribe(response => {
        if (response.status) {
          this.product_NamesBase = response.result;
          this.filterDropdownListByCustomerDropdowns('brand');
        }
      });
    }

  }


  initializeDataSource() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          if (!this.isReset) {
            this.pageIndex = this.paginator.pageIndex;
            this.pageSize = this.paginator.pageSize;
            this.sortField = this.sort.active;
            this.sortDirection = this.sort.direction;
          }
          return this.fetchData();
        }),
        map((data) => {
          this.dataItems = data.result.records;
          this.totalRecords = data.result.totalRecords;
          this.dataSource = new MatTableDataSource<SalesforceData>(
           this.dataItems
          );
          this.paginator.length = this.totalRecords;
        }),
        catchError(() => {
          // Handle error, e.g., show error message
          return of(null);
        })
      )
      .subscribe();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.sortDirection = sortState.direction;
      this.sortField = sortState.active;
      this.initializeDataSource();
    } else {
      this.sortDirection = '';
      this.sortField = '';
      this.initializeDataSource();
    }
  }



  filterDropdownListByCustomerDropdowns(type: string) {
    if (this.allCustomerData) {
      if (type == 'therapeuticCategory' && this.theraptic_category_NamesBase && this.theraptic_category_NamesBase.length && this.allCustomerData.therapeutic_categories && this.allCustomerData.therapeutic_categories.length) {
        this.theraptic_category_Names = this.theraptic_category_NamesBase.filter(tc => this.allCustomerData.therapeutic_categories.findIndex(a => a.therapeutic_category == tc.therapeuticCategory_Name) > -1).map(tc => ({ id: tc.therapeuticCategory_Id, name: tc.therapeuticCategory_Name }));
        this.filteredOptionstherapticCategory_Name = of(this.theraptic_category_Names);
      }
      if (type == 'country' && this.countries_NamesBase && this.countries_NamesBase.length && this.allCustomerData.countries && this.allCustomerData.countries.length) {
        this.countries_Names = this.countries_NamesBase.filter(c => this.allCustomerData.countries.findIndex(a => a.country_name == c.name) > -1);
        this.filteredOptionsCountry_Name = of(this.countries_Names);
      }
      if (type == 'company' && this.companies_NamesBase && this.companies_NamesBase.length && this.allCustomerData.companies && this.allCustomerData.companies.length) {
        this.companies_Names = this.companies_NamesBase.filter(c => this.allCustomerData.companies.findIndex(a => a.company_name == c.name) > -1);
        this.filteredOptionsCompany_Name = of(this.companies_Names);
      }
      if (type == 'period' && this.periodListBase && this.periodListBase.length && this.allCustomerData.periods && this.allCustomerData.periods.length) {
        this.period_Names = this.periodListBase.filter(p => this.allCustomerData.periods.findIndex(a => a.period_year == p.period_Year && a.period_quarter == p.period_Quarter) > -1).map(per => ({ id: per.period_Id, name: per.displayed_Title }));
        this.filteredOptionsPeriod_Name = of(this.period_Names);
      }
      if (type == 'brand') {
        if (this.product_NamesBase && this.product_NamesBase.length && this.allCustomerData.brands && this.allCustomerData.brands.length)
          this.product_Names = this.product_NamesBase.filter(p => this.allCustomerData.brands.findIndex(a => a.us_product_name_product_promoted == p.name) > -1);
        this.filteredOptionsProduct_Name = of(this.product_Names);
      }
      if (type == 'salesforce') {
        if (this.salesforce_NamesBase && this.salesforce_NamesBase.length && this.allCustomerData.salesforces && this.allCustomerData.salesforces.length)
          this.salesforce_Names = this.salesforce_NamesBase.filter(p => this.allCustomerData.salesforces.findIndex(a => a.salesforce_name == p.salesforceName_Name) > -1).map(sf => ({ id: sf.salesforce_Id, name: sf.salesforceName_Name }));
        this.filteredOptionsSalesForce_Name = of(this.salesforce_Names);
      }
    }

    this.bindFilterEvents();
  }

  getCustomerDropdowns() {
    this.getSpecificCustomerData('country');
    this.getSpecificCustomerData('company');
    this.getSpecificCustomerData('period');
    this.getSpecificCustomerData('therapeuticCategory');
    this.getSpecificCustomerData('brand');
    this.getSpecificCustomerData('salesforce');
  }

  getSpecificCustomerData(type: string, params: any = null) {

    let columns: string = 'Period_Year,Period_Quarter,Country_Name,Company_Name,SalesForce_Name,US_Product_Name_Product_Promoted,Generic_Name,Therapeutic_Category';
    if (type == 'country')
      columns = 'Country_Name'
    else if (type == 'company')
      columns = 'Company_Name';
    else if (type == 'period')
      columns = 'Period_Year,Period_Quarter';
    else if (type == 'therapeuticCategory')
      columns = 'Therapeutic_Category';
    else if (type == 'brand')
      columns = 'US_Product_Name_Product_Promoted';
    else if (type == 'genericname')
      columns = 'Generic_Name';
    else if (type == 'salesforce')
      columns = 'SalesForce_Name';

    let data: any = {
      user_id: this.user_id,
      companies: null,
      countries: null,
      periods: null,
      therapeuticcategories: null,
      columns: columns
    };

    if (params) {
      data = params;
      data.columns = columns;
    }

    this.apiService.PostAll(GetCustomerDropdowns, data).subscribe(response => {
      if (response?.status) {
        if (type == 'country') {
          this.allCustomerData.countries = response.result;
          this.filterDropdownListByCustomerDropdowns('country');
        }
        else if (type == 'company') {
          this.allCustomerData.companies = response.result;
          this.filterDropdownListByCustomerDropdowns('company');
        }
        else if (type == 'period') {
          this.allCustomerData.periods = response.result;
          this.filterDropdownListByCustomerDropdowns('period');
        }
        else if (type == 'therapeuticCategory') {
          this.allCustomerData.therapeutic_categories = response.result;
          this.filterDropdownListByCustomerDropdowns('therapeuticCategory');
        }
        else if (type == 'brand') {
          this.allCustomerData.brands = response.result;
          this.filterDropdownListByCustomerDropdowns('brand');
        }
        else if (type == 'genericname') {
          this.allCustomerData.genericnames = response.result;
          this.filterDropdownListByCustomerDropdowns('genericname');
        }
        else if (type == 'salesforce') {
          this.allCustomerData.salesforces = response.result;
          this.filterDropdownListByCustomerDropdowns('salesforce');
        }

      }
    });
  }

  checkAccess(functionId: string) {
    if (this.adminFunctionList.includes(functionId)) {
      return true
    }
    else {
      return false
    }
  }

}
