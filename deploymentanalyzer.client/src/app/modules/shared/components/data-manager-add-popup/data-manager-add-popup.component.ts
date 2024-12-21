import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalesforceData, IdNamePair } from '../../../../models/salesforcedata';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataManagerProduct } from '../../../../models/datamanagerproduct';
//import { DataManagerProductAddPopupComponent } from '../data-manager-product-add-popup/data-manager-product-add-popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { ApiResponse } from '../../../../models/ApiResponse';
import { GetDMSalesforceRecordsFilters, addUpdateMasterCode } from '../../../../constants/api.constant';
import { ToasterService } from '../../../../services/common/toaster.service';
import { ApiService } from '../../../../services/Api/api.service';
import { DataManagerAddProductPopupComponent } from '../../data-manager-add-product-popup/data-manager-add-product-popup.component';

@Component({
  selector: 'app-data-manager-add-popup',
  templateUrl: './data-manager-add-popup.component.html',
  styleUrls: ['./data-manager-add-popup.component.scss']
})
export class DataManagerAddPopupComponent implements OnInit {

  isExpandedProductListExpansionPanel = false;

  isOpenManageDataManagerSidebar = false;
  coPromotionHint = '';
  salesForceHint = '';
  dataManagerForm: FormGroup;
  productItems: DataManagerProduct[] = [];

  salesforce_Name: IdNamePair[] = [];
  countries_Names: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  period_Years: IdNamePair[] = [];
  period_Quarters: number[] = [1,2,3,4];
  type_of_salesforce: IdNamePair[] = [];


  filteredSalesForceOptions: Observable<IdNamePair[]> | undefined;
  filteredYearsOptions: Observable<IdNamePair[]> | undefined;

  productdataSource = new MatTableDataSource<DataManagerProduct>(this.productItems);
 
  dropdownData: any;
  displayedColumns: string[] = [
    'select',
    'uS_Product_Name_Product_Promoted',
    'country_Specific_Product_Name_Product_Promoted',
    'generic_Name',
    'therapeutic_Category',
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

    toggleProductListExpansionPanel() {
    this.isExpandedProductListExpansionPanel =
      !this.isExpandedProductListExpansionPanel;
  }
  
  constructor(public dialogRef: MatDialogRef<DataManagerAddPopupComponent>,private dialog: MatDialog,
    public fb:FormBuilder,private cdr: ChangeDetectorRef, private apiService: ApiService,
    private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: { dataManager: SalesforceData }) { 
     

        this.dataManagerForm = this.fb.group({
          dADatabase_Salesforce_Id: [''],
          country_Name: ['',[Validators.required]],
          company_Name: ['',[Validators.required]],
          period_Year: [null,[Validators.required]],
          period_Quarter: [null,[Validators.required]],
          salesforce_Name: ['',[Validators.required]],
          type_of_Salesforce: ['',[Validators.required]],
          number_Of_Sales_Representatives: [0,[Validators.required]],
          number_Of_District_Managers: [0],
          number_Of_Regional_Managers: [0],
          salary_Low: [0],
          salary_High: [0],
          target_Bonus: [0],
          reach: [0],
          frequency: [0],
          additional_Notes_Salesforce: [''],
          pct_Split_Between_Primary_Care_And_Specialty: [null],
          productItems: this.fb.array([]) 
        });
      

      this.dataManagerForm.get('co_Promotion_YesNo')?.valueChanges.subscribe((isCoPromotion: boolean) => {
        const nameControl = this.dataManagerForm.get('name_of_a_Partner_Company');
        if (isCoPromotion) {
          this.coPromotionHint = 'Enter name of a partner company';
          nameControl?.enable();
        } else {
          this.coPromotionHint = '';
          nameControl?.disable();
        }
        this.cdr.detectChanges();  
      });

      this.dataManagerForm.get('contract_Sales_Force_YesNo')?.valueChanges.subscribe((isContactSalesForce: boolean) => {
        const nameControl = this.dataManagerForm.get('name_of_a_CSO_Contract_Sales_Organization');
        if (isContactSalesForce) {
          this.salesForceHint = 'Enter Name of a Contract Sales Organization';
          nameControl?.enable();
        } else {
          this.salesForceHint = '';
          nameControl?.disable();
        }
        this.cdr.detectChanges();  
      });

      this.isOpenManageDataManagerSidebar = true;
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
    return this.salesforce_Name.filter(option => option.name.startsWith(filterValue));
  }


  private _filterYears(value: number): IdNamePair[] {
    const filterValue = value;
    return this.period_Years.filter(option => option.name.startsWith(filterValue.toString()));
  }

  onCloseClick(): void {
    this.isOpenManageDataManagerSidebar = false;
    this.dialogRef.close();
  }

  getEmptyProduct() {
    let product: DataManagerProduct = {
      daDatabase_Product_Id: '',
      daDatabase_Salesforce_Id: '',
      uS_Product_Name_Product_Promoted: '',
      country_Specific_Product_Name_Product_Promoted: '',
      generic_Name: '',
      therapeutic_Category: '',
      product_Promotion_Priority_Order: 0,
      total_Number_of_Full_Time_Equivalents_FTEs: 0,
      primary_Care_Full_Time_Equivalents_FTEs: 0,
      specialty_Full_Time_Equivalents_FTEs: 0,
      physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: '',
      specialty_Physicians_Targeted: '',
      co_Promotion_YesNo: false,
      name_of_a_Partner_Company: '',
      contract_Sales_Force_YesNo: false,
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

  refreshProducts(){
      this.productdataSource = new MatTableDataSource<DataManagerProduct>(this.productItems);
      const productItemsArray = this.dataManagerForm.get('productItems') as FormArray;
      productItemsArray.clear(); 
      
      this.productItems.forEach(item => {
    
        const specialtyPhysiciansTargetedString = Array.isArray(item.specialty_Physicians_Targeted)
          ? item.specialty_Physicians_Targeted.join(',')
          : item.specialty_Physicians_Targeted;
      
        const updatedItem = {
          ...item,
          specialty_Physicians_Targeted: specialtyPhysiciansTargetedString
        };
      
        productItemsArray.push(this.fb.group(updatedItem));
      });

      this.isExpandedProductListExpansionPanel = true;
  }

  openProductEditDialog(index: any) {
    let item = this.productItems[index];
    const dialogRef = this.dialog.open(DataManagerAddProductPopupComponent, {
      height: '0%',
      data: { product: item }
    });
  
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        if(result){
            this.productItems[index] = result;
            this.refreshProducts();
        }
      }
    });
  }
  
  
  deleteProductItem(item:any){
    const index = this.productItems.indexOf(item);
    if (index >= 0) {
      this.productItems.splice(index, 1);
      this.refreshProducts();
    }
  }

  get dataManagerFormControls() { return this.dataManagerForm.controls; }

}
