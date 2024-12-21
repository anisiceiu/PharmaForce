import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterCode } from '../../../../models/mastercode';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IdNamePair } from '../../../../models/salesforcedata';
import { Observable, map, of, startWith } from 'rxjs';
import { ApiService } from '../../../../services/Api/api.service';
import { GetMasterCodeFilters } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';

@Component({
  selector: 'app-add-company-master-code',
  templateUrl: './add-company-master-code.component.html',
  styleUrl: './add-company-master-code.component.css'
})
export class AddCompanyMasterCodeComponent {
  isOpenManageCompanySidebar = false;
  masterCodeForm: FormGroup;
  country_Names: IdNamePair[] = [];
  filteredCountryOptions: Observable<IdNamePair[]> | undefined;
  constructor(
    public dialogRef: MatDialogRef<AddCompanyMasterCodeComponent>, public fb: FormBuilder, private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { mastercode: MasterCode }
  ) {
    if (data.mastercode && data.mastercode.id > 0) {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        website: [data.mastercode.website],
        headquarters: [data.mastercode.headquarters],
        number_of_employees: [data.mastercode.number_of_employees],
        type_of_entity: [data.mastercode.type_of_entity],
        sales_previous_year: [data.mastercode.sales_previous_year],
        country: [data.mastercode.country?.split(',')]
      });
    } else {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        website: [data.mastercode.website],
        headquarters: [data.mastercode.headquarters],
        number_of_employees: [data.mastercode.number_of_employees],
        type_of_entity: [data.mastercode.type_of_entity],
        sales_previous_year: [data.mastercode.sales_previous_year],
        country: [data.mastercode.country?.split(',')]
      });
    }

    this.getCountryFilters();

    this.isOpenManageCompanySidebar = true;
  }

  ngOnInit(): void {

    this.filteredCountryOptions = this.masterCodeForm.get('country')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountry(value || '')),
    );

    
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

  private _filterCountry(value: string): IdNamePair[] {
    const filterValue = value;
    return this.country_Names.filter(option => option.name.toLowerCase().startsWith(filterValue.toLowerCase()));
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
