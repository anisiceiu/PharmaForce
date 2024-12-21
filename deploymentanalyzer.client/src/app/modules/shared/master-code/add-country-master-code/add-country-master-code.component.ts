import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterCode } from '../../../../models/mastercode';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IdNamePair } from '../../../../models/salesforcedata';
import { ApiService } from '../../../../services/Api/api.service';
import { GetMasterCodeFilters } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';

@Component({
  selector: 'app-add-country-master-code',
  templateUrl: './add-country-master-code.component.html',
  styleUrl: './add-country-master-code.component.css'
})
export class AddCountryMasterCodeComponent {
  isOpenManageCountrySidebar = false;
  masterCodeForm: FormGroup;
  region_Names: IdNamePair[] = [];
  currencySymbol_Names: IdNamePair[] = [];
  isNewCurrencySymbol: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddCountryMasterCodeComponent>, public fb: FormBuilder, private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { mastercode: MasterCode }
  ) {
    if (data.mastercode && data.mastercode.id > 0) {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        region: [data.mastercode.region],
        currency_symbol: [data.mastercode.currency_symbol]
      });
    } else {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        region: [data.mastercode.region],
        currency_symbol: [data.mastercode.currency_symbol]
      });
    }
    this.isOpenManageCountrySidebar = true;

    this.getCurrencySymbolFilters();
    this.getRegionFilters();
  }

  onCurrencySelectionChange(value:string) {
    console.log(value);
    if (value == 'Add New Currency Symbol') {
      this.isNewCurrencySymbol = true;
    }
    else {
      this.isNewCurrencySymbol = false;
    }
   
  }

  getRegionFilters() {
    let data = { type: 0 };
    this.apiService
      .PostAll(GetMasterCodeFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.region_Names = response.result;
        }
      });
  }

  getCurrencySymbolFilters() {
    let data = {
      type: 6
    };
    this.apiService
      .PostAll(GetMasterCodeFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.currencySymbol_Names = response.result;
          this.currencySymbol_Names.unshift({id:-1,name:'Add New Currency Symbol'});
        }
      });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
