import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdNamePair } from '../../../models/salesforcedata';
import { Observable, map, startWith } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { StorageService } from '../../../services/common/storage.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { DataManagerProduct } from '../../../models/datamanagerproduct';
import { CitationPopupComponent } from '../components/citation-popup/citation-popup.component';
import { GetDMSalesforceRecordsFilters, addUpdateCitation, addUpdateMasterCode, addUpdateNotes } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { NotesPopupComponent } from '../components/notes-popup/notes-popup.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-data-manager-add-product-popup',
  templateUrl: './data-manager-add-product-popup.component.html',
  styleUrl: './data-manager-add-product-popup.component.css'
})
export class DataManagerAddProductPopupComponent implements OnInit {

  isOpenManageProductSidebar = false;
  isOpenManageDMNotesSidebar = false;
  isOpenManageDMCitationSidebar = false;
  isEnabledCitationPrimarySearch = true;
  isEnabledCitationSecondarySearch = false;
  isEnabledCitationAnalystComment = false;
  productForm: FormGroup;
  co_Promotion = 'Co-Promotion';
  contact_Sales = 'Contract Sales Force';


  salesforce_id = '';
  product_id = '';
  currentUser: any;

  companies_Names: IdNamePair[] = [];
  us_Brand_Name: IdNamePair[] = [];
  country_Specific_Product: IdNamePair[] = [];
  generic_Name: IdNamePair[] = [];
  therapeutic_Category: IdNamePair[] = [];
  physician_Focus: IdNamePair[] = [];
  physician_Targeted: IdNamePair[] = [];
  name_of_cso: IdNamePair[] = [];

  filteredCompaniesOptions: Observable<IdNamePair[]> | undefined;
  us_Brand_Name_Options: Observable<IdNamePair[]> | undefined;
  country_Specific_Product_Options: Observable<IdNamePair[]> | undefined;
  generic_Name_Options: Observable<IdNamePair[]> | undefined;
  therapeutic_Category_Options: Observable<IdNamePair[]> | undefined;
  physician_Focus_Options: Observable<IdNamePair[]> | undefined;
  physician_Targeted_Options: Observable<IdNamePair[]> | undefined;
  name_of_cso_Options: Observable<IdNamePair[]> | undefined;
  constructor(public dialogRef: MatDialogRef<DataManagerAddProductPopupComponent>, public fb: FormBuilder,
    private cdr: ChangeDetectorRef, private dialog: MatDialog, private storageService: StorageService,
    private apiService: ApiService, private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: { product: DataManagerProduct }
  ) {
    this.salesforce_id = data.product.daDatabase_Salesforce_Id;
    this.product_id = data.product.daDatabase_Product_Id = data.product.daDatabase_Product_Id ? data.product.daDatabase_Product_Id : uuidv4();
    this.productForm = this.fb.group({
      daDatabase_Product_Id: [data.product.daDatabase_Product_Id],
      daDatabase_Salesforce_Id: [data.product.daDatabase_Salesforce_Id],
      uS_Product_Name_Product_Promoted: [data.product.uS_Product_Name_Product_Promoted, [Validators.required]],
      country_Specific_Product_Name_Product_Promoted: [data.product.country_Specific_Product_Name_Product_Promoted],
      generic_Name: [data.product.generic_Name, [Validators.required]],
      therapeutic_Category: [data.product.therapeutic_Category, [Validators.required]],
      primary_Care_Full_Time_Equivalents_FTEs: [data.product.primary_Care_Full_Time_Equivalents_FTEs],
      specialty_Full_Time_Equivalents_FTEs: [data.product.specialty_Full_Time_Equivalents_FTEs, [Validators.required]],
      physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: [data.product.physicians_Focus_Primary_Care_Physicians_Specialty_Physicians],
      specialty_Physicians_Targeted: [data.product.specialty_Physicians_Targeted, [Validators.required]],
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
  }

  onCloseClick(): void {
    this.isOpenManageProductSidebar = false;
    this.dialogRef.close();
  }

  openCitationPopup(column_name: string) {
    let columDetail = {
      column_name: column_name.toLowerCase(),
      salesforceId: this.salesforce_id,
      productId: this.product_id
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
      salesforceId: this.salesforce_id,
      productId: this.product_id
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


  bindMasterCodes() {
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

  executeFilters() {

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

  get productFormControls() { return this.productForm.controls; }




}
