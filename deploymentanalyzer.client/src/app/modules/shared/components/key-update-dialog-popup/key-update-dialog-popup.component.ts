import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToasterService } from '../../../../services/common/toaster.service';
import { ApiService } from '../../../../services/Api/api.service';
import { keyUpdate, keyUpdateTag } from '../../../../models/keyUpdate';
import { GetCustomerDropdowns, GetKeyUpdateTags, getAdminPeriods, getAdminTherapeuticCategories, getAllCompanyCountry, getCompany, getCountry } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { TherapeuticCategory } from '../../../../models/therapeuticCategory';
import { Period } from '../../../../models/period';
import { StorageService } from '../../../../services/common/storage.service';
import { CustomerDropdownGroupModel } from '../../../../models/CustomerDropdown';

@Component({
  selector: 'app-key-update-dialog-popup',
  templateUrl: './key-update-dialog-popup.component.html',
})
export class KeyUpdateDialogPopupComponent {

  isOpenManageKeyUpdateSidebar = false;

  therapeuticCategories: TherapeuticCategory[] = [];
  companies: any[] = [];
  countries: any[] = [];
  periodList: Period[] = [];
  companiesBase: any[] = [];
  countriesBase: any[] = [];
  periodListBase: Period[] = [];
  updateTagList: keyUpdateTag[] = [];
  companyCountries: any[] = [];
  countryDisabled = true;
  currentUser: any;
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  demo = {
    user_id: 1,
    security_Token: "",
  }

  selectedCountryId: number = 0;
  selectedCompanyId: number = 0;
  filteredCompanies: any = [];

  keyUpdateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<KeyUpdateDialogPopupComponent>, public fb: FormBuilder,
    private apiService: ApiService, private toasterService: ToasterService, private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { keyUpdate: keyUpdate }
  ) {

    if (data.keyUpdate && data.keyUpdate.keyUpdate_Id > 0) {

      this.keyUpdateForm = this.fb.group({
        id: [data.keyUpdate.keyUpdate_Id],
        companyCountry_Id: [data.keyUpdate.companyCountry_Id],
        therapeuticCategory_Id: [null],
        note: [data.keyUpdate.note, [Validators.required]],
        description: [" "],
        company_Id: [data.keyUpdate.company_Id, [Validators.required]],
        country_Id: [data.keyUpdate.country_Id, [Validators.required]],
        period_Id: [data.keyUpdate.period_Id, [Validators.required]],
        updateTag: [data.keyUpdate.updateTag, [Validators.required]],
      });

    } else {
      this.keyUpdateForm = this.fb.group({
        id: null,
        companyCountry_Id: [data.keyUpdate.companyCountry_Id],
        therapeuticCategory_Id: [null],
        note: [data.keyUpdate.note, [Validators.required]],
        description: [""],
        company_Id: [null, [Validators.required]],
        country_Id: [null, [Validators.required]],
        period_Id: [data.keyUpdate.period_Id, [Validators.required]],
        updateTag: [data.keyUpdate.updateTag, [Validators.required]],
      });
    }

    this.keyUpdateForm.get('company_Id')!.valueChanges.subscribe(() => {
      this.updateCompanyCountryId();
    });

    this.keyUpdateForm.get('country_Id')!.valueChanges.subscribe(() => {
      this.updateCompanyCountryId();
    });

    this.isOpenManageKeyUpdateSidebar = true;

  }


  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    //this.loadTherapeuticCategories();
    this.loadCompanies();
    this.loadCountires();
    this.loadCompanyCountry();
    this.loadPeriod();
    this.getCustomerDropdowns();
    this.loadUpdateTags();
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

  loadCompanies() {
    this.apiService.PostAll(getCompany, this.demo).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.companiesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('company');
        this.filteredCompanies = response.result;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  loadCountires() {
    this.apiService.PostAll(getCountry, this.demo).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.countriesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('country');
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

  //filterCompaniesByCountry() {
  //  this.selectedCountryId = this.keyUpdateForm.controls['country_Id'].value;
  //  if (this.selectedCountryId) {
  //    const companyIds = this.companyCountries
  //      .filter(cc => cc.country_Id === this.selectedCountryId)
  //      .map(cc => cc.company_Id);

  //    this.filteredCompanies = this.companies.filter(c => companyIds.includes(c.company_Id));
  //  } else {
  //    this.filteredCompanies = this.companies;
  //  }
  //  this.countryDisabled = false;
  //}


  updateCompanyCountryId() {

    this.selectedCompanyId = this.keyUpdateForm.get('company_Id')!.value;
    this.selectedCountryId = this.keyUpdateForm.get('country_Id')!.value;

    const matchingEntry = this.companyCountries.find(cc =>
      cc.company_Id === this.selectedCompanyId && cc.country_Id === this.selectedCountryId
    )
    if (matchingEntry) {

      this.keyUpdateForm.patchValue({ companyCountry_Id: matchingEntry.companyCountry_Id });
    } else {
      this.keyUpdateForm.patchValue({ companyCountry_Id: null });
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
      data.countries = this.keyUpdateForm.controls['country_Id'].value ? this.keyUpdateForm.controls['country_Id'].value.toString() : null;
      this.keyUpdateForm.controls['company_Id'].setValue(null);
      if (data.countries)
        this.getSpecificCustomerData('company', data);
    }
    else if (filterType == 'company') {
      data.countries = this.keyUpdateForm.controls['country_Id'].value ? this.keyUpdateForm.controls['country_Id'].value.toString() : null;
      data.companies = this.keyUpdateForm.controls['company_Id'].value ? this.keyUpdateForm.controls['company_Id'].value.toString() : null;
      this.keyUpdateForm.controls['period_Id'].setValue(null);
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



  onCloseClick(): void {
    this.dialogRef.close();
  }

  get KeyUpdateFormControls() { return this.keyUpdateForm.controls; }
}
