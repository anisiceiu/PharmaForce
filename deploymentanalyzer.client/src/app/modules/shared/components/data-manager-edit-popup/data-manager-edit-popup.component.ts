import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalesforceData, IdNamePair } from '../../../../models/salesforcedata';
//import { DataManagerAddPopupComponent } from '../data-manager-add-popup/data-manager-add-popup.component';
import { ApiService } from '../../../../services/Api/api.service';
import { getDMCompaniesForCountry, getDMPeriodSalesforceForCompany, deleteDMProductRecord, GetDMSalesforceRecordsFilters, addUpdateCitation, addUpdateMasterCode, addUpdateNotes, getDataManagerItemById, getNotes, getProductionDataManagerItemById, GetMasterCodeRecords } from '../../../../constants/api.constant';
import { MatTableDataSource } from '@angular/material/table';
import { DataManagerProduct } from '../../../../models/datamanagerproduct';
import { DataManagerProductEditPopupComponent } from '../data-manager-product-edit-popup/data-manager-product-edit-popup.component';
import { CitationPopupComponent } from '../citation-popup/citation-popup.component';
import { ToasterService } from '../../../../services/common/toaster.service';
import { NotesPopupComponent } from '../notes-popup/notes-popup.component';
import { notes } from '../../../../models/notes';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, map, of, startWith } from 'rxjs';
import { ApiResponse } from '../../../../models/ApiResponse';
//import { DataManagerProductAddPopupComponent } from '../data-manager-product-add-popup/data-manager-product-add-popup.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { StorageService } from '../../../../services/common/storage.service';
import { DataManagerAddSalesforcePopupComponent } from '../../data-manager-add-salesforce-popup/data-manager-add-salesforce-popup.component';
import { DataManagerAddProductPopupComponent } from '../../data-manager-add-product-popup/data-manager-add-product-popup.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SalesforceOption } from '../../../../models/SalesforceOption';
import { MasterCode } from '../../../../models/mastercode';
import moment from 'moment';



@Component({
  selector: 'app-data-manager-edit-popup',
  templateUrl: './data-manager-edit-popup.component.html',
  styleUrls: ['./data-manager-edit-popup.component.scss']
})
export class DataManagerEditPopupComponent implements OnInit {
 
  isOpenEditDMSidebar = false;
  isExpandedProductListExpansionPanel = false;
  currentData:any;
  productItems: DataManagerProduct[] = [];
  notesItems: notes[] = [];
  productionData:any;
  dataLoaded: boolean = false;
  dataManagerForm: FormGroup;
  coPromotionHint = '';
  salesForceHint = '';
  isAddToQCQ = true;

  salesforce_Name: SalesforceOption[] = [];
  countries_Names: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  period_Years: IdNamePair[] = [];
  period_Quarters: number[] = [1,2,3,4];
  type_of_salesforce: IdNamePair[] = [];
  salesforce_NameNarrow: IdNamePair[] = [];
  companies_NamesNarrow: IdNamePair[] = [];
  period_YearsNarrow: IdNamePair[] = [];
  periodSalesforceForCompany: any = [];
  currencySymbol_Name: IdNamePair[] = [];
  currency_symbol: string = '';

  filteredSalesForceOptions: Observable<IdNamePair[]> | undefined;
  filteredYearsOptions: Observable<IdNamePair[]> | undefined;

  currentUser:any;

  salesforce_Id = '';
  product_Id = '';
  displayedColumns: string[] = [
    'select',
    'daDatabase_Product_Id',
    'uS_Product_Name_Product_Promoted',
    'country_Specific_Product_Name_Product_Promoted',
    'generic_Name',
    'therapeutic_Category',
    'primary_Care_Full_Time_Equivalents_FTEs',
    'specialty_Full_Time_Equivalents_FTEs',
    'total_Number_of_Full_Time_Equivalents_FTEs',
    'physicians_Focus_Primary_Care_Physicians_Specialty_Physicians',
    'specialty_Physicians_Targeted',
    'co_Promotion_YesNo',
    'name_of_a_Partner_Company',
    'contract_Sales_Force_YesNo',
    'name_of_a_CSO_Contract_Sales_Organization',
    'additional_Notes_Product',
    'product_added_date',
    'product_added_by_name'
  ];

  displayedNotesColumns: string[] = [
    'column_name',
    'description',
    'full_Name',
    'company_Name',
    'country_Name',
    'salesforce_Name',
    'period_Year',
    'period_Quarter',
    'added_Dt'
  ];

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

  productdataSource = new MatTableDataSource<DataManagerProduct>(this.productItems);

  notesdataSource = new MatTableDataSource<notes>(this.notesItems);

  isEditable: boolean = true;
  currentQuarter: number = 0;
  currentYear: number = 0;
  mastercodePeriods!: IdNamePair[];

  @ViewChild('notePaginator') paginator!: MatPaginator;
  @ViewChild('productPaginator') productPaginator!: MatPaginator;
  @ViewChild('noteSort') sort: MatSort = new MatSort();
  @ViewChild('productSort') productSort: MatSort = new MatSort();

  constructor(public dialogRef: MatDialogRef<DataManagerAddSalesforcePopupComponent>, private dialog: MatDialog, public fb: FormBuilder,
    private cdr: ChangeDetectorRef,private apiService: ApiService, 
    private toasterService: ToasterService,private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { dataManager: SalesforceData, openedFrom:string }) {

      this.salesforce_Id = data.dataManager.daDatabase_Salesforce_Id;
      this.product_Id = data.dataManager.daDatabase_Product_Id;

        if (data.openedFrom && data.openedFrom == 'QCQueueList') {
          this.isEditable = false;
        }


      this.dataManagerForm = this.fb.group({
        dADatabase_Salesforce_Id: [data.dataManager.daDatabase_Salesforce_Id],
        country_Name: [data.dataManager.country_Name,[Validators.required]],
        company_Name: [data.dataManager.company_Name,[Validators.required]],
        period_Year: [data.dataManager.period_Year,[Validators.required]],
        period_Quarter: [data.dataManager.period_Quarter,[Validators.required]],
        salesforce_Name: [data.dataManager.salesforce_Name,[Validators.required]],
        type_of_Salesforce: [data.dataManager.type_of_Salesforce,[Validators.required]],
        number_Of_Sales_Representatives: [data.dataManager.number_Of_Sales_Representatives > 0 ? data.dataManager.number_Of_Sales_Representatives : 0,[Validators.required]],
        number_Of_District_Managers: [data.dataManager.number_Of_District_Managers > 0 ? data.dataManager.number_Of_District_Managers : null],
        number_Of_Regional_Managers: [data.dataManager.number_Of_Regional_Managers > 0 ? data.dataManager.number_Of_Regional_Managers : null],
        salary_Low: [data.dataManager.salary_Low > 0 ? data.dataManager.salary_Low : null],
        salary_High: [data.dataManager.salary_High > 0 ? data.dataManager.salary_High : null],
        target_Bonus: [data.dataManager.target_Bonus > 0 ? data.dataManager.target_Bonus : null],
        reach: [data.dataManager.reach > 0 ? data.dataManager.reach : null],
        frequency: [data.dataManager.frequency > 0 ? data.dataManager.frequency : null],
        additional_Notes: [data.dataManager.additional_Notes_Salesforce],
        pct_Split_Between_Primary_Care_And_Specialty: [data.dataManager.pct_Split_Between_Primary_Care_And_Specialty > 0 ? data.dataManager.pct_Split_Between_Primary_Care_And_Specialty : null],
        productItems: this.fb.array([]),
        isAddToQCQ: [this.isAddToQCQ],
        periodList:[]
      });

      this.isOpenEditDMSidebar = true;
      this.isExpandedProductListExpansionPanel = true;
    if (data.dataManager && data.dataManager.daDatabase_Salesforce_Id.length > 0) {
      this.getDataManagerDetail(data.dataManager.daDatabase_Product_Id.trim(), data.dataManager.daDatabase_Salesforce_Id.trim());
      this.getProductionDataManagerDetail(data.dataManager.daDatabase_Product_Id.trim(), data.dataManager.daDatabase_Salesforce_Id.trim());
      }
     }

     ngOnInit(): void {
      this.currentUser = this.storageService.UserDetails;
      this.getSalesForceNotes();
       this.bindMasterCodes();

       this.currentQuarter = moment().quarter();
       this.currentYear = moment().year();

       this.loadPeriodMasterCodes();
  }

  getStandardizeColumnName(columnName: string) {
    let col = this.standardColumnList.filter(c => c.key.toLowerCase() == columnName.toLowerCase());
    if (col && col.length)
      return col[0].value;
    else
      return columnName;
  }

  isCurrentPeriod() {

    let selectedPeriodYear = Number(this.dataManagerForm.controls['period_Year'].value);
    let selectedPeriodQuarter = Number(this.dataManagerForm.controls['period_Quarter'].value);

    if (selectedPeriodYear == this.currentYear && selectedPeriodQuarter == this.currentQuarter) {
      return true;
    }
    else {
      this.dataManagerForm.controls['periodList'].setValue(null);
      return;
    }
    
  }

  onAddToQCQChange() {
    this.dataManagerForm.controls['isAddToQCQ'].setValue(this.isAddToQCQ);
  }

  onCountry_NameChange(country_name: string) {
    this.apiService.PostAll(getDMCompaniesForCountry, { user_id: this.currentUser.id, security_token: '', country_name: country_name }).subscribe(response => {
      if (response && response.status) {
        this.companies_NamesNarrow = this.companies_Names.filter(i => response.result.findIndex((c: { company_Name: string; }) => c.company_Name == i.name) > -1);
        //pre-select
        if (this.data.dataManager.company_Name && this.companies_NamesNarrow.findIndex(c => c.name == this.data.dataManager.company_Name) > -1) {
          this.onCompany_NameChange(this.data.dataManager.company_Name);
        }
        else {
          this.data.dataManager.company_Name = '';
          this.dataManagerForm.controls['company_Name'].setValue(null);
        }
      }
    });

    let country = this.countries_Names.filter(c => c.name == country_name);
    if (country && country.length) {
      let selected = country[0];
      let selectedCurrency = this.currencySymbol_Name.filter(c => c.id == selected.id);
      if (selectedCurrency && selectedCurrency.length)
        this.currency_symbol = selectedCurrency[0].name;
    }
  }

  onCompany_NameChange(company_name: string) {
    this.apiService.PostAll(getDMPeriodSalesforceForCompany, { user_id: this.currentUser.id, security_token: '', country_Name: this.dataManagerForm.controls['country_Name'].value, company_name: company_name }).subscribe(response => {
      if (response && response.status) {
        this.periodSalesforceForCompany = response.result;
        //this.period_YearsNarrow = this.period_Years.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; }) => c.period_Year == i.name) > -1);
        this.salesforce_NameNarrow = this.salesforce_Name.filter(c => this.periodSalesforceForCompany.findIndex((u: { salesForce_Name: string; }) => u.salesForce_Name == c.name && c.company == company_name && c.country == this.dataManagerForm.controls['country_Name'].value) > -1);
        //pre-select
        if (this.data.dataManager.period_Year && this.period_YearsNarrow.findIndex(c => c.name == this.data.dataManager.period_Year.toString()) > -1) {
          this.onPeriod_YearChange(this.data.dataManager.period_Year.toString());
          this.dataManagerForm.controls['period_Year'].setValue(this.data.dataManager.period_Year.toString());
        }
        else {
          this.data.dataManager.period_Year = 0;
          this.dataManagerForm.controls['period_Year'].setValue(null);
        }

        if (this.data.dataManager.salesforce_Name && this.salesforce_NameNarrow.findIndex(c => c.name == this.data.dataManager.salesforce_Name) == -1) {
          this.data.dataManager.salesforce_Name = '';
          this.dataManagerForm.controls['salesforce_Name'].setValue(null);
        }

      }
    });
  }

  onPeriod_YearChange(periodYear: string) {
    //this.salesforce_NameNarrow = this.salesforce_NameNarrow.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; period_Quarter: string, salesForce_Name: string }) => c.period_Year == periodYear && c.salesForce_Name == i.name) > -1);
    //pre-select
    if (this.data.dataManager.period_Quarter) {
      this.onPeriod_QuarterChange(this.data.dataManager.period_Quarter.toString());
    }

    if (this.data.dataManager.salesforce_Name && this.salesforce_NameNarrow.findIndex(c => c.name == this.data.dataManager.salesforce_Name) == -1) {
      this.data.dataManager.salesforce_Name = '';
      this.dataManagerForm.controls['salesforce_Name'].setValue(null);
    }

  }

  onPeriod_QuarterChange(periodQuarter: string) {
    //this.salesforce_NameNarrow = this.salesforce_NameNarrow.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; period_Quarter: string, salesForce_Name: string }) => c.period_Year == this.dataManagerForm.controls['period_Year'].value && c.period_Quarter == periodQuarter && c.salesForce_Name == i.name) > -1);
    if (this.data.dataManager.salesforce_Name && this.salesforce_NameNarrow.findIndex(c => c.name == this.data.dataManager.salesforce_Name) == -1) {
      this.data.dataManager.salesforce_Name = '';
      this.dataManagerForm.controls['salesforce_Name'].setValue(null);
    }
  }
  
  deleteProduct(item: any) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'Product',
          id: item,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productItems = this.productItems.filter(i => i != item);
        this.productdataSource.data = this.productItems;
        this.refreshProducts();
      }
    });

      
    
  }

  loadPeriodMasterCodes() {
    let data = { category: 'Period' }
    this.apiService.PostAll(GetMasterCodeRecords, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.mastercodePeriods = response.result.map(function (v: MasterCode) {
          return {
            id: v.id,
            name: v.name
          };
        });
      }

    });
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
            this.currencySymbol_Name = response.result.currency_Symbol;

            this.period_YearsNarrow = this.period_Years;

            //pre-select all
            if (this.data.dataManager.country_Name) {
              this.onCountry_NameChange(this.data.dataManager.country_Name);
            }
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
      return this.salesforce_NameNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue));
    }
  
    private _filterYears(value: number): IdNamePair[] {
      const filterValue = value;
      return this.period_YearsNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue.toString()));
    }

  getSalesForceNotes(){
    let data = {
      user_id: this.currentUser.id,
      daDatabase_Salesforce_Id: this.salesforce_Id,
      daDatabase_Product_id: "",
      security_Token: ""
    }

    this.apiService.PostAll(getNotes, data, true).subscribe(response =>{
      if (response.status){
        this.notesItems = this.getStandardizeNoteList(response.result);
        this.notesdataSource = new MatTableDataSource<notes>(this.notesItems);
        this.notesdataSource.paginator = this.paginator;
        this.notesdataSource.sort = this.sort;
      }
    });
  }

  getStandardizeNoteList(list: any[]) {
    let noteList = list.map(item => ({ ...item, column_name: this.getStandardizeColumnName(item.column_name) }));
    return noteList;
  }

  getDataManagerDetail(daDatabase_Product_Id: string, dADatabase_Salesforce_Id:string){
    let data = {
      daDatabase_Product_Id: daDatabase_Product_Id,
      dADatabase_Salesforce_Id: dADatabase_Salesforce_Id
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
        this.productdataSource.paginator = this.productPaginator;
        this.productdataSource.sort = this.productSort;
      }
    });
  }

  getProductionDataManagerDetail(daDatabase_Product_Id: string, dADatabase_Salesforce_Id: string) {
    let data = {
      daDatabase_Product_Id: daDatabase_Product_Id,
      dADatabase_Salesforce_Id: dADatabase_Salesforce_Id
    };
    this.apiService
      .PostAll(getProductionDataManagerItemById, data, true)
      .subscribe((result) => {
        if (result.status) {
          this.dataLoaded = true;
          this.productionData = result.result[0];
        }
      });
  }

  shouldHighlight(fieldName: string): boolean {
    if (!this.dataLoaded || !this.productionData) {
      return false;
    }
    
    const currentValue = this.dataManagerForm.get(fieldName)?.value;
    const productionValue = this.productionData[fieldName];

    // Convert both values to the same type (string) for comparison
    return String(currentValue) !== String(productionValue);
  }


  isDifferent(fieldName: string): boolean {
    const formValue = this.dataManagerForm.get(fieldName)?.value ? this.dataManagerForm.get(fieldName)?.value
      : this.productItems && this.productItems.length && this.productItems[0][fieldName as keyof DataManagerProduct];
    const productionValue = this.productionData ? this.productionData[fieldName != 'additional_Notes' ? fieldName : 'additional_Notes_Salesforce'] : '';

    if ((formValue == null || formValue == undefined || formValue == '') &&
      (productionValue == null || productionValue == undefined || productionValue == '')) {
      return false;
    }
    if(formValue==0 && (productionValue == null || productionValue == undefined || productionValue == '')){
      return false;
    }
    return formValue != productionValue;
  }

  onCloseClick(): void {
    this.isOpenEditDMSidebar = false;
    this.dialogRef.close();
  }

  openEditProductDialog(item:any){
    const dialogRef = this.dialog.open(DataManagerProductEditPopupComponent, {
      height: '0%',
      data: {
        product: item, productionproduct: this.productionData, openedFrom: this.data?.openedFrom
      }
    });
  
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        if(result){

          this.productItems.forEach(item => {
            if(item.daDatabase_Product_Id == result.daDatabase_Product_Id){
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
      if (Array.isArray(item?.specialty_Physicians_Targeted)) {
        item.specialty_Physicians_Targeted = item?.specialty_Physicians_Targeted.join(', ');
      }
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

  toggleProductListExpansionPanel() {
    this.isExpandedProductListExpansionPanel =
      !this.isExpandedProductListExpansionPanel;
  }

  getEmptyProduct() {
    let product: DataManagerProduct = {
      daDatabase_Product_Id: '',
      daDatabase_Salesforce_Id: this.salesforce_Id,
      uS_Product_Name_Product_Promoted: '',
      country_Specific_Product_Name_Product_Promoted: '',
      generic_Name: '',
      therapeutic_Category: '',
      product_Promotion_Priority_Order: null,
      total_Number_of_Full_Time_Equivalents_FTEs: 0,
      primary_Care_Full_Time_Equivalents_FTEs: 0,
      specialty_Full_Time_Equivalents_FTEs: 0,
      physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: '',
      specialty_Physicians_Targeted: '',
      co_Promotion_YesNo: null,
      name_of_a_Partner_Company: '',
      contract_Sales_Force_YesNo: null,
      name_of_a_CSO_Contract_Sales_Organization: '',
      additional_Notes_Product: '',
      uS_Product_Name_Product_Promoted_qcq: null,
      country_Specific_Product_Name_Product_Promoted_qcq: null,
      generic_Name_qcq: null,
      therapeutic_Category_qcq: null,
      product_Promotion_Priority_Order_qcq: null,
      total_Number_of_Full_Time_Equivalents_FTEs_qcq: null,
      primary_Care_Full_Time_Equivalents_FTEs_qcq: null,
      specialty_Full_Time_Equivalents_FTEs_qcq: null,
      physicians_Focus_Primary_Care_Physicians_Specialty_Physicians_qcq: null,
      specialty_Physicians_Targeted_qcq: null,
      co_Promotion_YesNo_qcq: null,
      name_of_a_Partner_Company_qcq: null,
      contract_Sales_Force_YesNo_qcq: null,
      name_of_a_CSO_Contract_Sales_Organization_qcq: null
    };

    return product;
  }

  openAddEditPopup(item?: DataManagerProduct) {
    const dialogRef = this.dialog.open(DataManagerAddProductPopupComponent, {
      height: '0%',
      data: {
        product: item ? item : this.getEmptyProduct()
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        if(result){
         this.productItems.push(result);
         this.refreshProducts();
        }
      }
    });
  }

  get dataManagerFormControls() { return this.dataManagerForm.controls; }

}
