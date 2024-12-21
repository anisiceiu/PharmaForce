import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { StorageService } from '../../../services/common/storage.service';
import { ApiService } from '../../../services/Api/api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, startWith, switchMap, map, catchError, of, Observable } from 'rxjs';
import { AddUpdateCompanyProductProfileUserPreference, GetCitationsByIdCSV, GetCompanyProductProfileUserPreferences, GetCompanyProfileAdditionalNoteList, GetCompanyProfileRecords, GetCompanyProfileTopInfo, GetCustomerDropdowns, GetTherapeuticCategoryWiseCompanyInfo, addRemoveFavoriteForCompany, getAdminCountries, getAdminPeriods, getAllDataManagerItems, getFavoriteCompanyList, getUserRights } from '../../../constants/api.constant';
import { IdNamePair, SalesforceData } from '../../../models/salesforcedata';
import { citation, smallCitation } from '../../../models/citation';
import { Country } from '../../../models/country';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';
import _ from 'underscore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyProfileTopInfo } from '../../../models/CompanyProfileTopInfo';
import { TherapeuticCategoryWiseCompanyInfo } from '../../../models/TherapeuticCategoryWiseCompanyInfo';
import { Period } from '../../../models/period';
import { AdditionalNote } from '../../../models/Product';
import { CustomerDropdownGroupModel, CustomerDropdownModel } from '../../../models/CustomerDropdown';
import { ProfilePageUserPreference } from '../../../models/ProfilePageUserPreference';
import { UserRight } from '../../../models/userRights';
import { CommonMethodService } from '../../../services/common/common-method.service';

@Component({
  selector: 'app-company-profile-detail',
  templateUrl: './company-profile-detail.component.html',
  styleUrls: ['./company-profile-detail.component.scss']
})
export class CompanyProfileDetailComponent implements OnInit {
  chart!: any;
  currentUser:any;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataItems: SalesforceData[] = [];
  dataItemsBase: SalesforceData[] = [];
  dataSource = new MatTableDataSource<SalesforceData>(this.dataItems);
  totalRecords: number = 0;
  resultsLength = 0;
  pageSize: number = 10; // Default page size
  pageIndex: number = 0;
  isReset = false;
  user_id = 0;
  ciationList: smallCitation[] = [];
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  userRights: UserRight = {} as UserRight;
  additionalNotes: AdditionalNote[] = [];
  therapeuticCategoryWiseCompanyInfo: TherapeuticCategoryWiseCompanyInfo[] = [];
  therapeuticCategoriesOrdered: string[] = [
    'Anti-Infectives',
    'Cardiovascular',
    'Categgge',
    'CNS, Pain and Anesthesia',
    'Dermatology',
    'Endocrinology and Metabolic Disorders',
    'Gastrointestinal',
    "Gynecology/Women's Health",
    'Nephrology and Transplantation',
    'Oncology and Hematology',
    'Ophthalmology',
    'Respiratory and Allergy',
    'Rheumatology, Bone and Inflammation',
    'Urology',
    'Vaccines',
    'Other'
  ];

  therapeuticCategoryWiseCompanyInfoOdered: TherapeuticCategoryWiseCompanyInfo[] = [];
  customerDropdownList: CustomerDropdownModel[] = [];
  customerDropdownListForCountry: CustomerDropdownModel[] = [];
  userPreferences: ProfilePageUserPreference[] = [];
  sortField = '';
  sortDirection = '';
  citationIdList: number[]=[];
  displayedColumns: string[] = [
    //'region_Name',
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
    'salary_Low',
    'salary_High',
    'target_Bonus',
    'reach',
    'pct_Split_Between_Primary_Care_And_Specialty',
    'frequency',
    'additional_Notes_Product',
    'additional_Notes_Salesforce'
  ];
  countries:any[] = [];
  country:any;
  countryList: Country[] = [];
  // period_Years: Period[] = [];
  period_Quarters: IdNamePair[] = [
    { id: 4, name: '4' },
    { id: 3, name: '3' },
    { id: 2, name: '2' },
    { id: 1, name: '1' },
  ];
  periodList: Period[] = [];
  filteredperiodList: Period[] = [];
  filteredcountryList: Country[] = [];
  searchForm!: FormGroup;
  companyId: number = 0;
  headerInfo: CompanyProfileTopInfo = {} as CompanyProfileTopInfo;
  selected_periodQuarter!: number;
  selected_periodYear!: number;
  backgroundColors:string[] = [
    '#8BC34A', // Anti-Infectives
    '#23511E', // Cardiovascular
    '#F9E0A2', // Categgge
    '#00BCD4', // CNS, Pain and Anesthesia
    '#9C27B0', // Dermatology
    '#EC7A08', // Endocrinology and Metabolic Disorders
    '#A30000', // Gastrointestinal
    '#3C3D99', // Gynecology/Women's Health
    '#4CAF50', // Oncology and Hematology
    '#AFB42B', // Respiratory and Allergy
    '#73C5C5', // Rheumatology, Bone and Inflammation
    '#2F4B7C', // Urology
    '#665191', // Vaccines
    '#d45087', // Ophthalmology
    '#F95D6A', // Nephrology and Transplantation
    '#FF7C43'  // Other
  ];

  pie_labels: string[] = [];
  favoriteCompanies: any;
  IsInFavoriteList: boolean = false;
  rowSpan: number[] = [];
  displayForSpan: boolean[] = [];

  constructor(private storageService:StorageService,
    private apiService: ApiService, private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService, private commonMethodService: CommonMethodService,
    public fb: FormBuilder
  ) {

    this.activatedRoute.params.subscribe(params => {
      this.companyId = params['company_Id'];
    });

    this.searchForm = this.fb.group({
      country: [null],
      period_year: [0],
      period_quarter: [0],
      company_id: [this.companyId]
    });

    this.fillArrayByEmptyInfo();
    this.headerInfo = this.getEmptyCompanyProfileTopInfo();
  }

  ngOnInit() {
    this.commonMethodService.setTitle("Company Details");
    this.currentUser = this.storageService.UserDetails;
    this.user_id = this.currentUser.id;
    this.createChart();
    this.loadCountry();
    this.loadPeriod();
    this.getTherapeuticCategoryWiseCompanyInfo();
    this.getCustomerDropdowns();
    this.getUserPreferences();
    this.setDefaultCountry();
    this.loadFavoriteCompany();
  }


  getCitationToolTipValue(item: any, propName: string) {
    let tooltipText: string = '';
    if (item.citationValue) {
      tooltipText = item.citationValue?.[propName] ? item.citationValue[propName] : '';
      if (propName == 'period') {
        tooltipText = '';
        tooltipText = item.citationValue && item.citationValue.hasOwnProperty('period_year') ? item.citationValue.period_year : '';
        tooltipText += '\n' + item.citationValue && item.citationValue.hasOwnProperty('period_quarter') ? item.citationValue.period_quarter : '';
      }
    }
    return tooltipText;
  }

  applyFilter(value: string, column: keyof SalesforceData) {
    value = value.trim().toLowerCase(); // Remove whitespace and lowercase the input
  
    this.dataSource.filterPredicate = (data: SalesforceData, filter: string) => {
      const columnValue = data[column]?.toString().toLowerCase() || '';
      return columnValue.includes(filter);
    };
  
    this.dataSource.filter = value; // Trigger the filter
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  setDefaultCountry() {
    
      let countryId: number = Number(sessionStorage.getItem('company-profile-selected-country'));
      if (this.filteredcountryList && this.filteredcountryList.length) {
        let countryName: string = this.filteredcountryList.find(c => c.country_Id == countryId)?.country_Name ?? '';
        if (countryName)
          this.searchForm.controls['country'].setValue(countryName);
        else
          this.searchForm.controls['country'].setValue(this.filteredcountryList[0].country_Name);

        this.getSpecificCustomerData('period');
      }
     
  }

  getEmptyCompanyProfileTopInfo() {
    let topInfo: CompanyProfileTopInfo = {
      company_name: '',
      headquarters: '',
      type_of_entity: '',
      number_of_employees: 0,
      sales: 0,
      primary_care_deployment: 0,
      speciality_deployment: 0,
      total_deployment: 0
    };

    return topInfo;
  }

  loadFavoriteCompany() {
    let data = {
      user_id: this.currentUser.id,
      client_id: this.currentUser.clientId
    }
    this.apiService.PostAll(getFavoriteCompanyList, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.favoriteCompanies = response.result;
        if (this.favoriteCompanies.find((c: any) => c.company_Id == this.companyId)) {
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

  AddRemoveFavoriteForCompany() {
    let data = {
      company_Id: this.companyId,
      client_id: this.currentUser.clientId,
      user_Id: this.currentUser.id
    }
    this.apiService.PostAll(addRemoveFavoriteForCompany, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        if (response.result == 3) {
          this.toasterService.showWarning(response.message);
        } else {
          this.toasterService.showSuccess(response.message);
        }

        this.loadFavoriteCompany();
      } else {
        this.toasterService.showError(response.message);
      }

    });

  }

  fillArrayByEmptyInfo() {
    this.therapeuticCategoriesOrdered.forEach(category => {
      this.therapeuticCategoryWiseCompanyInfoOdered.push(this.getEmptyTherapeuticCategoryWiseCompanyInfo(category));
    });
  }

  getTopInfo() {
    let data = {
      user_id: this.currentUser.id,
      company_id: this.searchForm.controls['company_id'].value,
      period_year: this.selected_periodYear,
      period_quarter: this.selected_periodQuarter,
      country: this.searchForm.controls['country'].value
    };

    if (data.company_id && data.period_year && data.period_quarter && data.country) {
      this.apiService
        .PostAll(GetCompanyProfileTopInfo, data)
        .subscribe(response => {
          if (response.status) {
            this.headerInfo = response.result || this.getEmptyCompanyProfileTopInfo();
          } else {
            this.toasterService.showError(response.message);
          }
        });
    }
   

  }

  getAdditionalNotes() {
    let data = {
      user_id: this.currentUser.id,
      company_id: this.searchForm.controls['company_id'].value,
      period_year: this.selected_periodYear,
      period_quarter: this.selected_periodQuarter,
      country: this.searchForm.controls['country'].value
    };

    if (data.company_id && data.period_year && data.period_quarter && data.country) {
      this.apiService
        .PostAll(GetCompanyProfileAdditionalNoteList, data)
        .subscribe(response => {
          if (response.status) {
            this.additionalNotes = response.result;
          } else {
            this.toasterService.showError(response.message);
          }
        });
    }
  }

  getTherapeuticCategoryWiseCompanyInfo() {
    let data = {
      user_id: this.currentUser.id,
      company_id: this.searchForm.controls['company_id'].value,
      period_year: this.selected_periodYear,
      period_quarter: this.selected_periodQuarter,
      country: this.searchForm.controls['country'].value
    };

    this.fillArrayByEmptyInfo(); // reset

    if (data.company_id && data.period_year && data.period_quarter && data.country) {
      
      this.apiService
        .PostAll(GetTherapeuticCategoryWiseCompanyInfo, data)
        .subscribe(response => {
          if (response.status) {
            if (response.result && response.result?.length)
              this.therapeuticCategoryWiseCompanyInfo = response.result;
            else
              this.therapeuticCategoryWiseCompanyInfo = [];

            this.arrangeByOrderTherapeuticCategoryWiseCompanyInfo(this.therapeuticCategoryWiseCompanyInfo);
          } else {
            this.toasterService.showError(response.message);
          }
        });
    }
  }


  destroyChart() {
    
    if (<Chart>this.chart) {
      (<Chart>this.chart).destroy();
    }

  }

  clickOnPieByIndex(TC: string) {
    if (TC == "Gynecology/Womens Health")
      TC = "Gynecology/Women's Health";

    let index: number = this.pie_labels.findIndex(v => v == TC);
     var meta = this.chart.getDatasetMeta(0),
     rect = this.chart.canvas.getBoundingClientRect(),
     point = meta.data[index].getCenterPoint(),
     evt = new MouseEvent('click', {
      clientX: rect.left + point.x,
      clientY: rect.top + point.y
     }),

     node = this.chart.canvas;
     node.dispatchEvent(evt);

    //this.narrowDownGridRecords(TC);
  }

  narrowDownGridRecords(TC: string) {
    this.dataItems = this.dataItemsBase.filter(sf => sf.therapeutic_Category == TC);
    this.dataSource = new MatTableDataSource<SalesforceData>(this.dataItems);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.manipulateForRowSpanTable();
  }

  createChart() {
    let nonZeroItems = this.therapeuticCategoryWiseCompanyInfoOdered.filter(i => i.total_number_of_full_time_equivalents_ftes > 0);
    let valuesTotal_FTEs: number[] = nonZeroItems.map(c => c.total_number_of_full_time_equivalents_ftes);
    let backColors = this.backgroundColors.slice(0, nonZeroItems.length);

    let labels = nonZeroItems.filter(i => i.total_number_of_full_time_equivalents_ftes > 0).map(c => c.therapeutic_category);
    this.pie_labels = labels;
    
    this.chart = new Chart("MyChart", {
      type: 'pie', // Set chart type to 'pie'
      data: {
        labels: Array.from(labels),
        datasets: [
          {
            data: valuesTotal_FTEs, // Update data according to the chart in the image
            backgroundColor: Array.from(backColors),
            offset: new Array(labels.length).fill(0)
          }
        ]
      },
      options: {
        responsive: true, // Ensure the chart is responsive
        maintainAspectRatio: false, // Disable maintaining aspect ratio
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                let item = nonZeroItems[context.dataIndex];
                if (item) {
                  label = 'PC:' + item.primary_care_full_time_equivalents_ftes
                    + ' SP:' + item.specialty_full_time_equivalents_ftes +
                    ' Total:' + item.total_number_of_full_time_equivalents_ftes;

                  return label;
                }
                
                return label;
              }
            }

          },
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14
              }
            }
          }
        },
        onClick: (evt, activeElements) => {
          if (activeElements && activeElements.length && activeElements[0]) {
            const dataIndex = activeElements[0].index;
            const label = this.chart.data.labels[dataIndex];
            this.chart.config.data.datasets[0].offset = new Array(this.chart.config.data.datasets[0].offset.length).fill(0);
            this.chart.config.data.datasets[0].offset[activeElements[0].index] += 50;
            this.chart.update();
            this.narrowDownGridRecords(label);
          }
        }
      }
    });
  }


  manipulateForRowSpanTable() {
    let length = this.dataItems.length;
    this.rowSpan = Array(length).fill(1);
    this.displayForSpan = Array(length).fill(true);
    let currentValue:string | null = null;
    this.dataItems.forEach((row, index) => {
      if (!currentValue || currentValue != row.daDatabase_Salesforce_Id) {
        currentValue = row.daDatabase_Salesforce_Id;
        let count = this.dataItems.filter(c => c.daDatabase_Salesforce_Id == currentValue).length;
        this.rowSpan[index] = count;

        let i = index + 1;
        while (count--) {
          if (this.dataItems[i] && this.dataItems[i].daDatabase_Salesforce_Id == currentValue) {
            this.displayForSpan[i]=false;
          }
          i++;
        }
      }
    });
  }

  onSearch() {
    let data = {
      user_id: this.currentUser.id,
      company_id: this.searchForm.controls['company_id'].value,
      period_year: this.selected_periodYear,
      period_quarter: this.selected_periodQuarter,
      country: this.searchForm.controls['country'].value
    };

    if (data.company_id && data.period_year && data.period_quarter && data.country) {
      this.apiService
        .PostAll(GetCompanyProfileRecords, data)
        .subscribe(response => {
          if (response.status) {
            this.dataItemsBase = response.result;
            //citations
            this.dataItemsBase.forEach(item => {
              if (item.column_names && item.column_names.length) {
                const columnNames = item.column_names.split('^|');
                const columnValues = item.citations_text.split('^|');

                item.hasAsterisk = {};
                item.citationValue = {};

                columnNames.forEach((name, index) => {
                  if (columnValues[index]) {
                    item.hasAsterisk[name.trim()] = true;
                    item.citationValue[name.trim()] = columnValues[index];
                  } else {
                    item.hasAsterisk[name.trim()] = false;
                    item.citationValue[name.trim()] = '';
                  }
                });
              }
            });

                //now assign table data
            this.dataItems = Array.from(this.dataItemsBase);
            this.manipulateForRowSpanTable();
                this.dataSource = new MatTableDataSource<SalesforceData>(this.dataItems);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

          } else {
            this.toasterService.showError(response.message);
          }
        });

      this.saveUserPreference();
    }

    this.getTopInfo();
    this.getTherapeuticCategoryWiseCompanyInfo();
    this.getAdditionalNotes();
  }

  onPeriod_YearChange(selectedPeriod: Period) {
    if (selectedPeriod) {
      this.selected_periodYear = selectedPeriod.period_Year;
      this.selected_periodQuarter = selectedPeriod.period_Quarter;
      this.onSearch();
    }
    
  }

  onPeriod_QuarterChange(periodQtr: string) {
    this.searchForm.controls['period_quarter'].setValue(periodQtr);
    this.onSearch();
  }

  onCountryChange(country: string) {
    this.onFilterChange();
  }

  loadPeriod() {
    this.apiService.GetAll(getAdminPeriods, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.periodList = response.result;
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }


  loadCountry() {
    this.apiService.GetAll(getAdminCountries, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.countryList = response.result;
        this.filterDropdownListByCustomerDropdowns('country');
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  arrangeByOrderTherapeuticCategoryWiseCompanyInfo(list: TherapeuticCategoryWiseCompanyInfo[]) {

    this.therapeuticCategoryWiseCompanyInfoOdered = [];

    this.therapeuticCategoriesOrdered.forEach(category => {

      let info = list.find(i => i.therapeutic_category.toLowerCase().trim() == category.toLowerCase().trim());
      if (info) {
        info.disabled = false;
        this.therapeuticCategoryWiseCompanyInfoOdered.push(info);
      }
      else {
        info = this.getEmptyTherapeuticCategoryWiseCompanyInfo(category);
        this.therapeuticCategoryWiseCompanyInfoOdered.push(info);
      }

    });

    this.destroyChart();
    this.createChart();

    console.log('the chart:',this.chart);
  }

  getEmptyTherapeuticCategoryWiseCompanyInfo(therapeutic_category:string) {
    let info: TherapeuticCategoryWiseCompanyInfo = {
      therapeutic_category: therapeutic_category,
      primary_care_full_time_equivalents_ftes: 0,
      specialty_full_time_equivalents_ftes: 0,
      total_number_of_full_time_equivalents_ftes: 0,
      disabled: true
    };

    return info;
  }

  saveUserPreference() {

    let period: Period = this.searchForm.controls['period_year'].value;
    let country: string = this.searchForm.controls['country'].value;

    if (period && country) {
      let data: any = {
        user_id: this.user_id,
        item_type: 'company',
        client_id: this.currentUser.clientId,
        company_id: this.companyId,
        country_name: country,
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
      let item = this.userPreferences.find(u => u.country_name == this.searchForm.controls['country'].value);
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
      item_type: 'company',
      company_id: this.companyId
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

    let country_name: string = this.searchForm.controls['country'].value;
    let countryId: number = this.countryList.find(c => c.country_Name == country_name)?.country_Id ?? 0;
    sessionStorage.setItem('company-profile-selected-country', countryId.toString());

    let data = {
      user_id: this.user_id,
      companies: this.companyId.toString(),
      countries: countryId ? countryId.toString() : null,
      periods: this.userRights.periods,
      brands: null,
      therapeuticcategories: this.userRights.therapeuticCategories,
    };

    this.getSpecificCustomerData('period',data);

  }

  filterDropdownListByCustomerDropdowns(type: string, serial: number = 0) {
    if (this.allCustomerData) {

      if (type == 'country' && this.countryList && this.countryList.length && this.allCustomerData.countries) {
        this.filteredcountryList = this.countryList.filter(c => this.allCustomerData.countries.findIndex(a => a.country_name == c.country_Name) > -1);
        if (!this.searchForm.controls['country'].value) {
          this.setDefaultCountry();
        }
      }

      if (type == 'period' && this.periodList && this.periodList.length && this.allCustomerData.periods) {
        this.filteredperiodList = this.periodList.filter(p => this.allCustomerData.periods.findIndex(a => a.period_year == p.period_Year && a.period_quarter == p.period_Quarter) > -1);
          this.setPeriodFromPreference();
      }
    }
  }

  getCustomerDropdowns() {
    this.getSpecificCustomerData('country');
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

    let country_id = 0;
    if (this.searchForm.controls['country'].value) {
      country_id = this.countryList.find(c => c.country_Name == this.searchForm.controls['country'].value)?.country_Id ?? 0;
    }

    let data: any = {
      user_id: this.user_id,
      companies: this.companyId.toString(),
      countries: country_id ? country_id.toString() : null,
      periods: null,
      therapeuticcategories:null,
      columns: columns
    };

    if (params) {
      data = params;
      data.columns = columns;
    }

    this.apiService.PostAll(GetCustomerDropdowns, data).subscribe(response => {
      if (response?.status) {
        if (type == 'country') {
          this.allCustomerData.countries = response.result;
          this.filterDropdownListByCustomerDropdowns('country');
        }
        
        else if (type == 'period') {
          this.allCustomerData.periods = response.result;
          this.filterDropdownListByCustomerDropdowns('period');
        }

      }
    });
  }
  
  exportGridtoExcel(): void {
    const header = [
      'Salesforce', // salesforce_Name
      'Type of Salesforce', // type_of_Salesforce
      'Sales Representatives', // number_Of_Sales_Representatives
      'District Managers', // number_Of_District_Managers
      'Regional Managers', // number_Of_Regional_Managers
      'US Brand Name', // uS_Product_Name_Product_Promoted
      'Product Promoted', // country_Specific_Product_Name_Product_Promoted
      'Generic Name', // generic_Name
      'Therapeutic Category', // therapeutic_Category
      'Salary Low', // salary_Low
      'Salary High', // salary_High
      'Target Bonus', // target_Bonus
      'Reach', // reach
      '% PC and SP', // pct_Split_Between_Primary_Care_And_Specialty
      'Frequency', // frequency
      'Product Notes', // additional_Notes_Product
      'Salesforce Notes', // additional_Notes_Salesforce
    ];
    const formatValue = (value: string) => {
      return value ? `"${value.replace(/,/g, ' ')}"` : '';
    };
    
    // Map data to rows and apply formatting
    const rows = this.dataSource.data.map(item => [
      formatValue(item.salesforce_Name),
      item.type_of_Salesforce,
      item.number_Of_Sales_Representatives,
      item.number_Of_District_Managers,
      item.number_Of_Regional_Managers,
      formatValue(item.uS_Product_Name_Product_Promoted),
      formatValue(item.country_Specific_Product_Name_Product_Promoted),
      formatValue(item.generic_Name),
      formatValue(item.therapeutic_Category),
      item.salary_Low,
      item.salary_High,
      item.target_Bonus,
      item.reach,
      item.pct_Split_Between_Primary_Care_And_Specialty,
      item.frequency,
      formatValue(item.additional_Notes_Product),
      formatValue(item.additional_Notes_Salesforce),
    ]);
  
  
    // Create CSV content
    const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');
  
    // Trigger file download
    this.downloadCSVFile(csvContent, 'CompanyProfileSalesForceData.csv');
  }

  private downloadCSVFile(csvContent: string, fileName: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  loadCitationsByIds() {
      let id_list: number[] = [...new Set(this.citationIdList)];
     return this.apiService.PostAll(GetCitationsByIdCSV, { user_id: this.user_id, id_list: id_list.join(',') });
  }

}
