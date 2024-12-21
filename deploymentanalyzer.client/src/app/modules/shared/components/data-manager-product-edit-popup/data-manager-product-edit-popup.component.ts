import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataManagerProduct } from '../../../../models/datamanagerproduct';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesPopupComponent } from '../notes-popup/notes-popup.component';
import { GetDMSalesforceRecordsFilters, addUpdateCitation, addUpdateMasterCode, addUpdateNotes, getNotes } from '../../../../constants/api.constant';
import { ApiService } from '../../../../services/Api/api.service';
import { ToasterService } from '../../../../services/common/toaster.service';
import { CitationPopupComponent } from '../citation-popup/citation-popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { notes } from '../../../../models/notes';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, startWith, map } from 'rxjs';
import { ApiResponse } from '../../../../models/ApiResponse';
import { IdNamePair } from '../../../../models/salesforcedata';
import { StorageService } from '../../../../services/common/storage.service';

@Component({
  selector: 'app-data-manager-product-edit-popup',
  templateUrl: './data-manager-product-edit-popup.component.html',
  styleUrls: ['./data-manager-product-edit-popup.component.scss']
})
export class DataManagerProductEditPopupComponent implements OnInit {

  isOpenManageProductSidebar = false;
  isOpenManageDMNotesSidebar = false;
  isOpenManageDMCitationSidebar = false;
  isEnabledCitationPrimarySearch = true;
  isEnabledCitationSecondarySearch = false;
  isEnabledCitationAnalystComment = false;
  productForm: FormGroup;
  productionData:any;
  co_Promotion = 'Co-Promotion';
  contact_Sales = 'Contract Sales Force';

  standardColumnList = [
    { key: 'qcq_status', value: 'QCQ Status' },
    { key: 'has_citation', value: 'Has Citation' },
    { key: 'country_Name', value: 'Country Name' },
    { key: 'company_Name', value: 'Company Name' },
    { key: 'period_Year', value: 'Period Year' },
    { key: 'period_Quarter', value: 'Period Quarter' },
    { key: 'salesforce_Name', value: 'Salesforce Name' },
    { key: 'type_of_Salesforce', value: 'Type Of Salesforce' },
    { key: 'number_Of_Sales_Representatives', value: 'Number Of Sales Representatives' },
    { key: 'number_Of_District_Managers', value: 'Number Of District Managers' },
    { key: 'number_Of_Regional_Managers', value: 'Number Of Regional Managers' },
    { key: 'uS_Product_Name_Product_Promoted', value: 'US Brand Name Product Promoted' },
    { key: 'country_Specific_Product_Name_Product_Promoted', value: 'Country Specific Brand Name Product Promoted' },
    { key: 'generic_Name', value: 'Generic Name' },
    { key: 'therapeutic_Category', value: 'Therapeutic Category' },
    { key: 'product_Promotion_Priority_Order', value: 'Product Promotion Priority Order' },
    { key: 'total_Number_of_Full_Time_Equivalents_FTEs', value: 'Total Number of Full Time Equivalents FTEs' },
    { key: 'primary_Care_Full_Time_Equivalents_FTEs', value: 'Primary Care Full Time Equivalents FTEs' },
    { key: 'specialty_Full_Time_Equivalents_FTEs', value: 'Specialty Full Time Equivalents FTEs' },
    { key: 'physicians_Focus_Primary_Care_Physicians_Specialty_Physicians', value: 'Physicians Focus Primary Care' },
    { key: 'specialty_Physicians_Targeted', value: 'Specialty Physicians Targeted' },
    { key: 'co_Promotion_YesNo', value: 'Co Promotion YesNo' },
    { key: 'name_of_a_Partner_Company', value: 'Name Of a Partner Company' },
    { key: 'contract_Sales_Force_YesNo', value: 'Contract Sales Force YesNo' },
    { key: 'name_of_a_CSO_Contract_Sales_Organization', value: 'Contract Sales Organization' },
    { key: 'salary_Low', value: 'Salary low' },
    { key: 'salary_High', value: 'Salary High' },
    { key: 'target_Bonus', value: 'Target Bonus' },
    { key: 'reach', value: 'Reach' },
    { key: 'pct_Split_Between_Primary_Care_And_Specialty', value: 'Pct Split Between Primary Care And Specialty' },
    { key: 'frequency', value: 'Frequency' },
    { key: 'additional_Notes', value: 'Additional Notes' },
    { key: 'additional_Notes_Product', value: 'Additional Notes Product' },
    { key: 'additional_Notes_Salesforce', value: 'Additional Notes Salesforce' },
    { key: 'daDatabase_Salesforce_Id', value: 'Database Salesforce Id' },
    { key: 'modified_date', value: 'Modified Date' },
    { key: 'modified_by_name', value: 'Modified By' },
    { key: 'added_date', value: 'Added Date' },
    { key: 'added_by_name', value: 'Added By' }
  ];

  salesforce_id = '';
  product_id = '';
  currentUser:any;
  
  companies_Names: IdNamePair[]  = [];
  us_Brand_Name : IdNamePair[] = [];
  country_Specific_Product : IdNamePair[] = [];
  generic_Name : IdNamePair[] = [];
  therapeutic_Category : IdNamePair[] = [];
  physician_Focus : IdNamePair[] = [];
  physician_Targeted : IdNamePair[] = [];
  name_of_cso : IdNamePair[] = [];
          
  filteredCompaniesOptions: Observable<IdNamePair[]> | undefined;
  us_Brand_Name_Options: Observable<IdNamePair[]> | undefined;
  country_Specific_Product_Options: Observable<IdNamePair[]> | undefined;
  generic_Name_Options: Observable<IdNamePair[]> | undefined;
  therapeutic_Category_Options: Observable<IdNamePair[]> | undefined;
  physician_Focus_Options: Observable<IdNamePair[]> | undefined;
  physician_Targeted_Options: Observable<IdNamePair[]> | undefined;
  name_of_cso_Options: Observable<IdNamePair[]> | undefined;

  displayedNotesColumns: string[] = [
    'column_name',
    'description',
    'uS_Product_Name_Product_Promoted',
    'full_Name',
    'company_Name',
    'country_Name',
    'salesforce_Name',
    'period_Year',
    'period_Quarter',
    'added_Dt'
  ];

  isEditable: boolean = true;
  
  notesItems: notes[] = [];
  notesdataSource = new MatTableDataSource<notes>(this.notesItems);
  constructor(public dialogRef: MatDialogRef<DataManagerProductEditPopupComponent>,public fb:FormBuilder,
    private cdr: ChangeDetectorRef,private dialog: MatDialog,private storageService:StorageService,
    private apiService: ApiService,  private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: { product: DataManagerProduct, productionproduct: any, openedFrom:string }
  ) {

    this.productionData = data.productionproduct
    this.salesforce_id = data.product.daDatabase_Salesforce_Id;
    this.product_id = data.product.daDatabase_Product_Id;

    if (data.openedFrom && data.openedFrom == 'QCQueueList') {
      this.isEditable = false;
    }

    this.productForm = this.fb.group({
      daDatabase_Product_Id: [data.product.daDatabase_Product_Id],
      daDatabase_Salesforce_Id: [data.product.daDatabase_Salesforce_Id],
      uS_Product_Name_Product_Promoted: [data.product.uS_Product_Name_Product_Promoted, [Validators.required]],
      country_Specific_Product_Name_Product_Promoted: [data.product.country_Specific_Product_Name_Product_Promoted],
      generic_Name: [data.product.generic_Name, [Validators.required]],
      therapeutic_Category: [data.product.therapeutic_Category, [Validators.required]],
      primary_Care_Full_Time_Equivalents_FTEs: 
      [Number(data.product.primary_Care_Full_Time_Equivalents_FTEs) > 0 ? data.product.primary_Care_Full_Time_Equivalents_FTEs : null],
      specialty_Full_Time_Equivalents_FTEs: 
        [Number(data.product.specialty_Full_Time_Equivalents_FTEs) > 0 ? data.product.specialty_Full_Time_Equivalents_FTEs : null, [Validators.required]],
      physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: [data.product.physicians_Focus_Primary_Care_Physicians_Specialty_Physicians],
      specialty_Physicians_Targeted: [typeof data.product.specialty_Physicians_Targeted === 'string'
        ? data.product.specialty_Physicians_Targeted.split(', ').map(value => value.trim())
        : data.product.specialty_Physicians_Targeted,[Validators.required]],
      co_Promotion_YesNo: [data.product.co_Promotion_YesNo],
      name_of_a_Partner_Company: [data.product.name_of_a_Partner_Company],
      contract_Sales_Force_YesNo: [data.product.contract_Sales_Force_YesNo],
      name_of_a_CSO_Contract_Sales_Organization: [data.product.name_of_a_CSO_Contract_Sales_Organization],
      additional_Notes_Product: [data.product.additional_Notes_Product]
    });
    this.initializeControl();
    this.isOpenManageProductSidebar = true;
  }

  initializeControl(){
    const coPromotionYesNoControl = this.productForm.get('co_Promotion_YesNo');
    const contractSalesForceYesNoControl = this.productForm.get('contract_Sales_Force_YesNo');

    const nameOfPartnerCompanyControl = this.productForm.get('name_of_a_Partner_Company');
    const nameOfCSOControl = this.productForm.get('name_of_a_CSO_Contract_Sales_Organization');

    // Initial check for co_Promotion_YesNo
    if (coPromotionYesNoControl?.value) {
      this.co_Promotion = 'Name of a partner company';
      nameOfPartnerCompanyControl?.enable();
    } else {
      this.co_Promotion = 'Co-Promotion';
      nameOfPartnerCompanyControl?.disable();
    }

    // Initial check for contract_Sales_Force_YesNo
    if (contractSalesForceYesNoControl?.value) {
      this.contact_Sales = 'Name of a CSO';
      nameOfCSOControl?.enable();
    } else {
      this.contact_Sales = 'Contract Sales Force';
      nameOfCSOControl?.disable();
    }

    // Subscribe to value changes for co_Promotion_YesNo
    coPromotionYesNoControl?.valueChanges.subscribe((isCoPromotion: boolean) => {
      if (isCoPromotion) {
        this.co_Promotion = 'Name of a partner company';
        nameOfPartnerCompanyControl?.enable();
      } else {
        this.co_Promotion = 'Co-Promotion';
        nameOfPartnerCompanyControl?.disable();
        nameOfPartnerCompanyControl?.setValue('');  // Clear the value when disabled
      }
      this.cdr.detectChanges();
    });

    // Subscribe to value changes for contract_Sales_Force_YesNo
    contractSalesForceYesNoControl?.valueChanges.subscribe((isContactSalesForce: boolean) => {
      if (isContactSalesForce) {
        this.contact_Sales = 'Name of a CSO';
        nameOfCSOControl?.enable();
      } else {
        this.contact_Sales = 'Contract Sales Force';
        nameOfCSOControl?.disable();
        nameOfCSOControl?.setValue('');  // Clear the value when disabled
      }
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.currentUser = this.storageService.UserDetails;
    this.bindMasterCodes();
    this.getProductsNotes();
  }

  getProductsNotes(){
    let data = {
      user_id: this.currentUser.id,
      daDatabase_Salesforce_Id: "",
      daDatabase_Product_id: this.product_id,
      security_Token: ""
    }

    this.apiService.PostAll(getNotes,data,true).subscribe(response=>{
      if (response.status){
        this.notesItems = this.getStandardizeNoteList(response.result);
        this.notesdataSource = new MatTableDataSource<notes>(this.notesItems);
      }
    });
  }

  getStandardizeColumnName(columnName: string) {
    let col = this.standardColumnList.filter(c => c.key.toLowerCase() == columnName.toLowerCase());
    if (col && col.length)
      return col[0].value;
    else
      return columnName;
  }

  getStandardizeNoteList(list: any[]) {
    let noteList = list.map(item => ({ ...item, column_name: this.getStandardizeColumnName(item.column_name) }));
    return noteList;
  }

  onCloseClick(): void {
    this.isOpenManageProductSidebar = false;
    this.dialogRef.close();
  }

  openCitationPopup(column_name:string){
    let columDetail = {
      column_name:column_name.toLowerCase(),
      salesforceId : this.salesforce_id,
      productId:this.product_id
    }
    const dialogRef = this.dialog.open(CitationPopupComponent, {
      height: '0%',
      data: { columDetail: columDetail }
    });
  
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        let request = {
          id: result.id || 0,
          user_id: result.user_id || this.currentUser.id,
          daDatabase_Salesforce_Id: result.daDatabase_Salesforce_Id,
          daDatabase_Product_Id: result.daDatabase_Product_Id,
          columnName: result.column_name,
          date: result.date ? new Date(result.date) : null, 
          url: result.url,
          description: result.description,
          type: `${result.primary || ''},${result.secondary || ''},${result.analyst || ''}`, 
          sourceFunction: result.source_function || '',
          sourceType: result.source_type || '',
          companyOverview: result.company_overview || '',
          interviewDate: result.interview_date ? new Date(result.interview_date) : null,
          comments: result.comments || '',
          analystComments: result.analyst_comments || '',
          status: result.status || ''
      };
      
        this.apiService.PostAll(addUpdateCitation,request,true).subscribe(result=>{
          if(result.status){
            this.toasterService.showSuccess(result.message);
          }else{
            this.toasterService.showError(result.message);
          }
        });
        
      }
    });
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    
    if(tabChangeEvent.index == 1){
      this.getProductsNotes();
    } 
  }

  openNotesPopup(column_name:string){
    let columDetail = {
      column_name:column_name,
      salesforceId : this.salesforce_id,
      productId:this.product_id
    }
    const dialogRef = this.dialog.open(NotesPopupComponent, {
      height: '0%',
      data: { columDetail: columDetail }
    });
  
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        let request  = {
          id: 0,
          user_id: this.currentUser.id,
          daDatabase_Salesforce_Id: result.daDatabase_Salesforce_Id,
          daDatabase_Product_Id: result.daDatabase_Product_Id,
          column_name: result.column_name,
          description: result.description,
          note_for: '',
          type:'product'

        }
        this.apiService.PostAll(addUpdateNotes,request,true).subscribe(result=>{
          if(result.status){
            this.toasterService.showSuccess(result.message);
          }else{
            this.toasterService.showError(result.message);
          }
        });
        
      }
    });
  }

  addMasterCode(name:string,category:string){
     
    let request = {
      name: this.productFormControls[name].value.toString(),
      category: category
    }

    if(category == 'CSO'){
      let csoYesNo = this.productFormControls['contract_Sales_Force_YesNo'].value;
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


  bindMasterCodes(){
    let data = {};
    this.apiService
      .PostAll(GetDMSalesforceRecordsFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
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
    const filterValue = value;
    return this.us_Brand_Name.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterCompanies(value: string): IdNamePair[] {
    const filterValue = value;
    return this.companies_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_country_Specific_Product(value: string): IdNamePair[] {
    const filterValue = value;
    return this.country_Specific_Product.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_generic_Name(value: string): IdNamePair[] {
    const filterValue = value;
    return this.generic_Name.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_therapeutic_Category(value: string): IdNamePair[] {
    const filterValue = value;
    return this.therapeutic_Category.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_physician_Focus(value: string): IdNamePair[] {
    const filterValue = value;
    return this.physician_Focus.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter_name_of_cso(value: string): IdNamePair[] {
    const filterValue = value;
    return this.name_of_cso.filter(option => option.name.toLowerCase().startsWith(filterValue));
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

  isDifferent(fieldName: string): boolean {
    const formValue = this.productForm.get(fieldName)?.value ? this.productForm.get(fieldName)?.value
      : this.data.product[fieldName as keyof DataManagerProduct];
    const productionValue = this.productionData ? this.productionData[fieldName] : '';

    if (fieldName = 'specialty_Physicians_Targeted' && formValue && Array.isArray(formValue) && productionValue) {
      let formValueCSV = formValue.join(', ');
      return formValueCSV != productionValue;
    }

    if ((formValue === null || formValue === undefined || formValue === '') &&
      (productionValue === null || productionValue === undefined || productionValue === '')) {
      return false;
    }
    if(formValue==0 && (productionValue === null || productionValue === undefined || productionValue === '')){
      return false;
    }

    
    return formValue !== productionValue;
  }

}
