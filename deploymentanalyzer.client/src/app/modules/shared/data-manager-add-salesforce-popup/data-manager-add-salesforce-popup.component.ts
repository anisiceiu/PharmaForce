import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DataManagerProduct } from '../../../models/datamanagerproduct';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdNamePair, SalesforceData } from '../../../models/salesforcedata';
import { Observable, map, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { StorageService } from '../../../services/common/storage.service';
import { ToasterService } from '../../../services/common/toaster.service';
//import { DataManagerProductAddPopupComponent } from '../components/data-manager-product-add-popup/data-manager-product-add-popup.component';
import { GetDMSalesforceRecordsFilters, addUpdateCitation, addUpdateMasterCode, addUpdateNotes, getDMCompaniesForCountry, getDMPeriodSalesforceForCompany } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { NotesPopupComponent } from '../components/notes-popup/notes-popup.component';
import { CitationPopupComponent } from '../components/citation-popup/citation-popup.component';
import { DataManagerProductEditPopupComponent } from '../components/data-manager-product-edit-popup/data-manager-product-edit-popup.component';
import { DeleteDialogComponent } from '../components/delete-dialog/delete-dialog.component';
import { v4 as uuidv4 } from 'uuid';
import { DataManagerAddProductPopupComponent } from '../data-manager-add-product-popup/data-manager-add-product-popup.component';
import { SalesforceOption } from '../../../models/SalesforceOption';

@Component({
  selector: 'app-data-manager-add-salesforce-popup',
  templateUrl: './data-manager-add-salesforce-popup.component.html',
  styleUrl: './data-manager-add-salesforce-popup.component.css'
})
export class DataManagerAddSalesforcePopupComponent implements OnInit {
  isOpenEditDMSidebar = false;
  isExpandedProductListExpansionPanel = false;
  currentData: any;
  productItems: DataManagerProduct[] = [];
  dataManagerForm: FormGroup;
  coPromotionHint = '';
  salesForceHint = '';
  isAddToQCQ = true;

  salesforce_Name: SalesforceOption[] = [];
  countries_Names: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  period_Years: IdNamePair[] = [];
  period_Quarters: number[] = [1, 2, 3, 4];
  type_of_salesforce: IdNamePair[] = [];
  salesforce_NameNarrow: IdNamePair[] = [];
  companies_NamesNarrow: IdNamePair[] = [];
  period_YearsNarrow: IdNamePair[] = [];
  periodSalesforceForCompany: any = [];
  currencySymbol_Name: IdNamePair[] = [];
  currency_symbol: string='';

  filteredSalesForceOptions: Observable<IdNamePair[]> | undefined;
  filteredYearsOptions: Observable<IdNamePair[]> | undefined;

  currentUser: any;

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
    'additional_Notes_Product'
  ];

  productdataSource = new MatTableDataSource<DataManagerProduct>(this.productItems);
  constructor(public dialogRef: MatDialogRef<DataManagerAddSalesforcePopupComponent>, private dialog: MatDialog, public fb: FormBuilder,
    private cdr: ChangeDetectorRef, private apiService: ApiService,
    private toasterService: ToasterService, private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { dataManager: SalesforceData }) {

    this.salesforce_Id = uuidv4();
    
    this.dataManagerForm = this.fb.group({
      dADatabase_Salesforce_Id: [this.salesforce_Id],
      country_Name: ['', [Validators.required]],
      company_Name: ['', [Validators.required]],
      period_Year: [null, [Validators.required]],
      period_Quarter: [null, [Validators.required]],
      salesforce_Name: ['', [Validators.required]],
      type_of_Salesforce: ['', [Validators.required]],
      number_Of_Sales_Representatives: [ 0, [Validators.required]],
      number_Of_District_Managers: [null],
      number_Of_Regional_Managers: [null],
      salary_Low: [null],
      salary_High: [null],
      target_Bonus: [null],
      reach: [null],
      frequency: [null],
      additional_Notes: [null],
      pct_Split_Between_Primary_Care_And_Specialty: [null],
      productItems: this.fb.array([]),
      isAddToQCQ: [this.isAddToQCQ]
    });

    this.isOpenEditDMSidebar = true;
    this.isExpandedProductListExpansionPanel = true;
    
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.bindMasterCodes();
  }

  onCountry_NameChange(country_name: string) {
    this.apiService.PostAll(getDMCompaniesForCountry, { user_id: this.currentUser.id, security_token: '', country_name: country_name }).subscribe(response => {
      if (response && response.status) {
        this.companies_NamesNarrow = this.companies_Names.filter(i => response.result.findIndex((c: { company_Name: string; }) => c.company_Name == i.name) > -1);
        
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
        if (this.dataManagerForm.controls['salesforce_Name'].value && this.salesforce_NameNarrow.findIndex(c => c.name == this.dataManagerForm.controls['salesforce_Name'].value) == -1) {
          this.dataManagerForm.controls['salesforce_Name'].setValue(null);
        }
      }
    });
  }

  onPeriod_YearChange(periodYear: string) {
    //this.salesforce_NameNarrow = this.salesforce_NameNarrow.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; period_Quarter: string, salesForce_Name: string }) => c.period_Year == periodYear && c.salesForce_Name == i.name) > -1);
    if (this.dataManagerForm.controls['salesforce_Name'].value && this.salesforce_NameNarrow.findIndex(c => c.name == this.dataManagerForm.controls['salesforce_Name'].value) == -1) {
      this.dataManagerForm.controls['salesforce_Name'].setValue(null);
    }
  }

  onPeriod_QuarterChange(periodQuarter: string) {
    //this.salesforce_NameNarrow = this.salesforce_NameNarrow.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; period_Quarter: string, salesForce_Name: string }) => c.period_Year == this.dataManagerForm.controls['period_Year'].value && c.period_Quarter == periodQuarter && c.salesForce_Name == i.name) > -1);
    if (this.dataManagerForm.controls['salesforce_Name'].value && this.salesforce_NameNarrow.findIndex(c => c.name == this.dataManagerForm.controls['salesforce_Name'].value) == -1) {
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


  bindMasterCodes() {
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
         
        }

        this.executeFilters();
      });
  }

  executeFilters() {
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
  onCloseClick(): void {
    this.isOpenEditDMSidebar = false;
    this.dialogRef.close();
  }

  openEditProductDialog(item: any) {
    const dialogRef = this.dialog.open(DataManagerProductEditPopupComponent, {
      height: '0%',
      data: {
        product: item
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        if (result) {

          this.productItems.forEach(item => {
            if (item.daDatabase_Product_Id == result.daDatabase_Product_Id) {
              let index = this.productItems.indexOf(item);
              this.productItems[index] = result;
            }

          });
          this.refreshProducts();
        }
      }
    });
  }

  refreshProducts() {
    this.productdataSource = new MatTableDataSource<DataManagerProduct>(this.productItems);
    const productItemsArray = this.dataManagerForm.get('productItems') as FormArray;
    productItemsArray.clear();
    this.productItems.forEach(item => {
      productItemsArray.push(this.fb.group(item));
    });
  }

  openCitationPopup(column_name: string) {
    let columDetail = {
      column_name: column_name.toLowerCase(),
      salesforceId: this.salesforce_Id,
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
        this.apiService.PostAll(addUpdateCitation, request, true).subscribe(result => {
          if (result.status) {
            this.toasterService.showSuccess(result.message);
          } else {
            this.toasterService.showError(result.message);
          }
        });

      }
    });
  }

  openNotesPopup(column_name: string) {
    let columDetail = {
      column_name: column_name,
      salesforceId: this.salesforce_Id
    }
    const dialogRef = this.dialog.open(NotesPopupComponent, {
      height: '0%',
      data: { columDetail: columDetail }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        let request = {
          id: 0,
          user_id: this.currentUser.id,
          daDatabase_Salesforce_Id: result.daDatabase_Salesforce_Id,
          column_name: result.column_name,
          description: result.description,
          note_for: '',
          type: 'salesforce'

        }
        this.apiService.PostAll(addUpdateNotes, request, true).subscribe(result => {
          if (result.status) {
            this.toasterService.showSuccess(result.message);
          } else {
            this.toasterService.showError(result.message);
          }
        });

      }
    });
  }

  onAddToQCQChange() {
    this.dataManagerForm.controls['isAddToQCQ'].setValue(this.isAddToQCQ);
  }

  addMasterCode(name: string, category: string) {
    let request = {
      name: this.dataManagerFormControls[name].value.toString(),
      category: category
    }
    if (request.name) {
      this.apiService.Create(addUpdateMasterCode, request).subscribe((response: ApiResponse) => {
        if (response.status) {
          this.toasterService.showSuccess(response.message);
          this.bindMasterCodes();
        } else {
          this.toasterService.showError(response.message);
        }
      });
    } else {
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
      total_Number_of_Full_Time_Equivalents_FTEs: null,
      primary_Care_Full_Time_Equivalents_FTEs: null,
      specialty_Full_Time_Equivalents_FTEs: null,
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
        if (result) {
          this.productItems.push(result);
          this.refreshProducts();
        }
      }
    });
  }

  get dataManagerFormControls() { return this.dataManagerForm.controls; }



}
