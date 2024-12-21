import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, startWith, map } from 'rxjs';
import { GetDMSalesforceRecordsFilters, getNotes, getDataManagerItemById, addUpdateCitation, addUpdateNotes, addUpdateMasterCode } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { DataManagerProduct } from '../../../../models/datamanagerproduct';
import { notes } from '../../../../models/notes';
import { IdNamePair, SalesforceData } from '../../../../models/salesforcedata';
import { ApiService } from '../../../../services/Api/api.service';
import { ToasterService } from '../../../../services/common/toaster.service';
import { CitationPopupComponent } from '../citation-popup/citation-popup.component';
//import { DataManagerAddPopupComponent } from '../data-manager-add-popup/data-manager-add-popup.component';
import { DataManagerProductEditPopupComponent } from '../data-manager-product-edit-popup/data-manager-product-edit-popup.component';
import { NotesPopupComponent } from '../notes-popup/notes-popup.component';
import { StorageService } from '../../../../services/common/storage.service';
import { DataManagerAddSalesforcePopupComponent } from '../../data-manager-add-salesforce-popup/data-manager-add-salesforce-popup.component';

@Component({
  selector: 'app-qc-queue-action-popup',
  templateUrl: './qc-queue-action-popup.component.html',
  styleUrls: ['./qc-queue-action-popup.component.scss']
})

//IMPORTANT: Not using this component anymore
export class QcQueueActionPopupComponent implements OnInit {

  isOpenEditDMSidebar = false;
  currentData:any;
  productItems: DataManagerProduct[] = [];
  notesItems: notes[] = [];
  productionData:any;
  dataManagerForm: FormGroup;
  coPromotionHint = '';
  salesForceHint = '';
  currentUser:any;

  salesforce_Name: IdNamePair[] = [];
  countries_Names: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  period_Years: IdNamePair[] = [];
  period_Quarters: number[] = [1,2,3,4];
  type_of_salesforce: IdNamePair[] = [];

  filteredSalesForceOptions: Observable<IdNamePair[]> | undefined;
  filteredYearsOptions: Observable<IdNamePair[]> | undefined;

 

  salesforce_Id = '';
  displayedColumns: string[] = [
    'select',
    'uS_Product_Name_Product_Promoted',
    'country_Specific_Product_Name_Product_Promoted',
    'generic_Name',
    'therapeutic_Category',
    'product_Promotion_Priority_Order',
    'total_Number_of_Full_Time_Equivalents_FTEs',
    'primary_Care_Full_Time_Equivalents_FTEs',
    'specialty_Full_Time_Equivalents_FTEs',
    'physicians_Focus_Primary_Care_Physicians_Specialty_Physicians',
    'specialty_Physicians_Targeted',
    'co_Promotion_YesNo',
    'name_of_a_Partner_Company',
    'contract_Sales_Force_YesNo',
    'name_of_a_CSO_Contract_Sales_Organization',
    'additional_Notes_Product'
  ];

  displayedNotesColumns: string[] = [
    'column_name',
    'note_for',
    'type',
    'description',
    'full_Name',
    'company_Name',
    'country_Name',
    'salesforce_Name',
    'period_Year',
    'period_Quarter'
  ];

  productdataSource = new MatTableDataSource<DataManagerProduct>(this.productItems);

  notesdataSource = new MatTableDataSource<notes>(this.notesItems);

  constructor(public dialogRef: MatDialogRef<DataManagerAddSalesforcePopupComponent>, private dialog: MatDialog, public fb: FormBuilder,
    private cdr: ChangeDetectorRef,private apiService: ApiService,
    private storageService:StorageService,private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: { dataManager: SalesforceData }) {
     

      this.salesforce_Id = data.dataManager.daDatabase_Salesforce_Id;

      this.dataManagerForm = this.fb.group({
        dADatabase_Salesforce_Id: [data.dataManager.daDatabase_Salesforce_Id],
        country_Name: [data.dataManager.country_Name,[Validators.required]],
        company_Name: [data.dataManager.company_Name,[Validators.required]],
        period_Year: [data.dataManager.period_Year,[Validators.required]],
        period_Quarter: [data.dataManager.period_Quarter,[Validators.required]],
        salesforce_Name: [data.dataManager.salesforce_Name,[Validators.required]],
        type_of_Salesforce: [data.dataManager.type_of_Salesforce,[Validators.required]],
        number_Of_Sales_Representatives: [data.dataManager.number_Of_Sales_Representatives > 0 ? data.dataManager.number_Of_Sales_Representatives : null,[Validators.required]],
        number_Of_District_Managers: [data.dataManager.number_Of_District_Managers > 0 ? data.dataManager.number_Of_District_Managers : null,[Validators.required]],
        number_Of_Regional_Managers: [data.dataManager.number_Of_Regional_Managers > 0 ? data.dataManager.number_Of_Regional_Managers : null,[Validators.required]],
        salary_Low: [data.dataManager.salary_Low > 0 ? data.dataManager.salary_Low : null,[Validators.required]],
        salary_High: [data.dataManager.salary_High > 0 ? data.dataManager.salary_High : null,[Validators.required]],
        target_Bonus: [data.dataManager.target_Bonus > 0 ? data.dataManager.target_Bonus : null,[Validators.required]],
        reach: [data.dataManager.reach > 0 ? data.dataManager.reach : null,[Validators.required]],
        frequency: [data.dataManager.frequency > 0 ? data.dataManager.frequency : null,[Validators.required]],
        additional_Notes: [data.dataManager.additional_Notes_Salesforce],
        pct_Split_Between_Primary_Care_And_Specialty: [data.dataManager.pct_Split_Between_Primary_Care_And_Specialty > 0 ? data.dataManager.pct_Split_Between_Primary_Care_And_Specialty : null],
        productItems: this.fb.array([]) 
      });

      this.isOpenEditDMSidebar = true;
      if(data.dataManager && data.dataManager.daDatabase_Product_Id.length > 0){
       this.getDataManagerDetail(data.dataManager.daDatabase_Product_Id.trim());
      }
     }


     ngOnInit(): void {
      this.currentUser = this.storageService.UserDetails;
      this.getSalesForceNotes();
      this.bindMasterCodes();
    }
  
  
    bindMasterCodes(){
      let data = {};
      this.apiService
        .PostAll(GetDMSalesforceRecordsFilters, data)
        .subscribe((response: ApiResponse) => {
          if (response.status) {
            this.companies_Names = response.result.company_Name;
            this.countries_Names = response.result.country_Name;
            this.salesforce_Name = response.result.salesForce_Name;
            this.period_Years = response.result.period_Year;
            this.type_of_salesforce = response.result.type_of_salesforce;
          }
  
          this.executeFilters();
        });
    }
  
    executeFilters(){
      this.filteredSalesForceOptions = this.dataManagerForm.get('salesforce_Name')?.valueChanges.pipe(
        startWith(''),
        map(value => this._filterSalesForce(value || '')),
      );

      this.filteredYearsOptions = this.dataManagerForm.get('period_Year')?.valueChanges.pipe(
        startWith(''),
        map(value => this._filterYears(value || '')),
      );
  
    }
  
    private _filterSalesForce(value: string): IdNamePair[] {
      const filterValue = value;
      return this.salesforce_Name.filter(option => option.name.toLowerCase().startsWith(filterValue));
    }
  
    private _filterYears(value: number): IdNamePair[] {
      const filterValue = value;
      return this.period_Years.filter(option => option.name.toLowerCase().startsWith(filterValue.toString()));
    }

  getSalesForceNotes(){
    let data = {
      user_id: this.currentUser.id,
      daDatabase_Salesforce_Id: this.salesforce_Id,
      daDatabase_Product_id: "",
      security_Token: ""
    }

    this.apiService.PostAll(getNotes,data,true).subscribe(result=>{
      if(result.status){
        this.notesItems = result.result;
        this.notesdataSource = new MatTableDataSource<notes>(this.notesItems);
      }
    });
  }

  getDataManagerDetail(daDatabase_Product_Id:string){
    let data = {
      daDatabase_Product_Id: daDatabase_Product_Id,
    }
    this.apiService.PostAll(getDataManagerItemById,data,true).subscribe(result=>{
      if(result.status){
        this.productItems = result.result;
        const productItemsArray = this.dataManagerForm.get('productItems') as FormArray;
        productItemsArray.clear(); 
        this.productItems.forEach(item => {
      
          productItemsArray.push(this.fb.group(item));
        });
        this.productdataSource = new MatTableDataSource<DataManagerProduct>(this.productItems);
      }
    });
  }

  onCloseClick(): void {
    this.isOpenEditDMSidebar = false;
    this.dialogRef.close();
  }

  openEditProductDialog(item:any){
    const dialogRef = this.dialog.open(DataManagerProductEditPopupComponent, {
      height: '0%',
      data: { product: item
      }
    });
  
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        if(result){

          this.productItems.forEach(item => {
            if(item.daDatabase_Product_Id == result.dADatabase_Product_Id){
              let index = this.productItems.indexOf(item);
              this.productItems[index] = result;
            }
            
          });
          this.refreshProducts();
        }
      }
    });
  }

  refreshProducts(){
    this.productdataSource = new MatTableDataSource<DataManagerProduct>(this.productItems);
    const productItemsArray = this.dataManagerForm.get('productItems') as FormArray;
    productItemsArray.clear(); 
    this.productItems.forEach(item => {
      productItemsArray.push(this.fb.group(item));
    });
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    
    if(tabChangeEvent.index == 2){
      this.getSalesForceNotes();
    } 
  }

  openCitationPopup(column_name:string){
    let columDetail = {
      column_name:column_name.toLowerCase(),
      salesforceId : this.salesforce_Id,
      productId: ''
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

  openNotesPopup(column_name:string){
    let columDetail = {
      column_name:column_name,
      salesforceId : this.salesforce_Id
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
          column_name: result.column_name,
          description: result.description,
          note_for: '',
          type:'salesforce'

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
      name: this.dataManagerFormControls[name].value.toString(),
      category: category
    }
    if(request.name){
      this.apiService.Create(addUpdateMasterCode,request).subscribe((response:ApiResponse) => {
        if(response.status){
          this.toasterService.showSuccess(response.message);
          this.bindMasterCodes();
        }else{
          this.toasterService.showError(response.message);
        }
      });
    }else{
      this.toasterService.showError('please do not add blank value');
    }
  
  }

  get dataManagerFormControls() { return this.dataManagerForm.controls; }


}
