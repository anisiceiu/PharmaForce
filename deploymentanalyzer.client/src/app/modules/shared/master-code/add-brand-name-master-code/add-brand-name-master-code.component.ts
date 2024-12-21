import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetMasterCodeFilters, GetMasterCodeUSNameFilters } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { IdNamePair } from '../../../../models/salesforcedata';
import { Observable, map, of, startWith } from 'rxjs';
import { MasterCode } from '../../../../models/mastercode';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../services/Api/api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { USNameOptions } from '../../../../models/ProductOption';
import { StorageService } from '../../../../services/common/storage.service';

@Component({
  selector: 'app-add-brand-name-master-code',
  templateUrl: './add-brand-name-master-code.component.html',
  styleUrl: './add-brand-name-master-code.component.css'
})
export class AddBrandNameMasterCodeComponent {
  currentUser: any;
  isOpenManageCountryProductSidebar = false;
  masterCodeForm: FormGroup;
  country_Names: IdNamePair[] = [];
  company_Names: IdNamePair[] = [];
  generic_Names: IdNamePair[] = [];
  us_name_options: USNameOptions[] = [];
  us_Names: IdNamePair[] = [];
  filteredCountryOptions: Observable<IdNamePair[]> | undefined;
  filteredCompanyOptions: Observable<IdNamePair[]> | undefined;
  filteredGenericNameOptions: Observable<IdNamePair[]> | undefined;
  filteredUsNameOptions: Observable<IdNamePair[]> | undefined;
  constructor(
    public dialogRef: MatDialogRef<AddBrandNameMasterCodeComponent>, public fb: FormBuilder, private apiService: ApiService, private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { mastercode: MasterCode }
  ) {
    if (data.mastercode && data.mastercode.id > 0) {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        country: [data.mastercode.country, [Validators.required]],
        company: [data.mastercode.company, [Validators.required]],
        generic_name: [data.mastercode.generic_name, [Validators.required]],
        us_name: [data.mastercode.us_name]
      });
    } else {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        country: [data.mastercode.country, [Validators.required]],
        company: [data.mastercode.company, [Validators.required]],
        generic_name: [data.mastercode.generic_name, [Validators.required]],
        us_name: [data.mastercode.us_name]
      });
    }
    this.isOpenManageCountryProductSidebar = true;

    
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.getCountryFilters();
    this.getGenericNameFilters();
    this.getUsNameFilters();
    this.getUsNameWithGenericNameList();
  }

  onUSNameChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      let selectUsName = this.us_name_options.find(u => u.name == event.option.value);
      if (selectUsName && selectUsName.generic_Name) {
        this.masterCodeForm.controls['generic_name'].setValue(selectUsName.generic_Name);
      }
    }
  }

  bindFilterEvents() {
    this.filteredCountryOptions = this.masterCodeForm.get('country')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountry(value || '')),
    );

    this.filteredCompanyOptions = this.masterCodeForm.get('company')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCompany(value || '')),
    );

    this.filteredGenericNameOptions = this.masterCodeForm.get('generic_name')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGenericName(value || '')),
    );

    this.filteredUsNameOptions = this.masterCodeForm.get('us_name')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUSName(value || '')),
    );
  }

  private _filterGenericName(value: string): IdNamePair[] {
    const filterValue = value;
    return this.generic_Names.filter(option => option.name.toLowerCase().startsWith(filterValue.toLowerCase()));
  }

  private _filterUSName(value: string): IdNamePair[] {
    const filterValue = value;
    return this.us_Names.filter(option => option.name.toLowerCase().startsWith(filterValue.toLowerCase()));
  }


  private _filterCountry(value: string): IdNamePair[] {
    const filterValue = value;
    return this.country_Names.filter(option => option.name.toLowerCase().startsWith(filterValue.toLowerCase()));
  }

  private _filterCompany(value: string): IdNamePair[] {
    const filterValue = value;
    return this.company_Names.filter(option => option.name.toLowerCase().startsWith(filterValue.toLowerCase()));
  }

  onCountry_NameChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.getCompanyFilters();
    }
  }

  getCountryFilters() {
    let data = { type: 1 };
    this.apiService
      .PostAll(GetMasterCodeFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.country_Names = response.result;
          this.filteredCountryOptions = of(response.result);
          this.bindFilterEvents();
        }
      });
  }

  getCompanyFilters() {
    let data = {
      type: 2,
      country: this.masterCodeForm.get('country')?.value
    };
    this.apiService
      .PostAll(GetMasterCodeFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.company_Names = response.result;
          this.filteredCompanyOptions = of(response.result);
          this.bindFilterEvents();
        }
      });
  }

  getGenericNameFilters() {
    let data = {
      type: 4
    };
    this.apiService
      .PostAll(GetMasterCodeFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.generic_Names = response.result;
          this.filteredGenericNameOptions = of(response.result);
          this.bindFilterEvents();
        }
      });
  }

  getUsNameFilters() {
    let data = {
      type: 5
    };
    this.apiService
      .PostAll(GetMasterCodeFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.us_Names = response.result;
          this.filteredUsNameOptions = of(response.result);
          this.bindFilterEvents();
        }
      });
  }

  getUsNameWithGenericNameList() {
    let data = {
      type: 5,
      user_id: this.currentUser.id
    };
    this.apiService
      .PostAll(GetMasterCodeUSNameFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.us_name_options = response.result;
        }
      });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
