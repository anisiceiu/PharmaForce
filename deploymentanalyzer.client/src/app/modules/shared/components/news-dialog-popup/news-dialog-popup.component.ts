import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { news } from '../../../../models/news';
import { IdNamePair } from '../../../../models/salesforcedata';
import { GetCustomerDropdowns, GetDMSalesforceRecordsFilters, getAllCompanyCountry, getCompany, getCountry, getCountryList } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { ApiService } from '../../../../services/Api/api.service';
import { ToasterService } from '../../../../services/common/toaster.service';
import { Country } from '../../../../models/country';
import { Company } from '../../../../models/company';
import { StorageService } from '../../../../services/common/storage.service';
import { CustomerDropdownGroupModel } from '../../../../models/CustomerDropdown';

@Component({
  selector: 'app-news-dialog-popup',
  templateUrl: './news-dialog-popup.component.html',
  styleUrls: ['./news-dialog-popup.component.scss']
})
export class NewsDialogPopupComponent implements OnInit {

  isOpenManageNewsSidebar = false;

  globalCountrySelectItem: IdNamePair = { id: 0, name: "Global" };
  all_countries: Country[] = [];
  all_countriesBase: Country[] = [];
  companies: Company[] = [];
  companiesBase: Company[] = [];
  filteredCompanies: Company[] = [];
  companyCountries: any[] = [];
  currentUser: any;
  selectedCountryId: number = 0;
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  newsForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<NewsDialogPopupComponent>,public fb:FormBuilder,
    private apiService: ApiService, private toasterService: ToasterService, private _storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { news: news }
  ) 
  {
    if(data.news && data.news.news_Id> 0)
      {
      this.newsForm = this.fb.group({
        news_id: [data.news.news_Id],
        short_message : [data.news.short_Message, [Validators.required]],
        long_message: [data.news.long_Message,[Validators.required]],
        news_url: [data.news.news_Url,[Validators.required]],
        news_date: [data.news.news_Date],
        country_id: [data.news.country_Id],
        company_id: [data.news.company_Id],
      });
    }else{
        this.newsForm = this.fb.group({
            news_id: [data.news.news_Id],
            short_message : [data.news.short_Message, [Validators.required]],
            long_message: [data.news.long_Message,[Validators.required]],
            news_url: [data.news.news_Url,[Validators.required]],
            news_date: [data.news.news_Date],
            country_id: [data.news.country_Id],
            company_id: [data.news.company_Id],
          });
    }
    this.isOpenManageNewsSidebar = true;

    this.currentUser = this._storageService.UserDetails;

    
    
  }

  filterCompaniesByCountry() {

    this.selectedCountryId = this.newsForm.controls['country_id'].value;
    if (this.selectedCountryId) {
      const companyIds = this.companyCountries
        .filter(cc => cc.country_Id === this.selectedCountryId)
        .map(cc => cc.company_Id);

      this.filteredCompanies = this.companies.filter(c => companyIds.includes(c.company_Id));
    } else {
      this.filteredCompanies = this.companies;
    }
    
  }

  loadCountries() {
    let data = {
      user_id: this.currentUser.id
    }
    this.apiService.PostAll(getCountry, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.all_countriesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('country');
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadCompanies() {
    let data = {
      user_id: this.currentUser.id
    }
    this.apiService.PostAll(getCompany, data).subscribe((response: ApiResponse) => {

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

  

  ngOnInit(): void {
    this.loadCountries();
    this.loadCompanyCountry();
    this.loadCompanies();
    this.getCustomerDropdowns();
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
      data.countries = this.newsForm.controls['country_id'].value ? this.newsForm.controls['country_id'].value.toString() : null;
      this.newsForm.controls['company_id'].setValue(null);
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

 

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get NewsFormControls() { return this.newsForm.controls; }
}
