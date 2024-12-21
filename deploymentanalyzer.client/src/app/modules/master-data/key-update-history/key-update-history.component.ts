import { Component, ViewChild, viewChild } from '@angular/core';
import { keyUpdate, keyUpdateTag } from '../../../models/keyUpdate';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '../../../services/common/storage.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { GetCustomerDropdowns, GetKeyUpdateList, GetKeyUpdateTags, getAdminPeriods, getAdminTherapeuticCategories, getAllCompanyCountry, getCompany, getCountryList, getKeyUpdates } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { IdNamePair } from '../../../models/salesforcedata';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Country } from '../../../models/country';
import { Company } from '../../../models/company';
import { TherapeuticCategory } from '../../../models/therapeuticCategory';
import { Period } from '../../../models/period';
import { CustomerDropdownGroupModel } from '../../../models/CustomerDropdown';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-key-update-history',
  templateUrl: './key-update-history.component.html',
  styleUrl: './key-update-history.component.css'
})
export class KeyUpdateHistoryComponent {
  currentUser: any;
  dataItems: keyUpdate[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<keyUpdate>(this.dataItems);

  displayedColumns: string[] = ['company_Name', 'country_Name', 'period_Name', 'updateTag', 'note'];
  showFilter = false;
  searchForm: FormGroup;
  accordion = viewChild.required(MatAccordion);
  isReset = false;
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  globalCountrySelectItem: IdNamePair = { id: 0, name: "Global" };
  therapeuticCategories: TherapeuticCategory[] = [];
  companies: any[] = [];
  countries: any[] = [];
  periodList: Period[] = [];
  companiesBase: any[] = [];
  countriesBase: any[] = [];
  periodListBase: Period[] = [];
  updateTagList: keyUpdateTag[] = [];
  companyCountries: any[] = [];
  selectedCountryId: number = 0;
  selectedCompanyId: number = 0;
  filteredCompanies = this.companies;

  //new grid
  private gridApi!: GridApi<keyUpdate>;
  //end new grid
  constructor(private storageService: StorageService, private dialog: MatDialog, private apiService: ApiService, public fb: FormBuilder,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) {
    this.currentUser = this.storageService.UserDetails;

    this.searchForm = this.fb.group({
      companyCountry_Id: [0],
      therapeuticCategory_Id: [0],
      company_Id: [0],
      country_Id: [0],
      period_Id: [0],
      updateTag: [''],
    });

    this.loadCompanies();
    this.loadCompanyCountry();
    this.loadCountries();
    this.loadTherapeuticCategories();
    this.loadPeriod();
    this.loadUpdateTags();

    this.searchForm.get('company_Id')!.valueChanges.subscribe(() => {
      this.updateCompanyCountryId();
    });

    this.searchForm.get('country_Id')!.valueChanges.subscribe(() => {
      this.updateCompanyCountryId();
    });
  }

  colDefs: ColDef[] = [
    {
      headerName: 'Company Name', field: 'company_Name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false,
    },
    {
      headerName: 'Country Name', field: 'country_Name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false,
    },
    {
      headerName: 'Period Name', field: 'period_Name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false,
    },
    {
      headerName: 'Update Tag', field: 'updateTag', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false,
    },
    {
      headerName: 'Note', field: 'note', filter: "agTextColumnFilter", minWidth:100, flex: 2, filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false,
    },
  ];

  setGridRowData() {
    this.gridApi.setGridOption("rowData", this.dataItems);
  }

  onGridReady(params: GridReadyEvent<keyUpdate>) {
    this.gridApi = params.api;
  }

  updateCompanyCountryId() {

    this.selectedCompanyId = this.searchForm.get('company_Id')!.value;
    this.selectedCountryId = this.searchForm.get('country_Id')!.value;

    const matchingEntry = this.companyCountries.find(cc =>
      cc.company_Id === this.selectedCompanyId && cc.country_Id === this.selectedCountryId
    )
    if (matchingEntry) {

      this.searchForm.patchValue({ companyCountry_Id: matchingEntry.companyCountry_Id });
    } else {
      this.searchForm.patchValue({ companyCountry_Id: null });
    }
  }

  loadUpdateTags() {
    this.apiService.GetAll(GetKeyUpdateTags + "?user_id=" + this.currentUser.id).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.updateTagList = response.result;
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadPeriod() {
    this.apiService.GetAll(getAdminPeriods, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.periodListBase = response.result;
        this.filterDropdownListByCustomerDropdowns('period');
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadTherapeuticCategories() {
    this.apiService.GetAll(getAdminTherapeuticCategories)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.therapeuticCategories = response.result;
        }
      });
  }


  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.getCustomerDropdowns();
    this.onSearch();
  }

  resetAllFilters() {
    this.isReset = true;
    if (this.gridApi) {
      //clear filters
      this.gridApi.setFilterModel(null);
      //notify grid to implement the changes
      this.gridApi.onFilterChanged();
    }
    this.accordion().closeAll();
    this.searchForm.reset({
      companyCountry_Id: 0,
      therapeuticCategory_Id: 0,
      company_Id: 0,
      country_Id: 0,
      period_Id: 0,
      updateTag: '',
    });


    this.onSearch();
  }


  onSearch() {
    this.accordion().closeAll();
    let data = {
      user_id: this.currentUser.id,
      caller: '',
      country_id: this.searchForm.get('country_Id')?.value
        ? this.searchForm.get('country_Id')?.value
        : null,
      company_id: this.searchForm.get('company_Id')?.value
        ? this.searchForm.get('company_Id')?.value
        : null,
      therapeuticcategory_id: this.searchForm.get('therapeuticCategory_Id')?.value
        ? this.searchForm.get('therapeuticCategory_Id')?.value
        : null,
      period_id: this.searchForm.get('period_Id')?.value
        ? this.searchForm.get('period_Id')?.value
        : null,
      updatetag: this.searchForm.get('updateTag')?.value
        ? this.searchForm.get('updateTag')?.value
        : null,
      security_Token: '',
    };

    this.apiService.PostAll(GetKeyUpdateList, data).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.dataItems = response.result;
        this.dataSource = new MatTableDataSource<keyUpdate>(this.dataItems);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.setGridRowData();

      } else {
        this.toasterService.showError(response.message);
      }
    });


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
      default:
        break;
    }
  }

  filterDisplay() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }


  loadCountries() {
    let data = {
      user_id: this.currentUser.id
    }
    this.apiService.PostAll(getCountryList, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.countriesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('country');
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }


  loadCompanies() {

    this.apiService.PostAll(getCompany, {
      user_id: this.currentUser.id,
      security_Token: "",
    }).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.companiesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('company');
        this.filteredCompanies = response.result;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  loadCompanyCountry() {
    this.apiService.GetAll(getAllCompanyCountry + "?user_id=" + this.currentUser.id).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.companyCountries = response.result;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }


  filterCompaniesByCountry() {
    this.selectedCountryId = this.searchForm.controls['country_Id'].value;
    if (this.selectedCountryId) {
      const companyIds = this.companyCountries
        .filter(cc => cc.country_Id === this.selectedCountryId)
        .map(cc => cc.company_Id);

      this.filteredCompanies = this.companies.filter(c => companyIds.includes(c.company_Id));
    } else {
      this.filteredCompanies = this.companies;
    }
    
  }

  onfilterChange(filterType: string) {
    let data = {
      user_id: this.currentUser.id,
      companies: null,
      countries: null,
      periods: null,
      brands: null,
      therapeuticcategories: null,
    };

    if (filterType == 'country') {
      data.countries = this.searchForm.controls['country_Id'].value ? this.searchForm.controls['country_Id'].value.toString() : null;
      this.searchForm.controls['company_Id'].setValue(null);
      if (data.countries)
        this.getSpecificCustomerData('company', data);
    }
    else if (filterType == 'company') {
      data.countries = this.searchForm.controls['country_Id'].value ? this.searchForm.controls['country_Id'].value.toString() : null;
      data.companies = this.searchForm.controls['company_Id'].value ? this.searchForm.controls['company_Id'].value.toString() : null;
      this.searchForm.controls['period_Id'].setValue(null);
      if (data.companies)
        this.getSpecificCustomerData('period', data);
    }

  }


  filterDropdownListByCustomerDropdowns(type: string) {
    if (this.allCustomerData) {

      if (type == 'country' && this.countriesBase && this.countriesBase.length && this.allCustomerData.countries && this.allCustomerData.countries.length) {
        this.countries = this.countriesBase.filter(c => this.allCustomerData.countries.findIndex(a => a.country_name == c.country_Name) > -1);
      }
      if (type == 'company' && this.companiesBase && this.companiesBase.length && this.allCustomerData.companies && this.allCustomerData.companies.length) {
        this.companies = this.companiesBase.filter(c => this.allCustomerData.companies.findIndex(a => a.company_name == c.company_Name) > -1);
      }
      if (type == 'period' && this.periodListBase && this.periodListBase.length && this.allCustomerData.periods && this.allCustomerData.periods.length) {
        this.periodList = this.periodListBase.filter(p => this.allCustomerData.periods.findIndex(a => a.period_year == p.period_Year && a.period_quarter == p.period_Quarter) > -1);
      }
    }
  }

  getCustomerDropdowns() {
    this.getSpecificCustomerData('country');
    this.getSpecificCustomerData('company');
    this.getSpecificCustomerData('period');
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
      user_id: this.currentUser.id,
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

      }
    });
  }



  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
