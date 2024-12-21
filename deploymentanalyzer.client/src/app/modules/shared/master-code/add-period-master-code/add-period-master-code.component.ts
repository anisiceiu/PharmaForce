import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterCode } from '../../../../models/mastercode';
import { Observable, map, of, startWith } from 'rxjs';
import { IdNamePair } from '../../../../models/salesforcedata';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../services/Api/api.service';
import { getAdminPeriods, GetMasterCodeFilters } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { Period } from '../../../../models/period';
import _ from 'underscore';

@Component({
  selector: 'app-add-period-master-code',
  templateUrl: './add-period-master-code.component.html',
  styleUrl: './add-period-master-code.component.css'
})
export class AddPeriodMasterCodeComponent {

  isOpenManagePeriodSidebar = false;
  masterCodeForm: FormGroup;
  periodYear_Names: IdNamePair[] = [];
  periodQuarter_Names: IdNamePair[] = [];
  periodList: Period[]=[];
  constructor(
    public dialogRef: MatDialogRef<AddPeriodMasterCodeComponent>, public fb: FormBuilder, private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { mastercode: MasterCode }
  ) {
    if (data.mastercode && data.mastercode.id > 0) {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        year: [data.mastercode.year, [Validators.required]],
        quarter: [data.mastercode.quarter, [Validators.required]]
      });
    } else {
      this.masterCodeForm = this.fb.group({
        id: [data.mastercode.id],
        name: [data.mastercode.name, [Validators.required]],
        year: [data.mastercode.year, [Validators.required]],
        quarter: [data.mastercode.quarter, [Validators.required]]
      });
    }
    this.isOpenManagePeriodSidebar = true;

    this.getPeriodYearFilters();
    this.getPeriodQuarterFilters();
  }

  ngOnInit(): void {

  }

  onYearOrQarterChange() {
    let year = this.masterCodeForm.controls['year'].value;
    let quarter = this.masterCodeForm.controls['quarter'].value;
    if (year && quarter) {
      let name = `${year} Q${quarter}`;
      this.masterCodeForm.controls['name'].setValue(name);
    }
  }

  getPeriodYearFilters() {
    this.apiService.GetAll(getAdminPeriods, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.periodList = response.result;
        
        let years = this.periodList.map((c:any) => c.period_Year);
        years = _.uniq(years);
        let maxYear = _.max(years.map(c => Number(c)));
        if (maxYear) {  //Add Extra two future years
          years.unshift(maxYear + 1);
          years.unshift(maxYear + 2);
        }
        this.periodYear_Names = years.map((c: any) => ({ id: c, name: c.toString() }));

        if (this.periodYear_Names && this.periodYear_Names.length) {
          this.masterCodeForm.controls['year'].setValue(this.periodYear_Names[0].id);
        }
       
      } else {
      }

    });
  }

  getPeriodQuarterFilters() {
    let quarters: IdNamePair[] = [
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
      { id: 4, name: '4' }
    ];

    this.periodQuarter_Names = quarters;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get companyFormControls() { return this.masterCodeForm.controls; }

}
