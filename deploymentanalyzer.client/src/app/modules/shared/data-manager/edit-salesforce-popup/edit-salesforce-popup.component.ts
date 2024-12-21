import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { IdNamePair, SalesforceData } from '../../../../models/salesforcedata';
import { Observable, map, of, startWith } from 'rxjs';
import { GetDMSalesforceRecordsFilters, GetMasterCodeFilters, GetMasterCodeRecords, addUpdateCitation, addUpdateNotes, getDMCompaniesForCountry, getDMPeriodSalesforceForCompany, getDataManagerItemById, getNotes, getProductionDataManagerItemById } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { NotesPopupComponent } from '../../components/notes-popup/notes-popup.component';
import { CitationPopupComponent } from '../../components/citation-popup/citation-popup.component';
import { DataManagerProduct } from '../../../../models/datamanagerproduct';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { SalesforceOption } from '../../../../models/SalesforceOption';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../services/Api/api.service';
import { StorageService } from '../../../../services/common/storage.service';
import { ToasterService } from '../../../../services/common/toaster.service';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { notes } from '../../../../models/notes';
import { MasterCode } from '../../../../models/mastercode';
import { ProductOption } from '../../../../models/ProductOption';
import { QcqNotePopupComponent } from '../../qcq-note-popup/qcq-note-popup.component';


@Component({
  selector: 'app-edit-salesforce-popup',
  templateUrl: './edit-salesforce-popup.component.html',
  styleUrl: './edit-salesforce-popup.component.css',
})
export class EditSalesforcePopupComponent {

  isOpenEditDMSidebar = false;
  dataManagerForm: FormGroup;
  isExpandedProductListExpansionPanel = false;
  currentUser: any;
  salesforce_Name: SalesforceOption[] = [];
  salesforce_NameAll: SalesforceOption[] = [];
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
  us_Brand_Name: ProductOption[] = [];
  us_Brand_NameAll: ProductOption[] = [];
  country_Specific_Product: ProductOption[] = [];
  country_Specific_ProductAll: ProductOption[] = [];
  generic_Name: IdNamePair[] = [];
  therapeutic_Category: IdNamePair[] = [];
  physician_Focus: IdNamePair[] = [];
  physician_Targeted: IdNamePair[] = [];
  name_of_cso: IdNamePair[] = [];
  us_Brand_Name_Options: Observable<ProductOption[]> []=[];
  country_Specific_Product_Options: Observable<IdNamePair[]> [] = [];
  generic_Name_Options: Observable<IdNamePair[]> []=[];
  therapeutic_Category_Options: Observable<IdNamePair[]> [] = [];
  physician_Focus_Options: Observable<IdNamePair[]> [] = [];
  physician_Targeted_Options: Observable<IdNamePair[]> [] =  [];
  name_of_cso_Options: Observable<IdNamePair[]> [] = [];
  filteredCompaniesOptions: Observable<IdNamePair[]>  [] = [];
  co_Promotion = 'Co-Promotion';
  contact_Sales = 'Contract Sales Force';
  notesItems: notes[] = [];
  productionData: any;
  dataLoaded: boolean = false;
  productProductionData: any[] = [];

  currency_symbol: string = '';
  isAddToQCQ = true;

  productItems: DataManagerProduct[] = [];
  //productForm: FormGroup;

  salesforce_Id = '';
  product_Id = '';
  filteredSalesForceOptions: Observable<IdNamePair[]> | undefined;
  isProductEdit: boolean = false;
  isEditable: boolean = true;
  currentQuarter: number = 0;
  currentYear: number = 0;
  mastercodePeriods!: IdNamePair[];
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


  constructor(public dialogRef: MatDialogRef<EditSalesforcePopupComponent>, private dialog: MatDialog, public fb: FormBuilder,
    private cdr: ChangeDetectorRef, private apiService: ApiService,
    private toasterService: ToasterService, private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: { dataManager: SalesforceData, openedFrom: string }) {

    this.salesforce_Id = data.dataManager.daDatabase_Salesforce_Id;
    this.product_Id = data.dataManager.daDatabase_Product_Id;

    if (data.openedFrom && data.openedFrom == 'QCQueueList') {
      this.isEditable = false;
    }

    this.dataManagerForm = this.fb.group({
      dADatabase_Salesforce_Id: [this.salesforce_Id],
      country_Name: [data.dataManager.country_Name, [Validators.required]],
      company_Name: [data.dataManager.company_Name, [Validators.required]],
      period_Year: [data.dataManager.period_Year, [Validators.required]],
      period_Quarter: [data.dataManager.period_Quarter, [Validators.required]],
      salesforce_Name: [data.dataManager.salesforce_Name, [Validators.required]],
      type_of_Salesforce: [data.dataManager.type_of_Salesforce, [Validators.required]],
      number_Of_Sales_Representatives: [data.dataManager.number_Of_Sales_Representatives > 0 ? data.dataManager.number_Of_Sales_Representatives : 0, [Validators.required]],
      number_Of_District_Managers: [data.dataManager.number_Of_District_Managers > 0 ? data.dataManager.number_Of_District_Managers : null],
      number_Of_Regional_Managers: [data.dataManager.number_Of_Regional_Managers > 0 ? data.dataManager.number_Of_Regional_Managers : null],
      salary_Low: [data.dataManager.salary_Low > 0 ? data.dataManager.salary_Low : null],
      salary_High: [data.dataManager.salary_High > 0 ? data.dataManager.salary_High : null],
      target_Bonus: [data.dataManager.target_Bonus > 0 ? data.dataManager.target_Bonus : null],
      reach: [data.dataManager.reach > 0 ? data.dataManager.reach : null],
      frequency: [data.dataManager.frequency > 0 ? data.dataManager.frequency : null],

      country_Name_qcq: [null],
      company_Name_qcq: [null],
      period_Year_qcq: [null],
      period_Quarter_qcq: [null],
      salesforce_Name_qcq: [null],
      type_of_Salesforce_qcq: [null],
      number_Of_Sales_Representatives_qcq: [null],
      number_Of_District_Managers_qcq: [null],
      number_Of_Regional_Managers_qcq: [null],
      salary_Low_qcq: [null],
      salary_High_qcq: [null],
      target_Bonus_qcq: [null],
      reach_qcq: [null],
      frequency_qcq: [null],

      additional_Notes: [data.dataManager.additional_Notes_Salesforce],
      pct_Split_Between_Primary_Care_And_Specialty: [data.dataManager.pct_Split_Between_Primary_Care_And_Specialty > 0 ? data.dataManager.pct_Split_Between_Primary_Care_And_Specialty : null],
      productItems: this.fb.array([]),
      isAddToQCQ: [this.isAddToQCQ],
      periodList: []
    });

    this.isOpenEditDMSidebar = true;
    this.isExpandedProductListExpansionPanel = true;

    if (data.dataManager && data.dataManager.daDatabase_Salesforce_Id.length > 0) {
      this.getDataManagerDetail(data.dataManager.daDatabase_Product_Id.trim(), data.dataManager.daDatabase_Salesforce_Id.trim());
      this.getProductionDataManagerDetail(data.dataManager.daDatabase_Product_Id.trim(), data.dataManager.daDatabase_Salesforce_Id.trim());
    }

    const productItemsArray = this.dataManagerForm.get('productItems') as FormArray;
    productItemsArray.controls.forEach((item, index) => {
      this.initializeControl(index);
    });
    
  }

  addProductRow() {
    const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    arrayControl.push(this.createProductFormGroup());
    
    this.initialValuesSetProductAutos();
    arrayControl.controls.forEach((item, index) => {
      this.initializeControl(index);
    });
  }

  createProductFormGroup(product?: DataManagerProduct, isEditable: boolean=true): FormGroup {
    product = product ? product : this.getEmptyProduct();
    return this.fb.group({
      daDatabase_Product_Id: [product.daDatabase_Product_Id],
      daDatabase_Salesforce_Id: [product.daDatabase_Salesforce_Id],
      uS_Product_Name_Product_Promoted: [product.uS_Product_Name_Product_Promoted, [Validators.required]],
      country_Specific_Product_Name_Product_Promoted: [product.country_Specific_Product_Name_Product_Promoted],
      generic_Name: [product.generic_Name, [Validators.required]],
      therapeutic_Category: [product.therapeutic_Category, [Validators.required]],
      primary_Care_Full_Time_Equivalents_FTEs: [product.primary_Care_Full_Time_Equivalents_FTEs],
      specialty_Full_Time_Equivalents_FTEs: [product.specialty_Full_Time_Equivalents_FTEs, [Validators.required]],
      physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: [product.physicians_Focus_Primary_Care_Physicians_Specialty_Physicians],
      specialty_Physicians_Targeted: [product.specialty_Physicians_Targeted ? product.specialty_Physicians_Targeted.split(',') : null ],
      co_Promotion_YesNo: [product.co_Promotion_YesNo],
      name_of_a_Partner_Company: [product.name_of_a_Partner_Company],
      contract_Sales_Force_YesNo: [product.contract_Sales_Force_YesNo],
      name_of_a_CSO_Contract_Sales_Organization: [product.name_of_a_CSO_Contract_Sales_Organization],
      additional_Notes_Product: [product.additional_Notes_Product],
      uS_Product_Name_Product_Promoted_qcq: [null],
      country_Specific_Product_Name_Product_Promoted_qcq: [null],
      generic_Name_qcq: [null],
      therapeutic_Category_qcq: [null],
      product_Promotion_Priority_Order_qcq: [null],
      total_Number_of_Full_Time_Equivalents_FTEs_qcq: [null],
      primary_Care_Full_Time_Equivalents_FTEs_qcq: [null],
      specialty_Full_Time_Equivalents_FTEs_qcq: [null],
      physicians_Focus_Primary_Care_Physicians_Specialty_Physicians_qcq: [null],
      specialty_Physicians_Targeted_qcq: [null],
      co_Promotion_YesNo_qcq: [null],
      name_of_a_Partner_Company_qcq: [null],
      contract_Sales_Force_YesNo_qcq: [null],
      name_of_a_CSO_Contract_Sales_Organization_qcq: [null],
      isEditable: [isEditable]
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

  shouldHighlight(fieldName: string): boolean {
    if (!this.dataLoaded || !this.productionData) {
      return false;
    }
    if (fieldName == 'additional_Notes')
      fieldName = 'additional_Notes_Salesforce';

    const currentValue = this.dataManagerForm.get(fieldName)?.value;
    const productionValue = this.productionData[fieldName];

    // Convert both values to the same type (string) for comparison
    return String(currentValue) !== String(productionValue);
  }

  getproductionData(productId: string, fieldName: string) {
    let productionData = this.productProductionData.find(c => c.daDatabase_Product_Id == productId);
    const productionValue = productionData ? productionData[fieldName != 'additional_Notes' ? fieldName : 'additional_Notes_Salesforce'] : '';
    return productionValue;
  }

  isDifferent(productId: string, fieldName: string): boolean {
    let productionData = this.productProductionData.find(c => c.daDatabase_Product_Id == productId);
    const formValue = this.dataManagerForm.get(fieldName)?.value ? this.dataManagerForm.get(fieldName)?.value
      : this.productItems && this.productItems.length && this.productItems[0][fieldName as keyof DataManagerProduct];
    const productionValue = productionData ? productionData[fieldName != 'additional_Notes' ? fieldName : 'additional_Notes_Salesforce'] : '';

    if ((formValue == null || formValue == undefined || formValue == '') &&
      (productionValue == null || productionValue == undefined || productionValue == '')) {
      return false;
    }
    if (formValue == 0 && (productionValue == null || productionValue == undefined || productionValue == '')) {
      return false;
    }
    return formValue != productionValue;
  }


  getDataManagerDetail(daDatabase_Product_Id: string, dADatabase_Salesforce_Id: string) {
    let data = {
      daDatabase_Product_Id: daDatabase_Product_Id,
      dADatabase_Salesforce_Id: dADatabase_Salesforce_Id
    }
    this.apiService.PostAll(getDataManagerItemById, data, true).subscribe(result => {
      if (result.status) {
        this.productItems = result.result;
        if (this.productItems && this.productItems.length) {
          this.productItems.forEach((item, index) => {
            const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
            arrayControl.push(this.createProductFormGroup(item, false));
            this.initializeControl(index);
          });
        }
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
          this.productProductionData = result.result;
        }
      });
  }



  updateSalesforceProduct() {
    let noOfSalesReprentitives: number = 0;
    const productItemsArray = this.dataManagerForm.get('productItems') as FormArray;

    productItemsArray.controls.forEach(item => {
      noOfSalesReprentitives += Number(item.get('specialty_Full_Time_Equivalents_FTEs')!.value + Number(item.get('primary_Care_Full_Time_Equivalents_FTEs')!.value));
    });

    this.dataManagerForm.controls['number_Of_Sales_Representatives'].setValue(Math.round(noOfSalesReprentitives));
  }

  get getProductFormControls() {
    const control = this.dataManagerForm.get('productItems') as FormArray;
    return control;
  }

  initializeControl(index: number) {
    let arrayControl = this.dataManagerForm.get('productItems') as FormArray;

    const coPromotionYesNoControl = arrayControl.at(index).get('co_Promotion_YesNo');
    const contractSalesForceYesNoControl = arrayControl.at(index).get('contract_Sales_Force_YesNo');

    const nameOfPartnerCompanyControl = arrayControl.at(index).get('name_of_a_Partner_Company');
    const nameOfCSOControl = arrayControl.at(index).get('name_of_a_CSO_Contract_Sales_Organization');

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

    this.executeFiltersProduct(index);
  }

  addNewProduct() {
    
    this.addProductRow();
    this.updateSalesforceProduct();
    
  }

  saveProduct(index:number) {
    this.updateSalesforceProduct();
    const productItemsArray = this.dataManagerForm.get('productItems') as FormArray;
    productItemsArray.at(index).get('isEditable')?.setValue(false);
    productItemsArray.controls.forEach((item, index) => {
      this.initializeControl(index);
    });
  }

  deleteProduct(index: number) {
    const control = this.dataManagerForm.get('productItems') as FormArray;
    let daDatabase_Product_Id = control.at(index).get('daDatabase_Product_Id')?.value;

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'Product',
          id: daDatabase_Product_Id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const control = this.dataManagerForm.get('productItems') as FormArray;
        control.removeAt(index);
      }
    });

    

    this.updateSalesforceProduct();

    const productItemsArray = this.dataManagerForm.get('productItems') as FormArray;
    productItemsArray.controls.forEach((item, index) => {
      this.initializeControl(index);
    });
  }

  productEdit(index: number) {
    const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    arrayControl.at(index).get('isEditable')!.setValue(true);
  }

  getEmptyProduct() {
    let product: DataManagerProduct = {
      daDatabase_Product_Id: uuidv4(),
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
      name_of_a_CSO_Contract_Sales_Organization_qcq: null,
    };
    return product;
  }

  initialValuesSetProductAutos() {
    const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    arrayControl.controls.forEach((item, index) => {
      
      this.us_Brand_Name_Options[index] = of(this.us_Brand_Name);
      this.country_Specific_Product = this.country_Specific_ProductAll.filter(cp => cp.country == this.dataManagerForm.controls['country_Name'].value && cp.company == this.dataManagerForm.controls['company_Name'].value);
      this.country_Specific_Product_Options[index] = of(this.country_Specific_Product);
    });
  }

  onCountry_NameChange(country_name: string) {
    this.apiService.PostAll(GetMasterCodeFilters, { user_id: this.currentUser.id, type: 2, security_token: '', country: country_name }).subscribe(response => {
      if (response && response.status) {
        this.companies_NamesNarrow = this.companies_Names.filter(i => response.result.findIndex((c: IdNamePair) => c.name == i.name) > -1);
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

    this.salesforce_Name = this.salesforce_NameAll.filter(s => s.country == country_name);
    this.us_Brand_Name = this.us_Brand_NameAll.filter(u => u.country == country_name);

    this.us_Brand_Name_Options.forEach((item, index) => {
      this.us_Brand_Name_Options[index] = of(this.us_Brand_Name);
      this.country_Specific_Product = this.country_Specific_ProductAll.filter(cp => cp.country == country_name);
      this.country_Specific_Product_Options[index] = of(this.country_Specific_Product);
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

    this.salesforce_NameNarrow = this.salesforce_Name.filter(c => this.salesforce_NameAll.findIndex((u: SalesforceOption) => u.name == c.name && c.company == company_name && c.country == this.dataManagerForm.controls['country_Name'].value) > -1);
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

        this.filteredSalesForceOptions = of(this.salesforce_NameNarrow);


    let country_name: string = this.dataManagerForm.controls['country_Name'].value;

    this.salesforce_Name = this.salesforce_NameAll.filter(s => s.country == country_name && s.company == company_name);
    this.us_Brand_Name = this.us_Brand_NameAll.filter(u => u.country == country_name && u.company == company_name);

    this.us_Brand_Name_Options.forEach((item, index) => {
      this.us_Brand_Name_Options[index] = of(this.us_Brand_Name);
      this.country_Specific_Product = this.country_Specific_ProductAll.filter(cp => cp.country == country_name && cp.company == company_name);
      this.country_Specific_Product_Options[index] = of(this.country_Specific_Product);
    });
    


  }

  onPeriod_YearChange(periodYear: string) {

    //pre-select
    if (this.data.dataManager.period_Quarter) {
      this.onPeriod_QuarterChange(this.data.dataManager.period_Quarter.toString());
    }

    if (this.data.dataManager.salesforce_Name && this.salesforce_NameNarrow.findIndex(c => c.name == this.data.dataManager.salesforce_Name) == -1) {
      this.data.dataManager.salesforce_Name = '';
      this.dataManagerForm.controls['salesforce_Name'].setValue(null);
    }

    this.isCurrentPeriod();
  }

  onPeriod_QuarterChange(periodQuarter: string) {

    if (this.dataManagerForm.controls['salesforce_Name'].value && this.salesforce_NameNarrow.findIndex(c => c.name == this.dataManagerForm.controls['salesforce_Name'].value) == -1) {
      this.dataManagerForm.controls['salesforce_Name'].setValue(null);
    }

    this.isCurrentPeriod();
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

  onChangeCountrySpecificBrandName(index: number, countrySpecificName: string) {
    const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    let itemSelected = this.country_Specific_Product.find(g => g.name == countrySpecificName);
    if (itemSelected && itemSelected.generic_Name) {
      arrayControl.at(index).get("generic_Name")!.setValue(itemSelected.generic_Name);
    }
    if (itemSelected && itemSelected.name) {
      let brand = this.us_Brand_Name.find(b => b.name == itemSelected.name);
      if (brand)
        arrayControl.at(index).get('uS_Product_Name_Product_Promoted')!.setValue(brand?.uS_Name);
    }
  }

  onChangeBrandName(index: number, usName: string) {
    const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    let itemSelected = this.us_Brand_Name.find(g => g.uS_Name == usName);
    if (itemSelected && itemSelected.generic_Name) {
      arrayControl.at(index).get('generic_Name')!.setValue(itemSelected.generic_Name);
    }
    if (itemSelected && itemSelected.name) {
      arrayControl.at(index).get('country_Specific_Product_Name_Product_Promoted')!.setValue(itemSelected.name);
    }
  }

  onChangeSalesforce(salesforceName: string) {
    let itemSelected = this.salesforce_Name.find(g => g.name == salesforceName);
    if (itemSelected && itemSelected.type_of_SalesForce) {
      this.dataManagerForm.controls['type_of_Salesforce'].setValue(itemSelected.type_of_SalesForce);
    }
    else {
      this.dataManagerForm.controls['type_of_Salesforce'].setValue(null);
    }
  }

  openCitationProductPopup(index:number,column_name: string) {
    const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    let columDetail = {
      column_name: column_name.toLowerCase(),
      salesforceId: arrayControl.at(index).get('daDatabase_Salesforce_Id')?.value,
      productId: arrayControl.at(index).get('daDatabase_Product_Id')?.value
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

  openNotesProductPopup(index: number, column_name: string) {
    const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    let columDetail = {
      column_name: column_name,
      salesforceId: arrayControl.at(index).get('daDatabase_Salesforce_Id')?.value,
      productId: arrayControl.at(index).get('daDatabase_Product_Id')?.value
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
          daDatabase_Product_Id: result.daDatabase_Product_Id,
          column_name: result.column_name,
          description: result.description,
          note_for: '',
          type: 'product'

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

  openQcqNotesProductPopup(index: number, column_name: string) {
    const arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    let columDetail = {
      column_name: column_name,
      salesforceId: arrayControl.at(index).get('daDatabase_Salesforce_Id')?.value,
      productId: arrayControl.at(index).get('daDatabase_Product_Id')?.value
    }
    const dialogRef = this.dialog.open(QcqNotePopupComponent, {
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
          daDatabase_Product_Id: result.daDatabase_Product_Id,
          column_name: result.column_name,
          description: result.description,
          note_for: '',
          type: 'product'

        };

        //do staff here
        //do staff here
        if (column_name) {
          let qcqcolumnFrmCtrlName = column_name.concat('_qcq');
          arrayControl.at(index).get(qcqcolumnFrmCtrlName)!.setValue(request.description);
        }
      }
    });
  }

  openQcqNotesPopup(column_name: string) {
    let columDetail = {
      column_name: column_name,
      salesforceId: this.salesforce_Id
    }
    const dialogRef = this.dialog.open(QcqNotePopupComponent, {
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

        };
        //do staff here
        if (column_name) {
          let qcqcolumnFrmCtrlName = column_name.concat('_qcq');
          this.dataManagerForm.controls[qcqcolumnFrmCtrlName].setValue(request.description);
        }
      }
    });
  }

  onAddToQCQChange() {
    this.dataManagerForm.controls['isAddToQCQ'].setValue(this.isAddToQCQ);
  }


  onCloseClick(): void {
    this.isOpenEditDMSidebar = false;
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
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
      this.dataManagerForm.controls['periodList'].enable();
      return true;
    }
    else {
      this.dataManagerForm.controls['periodList'].setValue(null);
      this.dataManagerForm.controls['periodList'].disable();
      return false;
    }

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
          this.salesforce_NameAll = response.result.salesForce_Name;
          this.period_Years = response.result.period_Year;
          this.type_of_salesforce = response.result.type_of_salesforce;
          this.currencySymbol_Name = response.result.currency_Symbol;
          //this.us_Brand_Name = response.result.us_Brand_Name;
          this.us_Brand_NameAll = response.result.us_Brand_Name;
          //this.country_Specific_Product = response.result.country_Specific_Product;
          this.country_Specific_ProductAll = response.result.country_Specific_Product;
          this.generic_Name = response.result.generic_Name;
          this.therapeutic_Category = response.result.therapeutic_Category;
          this.physician_Focus = response.result.physician_Focus;
          this.physician_Targeted = response.result.physician_Targeted;
          this.name_of_cso = response.result.name_of_cso;

          this.period_YearsNarrow = this.period_Years;

          //pre-select all
          if (this.data.dataManager.country_Name) {
            this.onCountry_NameChange(this.data.dataManager.country_Name);
          }

        }

        this.executeFilters();
      });
  }

  executeFilters() {
    this.filteredSalesForceOptions = this.dataManagerForm.get('salesforce_Name')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSalesForce(value || '')),
    );
  }

  executeFiltersProduct(index:number) {
    
    let arrayControl = this.dataManagerForm.get('productItems') as FormArray;
    //products filters

    this.filteredCompaniesOptions[index] = arrayControl.at(index).get('name_of_a_Partner_Company')?.valueChanges.pipe(
      startWith(''),
      map(value =>  this._filterCompanies(value || '') ),
    )!;

    this.us_Brand_Name_Options[index] = arrayControl.at(index).get('uS_Product_Name_Product_Promoted')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_us_Brand_Name(value || '')),
    )!;

    this.country_Specific_Product_Options[index] = arrayControl.at(index).get('country_Specific_Product_Name_Product_Promoted')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_country_Specific_Product(value || '')),
    )!;

    this.generic_Name_Options[index] = arrayControl.at(index).get('generic_Name')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_generic_Name(value || '')),
    )!;

    this.therapeutic_Category_Options[index] = arrayControl.at(index).get('therapeutic_Category')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_therapeutic_Category(value || '')),
    )!;

    this.physician_Focus_Options[index] = arrayControl.at(index).get('physicians_Focus_Primary_Care_Physicians_Specialty_Physicians')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_physician_Focus(value || '')),
    )!;

    this.name_of_cso_Options[index] = arrayControl.at(index).get('name_of_a_CSO_Contract_Sales_Organization')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_name_of_cso(value || '')),
    )!;

  }

  private _filterSalesForce(value: string): IdNamePair[] {
    const filterValue = value;
    return this.salesforce_NameNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }



  private _filter_us_Brand_Name(value: string): ProductOption[] {
    const filterValue = value;
    return this.us_Brand_Name.filter(option => option.uS_Name.toLowerCase().startsWith(filterValue));
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

  get dataManagerFormControls() { return this.dataManagerForm.controls; }

}
