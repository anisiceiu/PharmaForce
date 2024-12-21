import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from '../../../../models/company';
import { MasterCode } from '../../../../models/mastercode';
import { ApiResponse } from '../../../../models/ApiResponse';
import { GetMasterCodeAddFilters } from '../../../../constants/api.constant';
import { IdNamePair } from '../../../../models/salesforcedata';
import { ApiService } from '../../../../services/Api/api.service';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-edit-mastercode-popup',
  templateUrl: './add-edit-mastercode-popup.component.html',
  styleUrls: ['./add-edit-mastercode-popup.component.scss']
})
export class AddEditMastercodePopupComponent {

  isOpenManageCompanySidebar = false;
  mastercodeForm: FormGroup;
  categories : string [] = [];
  isCategoryDropDownShow: boolean = true;
  region_Names: IdNamePair[] = [];
  currencySymbol_Names: IdNamePair[] = [];
 
  constructor(
    public dialogRef: MatDialogRef<AddEditMastercodePopupComponent>, public fb: FormBuilder, private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { mastercode: MasterCode,categories : string[],masterCodeCategory:string }
  ) {
    this.isCategoryDropDownShow = this.isCategoryDropDownShow = !(data.masterCodeCategory === 'Period' || data.masterCodeCategory === 'Country');
    this.categories = data.categories;
    if(data.mastercode && data.mastercode.id > 0){
      this.mastercodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        category: [data.mastercode.category, [Validators.required]],
        region: data.masterCodeCategory === 'Country' ? [data.mastercode.region, [Validators.required]] : [data.mastercode.region, null],
        currency_symbol: data.masterCodeCategory === 'Country' ? [data.mastercode.currency_symbol, [Validators.required]] : [data.mastercode.currency_symbol, null],
      });
    }else{
      this.mastercodeForm = this.fb.group({
        id: [null],
        name: ['', [Validators.required]],
        category: [
          (data.masterCodeCategory === 'Period' || data.masterCodeCategory === 'Country')
            ? data.masterCodeCategory : '', [Validators.required]],
        region: data.masterCodeCategory === 'Country' ? [data.mastercode.region, [Validators.required]] : [data.mastercode.region, null],
        currency_symbol: data.masterCodeCategory === 'Country' ? [data.mastercode.currency_symbol, [Validators.required]] : [data.mastercode.currency_symbol, null],
      });
    }
    this.isOpenManageCompanySidebar = true;
  }

  ngOnInit(): void {

    if (this.data.masterCodeCategory == 'Country') {
      this.getRegionFilters();
      this.getCurrencySymbolFilters();
    }
  }


  getRegionFilters() {
    let data = { type: 0 };
    this.apiService
      .PostAll(GetMasterCodeAddFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.region_Names = response.result;
        }
      });
  }

  getCurrencySymbolFilters() {
    let data = {
      type: 1
    };
    this.apiService
      .PostAll(GetMasterCodeAddFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.currencySymbol_Names = response.result;
          
        }
      });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.mastercodeForm.controls; }
}
