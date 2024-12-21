import { Component, ViewChild, viewChild } from '@angular/core';
import { news } from '../../../models/news';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '../../../services/common/storage.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { ApiResponse } from '../../../models/ApiResponse';
import { GetCustomerDropdowns, GetNewsList, GetallNews, getAllCompanyCountry, getCompany, getCountryList } from '../../../constants/api.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { IdNamePair } from '../../../models/salesforcedata';
import { Country } from '../../../models/country';
import { Company } from '../../../models/company';
import moment from 'moment';
import { CustomerDropdownGroupModel } from '../../../models/CustomerDropdown';


@Component({
  selector: 'app-news-history',
  templateUrl: './news-history.component.html',
  styleUrl: './news-history.component.css'
})
export class NewsHistoryComponent {
  currentUser: any;
  newsmanagement: news[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<news>(this.newsmanagement);
  displayedColumns: string[] = ['company_Name', 'country_Name', 'long_Message', 'news_Url', 'news_Date'];
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  showFilter = false;
  searchForm: FormGroup;
  accordion = viewChild.required(MatAccordion);
  isReset = false;
  
  globalCountrySelectItem: IdNamePair = { id: 0, name: "Global" };
  companyCountries: any[] = [];
  all_countries: Country[] = [];
  companies: Company[] = [];
  all_countriesBase: Country[] = [];
  companiesBase: Company[] = [];
  filteredCompanies: Company[] = [];
  selectedCountryId: number = 0;

  constructor(private storageService: StorageService, private dialog: MatDialog, private apiService: ApiService, public fb: FormBuilder,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) {
    this.currentUser = this.storageService.UserDetails;

    this.searchForm = this.fb.group({
      country_id: [0],
      company_id: [0],
      news_date_start: [null],
      news_date_end: [null]
    });

    this.loadCompanies();
    this.loadCompanyCountry();
    this.loadCountries();
  }

  updateAdded_from(event: any) {
    if (event.value) {
      const added_from = moment(event.value).format("YYYY-MM-DD");
      this.searchForm.controls['news_date_start'].setValue(added_from);
    }
  }

  updateAdded_to(event: any) {
    if (event.value) {
      const added_to = moment(event.value).format("YYYY-MM-DD");
      this.searchForm.controls['news_date_end'].setValue(added_to);
    }
  }

  filterCompaniesByCountry() {

    this.selectedCountryId = this.searchForm.controls['country_id'].value;
    if (this.selectedCountryId) {
      const companyIds = this.companyCountries
        .filter(cc => cc.country_Id === this.selectedCountryId)
        .map(cc => cc.company_Id);

      this.filteredCompanies = this.companies.filter(c => companyIds.includes(c.company_Id));
    } else {
      this.filteredCompanies = this.companies;
    }

  }

  onSearch() {
    this.accordion().closeAll();
    let data = {
      user_id: this.currentUser.id,
      caller: '',
      country_id: this.searchForm.get('country_id')?.value
        ? this.searchForm.get('country_id')?.value
        : null,
      company_id: this.searchForm.get('company_id')?.value
        ? this.searchForm.get('company_id')?.value
        : null,
      news_date_start: this.searchForm.get('news_date_start')?.value
        ? this.searchForm.get('news_date_start')?.value
        : null,
      news_date_end: this.searchForm.get('news_date_end')?.value
        ? this.searchForm.get('news_date_end')?.value
        : null,
      security_Token: '',
    };

    this.apiService.PostAll(GetNewsList, data).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.newsmanagement = response.result;
        this.dataSource = new MatTableDataSource<news>(this.newsmanagement);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toasterService.showError(response.message);
      }
    });

    
  }

  resetAllFilters() {
    this.isReset = true;

    this.accordion().closeAll();
    this.searchForm.reset({
      country_id: 0,
      company_id: 0,
      news_date_start: null,
      news_date_end: null
    });
   

    this.onSearch();
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.getCustomerDropdowns();
    this.onSearch();
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
        this.all_countriesBase = response.result;
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
        this.filteredCompanies = this.companies;
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

  filterDropdownListByCustomerDropdowns(type: string) {
    if (this.allCustomerData) {

      if (type == 'country' && this.all_countriesBase && this.all_countriesBase.length && this.allCustomerData.countries && this.allCustomerData.countries.length) {
        this.all_countries = this.all_countriesBase.filter(c => this.allCustomerData.countries.findIndex(a => a.country_name == c.country_Name) > -1);
      }
      if (type == 'company' && this.companiesBase && this.companiesBase.length && this.allCustomerData.companies && this.allCustomerData.companies.length) {
        this.companies = this.companiesBase.filter(c => this.allCustomerData.companies.findIndex(a => a.company_name == c.company_Name) > -1);
      }

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
      data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
      this.searchForm.controls['company_id'].setValue(null);
      if (data.countries)
        this.getSpecificCustomerData('company', data);
    }


  }

  getCustomerDropdowns() {
    this.getSpecificCustomerData('country');
    this.getSpecificCustomerData('company');
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

      }
    });
  }



}
