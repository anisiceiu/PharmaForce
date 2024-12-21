import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterCode } from '../../../../models/mastercode';
import { IdNamePair } from '../../../../models/salesforcedata';
import { GetMasterCodeFilters, GetMasterCodeRecords } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { ApiService } from '../../../../services/Api/api.service';
import { Observable, map, of, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-salesforce-name-master-code',
  templateUrl: './add-salesforce-name-master-code.component.html',
  styleUrl: './add-salesforce-name-master-code.component.css'
})
export class AddSalesforceNameMasterCodeComponent {
  isOpenManageSalesforceNameSidebar = false;
  masterCodeForm: FormGroup;
  country_Names: IdNamePair[] = [];
  company_Names: IdNamePair[] = [];
  filteredCountryOptions: Observable<IdNamePair[]> | undefined;
  filteredCompanyOptions: Observable<IdNamePair[]> | undefined;
  salesForceTypes: IdNamePair[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddSalesforceNameMasterCodeComponent>, public fb: FormBuilder, private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { mastercode: MasterCode }
  ) {
    if (data.mastercode && data.mastercode.id > 0) {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        country: [data.mastercode.country, [Validators.required]],
        company: [data.mastercode.company, [Validators.required]],
        type_of_salesforce: [data.mastercode.type_of_salesforce, [Validators.required]]
      });
    } else {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        country: [data.mastercode.country, [Validators.required]],
        company: [data.mastercode.company, [Validators.required]],
        type_of_salesforce: [data.mastercode.type_of_salesforce, [Validators.required]]
      });
    }
    this.isOpenManageSalesforceNameSidebar = true;

    this.getCountryFilters();
    this.loadSalesForceTypeMasterCodes();
  }

  loadSalesForceTypeMasterCodes() {
    let data = { category: 'SalesForce_Type' }
    this.apiService.PostAll(GetMasterCodeRecords, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.salesForceTypes = response.result.map((t: MasterCode) => ({ id: t.id, name: t.name }));
      }

    });
  }

  ngOnInit(): void {

    this.filteredCountryOptions = this.masterCodeForm.get('country')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountry(value || '')),
    );

    this.filteredCompanyOptions = this.masterCodeForm.get('company')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCompany(value || '')),
    );

  }


  onCountry_NameChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.getCompanyFilters();
    }
  }


  private _filterCountry(value: string): IdNamePair[] {
    const filterValue = value;
    return this.country_Names.filter(option => option.name.toLowerCase().startsWith(filterValue.toLowerCase()));
  }

  private _filterCompany(value: string): IdNamePair[] {
    const filterValue = value;
    return this.company_Names.filter(option => option.name.toLowerCase().startsWith(filterValue.toLowerCase()));
  }


  getCountryFilters() {
    let data = { type: 1 };
    this.apiService
      .PostAll(GetMasterCodeFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.country_Names = response.result;
          this.filteredCountryOptions = of(response.result);
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
        }
      });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
