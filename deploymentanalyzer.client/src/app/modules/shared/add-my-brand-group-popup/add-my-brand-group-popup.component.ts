import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/Api/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToasterService } from '../../../services/common/toaster.service';
import { Brand, MyBrand } from '../../../models/brand';
import { IdNamePair } from '../../../models/salesforcedata';
import { GetCompanyTherapeuticBrandAssociation,GetBrandGroupFilters, getAdminCountries, getAdminTherapeuticCategories, getCompany } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { Country } from '../../../models/country';
import { DualListBoxControlComponent } from '../dual-list-box-control/dual-list-box-control.component';
import { TherapeuticCategory } from '../../../models/therapeuticCategory';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-add-my-brand-group-popup',
  templateUrl: './add-my-brand-group-popup.component.html',
  styleUrl: './add-my-brand-group-popup.component.css'
})
export class AddMyBrandGroupPopupComponent {

  isOpenManageBrandGroupSidebar = false;
  brandList: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  theraptic_category_Names: IdNamePair[] = [];
  keyBrand: string = 'id';
  displayBrand: string = 'name';
  sourceBrand: Array<any> = [];
  confirmedBrand: Array<any> = [];
  previousBrandList: Array<string> = [];
  keepSorted = true;
  filter = false;
  disabled = false;
  sourceLeft = true;
  format: any = DualListBoxControlComponent.DEFAULT_FORMAT;

  filteredOptionsCompany_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionstherapticCategory_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
 
  brandGroupForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddMyBrandGroupPopupComponent>, public fb: FormBuilder,
    private apiService: ApiService, private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: { myBrandGroup: MyBrand }
  ) {

    if (data.myBrandGroup && data.myBrandGroup.id > 0) {

      this.brandGroupForm = this.fb.group({
        id: [data.myBrandGroup.id],
        userId: [data.myBrandGroup.userId],
        name: [data.myBrandGroup.name, [Validators.required]],
        brands: [data.myBrandGroup.brands, [Validators.required]],
        isChemicalGroup: [data.myBrandGroup.isChemicalGroup],
        company_Id: [0],
        therapeuticCategory_Id: [0],
        company_NameAuto: [null],
        therapticCategory_NameAuto: [null]
      });

      this.loadAdditionalData(data.myBrandGroup.id);

    } else {
      this.brandGroupForm = this.fb.group({
        id: 0,
        userId: [data.myBrandGroup.userId],
        name: [data.myBrandGroup.name, [Validators.required]],
        brands: [data.myBrandGroup.brands, [Validators.required]],
        isChemicalGroup: [data.myBrandGroup.isChemicalGroup],
        company_Id: [0],
        therapeuticCategory_Id: [0],
        company_NameAuto: [null],
        therapticCategory_NameAuto: [null]
      });
    }

    this.isOpenManageBrandGroupSidebar = true;

  }


  loadAdditionalData(id: number) {
    this.apiService.PostAll(GetCompanyTherapeuticBrandAssociation, { myBrandId: id }).subscribe(response => {

      if (response.status) {
        let association = response.result;
        if (association && association.companyId) {
          this.brandGroupForm.controls['company_Id'].setValue(association.companyId);
          this.getCompanyFilters();
        }
        if (association && association.therapeuticCategoryId) {
          this.brandGroupForm.controls['therapeuticCategory_Id'].setValue(association.therapeuticCategoryId);
          this.getTherapeuticCategoryFilters();
        }
      }

    });
  }

  onClickDualBox() {
    if (this.confirmedBrand && this.confirmedBrand.length) {
      let ids = this.confirmedBrand.map(o => { return o.id; });
      this.brandGroupForm.controls['brands'].setValue(ids.join(','));
    }
  }

 
  onSelectedTherapeuticCategoryChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.brandGroupForm.controls['therapeuticCategory_Id'].setValue(event.option.value.id);
      this.loadBrands();
    }
  }

  onSelectedCompanyChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.brandGroupForm.controls['company_Id'].setValue(event.option.value.id);
      this.getTherapeuticCategoryFilters();
    }
  }
  

  loadBrands() {
    this.apiService.PostAll(GetBrandGroupFilters, {
      type: 2,
      companyId: Number(this.brandGroupForm.controls['company_Id'].value),
      therapeuticCategory_Id: Number(this.brandGroupForm.controls['therapeuticCategory_Id'].value)
    }).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.brandList = response.result;
        this.initBrandDualList();
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  initBrandDualList() {
    this.sourceBrand = JSON.parse(JSON.stringify(this.brandList));
    this.previousBrandList = new Array<string>();
    this.confirmedBrand = new Array<any>();

    if (this.brandGroupForm.controls['brands'].value && this.sourceBrand && this.sourceBrand.length) {
      let ids: [] = this.brandGroupForm.controls['brands'].value.split(',');

      ids.forEach(id => {
        let item = this.sourceBrand.filter(c => c.id == id);
        if (item && item.length) {
          this.previousBrandList.push(item[0].name);
          this.confirmedBrand.push(item[0]);
        }
      });

    }
  }

  getCompanyFilters() {
    let data = {
      type: 0,
      companyId: Number(this.brandGroupForm.controls['company_Id'].value),
      therapeuticCategory_Id: Number(this.brandGroupForm.controls['therapeuticCategory_Id'].value)
    };
    this.apiService
      .PostAll(GetBrandGroupFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.companies_Names = response.result;
          this.filteredOptionsCompany_Name = of(this.companies_Names);
          if (this.brandGroupForm.controls['company_Id'].value) {
            let companyId = Number(this.brandGroupForm.controls['company_Id'].value);
            let selectedCompany = this.companies_Names.filter(c => c.id == companyId);
            if (selectedCompany && selectedCompany.length)
              this.brandGroupForm.controls['company_NameAuto'].setValue(selectedCompany[0]);
          }
        }
      });
  }

  getTherapeuticCategoryFilters() {
    let data = {
      type: 1,
      companyId: Number(this.brandGroupForm.controls['company_Id'].value),
      therapeuticCategory_Id: Number(this.brandGroupForm.controls['therapeuticCategory_Id'].value)
    };
    this.apiService
      .PostAll(GetBrandGroupFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.theraptic_category_Names = response.result;
          this.filteredOptionstherapticCategory_Name = of(this.theraptic_category_Names);
          if (this.brandGroupForm.controls['therapeuticCategory_Id'].value) {
            let therapeuticId = Number(this.brandGroupForm.controls['therapeuticCategory_Id'].value);
            let selectedTherapeutic = this.theraptic_category_Names.filter(c => c.id == therapeuticId);
            if (selectedTherapeutic && selectedTherapeutic.length)
              this.brandGroupForm.controls['therapticCategory_NameAuto'].setValue(selectedTherapeutic[0]);
            this.loadBrands();
          }
        }
      });
  }

  ngOnInit(): void {

    this.filteredOptionsCompany_Name = this.brandGroupForm.controls['company_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterCompany(name as string) : this.companies_Names.slice();
      }),
    );

    this.filteredOptionstherapticCategory_Name = this.brandGroupForm.controls['therapticCategory_NameAuto'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterTherapticCategory(name as string) : this.theraptic_category_Names.slice();
      }),
    );


    this.getCompanyFilters();
  }

  displayFn(item: IdNamePair): string {
    return item && item.name ? item.name : '';
  }

  private _filterCompany(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.companies_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterTherapticCategory(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.theraptic_category_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

  get brandGroupFormControls() { return this.brandGroupForm.controls; }
}
