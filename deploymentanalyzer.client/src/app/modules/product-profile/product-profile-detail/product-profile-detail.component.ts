import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import { merge, startWith, switchMap, map, catchError, of, Observable } from 'rxjs';
import { AddUpdateCompanyProductProfileUserPreference, GetCompanyProductProfileUserPreferences, GetCustomerDropdowns, GetProductProfileAdditionalNoteList, GetProductProfileRecords, GetProductProfileTopInfo, GetTherapeuticCategoryWiseProductInfo, addRemoveFavoriteForProduct, getAdminCountries, getAdminPeriods, getAllDataManagerItems, getCompany, getFavoriteProductList, getUserRights } from '../../../constants/api.constant';
import { citation } from '../../../models/citation';
import { IdNamePair, SalesforceData } from '../../../models/salesforcedata';
import { ApiService } from '../../../services/Api/api.service';
import { StorageService } from '../../../services/common/storage.service';
import { Country } from '../../../models/country';
import { Period } from '../../../models/period';
import { ToasterService } from '../../../services/common/toaster.service';
import { ApiResponse } from '../../../models/ApiResponse';
import * as _ from 'underscore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductProfileTopInfo } from '../../../models/ProductProfileTopInfo';
import { Company } from '../../../models/company';
import { TherapeuticCategoryWiseProductInfo } from '../../../models/TherapeuticCategoryWiseProductInfo';
import { AdditionalNote } from '../../../models/Product';
import { CustomerDropdownGroupModel, CustomerDropdownModel } from '../../../models/CustomerDropdown';
import { ProfilePageUserPreference } from '../../../models/ProfilePageUserPreference';
import { UserRight } from '../../../models/userRights';
import * as XLSX from 'xlsx';
import { CommonMethodService } from '../../../services/common/common-method.service';

@Component({
  selector: 'app-product-profile-detail',
  templateUrl: './product-profile-detail.component.html',
  styleUrls: ['./product-profile-detail.component.scss']
})
export class ProductProfileDetailComponent implements OnInit {

  chart: any;
  currentUser: any;
  IsInFavoriteList: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataItems: SalesforceData[] = [];
  headerInfo: ProductProfileTopInfo = {} as ProductProfileTopInfo;
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  userRights: UserRight = {} as UserRight;
  dataSource = new MatTableDataSource<SalesforceData>(this.dataItems);
  totalRecords: number = 0;
  resultsLength = 0;
  pageSize: number = 10; // Default page size
  pageIndex: number = 0;
  isReset = false;
  user_id = 0;
  countryList: Country[] = [];
  companies: Company[] = [];
  periodList: Period[] = [];
  filteredperiodList: Period[] = [];
  period_Years: IdNamePair[] = [];
  customerDropdownList: CustomerDropdownModel[] = [];
  additionalNotes: AdditionalNote[] = [];
  period_Quarters: IdNamePair[] = [
    { id: 4, name: '4' },
    { id: 3, name: '3' },
    { id: 2, name: '2' },
    { id: 1, name: '1' },
  ];
  therapeuticCategoryWiseProductInfo: TherapeuticCategoryWiseProductInfo[] = [];
  therapeuticCategoriesOrdered: string[] = [
    'Anti-Infectives',
    'Cardiovascular',
    'CNS, Pain and Anesthesia',
    'Dermatology',
    'Gastrointestinal',
    'Oncology and Hematology',
    'Respiratory and Allergy',
    'Urology',
    'Vaccines',
    'Ophthalmology',
    'Nephrology and Transplantation',
    'Other'
  ];

  citations: citation[] = [];
  favoriteProducts: any;
  sortField = '';
  sortDirection = '';
  userPreferences: ProfilePageUserPreference[] = [];
  searchForm: FormGroup;

  displayedColumns: string[] = [
    /*'region_Name',*/
    'country_Name',
    'company_Name',
    'period_Year',
    'period_Quarter',
    'salesforce_Name',
    'type_of_Salesforce',
    'number_Of_Sales_Representatives',
    'number_Of_District_Managers',
    'number_Of_Regional_Managers',
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
    'salary_Low',
    'salary_High',
    'target_Bonus',
    'reach',
    'pct_Split_Between_Primary_Care_And_Specialty',
    'frequency',
    'additional_Notes_Product',
    'additional_Notes_Salesforce'
  ];
  columnChooserList = [
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
    { key: 'additional_Notes_Product', value: 'Additional Notes Product' },
    { key: 'additional_Notes_Salesforce', value: 'Additional Notes Salesforce' },
    { key: 'daDatabase_Salesforce_Id', value: 'Database Salesforce Id' },
    { key: 'modified_date', value: 'Modified Date' },
    { key: 'modified_by_name', value: 'Modified By' },
    { key: 'added_date', value: 'Added Date' },
    { key: 'added_by_name', value: 'Added By' }
  ];
  productId: number = 0;
  selected_periodQuarter: number = 0;
  selected_periodYear: number = 0;
  exportExcelFileName: string = "Product Profile Grid Data.xlsx";
  rowSpan: number[] = [];
  displayForSpan: boolean[] = [];
  constructor(private storageService: StorageService, public fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private apiService: ApiService, private toasterService: ToasterService, private commonMethodService: CommonMethodService,
  ) {

    this.activatedRoute.params.subscribe(params => {
      this.productId = params['product_Id'];
    });

    this.searchForm = this.fb.group({
      company: [null],
      period_year: [0],
      period_quarter: [0],
      product_id: [this.productId]
    });

    this.headerInfo = this.getEmptyProductProfileTopInfo();
  }

  loadFavoriteProducts() {
    let data = {
      user_id: this.currentUser.id,
      client_id: this.currentUser.clientId
    }
    this.apiService.PostAll(getFavoriteProductList, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.favoriteProducts = response.result;
        if (this.favoriteProducts.find((c: any) => c.product_Id == this.productId)) {
          this.IsInFavoriteList = true;
        }
        else {
          this.IsInFavoriteList = false;
        }
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  exportToexcel(): void {
    /* pass here the table id */
    //let element = document.getElementById('dmTableGrid');
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataItems);

    var range = XLSX.utils.decode_range(ws['!ref'] as string);
    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      // Example: Get second cell in each row, i.e. Column "C"=2,"A"=1
      //const actionCell = ws[XLSX.utils.encode_cell({ r: rowNum, c: 0 })];
      //actionCell.v = 'N/A';
      //const citationCell = ws[XLSX.utils.encode_cell({ r: rowNum, c: 2 })];
      //if (citationCell.v == 'toggle_off') {
      //  citationCell.v = 'No';
      //} else {
      //  citationCell.v = 'Yes';
      //}
      for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
        let headerCell = ws[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
        let col = this.columnChooserList.find(c => c.key == headerCell.v);
        if (col) {
          headerCell.v = col.value;
        }
      }
      break;
    }


    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.exportExcelFileName);

  }

  getEmptyProductProfileTopInfo() {
    let topInfo: ProductProfileTopInfo = {
      company_name: '',
      brand_name: '',
      generic_name: '',
      co_promotion_yesno: false,
      therapeutic_category: '',
      salesforce_name: ''
    };

    return topInfo;
  }

  ngOnInit() {
    this.commonMethodService.setTitle("Product Details");
    this.currentUser = this.storageService.UserDetails;
    this.user_id = this.currentUser.id;


    this.loadCompanies();
    this.loadPeriod();
    this.getCustomerDropdowns();
    //this.onSearch();
    //this.getTopInfo();
    this.fillArrayByEmptyInfo();
    this.createChart();
    this.getUserPreferences();
    this.loadFavoriteProducts();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  destroyChart() {

    if (<Chart>this.chart) {
      (<Chart>this.chart).destroy();
    }

  }


  getTherapeuticCategoryWiseProductInfo() {
    let data = {
      user_id: this.currentUser.id,
      product_id: this.searchForm.controls['product_id'].value,
      period_year: this.selected_periodYear,
      period_quarter: this.selected_periodQuarter,
      company: this.searchForm.controls['company'].value
    };

    if (data.product_id && data.period_year && data.period_quarter && data.company) {
      this.apiService
        .PostAll(GetTherapeuticCategoryWiseProductInfo, data)
        .subscribe(response => {
          if (response.status) {
            if (response.result && response.result?.length)
              this.therapeuticCategoryWiseProductInfo = response.result;
            else {
              this.therapeuticCategoryWiseProductInfo = [];
              this.fillArrayByEmptyInfo();
            }

            this.destroyChart();
            this.createChart();

          } else {
            this.toasterService.showError(response.message);
          }
        });
    }
  }

  fillArrayByEmptyInfo() {
    this.therapeuticCategoryWiseProductInfo = [];
    this.therapeuticCategoriesOrdered.forEach(category => {
      this.therapeuticCategoryWiseProductInfo.push(this.getEmptyTherapeuticCategoryWiseProductInfo(category));
    });
  }

  loadPeriod() {
    this.apiService.GetAll(getAdminPeriods, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.periodList = response.result;
        this.filterDropdownListByCustomerDropdowns('period');
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadCompanies() {
    let data = {
      user_id: this.currentUser.id
    }
    this.apiService.PostAll(getCompany, data).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.companies = response.result;
        this.filterDropdownListByCustomerDropdowns('company');
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  getEmptyTherapeuticCategoryWiseProductInfo(therapeutic_category: string) {
    let info: TherapeuticCategoryWiseProductInfo = {
      therapeutic_category: therapeutic_category,
      primary_care_full_time_equivalents_ftes: 0,
      specialty_full_time_equivalents_ftes: 0,
      disabled: true
    };

    return info;
  }

  onPeriod_YearChange(selectedPeriod: Period) {

    if(selectedPeriod)
    {
      this.selected_periodYear = selectedPeriod.period_Year;
      this.selected_periodQuarter = selectedPeriod.period_Quarter;
    }
    
    this.onSearch();
    this.getTopInfo();
    this.getTherapeuticCategoryWiseProductInfo();
    this.getAdditionalNotes();
  }

  onPeriod_QuarterChange(periodQtr: string) {
    this.searchForm.controls['period_quarter'].setValue(periodQtr);
    this.onSearch();
    this.getTopInfo();
    this.getTherapeuticCategoryWiseProductInfo();
    this.getAdditionalNotes();
  }

  onCompanyChange(company: string) {
    this.searchForm.controls['company'].setValue(company);
    this.getTopInfo();
    this.getTherapeuticCategoryWiseProductInfo();
    this.getAdditionalNotes();
    this.setPeriodFromPreference();
  }

  createChart() {
    let valuesLabels: string[] = this.therapeuticCategoryWiseProductInfo.map(c => c.therapeutic_category);
    let valuesPrimary_FTEs: number[] = this.therapeuticCategoryWiseProductInfo.map(c => c.primary_care_full_time_equivalents_ftes);
    let valuesSpeciality_FTEs: number[] = this.therapeuticCategoryWiseProductInfo.map(c => c.specialty_full_time_equivalents_ftes);

    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: valuesLabels,
        datasets: [
          {
            label: 'Primary Care',
            data: valuesPrimary_FTEs, // Update these numbers based on the chart
            backgroundColor: '#1C4B93', // Green color
            barThickness: 50
          },
          {
            label: 'Specialty',
            data: valuesSpeciality_FTEs, // Update these numbers based on the chart
            backgroundColor: '#E7883C', // Orange color
            barThickness: 50
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 50 // Adjust step size as needed
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }

  setDefaultCompany() {

    let companyId: number = Number(sessionStorage.getItem('product-profile-selected-country'));
    if (this.companies && this.companies.length) {
      let companyName: string = this.companies.find(c => c.company_Id == companyId)?.company_Name ?? '';
      if (companyName)
        this.searchForm.controls['company'].setValue(companyName);
      else
        this.searchForm.controls['company'].setValue(this.companies[0].company_Name);

      this.getSpecificCustomerData('period');
    }

  }

  AddRemoveFavoriteForProduct() {
    let data = {
      product_Id: this.productId,
      client_id: this.currentUser.clientId,
      user_Id: this.currentUser.id
    }
    this.apiService.PostAll(addRemoveFavoriteForProduct, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        if (response.result == 3) {
          this.toasterService.showWarning(response.message);
        } else {
          this.toasterService.showSuccess(response.message);
        }

        this.loadFavoriteProducts();

      } else {
        this.toasterService.showError(response.message);
      }

    });

  }


  manipulateForRowSpanTable() {
    let length = this.dataItems.length;
    this.rowSpan = Array(length).fill(1);
    this.displayForSpan = Array(length).fill(true);
    let currentValue: string | null = null;
    this.dataItems.forEach((row, index) => {
      if (!currentValue || currentValue != row.daDatabase_Salesforce_Id) {
        currentValue = row.daDatabase_Salesforce_Id;
        let count = this.dataItems.filter(c => c.daDatabase_Salesforce_Id == currentValue).length;
        this.rowSpan[index] = count;

        let i = index + 1;
        while (count--) {
          if (this.dataItems[i] && this.dataItems[i].daDatabase_Salesforce_Id == currentValue) {
            this.displayForSpan[i] = false;
          }
          i++;
        }
      }
    });
  }


  onSearch() {
    let data = {
      user_id: this.currentUser.id,
      product_id: this.searchForm.controls['product_id'].value,
      period_year: this.selected_periodYear,
      period_quarter: this.selected_periodQuarter,
      company: this.searchForm.controls['company'].value
    };

    if (data.product_id && data.period_year && data.period_quarter && data.company) {
      this.apiService
        .PostAll(GetProductProfileRecords, data)
        .subscribe(response => {
          if (response.status) {
            this.dataItems = response.result;
            this.dataSource = new MatTableDataSource<SalesforceData>(this.dataItems);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.manipulateForRowSpanTable();
          } else {
            this.toasterService.showError(response.message);
          }
        });

      this.saveUserPreference();
    }
  }

  getTopInfo() {
    let data = {
      user_id: this.currentUser.id,
      product_id: this.searchForm.controls['product_id'].value,
      period_year: this.selected_periodYear ? this.selected_periodYear : null,
      period_quarter: this.selected_periodQuarter ? this.selected_periodQuarter : null,
      company: this.searchForm.controls['company'].value
    };

    //if (data.product_id && data.period_year && data.period_quarter && data.company) {
      this.apiService
        .PostAll(GetProductProfileTopInfo, data)
        .subscribe(response => {
          if (response.status) {
            this.headerInfo = response.result || this.getEmptyProductProfileTopInfo();
          } else {
            this.toasterService.showError(response.message);
          }
        });
   // }
  }

  getAdditionalNotes() {
    let data = {
      user_id: this.currentUser.id,
      product_id: this.searchForm.controls['product_id'].value,
      period_year: this.selected_periodYear,
      period_quarter: this.selected_periodQuarter,
      company: this.searchForm.controls['company'].value
    };

    if (data.product_id && data.period_year && data.period_quarter && data.company) {
      this.apiService
        .PostAll(GetProductProfileAdditionalNoteList, data)
        .subscribe(response => {
          if (response.status) {
            this.additionalNotes = response.result || this.getEmptyProductProfileTopInfo();
          } else {
            this.toasterService.showError(response.message);
          }
        });
    }
  }

  saveUserPreference() {

    let period: Period = this.searchForm.controls['period_year'].value;
    let company: string = this.searchForm.controls['company'].value;

    if (period && company) {
      let data: any = {
        user_id: this.user_id,
        client_id: this.currentUser.clientId,
        item_type: 'product',
        product_id: this.productId,
        country_name: company,
        period_id: period.period_Id,
      };

      this.apiService.PostAll(AddUpdateCompanyProductProfileUserPreference, data).subscribe(response => {
        if (response.status) {
          this.getUserPreferences();
        }
      });
    }

  }

  setPeriodFromPreference() {
    let periodselected: any = null;
    if (this.userPreferences && this.userPreferences.length) {
      let item = this.userPreferences.find(u => u.company_name == this.searchForm.controls['company'].value);
      if (item) {
        let period = this.periodList.find(p => p.period_Id == item.period_id);
        if (period) {
          this.searchForm.controls['period_year'].setValue(period);
          periodselected = period;
        }

      }
      else {
        if (this.filteredperiodList && this.filteredperiodList.length) {
          this.searchForm.controls['period_year'].setValue(this.filteredperiodList[0]);
          periodselected = this.filteredperiodList[0];
        }
      }

    }
    else {
      if (this.filteredperiodList && this.filteredperiodList.length) {
        this.searchForm.controls['period_year'].setValue(this.filteredperiodList[0]);
        periodselected = this.filteredperiodList[0];
      }

    }

    this.onPeriod_YearChange(periodselected);
  }


  getUserPreferences() {
    let data: any = {
      user_id: this.user_id,
      client_id: this.currentUser.clientId,
      item_type: 'product',
      product_id: this.productId
    };

    this.apiService.PostAll(GetCompanyProductProfileUserPreferences, data).subscribe(response => {
      if (response.status) {
        this.userPreferences = response.result;
        if (!this.searchForm.controls['period_year'].value) {
          this.setPeriodFromPreference();
        }
      }
    });
  }

  onFilterChange() {

    let company_name: string = this.searchForm.controls['company'].value;
    let companyId: number = this.companies.find(c => c.company_Name == company_name)?.company_Id ?? 0;

    let data = {
      user_id: this.user_id,
      companies: companyId.toString(),
      countries: this.userRights.countries,
      periods: this.userRights.periods,
      brands: this.productId.toString(),
      therapeuticcategories: this.userRights.therapeuticCategories,
    };

    this.getSpecificCustomerData('period', data);

  }

  filterDropdownListByCustomerDropdowns(type: string, serial: number = 0) {
    if (this.allCustomerData) {

      if (type == 'company' && this.companies && this.companies.length && this.allCustomerData.companies) {
        this.companies = this.companies.filter(c => this.allCustomerData.companies.findIndex(a => a.company_name == c.company_Name) > -1);
        if (!this.searchForm.controls['company'].value) {
          this.setDefaultCompany();
        }
      }

      if (type == 'period' && this.periodList && this.periodList.length && this.allCustomerData.periods) {
        this.filteredperiodList = this.periodList.filter(p => this.allCustomerData.periods.findIndex(a => a.period_year == p.period_Year && a.period_quarter == p.period_Quarter) > -1);
        this.setPeriodFromPreference();
      }
    }
  }

  getCustomerDropdowns() {
     this.getSpecificCustomerData('company');
     this.getSpecificCustomerData('period');
  }

  getSpecificCustomerData(type: string, params: any = null, serial: number = 0) {

    let columns: string = 'Period_Year,Period_Quarter,Country_Name,Company_Name,SalesForce_Name,US_Product_Name_Product_Promoted,Generic_Name,Therapeutic_Category';
    if (type == 'country')
      columns = 'Country_Name'
    else if (type == 'company')
      columns = 'Company_Name';
    else if (type == 'period')
      columns = 'Period_Year,Period_Quarter';
    else if (type == 'therapeuticCategory')
      columns = 'Therapeutic_Category';
    else if (type == 'brand')
      columns = 'US_Product_Name_Product_Promoted';
    else if (type == 'genericname')
      columns = 'Generic_Name';
    else if (type == 'salesforce')
      columns = 'SalesForce_Name';

    let company_id = 0;
    if (this.searchForm.controls['company'].value) {
      company_id = this.companies.find(c => c.company_Name == this.searchForm.controls['company'].value)?.company_Id ?? 0;
    }

    let data: any = {
      user_id: this.user_id,
      brands: this.productId.toString(),
      companies: company_id ? company_id.toString() : null,
      countries: null,
      periods: null,
      therapeuticcategories: null,
      columns: columns
    };

    if (params) {
      data = params;
      data.columns = columns;
    }

    this.apiService.PostAll(GetCustomerDropdowns, data).subscribe(response => {
      if (response?.status) {
        if (type == 'company') {
          this.allCustomerData.companies = response.result;
          this.filterDropdownListByCustomerDropdowns('company');
        }

        else if (type == 'period') {
          this.allCustomerData.periods = response.result;
          this.filterDropdownListByCustomerDropdowns('period');
        }

      }
    });
  }

  applyFilter(value: string, column: keyof SalesforceData) {
    value = value.trim().toLowerCase(); // Remove whitespace and lowercase the input
  
    this.dataSource.filterPredicate = (data: SalesforceData, filter: string) => {
      const columnValue = data[column]?.toString().toLowerCase() || '';
      return columnValue.includes(filter);
    };
  
    this.dataSource.filter = value; // Trigger the filter
  }
}
