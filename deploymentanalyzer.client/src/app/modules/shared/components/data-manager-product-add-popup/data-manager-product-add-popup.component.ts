import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataManagerProduct } from '../../../../models/datamanagerproduct';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { GetDMSalesforceRecordsFilters, addUpdateMasterCode } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { IdNamePair, dropdowncollection } from '../../../../models/salesforcedata';
import { ApiService } from '../../../../services/Api/api.service';
import { ToasterService } from '../../../../services/common/toaster.service';

@Component({
  selector: 'app-data-manager-product-add-popup',
  templateUrl: './data-manager-product-add-popup.component.html',
  styleUrls: ['./data-manager-product-add-popup.component.scss']
})
export class DataManagerProductAddPopupComponent {

  isOpenManageProductSidebar = false;
  productForm: FormGroup;
  co_Promotion = 'Co-Promotion';
  contact_Sales = 'Contract Sales Force';

  all_data: dropdowncollection | undefined;

  companies_Names: IdNamePair[]  = [];
  us_Brand_Name : IdNamePair[] = [];
  country_Specific_Product : IdNamePair[] = [];
  generic_Name : IdNamePair[] = [];
  therapeutic_Category : IdNamePair[] = [];
  physician_Focus : IdNamePair[] = [];
  physician_Targeted:IdNamePair[] = [];
  name_of_cso : IdNamePair[] = [];
          
  filteredCompaniesOptions: Observable<IdNamePair[]> | undefined;
  us_Brand_Name_Options: Observable<IdNamePair[]> | undefined;
  country_Specific_Product_Options: Observable<IdNamePair[]> | undefined;
  generic_Name_Options: Observable<IdNamePair[]> | undefined;
  therapeutic_Category_Options: Observable<IdNamePair[]> | undefined;
  physician_Focus_Options: Observable<IdNamePair[]> | undefined;
  physician_Targeted_Options: Observable<IdNamePair[]> | undefined;
  name_of_cso_Options: Observable<IdNamePair[]> | undefined;

  constructor(public dialogRef: MatDialogRef<DataManagerProductAddPopupComponent>,public fb:FormBuilder,
    private cdr: ChangeDetectorRef, private apiService: ApiService,private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: { product: DataManagerProduct}
  ) { 
    if(data.product && data.product.uS_Product_Name_Product_Promoted.length > 0){
      this.productForm = this.fb.group({
        dADatabase_Product_Id: [data.product.daDatabase_Product_Id],
        dADatabase_Salesforce_Id: [data.product.daDatabase_Salesforce_Id],
        uS_Product_Name_Product_Promoted: [data.product.uS_Product_Name_Product_Promoted, [Validators.required]],
        country_Specific_Product_Name_Product_Promoted: [data.product.country_Specific_Product_Name_Product_Promoted],
        generic_Name: [data.product.generic_Name, [Validators.required]],
        therapeutic_Category: [data.product.therapeutic_Category, [Validators.required]],
        primary_Care_Full_Time_Equivalents_FTEs: [data.product.primary_Care_Full_Time_Equivalents_FTEs],
        specialty_Full_Time_Equivalents_FTEs: [data.product.specialty_Full_Time_Equivalents_FTEs],
        physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: [data.product.physicians_Focus_Primary_Care_Physicians_Specialty_Physicians],
        specialty_Physicians_Targeted: [data.product.specialty_Physicians_Targeted],
        co_Promotion_YesNo: [data.product.co_Promotion_YesNo],
        name_of_a_Partner_Company: [data.product.name_of_a_Partner_Company],
        contract_Sales_Force_YesNo: [data.product.contract_Sales_Force_YesNo],
        name_of_a_CSO_Contract_Sales_Organization: [data.product.name_of_a_CSO_Contract_Sales_Organization],
        additional_Notes_Product: [data.product.additional_Notes_Product]
      });
    } else {

      this.productForm = this.fb.group({
        dADatabase_Product_Id: [data.product.daDatabase_Product_Id],
        dADatabase_Salesforce_Id: [data.product.daDatabase_Salesforce_Id],
        uS_Product_Name_Product_Promoted: ['', [Validators.required]],
        country_Specific_Product_Name_Product_Promoted: [''],
        generic_Name: ['', [Validators.required]],
        therapeutic_Category: ['', [Validators.required]],
        primary_Care_Full_Time_Equivalents_FTEs: [0],
        specialty_Full_Time_Equivalents_FTEs: [0],
        physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: [''],
        specialty_Physicians_Targeted: [''],
        co_Promotion_YesNo: [null],
        name_of_a_Partner_Company:[{ value: '', disabled: true }],
        contract_Sales_Force_YesNo: [null],
        name_of_a_CSO_Contract_Sales_Organization: [{ value: '', disabled: true }],
        additional_Notes_Product: ['']
      });
    }

    this.productForm.get('co_Promotion_YesNo')?.valueChanges.subscribe((isCoPromotion: boolean) => {
      const nameControl = this.productForm.get('name_of_a_Partner_Company');
      if (isCoPromotion) {
        this.co_Promotion = 'Name of a partner company';
        nameControl?.enable();
      } else {
        this.co_Promotion = 'Co-Promotion';
        nameControl?.disable();
      }
      this.cdr.detectChanges();  
    });

    this.productForm.get('contract_Sales_Force_YesNo')?.valueChanges.subscribe((isContactSalesForce: boolean) => {
      const nameControl = this.productForm.get('name_of_a_CSO_Contract_Sales_Organization');
      if (isContactSalesForce) {
        this.contact_Sales = 'Name of a CSO';
        nameControl?.enable();
      } else {
        this.contact_Sales = 'Contract Sales Force';
        nameControl?.disable();
      }
      this.cdr.detectChanges();  
    });
    
    this.isOpenManageProductSidebar = true;
  }

  ngOnInit(): void {
    
    this.bindMasterCodes();

  }


  bindMasterCodes(){
    let data = {};
    this.apiService
      .PostAll(GetDMSalesforceRecordsFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.all_data = response.result;
          this.companies_Names = response.result.company_Name;
          this.us_Brand_Name = response.result.us_Brand_Name;
          this.country_Specific_Product = response.result.country_Specific_Product;
          this.generic_Name = response.result.generic_Name;
          this.therapeutic_Category = response.result.therapeutic_Category;
          this.physician_Focus = response.result.physician_Focus;
          this.physician_Targeted = response.result.physician_Targeted;
          this.name_of_cso = response.result.name_of_cso;
        }

        this.executeFilters();
      });
  }

  executeFilters(){

    this.filteredCompaniesOptions = this.productForm.get('name_of_a_Partner_Company')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCompanies(value || '')),
    );

    this.us_Brand_Name_Options = this.productForm.get('uS_Product_Name_Product_Promoted')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_us_Brand_Name(value || '')),
    );

    this.country_Specific_Product_Options = this.productForm.get('country_Specific_Product_Name_Product_Promoted')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_country_Specific_Product(value || '')),
    );

    this.generic_Name_Options = this.productForm.get('generic_Name')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_generic_Name(value || '')),
    );

    this.therapeutic_Category_Options = this.productForm.get('therapeutic_Category')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_therapeutic_Category(value || '')),
    );

    this.physician_Focus_Options = this.productForm.get('physicians_Focus_Primary_Care_Physicians_Specialty_Physicians')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_physician_Focus(value || '')),
    );

    this.name_of_cso_Options = this.productForm.get('name_of_a_CSO_Contract_Sales_Organization')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_name_of_cso(value || '')),
    );

  }

  private _filter_us_Brand_Name(value: string): IdNamePair[] {
    const filterValue = value.toLowerCase();
    return this.us_Brand_Name.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterCompanies(value: string): IdNamePair[] {
    const filterValue = value.toLowerCase();
    return this.companies_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_country_Specific_Product(value: string): IdNamePair[] {
    const filterValue = value.toLowerCase();
    return this.country_Specific_Product.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_generic_Name(value: string): IdNamePair[] {
    const filterValue = value.toLowerCase();
    return this.generic_Name.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_therapeutic_Category(value: string): IdNamePair[] {
    const filterValue = value.toLowerCase();
    return this.therapeutic_Category.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_physician_Focus(value: string): IdNamePair[] {
    const filterValue = value.toLowerCase();
    return this.physician_Focus.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_name_of_cso(value: string): IdNamePair[] {
    const filterValue = value.toLowerCase();
    return this.name_of_cso.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  onCloseClick(): void {
    this.isOpenManageProductSidebar = false;
    this.dialogRef.close();
  }

  addMasterCode(name:string,category:string){
     if(category == 'Specialty_Physician'){
      let targeted = this.productFormControls[name].value;
      if(targeted.length > 1){
        this.toasterService.showWarning('please do not choose multiple values');
        return;
      }
     }
      let request = {
        name: this.productFormControls[name].value.toString(),
        category: category
      }

      if(category == 'CSO'){
        let csoYesNo = this.productFormControls[name].value;
        if(!csoYesNo){
          this.toasterService.showWarning('can not add when CSO set to No');
          return;
        }else{
          if(request.name){
          this.callMasterCodeAction(request);
          }else{
            this.toasterService.showError('please do not add blank value');
          }
        }
      }
      else if(request.name){
          this.callMasterCodeAction(request);
      }
      else{
        this.toasterService.showError('please do not add blank value');
      }
    
    
  }

  callMasterCodeAction(request:any){
    this.apiService.Create(addUpdateMasterCode,request).subscribe((response:ApiResponse) => {
      if(response.status){
        this.toasterService.showSuccess(response.message);
        this.bindMasterCodes();
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }

  get productFormControls() { return this.productForm.controls; }

}
