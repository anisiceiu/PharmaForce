import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, viewChild, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import { merge, startWith, switchMap, map, catchError, of, Observable, BehaviorSubject, filter } from 'rxjs';
import { getAdminPeriods, getAdminTherapeuticCategories, getAllCompanyCountry, getAllDataManagerItems, GetBrandGroupFilters, getCompany, GetCompanyCountryAnalysisChartData, GetCompanyCountryAnalysisGridData, GetCompanyDeploymentByCountryPCAndSpecialtyChartData, GetCompanyDeploymentByCountryPCAndSpecialtyGridData, GetCompanyPortfolioByTCAndSalesForceChartData, GetCompanyPortfolioByTCAndSalesForceGridData, getCountry, GetCustomerDropdowns, GetDMSalesforceRecordsFilters, GetGenericNames, GetMyBrandGroups, GetProductFTEsByTCAndSalesForceUsingBrandNameChartData, GetProductFTEsByTCAndSalesForceUsingBrandNameGridData, GetProductFTEsByTCAndSalesForceUsingGenericNameChartData, GetProductFTEsByTCAndSalesForceUsingGenericNameGridData, GetReachAndFrequencyBySalesForceAndProductChartData, GetReachAndFrequencyBySalesForceAndProductGridData, GetSalesforceList, GetSalesRepresentativeCompensationBySalesForceAndProductChartData, GetSalesRepresentativeCompensationBySalesForceAndProductGridData, GetTotalCompanyDeploymentByCountryAndTCChartData, GetTotalCompanyDeploymentByCountryAndTCGridData, GetUserAnalyticFilters, getUserRights, SaveUserAnalyticFilters } from '../../../constants/api.constant';
import { citation } from '../../../models/citation';
import { dropdowncollection, IdNamePair, SalesforceData } from '../../../models/salesforcedata';
import { ApiService } from '../../../services/Api/api.service';
import { StorageService } from '../../../services/common/storage.service';
import { ApiResponse } from '../../../models/ApiResponse';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TherapeuticCategory } from '../../../models/therapeuticCategory';
import { Company } from '../../../models/company';
import { Period } from '../../../models/period';
import { Country } from '../../../models/country';
import { ToasterService } from '../../../services/common/toaster.service';
import { MyBrand } from '../../../models/brand';
import { GenericName } from '../../../models/genericName';
import { Salesforce } from '../../../models/Salesforce';
import { CompanyCountryAnalysisParams, CompanyDeploymentByCountryPCAndSpecialtyParams, CompanyPortfolioByTCAndSalesForceParams, ProductFTEsByTCAndSalesForceUsingBrandNameParams, ProductFTEsByTCAndSalesForceUsingGenericNameParams, ReachAndFrequencyBySalesForceAndProductParams, SalesRepresentativeCompensationBySalesForceAndProductParams, TotalCompanyDeploymentByCountryAndTCParams } from '../../../models/AnalyticReportParameters';
import { AnalyticsReportType } from '../../../models/AnalyticsReportType';
import { CompanyCountryAnalysisChartData, CompanyCountryAnalysisGridData, CompanyDeploymentByCountryPCAndSpecialtyChartData, CompanyDeploymentByCountryPCAndSpecialtyGridData, CompanyPortfolioByTCAndSalesForceChartData, CompanyPortfolioByTCAndSalesForceGridData, FilteredTotalCompanyDeploymentByCountryAndTCGridData, ProductFTEsByTCAndSalesForceUsingBrandNameChartData, ProductFTEsByTCAndSalesForceUsingBrandNameGridData, ProductFTEsByTCAndSalesForceUsingGenericNameChartData, ProductFTEsByTCAndSalesForceUsingGenericNameGridData, ReachAndFrequencyBySalesForceAndProductChartData, ReachAndFrequencyBySalesForceAndProductGridData, SalesRepresentativeCompensationBySalesForceAndProductChartData, SalesRepresentativeCompensationBySalesForceAndProductGridData, TotalCompanyDeploymentByCountryAndTCChartData, TotalCompanyDeploymentByCountryAndTCGridData } from '../../../models/AnalyticsDataModels';
import { ChartFiveDataset, ChartFourDataset, ChartOneDataset, ChartSevenDataset, ChartSixDataset, ChartTwoDataset } from '../../../models/ChartDataset';
import { MatAccordion } from '@angular/material/expansion';
import * as _ from 'underscore';
import { getAverage } from '../../../services/common/utility';
import { CustomerDropdownGroupModel, CustomerDropdownModel } from '../../../models/CustomerDropdown';
import { UserAnalyticFilters } from '../../../models/userPreference';
import { UserRight } from '../../../models/userRights';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { UserSavedSearchsPopupComponent } from '../../shared/analytics/user-saved-searchs-popup/user-saved-searchs-popup.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserPermissionModel } from '../../../models/AppFunction';

@Component({
  selector: 'app-analytics-data',
  templateUrl: './analytics-data.component.html',
  styleUrls: ['./analytics-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AnalyticsDataComponent implements OnInit {
  accordion = viewChild.required(MatAccordion);
  chart: any;
  pieChart: any;
  triChart: any;
  currentUser: any;
  isShowPieChart = false;
  isShowTriChart = false;
  userSavedFilters: Array<UserAnalyticFilters> = [];
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  userRights: UserRight = {} as UserRight;
  userPermission: UserPermissionModel = {
    canAccessReport: true,
    canExportExcel: true,
    canSaveSearch: true
  } as UserPermissionModel;
  adminFunctionList = "";
  FN_ExportExcel = "54";
  FN_SaveSearch = "55";
  filterChipList: Array<IdNamePair> = [];

  customLabelsPlugin = {
    id: 'customLabels',
    afterDatasetsDraw: function (chart: any) {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxisTop = chart.scales.x.bottom;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = 'bold 14px Arial';
      ctx.strokeStyle = 'black'; // Set border color to red
      ctx.lineWidth = 2; // Set border thickness


      let companyNames: string[] = ctx.companyNames;

      const totalContries = xAxis.ticks.length / companyNames.length;

      companyNames.forEach((company, index) => {
        const companyStart = xAxis.getPixelForTick(index * totalContries);
        const companyEnd = xAxis.getPixelForTick(((index + 1) * totalContries) - 1);

        const companyCenter = (companyStart + companyEnd) / 2;

        // Calculate text height
        const textHeight = 16; // Approximate height based on font size

        // Draw the company labels with a red border
        if (companyNames.length) {
          ctx.fillText(companyNames[index], companyCenter, yAxisTop - 70);
          ctx.strokeRect(companyStart, yAxisTop - 70 - textHeight, companyEnd - companyStart, textHeight + 10);
        }

      });


      ctx.restore();

    }
  };


  all_data: dropdowncollection | undefined;

  selectedReport: number = 1;
  chartName = "Company Deployment By PC/SP Split";
  isReset = false;
  user_id = 0;

  citations: citation[] = [];

  searchForm: FormGroup;
  therapeuticCategories: TherapeuticCategory[] = [];
  therapeuticCategoriesBase: TherapeuticCategory[] = [];
  therapeuticCatForCompanyCountryAnalysis: CustomerDropdownModel[] = [];
  companies: Company[] = [];
  countries: Country[] = [];
  periodList: Period[] = [];
  companiesBase: Company[] = [];
  countriesBase: Country[] = [];
  periodListBase: Period[] = [];
  companyCountries: any[] = [];
  isUseBrandGroup: boolean = false;
  brandListCompany1: IdNamePair[] = [];
  brandListCompany2: IdNamePair[] = [];
  brandListCompany3: IdNamePair[] = [];
  brandListCompany4: IdNamePair[] = [];
  brandListCompany5: IdNamePair[] = [];
  myBrandGroups: MyBrand[] = [];

  genericNameListCompany1: GenericName[] = [];
  genericNameListCompany2: GenericName[] = [];
  genericNameListCompany3: GenericName[] = [];
  genericNameListCompany4: GenericName[] = [];
  genericNameListCompany5: GenericName[] = [];

  salesforceListCompany1: Salesforce[] = [];
  salesforceListCompany2: Salesforce[] = [];
  salesforceListCompany3: Salesforce[] = [];
  salesforceListCompany4: Salesforce[] = [];
  salesforceListCompany5: Salesforce[] = [];

  companyCountryAnalysisGridDataList: CompanyCountryAnalysisGridData[] = [];
  CompanyCountryAnalysisChartDataList: CompanyCountryAnalysisChartData[] = [];
  reachAndFrequencyBySalesForceAndProductGridData: ReachAndFrequencyBySalesForceAndProductGridData[] = [];
  reachAndFrequencyBySalesForceAndProductChartData: ReachAndFrequencyBySalesForceAndProductChartData[] = [];
  salesRepresentativeCompensationBySalesForceAndProductGridData: SalesRepresentativeCompensationBySalesForceAndProductGridData[] = [];
  salesRepresentativeCompensationBySalesForceAndProductChartData: SalesRepresentativeCompensationBySalesForceAndProductChartData[] = [];
  ProductFTEsByTCAndSalesForceUsingGenericNameGridData: ProductFTEsByTCAndSalesForceUsingGenericNameGridData[] = [];
  productFTEsByTCAndSalesForceUsingGenericNameChartData: ProductFTEsByTCAndSalesForceUsingGenericNameChartData[] = [];
  productFTEsByTCAndSalesForceUsingBrandNameGridData: ProductFTEsByTCAndSalesForceUsingBrandNameGridData[] = [];
  productFTEsByTCAndSalesForceUsingBrandNameChartData: ProductFTEsByTCAndSalesForceUsingBrandNameChartData[] = [];
  companyPortfolioByTCAndSalesForceGridData: CompanyPortfolioByTCAndSalesForceGridData[] = [];
  companyPortfolioByTCAndSalesForceChartData: CompanyPortfolioByTCAndSalesForceChartData[] = [];
  totalCompanyDeploymentByCountryAndTCGridData: TotalCompanyDeploymentByCountryAndTCGridData[] = [];
  totalCompanyDeploymentByCountryAndTCChartData: TotalCompanyDeploymentByCountryAndTCChartData[] = [];
  companyDeploymentByCountryPCAndSpecialtyGridData: CompanyDeploymentByCountryPCAndSpecialtyGridData[] = [];
  companyDeploymentByCountryPCAndSpecialtyChartData: CompanyDeploymentByCountryPCAndSpecialtyChartData[] = [];
  filteredTotalCompanyDeploymentByCountryAndTCGridData: FilteredTotalCompanyDeploymentByCountryAndTCGridData[] = [];
  selectedCountries: Country[] = [];
  columnsLength: number = 0;

  showFilter = false;
  private filterState = new BehaviorSubject<string>('');

  constructor(private storageService: StorageService, private toasterService: ToasterService, private dialog: MatDialog,
    private apiService: ApiService, public fb: FormBuilder, private cd: ChangeDetectorRef,
  ) {
    this.searchForm = this.fb.group({
      country_id: [null],
      company_id: [null],
      period_id: [null],
      brandGroup: [null],
      therapeutic_category_id: [null],
      company_id_1: [null],
      company_id_2: [null],
      company_id_3: [null],
      company_id_4: [null],
      company_id_5: [null],
      brand_id_1: [null],
      brand_id_2: [null],
      brand_id_3: [null],
      brand_id_4: [null],
      brand_id_5: [null],
      generic_id_1: [null],
      generic_id_2: [null],
      generic_id_3: [null],
      generic_id_4: [null],
      generic_id_5: [null],
      salesForce_id_1: [null],
      salesForce_id_2: [null],
      salesForce_id_3: [null],
      salesForce_id_4: [null],
      salesForce_id_5: [null]
    });
  }


  buildFilterChipList(filters: any) {

    this.filterChipList = new Array<IdNamePair>();

    if (filters && filters.country_id && this.countries && Array.isArray(filters.country_id)) {
      let ops = this.countries.filter(b => filters.country_id.includes(b.country_Id)).map(op => ({ id: op.country_Id, name: op.country_Name }));
      ops.forEach(op => {
        this.filterChipList.push(op);
      });
    }
    else {
      if (filters && filters.country_id && this.countries && Array.isArray(filters.country_id) == false) {
        let op = this.countries.find(c => c.country_Id == filters.country_id);
        if (op) {
          this.filterChipList.push({ id: op.country_Id, name: op.country_Name });
        }
      }
    }

    if(filters && filters.company_id && this.companies && Array.isArray(filters.company_id)) {
        let ops = this.companies.filter(b => filters.company_id.includes(b.company_Id)).map(op => ({ id: op.company_Id, name: op.company_Name }));
        ops.forEach(op => {
          this.filterChipList.push(op);
        });
      }
    else {
      if (filters && filters.company_id && this.companies && Array.isArray(filters.company_id) == false) {
        let op = this.companies.find(c => c.company_Id == filters.company_id);
        if (op) {
          this.filterChipList.push({ id: op.company_Id, name: op.company_Name });
        }
      }
      }

    if (filters && filters.period_id && this.periodList && Array.isArray(filters.period_id)) {
      let ops = this.periodList.filter(b => filters.period_id.includes(b.period_Id)).map(op => ({ id: op.period_Id, name: op.displayed_Title }));
      ops.forEach(op => {
        this.filterChipList.push(op);
      });
    }
    else {
      if (filters && filters.period_id && this.periodList && Array.isArray(filters.period_id) == false) {
        let op = this.periodList.find(c => c.period_Id == filters.period_id);
        if (op) {
          this.filterChipList.push({ id: op.period_Id, name: op.displayed_Title });
        }
      }
    }

    if (filters && filters.therapeutic_category_id && this.therapeuticCategories && Array.isArray(filters.therapeutic_category_id)) {
      let ops = this.therapeuticCategories.filter(b => filters.therapeutic_category_id.includes(b.therapeuticCategory_Id)).map(op => ({ id: op.therapeuticCategory_Id, name: op.therapeuticCategory_Name }));
      ops.forEach(op => {
        this.filterChipList.push(op);
      });
    }
    else {
      if (filters && filters.therapeutic_category_id && this.therapeuticCategories && Array.isArray(filters.therapeutic_category_id) == false) {
        let op = this.therapeuticCategories.find(c => c.therapeuticCategory_Id == filters.therapeutic_category_id);
        if (op) {
          this.filterChipList.push({ id: op.therapeuticCategory_Id, name: op.therapeuticCategory_Name });
        }
      }
    }

    if (filters && filters.company_id_1 && this.companies && Array.isArray(this.companies)) {
      let op = this.companies.find(b => b.company_Id == filters.company_id_1);
      if (op) {
        this.filterChipList.push({ id: op.company_Id, name: op.company_Name });
      }
    }

    if (filters && filters.company_id_2 && this.companies && Array.isArray(this.companies)) {
      let op = this.companies.find(b => b.company_Id == filters.company_id_2);
      if (op) {
        this.filterChipList.push({ id: op.company_Id, name: op.company_Name });
      }
    }

    if (filters && filters.company_id_3 && this.companies && Array.isArray(this.companies)) {
      let op = this.companies.find(b => b.company_Id == filters.company_id_3);
      if (op) {
        this.filterChipList.push({ id: op.company_Id, name: op.company_Name });
      }
    }

    if (filters && filters.company_id_4 && this.companies && Array.isArray(this.companies)) {
      let op = this.companies.find(b => b.company_Id == filters.company_id_4);
      if (op) {
        this.filterChipList.push({ id: op.company_Id, name: op.company_Name });
      }
    }

    if (filters && filters.company_id_5 && this.companies && Array.isArray(this.companies)) {
      let op = this.companies.find(b => b.company_Id == filters.company_id_5);
      if (op) {
        this.filterChipList.push({ id: op.company_Id, name: op.company_Name });
      }
    }

    if (filters && filters.generic_id_1 && this.genericNameListCompany1 && Array.isArray(this.genericNameListCompany1)) {
      let op = this.genericNameListCompany1.find(b => b.genericName_Id == filters.generic_id_1);
      if (op) {
        this.filterChipList.push({ id: op.genericName_Id, name: op.generic_Name });
      }
    }

    if (filters && filters.generic_id_2 && this.genericNameListCompany2 && Array.isArray(this.genericNameListCompany2)) {
      let op = this.genericNameListCompany2.find(b => b.genericName_Id == filters.generic_id_2);
      if (op) {
        this.filterChipList.push({ id: op.genericName_Id, name: op.generic_Name });
      }
    }

    if (filters && filters.generic_id_3 && this.genericNameListCompany3 && Array.isArray(this.genericNameListCompany3)) {
      let op = this.genericNameListCompany3.find(b => b.genericName_Id == filters.generic_id_3);
      if (op) {
        this.filterChipList.push({ id: op.genericName_Id, name: op.generic_Name });
      }
    }

    if (filters && filters.generic_id_4 && this.genericNameListCompany4 && Array.isArray(this.genericNameListCompany4)) {
      let op = this.genericNameListCompany4.find(b => b.genericName_Id == filters.generic_id_4);
      if (op) {
        this.filterChipList.push({ id: op.genericName_Id, name: op.generic_Name });
      }
    }

    if (filters && filters.generic_id_5 && this.genericNameListCompany5 && Array.isArray(this.genericNameListCompany5)) {
      let op = this.genericNameListCompany5.find(b => b.genericName_Id == filters.generic_id_5);
      if (op) {
        this.filterChipList.push({ id: op.genericName_Id, name: op.generic_Name });
      }
    }

    if (filters && filters.brandGroup && Array.isArray(filters.brandGroup) && this.myBrandGroups) {
      let bgs = this.myBrandGroups.filter(bg => filters.brandGroup.includes(bg)).map(item => ({ id: item.id, name: item.name }));
      bgs.forEach(op => {
        this.filterChipList.push(op);
      });

    }

    if (filters && filters.brand_id_1 && this.brandListCompany1 && Array.isArray(this.brandListCompany1)) {
      let op = this.brandListCompany1.find(b => b.id == filters.brand_id_1);
      if (op) {
        this.filterChipList.push(op);
      }
    }

    if (filters && filters.brand_id_2 && this.brandListCompany2 && Array.isArray(this.brandListCompany2)) {
      let op = this.brandListCompany2.find(b => b.id == filters.brand_id_2);
      if (op) {
        this.filterChipList.push(op);
      }
    }

    if (filters && filters.brand_id_3 && this.brandListCompany3 && Array.isArray(this.brandListCompany3)) {
      let op = this.brandListCompany3.find(b => b.id == filters.brand_id_3);
      if (op) {
        this.filterChipList.push(op);
      }
    }

    if (filters && filters.brand_id_4 && this.brandListCompany4 && Array.isArray(this.brandListCompany4)) {
      let op = this.brandListCompany4.find(b => b.id == filters.brand_id_4);
      if (op) {
        this.filterChipList.push(op);
      }
    }

    if (filters && filters.brand_id_5 && this.brandListCompany5 && Array.isArray(this.brandListCompany5)) {
      let op = this.brandListCompany5.find(b => b.id == filters.brand_id_5);
      if (op) {
        this.filterChipList.push(op);
      }
    }

    if (filters && filters.salesForce_id_1 && this.salesforceListCompany1 && Array.isArray(this.salesforceListCompany1)) {
      let op = this.salesforceListCompany1.find(b => b.salesforce_Id == filters.salesForce_id_1);
      if (op) {
        this.filterChipList.push({ id: op.salesforce_Id, name: op.salesforceName_Name });
      }
    }

    if (filters && filters.salesForce_id_2 && this.salesforceListCompany2 && Array.isArray(this.salesforceListCompany2)) {
      let op = this.salesforceListCompany2.find(b => b.salesforce_Id == filters.salesForce_id_2);
      if (op) {
        this.filterChipList.push({ id: op.salesforce_Id, name: op.salesforceName_Name });
      }
    }

    if (filters && filters.salesForce_id_3 && this.salesforceListCompany3 && Array.isArray(this.salesforceListCompany3)) {
      let op = this.salesforceListCompany3.find(b => b.salesforce_Id == filters.salesForce_id_1);
      if (op) {
        this.filterChipList.push({ id: op.salesforce_Id, name: op.salesforceName_Name });
      }
    }

    if (filters && filters.salesForce_id_4 && this.salesforceListCompany4 && Array.isArray(this.salesforceListCompany4)) {
      let op = this.salesforceListCompany4.find(b => b.salesforce_Id == filters.salesForce_id_4);
      if (op) {
        this.filterChipList.push({ id: op.salesforce_Id, name: op.salesforceName_Name });
      }
    }

    if (filters && filters.salesForce_id_5 && this.salesforceListCompany5 && Array.isArray(this.salesforceListCompany5)) {
      let op = this.salesforceListCompany5.find(b => b.salesforce_Id == filters.salesForce_id_5);
      if (op) {
        this.filterChipList.push({ id: op.salesforce_Id, name: op.salesforceName_Name });
      }
    }

  }

  onAnalyticFilterChanges(): void {
    this.searchForm.valueChanges.subscribe(val => {
      this.buildFilterChipList(val);
    });
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

  refresh() {
    this.cd.detectChanges();
  }

  getFilterState() {
    return this.filterState.asObservable();
  }

  setNextFilterState(stateName:string) {
    this.filterState.next(stateName);
  }

  getCompanyCountryAnalysisGridData(params: any) {
    this.companyCountryAnalysisGridDataList = new Array<CompanyCountryAnalysisGridData>();
    this.apiService.PostAll(GetCompanyCountryAnalysisGridData, params).subscribe(response => {
      if (response.status) {
        this.companyCountryAnalysisGridDataList = this.manipulateCompanyCountryAnalysisGridData(response.result);
        //citations
        this.companyCountryAnalysisGridDataList.forEach(item => {
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
      }
    });
  }

  manipulateCompanyCountryAnalysisGridData(arr: CompanyCountryAnalysisGridData[]) {
    let helper: any = {};
    let company: string = this.companiesBase.find(c => c.company_Id == this.searchForm.controls['company_id'].value)?.company_Name ?? 'Unknown Company';
    var result = arr.reduce(function (r: any, o: any) {
      var key = o.country_id + '-' + o.period_id + '-' + o.salesforcename_id;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }

        helper[key].company = company;

        r.push(helper[key]);
      } else {
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }

        helper[key].salesforce_size += o.salesforce_size;
        helper[key].total += o.total;
        helper[key].pc += o.pc;
        helper[key].sp += o.sp;

      }

      return r;
    }, []);

    return result;
  }


  getCompanyCountryAnalysisChartData(params: any) {
    this.CompanyCountryAnalysisChartDataList = new Array<CompanyCountryAnalysisChartData>();
    this.apiService.PostAll(GetCompanyCountryAnalysisChartData, params).subscribe(response => {
      if (response.status) {
        this.CompanyCountryAnalysisChartDataList = response.result;
        this.displayUpdatedChart('8');

      }
    });
  }

  getCompanyDeploymentByCountryPCAndSpecialtyGridData(params: any) {
    this.companyDeploymentByCountryPCAndSpecialtyGridData = new Array<CompanyDeploymentByCountryPCAndSpecialtyGridData>();
    this.apiService.PostAll(GetCompanyDeploymentByCountryPCAndSpecialtyGridData, params).subscribe(response => {
      if (response.status) {
        this.companyDeploymentByCountryPCAndSpecialtyGridData = response.result;
        if (response.result && response.result.length) {
          let period: string = this.periodListBase.find(p => p.period_Id == this.searchForm.controls['period_id'].value)?.displayed_Title || 'Unknown Period';

          this.companyDeploymentByCountryPCAndSpecialtyGridData.forEach((item, index) => {
            item.period = period;
          });

          //citations
          this.companyDeploymentByCountryPCAndSpecialtyGridData.forEach(item => {
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
        }
      }
    });
  }

  getCompanyDeploymentByCountryPCAndSpecialtyChartData(params: any) {
    this.companyDeploymentByCountryPCAndSpecialtyChartData = new Array<CompanyDeploymentByCountryPCAndSpecialtyChartData>();
    this.apiService.PostAll(GetCompanyDeploymentByCountryPCAndSpecialtyChartData, params).subscribe(response => {
      if (response.status) {
        this.companyDeploymentByCountryPCAndSpecialtyChartData = response.result;
        this.displayUpdatedChart('1');
      }
    });
  }

  trackByIndex = (index: number,obj:any): number => {
    return obj;
  };

  getTotalCompanyDeploymentByCountryAndTCGridData(params: any) {
    this.totalCompanyDeploymentByCountryAndTCGridData = new Array<TotalCompanyDeploymentByCountryAndTCGridData>();
    this.apiService.PostAll(GetTotalCompanyDeploymentByCountryAndTCGridData, params).subscribe(response => {
      if (response.status) {
        this.totalCompanyDeploymentByCountryAndTCGridData = response.result;
        if (response.result && response.result.length) {
          let period: string = this.periodList.find(p => p.period_Id == this.searchForm.controls['period_id'].value)?.displayed_Title || 'Unknown Period';

          this.totalCompanyDeploymentByCountryAndTCGridData.forEach((item, index) => {
            item.period = period;
          });

          const countries = this.searchForm.get('country_id')?.value;
          this.selectedCountries = this.countries.filter((country) => countries?.includes(country?.country_Id));
          this.columnsLength = this.selectedCountries?.length + 1 || 0;
          let therapeuticCategories  = this.totalCompanyDeploymentByCountryAndTCGridData.map((e) => e?.therapeuticcategory_id);
          therapeuticCategories = [...new Set(therapeuticCategories)];
          const totalCompanyDeploymentByCountryAndTCGridData: any = [];

          therapeuticCategories.forEach((id) => {
            const data = this.totalCompanyDeploymentByCountryAndTCGridData.filter((item) => item.therapeuticcategory_id === id);
            const values = this.selectedCountries.map((e) => {
              const value = data.find((item) => item?.country_id === e?.country_Id);
              return value?.total || null;
            });
            const obj = {
              therapeuticcategory_name: data[0]?.therapeuticcategory_name,
              period: data[0]?.period,
              data: values
            };

            //citations
            if (data[0]) {
              if (data[0].column_names && data[0].column_names.length) {
              const columnNames = data[0].column_names.split('^|');
              const columnValues = data[0].citations_text.split('^|');

              data[0].hasAsterisk = {};
              data[0].citationValue = {};

              columnNames.forEach((name, index) => {
                if (columnValues[index]) {
                  data[0].hasAsterisk[name.trim()] = true;
                  data[0].citationValue[name.trim()] = columnValues[index];
                } else {
                  data[0].hasAsterisk[name.trim()] = false;
                  data[0].citationValue[name.trim()] = '';
                }
              });

              }

            }

            totalCompanyDeploymentByCountryAndTCGridData.push(obj);
          })

          this.filteredTotalCompanyDeploymentByCountryAndTCGridData = totalCompanyDeploymentByCountryAndTCGridData;
          
          
        }
      }
    });
  }

  getTotalCompanyDeploymentByCountryAndTCChartData(params: any) {
    this.totalCompanyDeploymentByCountryAndTCChartData = new Array<TotalCompanyDeploymentByCountryAndTCChartData>();
    this.apiService.PostAll(GetTotalCompanyDeploymentByCountryAndTCChartData, params).subscribe(response => {
      if (response.status) {
        this.totalCompanyDeploymentByCountryAndTCChartData = response.result;
        this.displayUpdatedChart('2');
      }
    });
  }

  getCompanyPortfolioByTCAndSalesForceGridData(params: any) {
    this.companyPortfolioByTCAndSalesForceGridData = new Array<CompanyPortfolioByTCAndSalesForceGridData>();
    this.apiService.PostAll(GetCompanyPortfolioByTCAndSalesForceGridData, params).subscribe(response => {
      if (response.status) {
        this.companyPortfolioByTCAndSalesForceGridData = this.manipulateCompanyPortfolioGridData(response.result);
        //citations
        this.companyPortfolioByTCAndSalesForceGridData.forEach(item => {
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
      }
    });
  }

  manipulateCompanyPortfolioGridData(arr: CompanyPortfolioByTCAndSalesForceGridData[]) {
    let helper: any = {};
    let country: string = this.countriesBase.find(c => c.country_Id == this.searchForm.controls['country_id'].value)?.country_Name ?? 'Unknown Country';
    let period: string = this.periodListBase.find(p => p.period_Id == this.searchForm.controls['period_id'].value)?.displayed_Title ?? 'Unknown Period';
    var result = arr.reduce(function (r:any, o:any) {
      var key = o.company_name + '-' + o.therapeuticcategory_name;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name,pc:o.pc,sp:o.sp, total: o.total });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }

        helper[key].country = country;
        helper[key].period = period;

        r.push(helper[key]);
      } else {
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }

        helper[key].total += o.total;
        helper[key].pc += o.pc;
        helper[key].sp += o.sp;

      }

      return r;
    }, []);

    return result;
  }

  getCompanyPortfolioByTCAndSalesForceChartData(params: any) {
    this.companyPortfolioByTCAndSalesForceChartData = new Array<CompanyPortfolioByTCAndSalesForceChartData>();
    this.apiService.PostAll(GetCompanyPortfolioByTCAndSalesForceChartData, params).subscribe(response => {
      if (response.status) {
        this.companyPortfolioByTCAndSalesForceChartData = response.result;
        this.displayUpdatedChart('3');
      }
    });
  }

  getProductFTEsByTCAndSalesForceUsingBrandNameGridData(params: any) {
    this.productFTEsByTCAndSalesForceUsingBrandNameGridData = new Array<ProductFTEsByTCAndSalesForceUsingBrandNameGridData>();
    this.apiService.PostAll(GetProductFTEsByTCAndSalesForceUsingBrandNameGridData, params).subscribe(response => {
      if (response.status) {
        this.productFTEsByTCAndSalesForceUsingBrandNameGridData = this.manipulateProductFTEsByTCAndSalesForceUsingBrandNameGridData(response.result);
        //citations
        this.productFTEsByTCAndSalesForceUsingBrandNameGridData.forEach(item => {
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
      }
    });
  }

  manipulateProductFTEsByTCAndSalesForceUsingBrandNameGridData(arr: ProductFTEsByTCAndSalesForceUsingBrandNameGridData[]) {
    let helper: any = {};
    let country: string = this.countriesBase.find(c => c.country_Id == this.searchForm.controls['country_id'].value)?.country_Name ?? 'Unknown Country';
    let period: string = this.periodListBase.find(c => c.period_Id == this.searchForm.controls['period_id'].value)?.displayed_Title ?? 'Unknown Period';
    var result = arr.reduce(function (r: any, o: any) {
      var key = o.company_id + '-' + o.salesforcename_id;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }

        helper[key].country = country;
        helper[key].period = period;
        helper[key].focused = helper[key].pc > helper[key].sp ? 'Pc Focused' : 'Sp Focused';

        r.push(helper[key]);
      } else {
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: o.total });
        }


        helper[key].total += o.total;
        helper[key].pc += o.pc;
        helper[key].sp += o.sp;

        helper[key].focused = helper[key].pc > helper[key].sp ? 'Pc Focused' : 'Sp Focused';
      }

      return r;
    }, []);

    return result;
  }

  getProductFTEsByTCAndSalesForceUsingBrandNameChartData(params: any) {
    this.productFTEsByTCAndSalesForceUsingBrandNameChartData = new Array<ProductFTEsByTCAndSalesForceUsingBrandNameChartData>();
    this.apiService.PostAll(GetProductFTEsByTCAndSalesForceUsingBrandNameChartData, params).subscribe(response => {
      if (response.status) {
        this.productFTEsByTCAndSalesForceUsingBrandNameChartData = response.result;
        this.displayUpdatedChart('4');
      }
    });
  }


  createChartDatasetForChartFour(): ChartFourDataset {

    let dataset: ChartFourDataset = {
      uniqlabels: [],
      globalDataSet: null
    };

    let data = this.productFTEsByTCAndSalesForceUsingBrandNameChartData;
    let barChartData: any[] = [];
    let salesforces: string[] = data.map(d => d.salesforcename_name);


    salesforces.forEach(sf => {

      if (barChartData.findIndex(c => c.label == sf) == -1) {
        let obj: any = { data: [], label: '', barThickness:50 };
        obj.data = [];
        obj.label = sf;
        obj.barThickness=50;
        barChartData.push(obj);
      }

    });

    const uniqueCombinations = new Set<string>();
    const product_data = new Set<number>();
    const sp_data = new Set<number>();

    data.forEach(item => {
      const combination = `${item.company_name}`;
      product_data.add(item.product_id);
      uniqueCombinations.add(combination);
    });

    const uniqueLabels = Array.from(uniqueCombinations);
    dataset.uniqlabels = uniqueLabels;


    let manipulated_data: any = [];
    barChartData.forEach(item => {
      uniqueLabels.forEach(company_name => {


        let in_data = data.find(c => c.company_name == company_name && c.salesforcename_name == item.label);
        if (in_data)
          item.data.push(in_data.total);
        else
          item.data.push(0);

      });
    });


    dataset.globalDataSet = barChartData;

    return dataset;
  }

  getProductFTEsByTCAndSalesForceUsingGenericNameGridData(params: any) {
    this.ProductFTEsByTCAndSalesForceUsingGenericNameGridData = new Array<ProductFTEsByTCAndSalesForceUsingGenericNameGridData>();
    this.apiService.PostAll(GetProductFTEsByTCAndSalesForceUsingGenericNameGridData, params).subscribe(response => {
      if (response.status) {
        this.ProductFTEsByTCAndSalesForceUsingGenericNameGridData = this.manipulateProductFTEsByTCAndSalesForceUsingGenericNameGridData(response.result);
        //citations
        this.ProductFTEsByTCAndSalesForceUsingGenericNameGridData.forEach(item => {
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
      }
    });
  }

  manipulateProductFTEsByTCAndSalesForceUsingGenericNameGridData(arr: ProductFTEsByTCAndSalesForceUsingGenericNameGridData[]) {
    let helper: any = {};
    let country: string = this.countriesBase.find(c => c.country_Id == this.searchForm.controls['country_id'].value)?.country_Name ?? 'Unknown Country';
    let period: string = this.periodListBase.find(c => c.period_Id == this.searchForm.controls['period_id'].value)?.displayed_Title ?? 'Unknown Period';
    var result = arr.reduce(function (r: any, o: any) {
      var key = o.company_id + '-' + o.salesforcename_id;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.genericname_name, pc: o.pc, sp: o.sp, total: o.total });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.genericname_name, pc: o.pc, sp: o.sp, total: o.total });
        }

        helper[key].country = country;
        helper[key].period = period;
        helper[key].focused = helper[key].pc > helper[key].sp ? 'Pc Focused' : 'Sp Focused';

        r.push(helper[key]);
      } else {
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.genericname_name, pc: o.pc, sp: o.sp, total: o.total });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.genericname_name, pc: o.pc, sp: o.sp, total: o.total });
        }


        helper[key].total += o.total;
        helper[key].pc += o.pc;
        helper[key].sp += o.sp;

        helper[key].focused = helper[key].pc > helper[key].sp ? 'Pc Focused' : 'Sp Focused';
      }

      return r;
    }, []);

    return result;
  }

  getProductFTEsByTCAndSalesForceUsingGenericNameChartData(params: any) {
    this.productFTEsByTCAndSalesForceUsingGenericNameChartData = new Array<ProductFTEsByTCAndSalesForceUsingGenericNameChartData>();
    this.apiService.PostAll(GetProductFTEsByTCAndSalesForceUsingGenericNameChartData, params).subscribe(response => {
      if (response.status) {
        this.productFTEsByTCAndSalesForceUsingGenericNameChartData = response.result;
        this.displayUpdatedChart('5');
      }
    });
  }

  createChartDatasetForChartFive(): ChartFiveDataset {

    let dataset: ChartFiveDataset = {
      uniqlabels: [],
      globalDataSet: null
    };

    let data = this.productFTEsByTCAndSalesForceUsingGenericNameChartData;
    let barChartData: any[] = [];
    let salesforces: string[] = data.map(d => d.salesforcename_name);


    salesforces.forEach(sf => {

      if (barChartData.findIndex(c => c.label == sf) == -1) {
        let obj: any = { data: [], label: '', barThickness: 50 };
        obj.data = [];
        obj.label = sf;
        obj.barThickness = 50;
        barChartData.push(obj);
      }

    });

    const uniqueCombinations = new Set<string>();
    const genericname_data = new Set<number>();
    const sp_data = new Set<number>();

    data.forEach(item => {
      const combination = `${item.company_name}`;
      genericname_data.add(item.genericname_id);
      uniqueCombinations.add(combination);
    });

    const uniqueLabels = Array.from(uniqueCombinations);
    dataset.uniqlabels = uniqueLabels;

    barChartData.forEach(item => {
      uniqueLabels.forEach(company_name => {


        let in_data = data.find(c => c.company_name == company_name && c.salesforcename_name == item.label);
        if (in_data)
          item.data.push(in_data.total);
        else
          item.data.push(0);

      });
    });


    dataset.globalDataSet = barChartData;

    return dataset;
  }

  getSalesRepresentativeCompensationBySalesForceAndProductGridData(params: any) {
    this.salesRepresentativeCompensationBySalesForceAndProductGridData = new Array<SalesRepresentativeCompensationBySalesForceAndProductGridData>();
    this.apiService.PostAll(GetSalesRepresentativeCompensationBySalesForceAndProductGridData, params).subscribe(response => {
      if (response.status) {
        this.salesRepresentativeCompensationBySalesForceAndProductGridData = response.result;
        if (response.result && response.result.length) {
          let period: string = this.periodListBase.find(p => p.period_Id == this.searchForm.controls['period_id'].value)?.displayed_Title || 'Unknown Period';
          let country: string = this.countriesBase.find(p => p.country_Id == this.searchForm.controls['country_id'].value)?.country_Name || 'Unknown Country';

          this.salesRepresentativeCompensationBySalesForceAndProductGridData.forEach((item, index) => {
            item.period = period;
            item.country = country;
          });

          //citations
          this.salesRepresentativeCompensationBySalesForceAndProductGridData.forEach(item => {
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
        }
      }
    });
  }

  createChartDatasetForChartSix(list: SalesRepresentativeCompensationBySalesForceAndProductChartData[]): ChartSixDataset {
    let dataset: ChartSixDataset = {
      companySalesforceProductComposedLabels: [],
      bonusValues: [],
      highSalaryValues: [],
      lowSalaryValues: []
    };

    let helper: any = {};
    var result: SalesRepresentativeCompensationBySalesForceAndProductChartData[] = list.reduce(function (r: any, o: any) {
      var key = o.company_id + '-' + o.salesforcename_id;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, salary_low: o.salary_low, salary_high: o.salary_high, target_bonus: o.target_bonus });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, salary_low: o.salary_low, salary_high: o.salary_high, target_bonus: o.target_bonus });
        }

        let sls: number[] = _.pluck(helper[key].products, 'salary_low');
        let slh: number[] = _.pluck(helper[key].products, 'salary_high');
        let tbs: number[] = _.pluck(helper[key].products, 'target_bonus');

        helper[key].salary_low = _.min(sls);
        helper[key].salary_high = _.max(slh);
        helper[key].target_bonus = getAverage(tbs);

        r.push(helper[key]);
      } else {
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, salary_low: o.salary_low, salary_high: o.salary_high, target_bonus: o.target_bonus });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, salary_low: o.salary_low, salary_high: o.salary_high, target_bonus: o.target_bonus });
        }

        let sls: number[] = _.pluck(helper[key].products, 'salary_low');
        let slh: number[] = _.pluck(helper[key].products, 'salary_high');
        let tbs: number[] = _.pluck(helper[key].products, 'target_bonus');

        helper[key].salary_low = _.min(sls);
        helper[key].salary_high = _.max(slh);
        helper[key].target_bonus = getAverage(tbs);

      }

      return r;
    }, []);

    result.forEach(item => {

      let productNames: string[] = _.pluck(item.products, 'name');
      let composedName: string = item.company_name + '-' + item.salesforcename_name + '-' + productNames.join('/');
      dataset.companySalesforceProductComposedLabels.push(composedName);
      dataset.lowSalaryValues.push(item.salary_low);
      dataset.highSalaryValues.push(item.salary_high);
      dataset.bonusValues.push(item.target_bonus);

    });

    return dataset;
  }

  getSalesRepresentativeCompensationBySalesForceAndProductChartData(params: any) {
    this.salesRepresentativeCompensationBySalesForceAndProductChartData = new Array<SalesRepresentativeCompensationBySalesForceAndProductChartData>()
    this.apiService.PostAll(GetSalesRepresentativeCompensationBySalesForceAndProductChartData, params).subscribe(response => {
      if (response.status) {
        this.salesRepresentativeCompensationBySalesForceAndProductChartData = response.result;
        this.displayUpdatedChart('6');
      }
    });
  }

  getReachAndFrequencyBySalesForceAndProductGridData(params: any) {
    this.reachAndFrequencyBySalesForceAndProductGridData = new Array<ReachAndFrequencyBySalesForceAndProductGridData>();
    this.apiService.PostAll(GetReachAndFrequencyBySalesForceAndProductGridData, params).subscribe(response => {
      if (response.status) {
        this.reachAndFrequencyBySalesForceAndProductGridData = this.manipulateReachAndFrequencyBySalesForceAndProductGridData(response.result);
        //citations
        this.reachAndFrequencyBySalesForceAndProductGridData.forEach(item => {
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
      }
    });
  }

  manipulateReachAndFrequencyBySalesForceAndProductGridData(arr: ReachAndFrequencyBySalesForceAndProductGridData[]) {
    let helper: any = {};
    let country: string = this.countriesBase.find(c => c.country_Id == this.searchForm.controls['country_id'].value)?.country_Name ?? 'Unknown Country';
    let period: string = this.periodListBase.find(c => c.period_Id == this.searchForm.controls['period_id'].value)?.displayed_Title ?? 'Unknown Period';
    var result = arr.reduce(function (r: any, o: any) {
      var key = o.company_id + '-' + o.salesforcename_id;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: (o.pc + o.sp) });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: (o.pc + o.sp) });
        }

        helper[key].country = country;
        helper[key].period = period;
        helper[key].focused = helper[key].pc > helper[key].sp ? 'Pc Focused' : 'Sp Focused';

        let pc = (helper[key].pc / (helper[key].pc + helper[key].sp)) * 100;
        let sp = (helper[key].sp / (helper[key].pc + helper[key].sp)) * 100;
        helper[key].pc_vs_sp = Math.round(pc) + '/' + Math.round(sp);

        r.push(helper[key]);
      } else {
        if (helper[key].products && Array.isArray(helper[key].products)) {
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: (o.pc + o.sp) });
        }
        else {
          helper[key].products = [];
          helper[key].products.push({ name: o.product_name, pc: o.pc, sp: o.sp, total: (o.pc + o.sp) });
        }


        helper[key].total += o.total;
        helper[key].pc += o.pc;
        helper[key].sp += o.sp;

        helper[key].focused = helper[key].pc > helper[key].sp ? 'Pc Focused' : 'Sp Focused';
        let pc = (helper[key].pc / (helper[key].pc + helper[key].sp)) * 100;
        let sp = (helper[key].sp / (helper[key].pc + helper[key].sp)) * 100;
        helper[key].pc_vs_sp = Math.round(pc) + '/' + Math.round(sp);

      }

      return r;
    }, []);

    return result;
  }

  getReachAndFrequencyBySalesForceAndProductChartData(params: any) {
    this.reachAndFrequencyBySalesForceAndProductChartData = new Array<ReachAndFrequencyBySalesForceAndProductChartData>();
    this.apiService.PostAll(GetReachAndFrequencyBySalesForceAndProductChartData, params).subscribe(response => {
      if (response.status) {
        this.reachAndFrequencyBySalesForceAndProductChartData = response.result;
        this.displayUpdatedChart('7');
      }
    });
  }

  createChartDatasetForChartSeven(list: ReachAndFrequencyBySalesForceAndProductChartData[]): ChartSevenDataset {

    let dataset: ChartSevenDataset = {
      salesforcelabels: [],
      reachValues: [],
      frequencyValues:[]
    };

    let helper: any = {};
    var result: ReachAndFrequencyBySalesForceAndProductChartData[] = list.reduce(function (r: any, o: any) {
      var key = o.salesforcename_name;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        helper[key].totalFrequency = o.calls_per_quarter;
        helper[key].totalReach = o.hspc;

        r.push(helper[key]);
      } else {
        helper[key].totalFrequency += o.calls_per_quarter;
        helper[key].totalReach += o.hspc;
      }

      return r;
    }, []);

    result.forEach(sfdata => {
      dataset.salesforcelabels.push(sfdata.salesforcename_name);
      dataset.frequencyValues.push(sfdata.totalFrequency);
      dataset.reachValues.push(sfdata.totalReach);
    });

    return dataset;
  }

  loadSalesforceName(companyId: number, countryId: number) {
    return this.apiService.PostAll(GetSalesforceList, { companyId: companyId, countryId: countryId, salesforceTypeId: 0 });
  }

  setSalesforceList(serial: number, companyId: number) {
    let countryId = this.searchForm.controls['country_id'].value;
    this.loadSalesforceName(companyId, countryId).subscribe(response => {
      if (response.status) {
        if (serial == 1)
          this.salesforceListCompany1 = response.result;
        else if (serial == 2)
          this.salesforceListCompany2 = response.result;
        else if (serial == 3)
          this.salesforceListCompany3 = response.result;
        else if (serial == 4)
          this.salesforceListCompany4 = response.result;
        else if (serial == 5)
          this.salesforceListCompany5 = response.result;

        this.filterDropdownListByCustomerDropdowns('salesforce', serial);
      }
    });
  }

  onchangeCompany1SalesforceChange(companyId: number) {
    let therapeutic_category_id = this.searchForm.controls['therapeutic_category_id'].value;
    //this.setSalesforceList(1, companyId);
    this.setBrandList(1, companyId, therapeutic_category_id);
  }

  onchangeCompany2SalesforceChange(companyId: number) {
    let therapeutic_category_id = this.searchForm.controls['therapeutic_category_id'].value;
    //this.setSalesforceList(2, companyId);
    this.setBrandList(2, companyId, therapeutic_category_id);
  }

  onchangeCompany3SalesforceChange(companyId: number) {
    let therapeutic_category_id = this.searchForm.controls['therapeutic_category_id'].value;
    //this.setSalesforceList(3, companyId);
    this.setBrandList(3, companyId, therapeutic_category_id);
  }

  onchangeCompany4SalesforceChange(companyId: number) {
    let therapeutic_category_id = this.searchForm.controls['therapeutic_category_id'].value;
    //this.setSalesforceList(4, companyId);
    this.setBrandList(4, companyId, therapeutic_category_id);
  }

  onchangeCompany5SalesforceChange(companyId: number) {
    let therapeutic_category_id = this.searchForm.controls['therapeutic_category_id'].value;
    //this.setSalesforceList(5, companyId);
    this.setBrandList(5, companyId, therapeutic_category_id);
  }

  loadGenericName(companyId: number) {
    return this.apiService.PostAll(GetGenericNames, { companyId: companyId });
  }

  setGenericNameList(serial: number, companyId: number) {
    this.loadGenericName(companyId).subscribe(response => {
      if (response.status) {
        if (serial == 1)
          this.genericNameListCompany1 = response.result;
        else if (serial == 2)
          this.genericNameListCompany2 = response.result;
        else if (serial == 3)
          this.genericNameListCompany3 = response.result;
        else if (serial == 4)
          this.genericNameListCompany4 = response.result;
        else if (serial == 5)
          this.genericNameListCompany5 = response.result;

        this.filterDropdownListByCustomerDropdowns('genericname', serial);
        this.onfilterChange('genericname', serial);
      }
    });
  }

  onchangeCompany1GenericChange(companyId: number) {
    this.setGenericNameList(1, companyId);
  }

  onchangeCompany2GenericChange(companyId: number) {
    this.setGenericNameList(2, companyId);
  }

  onchangeCompany3GenericChange(companyId: number) {
    this.setGenericNameList(3, companyId);
  }

  onchangeCompany4GenericChange(companyId: number) {
    this.setGenericNameList(4, companyId);
  }

  onchangeCompany5GenericChange(companyId: number) {
    this.setGenericNameList(5, companyId);
  }

  loadMyBrandGroup() {
    this.apiService.PostAll(GetMyBrandGroups, { user_id: this.currentUser.id }).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.myBrandGroups = response.result;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  onIsUseCheckChange(checked: boolean) {
    this.isUseBrandGroup = checked;
    this.searchForm.reset();
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.currentUser = this.storageService.UserDetails;
    this.adminFunctionList = this.currentUser.adminFunctions.split(",");
    this.user_id = this.currentUser.id;
    this.setUserPermission();
    this.getCustomerDropdowns();
    this.loadTherapeuticCategories();
    this.loadCompanies();
    this.loadCountires();
    this.loadCompanyCountry();
    this.loadPeriod();
    this.getUserSavedFilters();
    this.accordion().openAll();
    this.onAnalyticFilterChanges();
  }

  checkAccess(functionId: string) {
    if (this.adminFunctionList.includes(functionId)) {
      return true
    }
    else {
      return false
    }
  }

  setUserPermission() {
    if (this.storageService.UserDetails && this.storageService.UserDetails.userType == 'U' && this.storageService.UserDetails.userRights) {
      this.userPermission.canAccessReport = this.storageService.UserDetails.userRights.reportAccess;
      this.userPermission.canExportExcel = this.storageService.UserDetails.userRights.excelDownloadRights;
      this.userPermission.canSaveSearch = this.storageService.UserDetails.userRights.saveSearchAccess;
    } else {
      if (this.storageService.UserDetails.userType != 'U') {
        if (this.checkAccess(this.FN_ExportExcel)) {
          this.userPermission.canExportExcel = true;
        }
        else {
          this.userPermission.canExportExcel = false;
        }

        if (this.checkAccess(this.FN_SaveSearch)) {
          this.userPermission.canSaveSearch = true;
        }
        else {
          this.userPermission.canSaveSearch = false;
        }
      }
    }
  }

  getUserSavedFilters() {
    let data = {
      UserId: this.user_id,
      client_id: this.currentUser.clientId,
      PageName: 'Analytics'
    };

    this.apiService.PostAll(GetUserAnalyticFilters, data).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.userSavedFilters = response.result;
        if (response.result && response.result.length) {
          this.setSavedFilter();
        }
      } else {
        this.userSavedFilters = [];
      }
    });
  }

  openFilterPanelAndGo() {
    this.accordion().openAll();



    let btnGo: HTMLElement = document.getElementById('btnGo') as HTMLElement;
    if (btnGo) {
      btnGo.click();

    }
  }

  setSavedFilter(saveUserfilter?: UserAnalyticFilters) {

    if (saveUserfilter) {
      if (saveUserfilter.reportId != this.selectedReport) {
        this.selectedReport = saveUserfilter.reportId;
        setTimeout(() => {
          this.onReportTypeChange(saveUserfilter.reportId);
        });
        
      }
    }

    let reportType: AnalyticsReportType = saveUserfilter ? saveUserfilter.reportId : this.selectedReport;
    if (saveUserfilter || (this.selectedReport && this.userSavedFilters && this.userSavedFilters.length)) {
      let userfilter = saveUserfilter ? saveUserfilter : this.userSavedFilters.find(f => f.reportId == this.selectedReport);
      if (userfilter && userfilter.filterSettings && this.isJsonString(userfilter.filterSettings)) {

        if (reportType == AnalyticsReportType.CompanyCountryAnalysis) {
          setTimeout(() => {
            let filters: CompanyCountryAnalysisParams = JSON.parse(userfilter.filterSettings);
            let countries: number[] = filters.countries?.split(',').map(Number) || [];
            let periods: number[] = filters.periods?.split(',').map(Number) || [];

            this.searchForm.controls['company_id'].setValue(Number(filters.company_id));
            this.searchForm.controls['country_id'].setValue(countries);
            this.searchForm.controls['period_id'].setValue(periods);

            this.openFilterPanelAndGo();
          });
        }
        else if (reportType == AnalyticsReportType.CompanyPortfolioByTCAndSalesForce) {

          setTimeout(() => {
            let filters: CompanyPortfolioByTCAndSalesForceParams = JSON.parse(userfilter.filterSettings);
            let companies: number[] = filters.companies?.split(',').map(Number) || [];
            this.searchForm.controls['country_id'].setValue(Number(filters.country_id));
            this.searchForm.controls['company_id'].setValue(companies);
            this.searchForm.controls['period_id'].setValue(Number(filters.period_id));
            this.searchForm.controls['therapeutic_category_id'].setValue(Number(filters.therapeutic_category_id));

            this.openFilterPanelAndGo();
          });

        }
        else if (reportType == AnalyticsReportType.ProductFTEsByTCAndSalesForceUsingBrandName) {
          setTimeout(() => {
            let filters: ProductFTEsByTCAndSalesForceUsingBrandNameParams = JSON.parse(userfilter.filterSettings);
            let companies: number[] = filters.companies?.split(',').map(Number) || [];
            let brands: number[] = filters.brands?.split(',').map(Number) || [];
            let brandgroups: number[] = filters.brandgroups?.split(',').map(Number) || [];

            if (brandgroups && brandgroups.length) {
              this.isUseBrandGroup = true;
              this.searchForm.controls['brandGroup'].setValue(brandgroups);
              this.onIsUseCheckChange(true);
            }

            this.searchForm.controls['country_id'].setValue(Number(filters.country_id));
            this.searchForm.controls['period_id'].setValue(Number(filters.period_id));
            this.searchForm.controls['therapeutic_category_id'].setValue(Number(filters.therapeutic_category_id));
            this.searchForm.controls['company_id_1'].setValue(Number(companies[0] ?? 0));
            this.searchForm.controls['company_id_2'].setValue(Number(companies[1] ?? 0));
            this.searchForm.controls['company_id_3'].setValue(Number(companies[2] ?? 0));
            this.searchForm.controls['company_id_4'].setValue(Number(companies[3] ?? 0));
            this.searchForm.controls['company_id_5'].setValue(Number(companies[4] ?? 0));
            this.onchangeCompany1Change(companies[0] ?? 0);
            this.onchangeCompany2Change(companies[1] ?? 0);
            this.onchangeCompany3Change(companies[2] ?? 0);
            this.onchangeCompany4Change(companies[3] ?? 0);
            this.onchangeCompany5Change(companies[4] ?? 0);
            this.searchForm.controls['brand_id_1'].setValue(Number(brands[0] ?? 0));
            this.searchForm.controls['brand_id_2'].setValue(Number(brands[1] ?? 0));
            this.searchForm.controls['brand_id_3'].setValue(Number(brands[2] ?? 0));
            this.searchForm.controls['brand_id_4'].setValue(Number(brands[3] ?? 0));
            this.searchForm.controls['brand_id_5'].setValue(Number(brands[4] ?? 0));
            this.openFilterPanelAndGo();
          });
        }
        else if (reportType == AnalyticsReportType.ProductFTEsByTCAndSalesForceUsingGenericName) {
          setTimeout(() => {
            let filters: ProductFTEsByTCAndSalesForceUsingGenericNameParams = JSON.parse(userfilter.filterSettings);
            let companies: number[] = filters.companies?.split(',').map(Number) || [];
            let generic_names: number[] = filters.generic_names?.split(',').map(Number) || [];

            this.searchForm.controls['country_id'].setValue(Number(filters.country_id));
            this.searchForm.controls['period_id'].setValue(Number(filters.period_id));
            this.searchForm.controls['therapeutic_category_id'].setValue(Number(filters.therapeutic_category_id));
            this.searchForm.controls['company_id_1'].setValue(Number(companies[0] ?? 0));
            this.searchForm.controls['company_id_2'].setValue(Number(companies[1] ?? 0));
            this.searchForm.controls['company_id_3'].setValue(Number(companies[2] ?? 0));
            this.searchForm.controls['company_id_4'].setValue(Number(companies[3] ?? 0));
            this.searchForm.controls['company_id_5'].setValue(Number(companies[4] ?? 0));
            this.onchangeCompany1GenericChange(companies[0] ?? 0);
            this.onchangeCompany2GenericChange(companies[1] ?? 0);
            this.onchangeCompany3GenericChange(companies[2] ?? 0);
            this.onchangeCompany4GenericChange(companies[3] ?? 0);
            this.onchangeCompany5GenericChange(companies[4] ?? 0);

            this.searchForm.controls['generic_id_1'].setValue(Number(generic_names[0] ?? 0));
            this.searchForm.controls['generic_id_2'].setValue(Number(generic_names[1] ?? 0));
            this.searchForm.controls['generic_id_3'].setValue(Number(generic_names[2] ?? 0));
            this.searchForm.controls['generic_id_4'].setValue(Number(generic_names[3] ?? 0));
            this.searchForm.controls['generic_id_5'].setValue(Number(generic_names[4] ?? 0));
            this.openFilterPanelAndGo();
          });
        }
        else if (reportType == AnalyticsReportType.ReachAndFrequencyBySalesForceAndProduct) {
          setTimeout(() => {
            let filters: ReachAndFrequencyBySalesForceAndProductParams = JSON.parse(userfilter.filterSettings);
            let companies: number[] = filters.companies?.split(',').map(Number) || [];
            let brands: number[] = filters.brands?.split(',').map(Number) || [];
            let salesforces: number[] = filters.salesforces?.split(',').map(Number) || [];

            this.searchForm.controls['country_id'].setValue(Number(filters.country_id));
            this.searchForm.controls['period_id'].setValue(Number(filters.period_id));
            this.searchForm.controls['therapeutic_category_id'].setValue(Number(filters.therapeutic_category_id));
            this.searchForm.controls['company_id_1'].setValue(Number(companies[0] ?? 0));
            this.searchForm.controls['company_id_2'].setValue(Number(companies[1] ?? 0));
            this.searchForm.controls['company_id_3'].setValue(Number(companies[2] ?? 0));
            this.searchForm.controls['company_id_4'].setValue(Number(companies[3] ?? 0));
            this.searchForm.controls['company_id_5'].setValue(Number(companies[4] ?? 0));
            this.onchangeCompany1SalesforceChange(companies[0] ?? 0);
            this.onchangeCompany2SalesforceChange(companies[1] ?? 0);
            this.onchangeCompany3SalesforceChange(companies[2] ?? 0);
            this.onchangeCompany4SalesforceChange(companies[3] ?? 0);
            this.onchangeCompany5SalesforceChange(companies[4] ?? 0);

            this.searchForm.controls['brand_id_1'].setValue(Number(brands[0] ?? 0));
            this.searchForm.controls['brand_id_2'].setValue(Number(brands[1] ?? 0));
            this.searchForm.controls['brand_id_3'].setValue(Number(brands[2] ?? 0));
            this.searchForm.controls['brand_id_4'].setValue(Number(brands[3] ?? 0));
            this.searchForm.controls['brand_id_5'].setValue(Number(brands[4] ?? 0));


            this.onfilterChange('brand', 1);
            this.onfilterChange('brand', 2);
            this.onfilterChange('brand', 3);
            this.onfilterChange('brand', 4);
            this.onfilterChange('brand', 5);

            this.searchForm.controls['salesForce_id_1'].setValue(Number(salesforces[0] ?? 0));
            this.searchForm.controls['salesForce_id_2'].setValue(Number(salesforces[1] ?? 0));
            this.searchForm.controls['salesForce_id_3'].setValue(Number(salesforces[2] ?? 0));
            this.searchForm.controls['salesForce_id_4'].setValue(Number(salesforces[3] ?? 0));
            this.searchForm.controls['salesForce_id_5'].setValue(Number(salesforces[4] ?? 0));

            this.openFilterPanelAndGo();
          });
        }
        else if (reportType == AnalyticsReportType.SalesRepresentativeCompensationBySalesForceAndProduct) {
          setTimeout(() => {
            let filters: SalesRepresentativeCompensationBySalesForceAndProductParams = JSON.parse(userfilter.filterSettings);
            let companies: number[] = filters.companies?.split(',').map(Number) || [];
            let brands: number[] = filters.brands?.split(',').map(Number) || [];
            let salesforces: number[] = filters.salesforces?.split(',').map(Number) || [];

            this.searchForm.controls['country_id'].setValue(Number(filters.country_id));
            this.searchForm.controls['period_id'].setValue(Number(filters.period_id));
            this.searchForm.controls['therapeutic_category_id'].setValue(Number(filters.therapeutic_category_id));
            this.searchForm.controls['company_id_1'].setValue(Number(companies[0] ?? 0));
            this.searchForm.controls['company_id_2'].setValue(Number(companies[1] ?? 0));
            this.searchForm.controls['company_id_3'].setValue(Number(companies[2] ?? 0));
            this.searchForm.controls['company_id_4'].setValue(Number(companies[3] ?? 0));
            this.searchForm.controls['company_id_5'].setValue(Number(companies[4] ?? 0));
            this.onchangeCompany1SalesforceChange(companies[0] ?? 0);
            this.onchangeCompany2SalesforceChange(companies[1] ?? 0);
            this.onchangeCompany3SalesforceChange(companies[2] ?? 0);
            this.onchangeCompany4SalesforceChange(companies[3] ?? 0);
            this.onchangeCompany5SalesforceChange(companies[4] ?? 0);

            this.searchForm.controls['brand_id_1'].setValue(Number(brands[0] ?? 0));
            this.searchForm.controls['brand_id_2'].setValue(Number(brands[1] ?? 0));
            this.searchForm.controls['brand_id_3'].setValue(Number(brands[2] ?? 0));
            this.searchForm.controls['brand_id_4'].setValue(Number(brands[3] ?? 0));
            this.searchForm.controls['brand_id_5'].setValue(Number(brands[4] ?? 0));

            this.searchForm.controls['salesForce_id_1'].setValue(Number(salesforces[0] ?? 0));
            this.searchForm.controls['salesForce_id_2'].setValue(Number(salesforces[1] ?? 0));
            this.searchForm.controls['salesForce_id_3'].setValue(Number(salesforces[2] ?? 0));
            this.searchForm.controls['salesForce_id_4'].setValue(Number(salesforces[3] ?? 0));
            this.searchForm.controls['salesForce_id_5'].setValue(Number(salesforces[4] ?? 0));

            this.openFilterPanelAndGo();
          });
        }
        else if (reportType == AnalyticsReportType.TotalCompanyDeploymentByCountryAndTC) {

          setTimeout(() => {
            let filters: TotalCompanyDeploymentByCountryAndTCParams = JSON.parse(userfilter.filterSettings);
            let countries: number[] = filters.countries?.split(',').map(Number) || [];
            let companies: number[] = filters.companies?.split(',').map(Number) || [];
            this.searchForm.controls['country_id'].setValue(countries);
            this.searchForm.controls['company_id'].setValue(companies);
            this.searchForm.controls['period_id'].setValue(Number(filters.period_id));
            this.searchForm.controls['therapeutic_category_id'].setValue(Number(filters.therapeutic_category_id));

            this.openFilterPanelAndGo();
          });


        }
        else if (reportType == AnalyticsReportType.TotalCompanyDeploymentByCountryPCAndSpecialtyFTEs) {

          setTimeout(() => {
            let filters: CompanyDeploymentByCountryPCAndSpecialtyParams = JSON.parse(userfilter.filterSettings);
            let countries: number[] = filters.countries?.split(',').map(Number) || [];
            let companies: number[] = filters.companies?.split(',').map(Number) || [];

            this.searchForm.controls['country_id'].setValue(countries);
            this.searchForm.controls['company_id'].setValue(companies);
            this.searchForm.controls['period_id'].setValue(Number(filters.period_id));

            this.openFilterPanelAndGo();
          });


        }



      }
    }
  }

  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  openDialog(filterToSave?: UserAnalyticFilters): void {

    const dialogRef = this.dialog.open(UserSavedSearchsPopupComponent, {
      width: '400px',
      data: {
        filterToSave: filterToSave ? filterToSave : null,
        setSavedFilter: this.setSavedFilter.bind(this)
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        let result = data.value;
        let request = {};
        
      };
    });
  }

  getDefaultSearchName(reportId:number,userId:number): string {
    let name = 'No Name';
    let currentDateStr = moment(new Date()).format("YYYY-MM-DD");
    name = `Search_${userId}_${reportId}_${currentDateStr}`;
    return name;
  }
  saveUserFilters(savedFilterName?: string) {
    let reportType: AnalyticsReportType = this.selectedReport;
    let filters: any = this.getReportParameters(reportType);

    let data = {
      UserId: this.user_id,
      client_id: this.currentUser.clientId,
      SearchFilterName: savedFilterName ? savedFilterName : this.getDefaultSearchName(this.selectedReport, this.user_id),
      PageName: 'Analytics',
      ReportId: this.selectedReport,
      FilterSettings: JSON.stringify(filters)
    };

    this.apiService.PostAll(SaveUserAnalyticFilters,data).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.toasterService.showSuccess(response.message);
        this.getUserSavedFilters();
      } else {
        this.toasterService.showError(response.message);
      }
    });

  }

  saveAsUserFilters() {
    let reportType: AnalyticsReportType = this.selectedReport;
    let filters: any = this.getReportParameters(reportType);

    let data: UserAnalyticFilters = {
      id:0,
      userId: this.user_id,
      client_id: this.currentUser.clientId,
      searchFilterName: 'No Name',
      pageName: 'Analytics',
      reportId: this.selectedReport,
      filterSettings: JSON.stringify(filters),
      createdDate:new Date()
    };

    this.openDialog(data);

  }

  getReportParameters(reportType: AnalyticsReportType): any {
    if (reportType == AnalyticsReportType.TotalCompanyDeploymentByCountryPCAndSpecialtyFTEs) {
      let companies: string = Array.isArray(this.searchForm.controls['company_id'].value) ? this.searchForm.controls['company_id'].value.join(',') : '';
      let countries: string = Array.isArray(this.searchForm.controls['country_id'].value) ? this.searchForm.controls['country_id'].value.join(',') : '';

      let params: CompanyDeploymentByCountryPCAndSpecialtyParams = {
        companies: companies,
        countries: countries,
        period_id: this.searchForm.controls['period_id'].value,
        user_id: this.user_id
      };

      return params;
    }

    else if (reportType == AnalyticsReportType.TotalCompanyDeploymentByCountryAndTC) {
      let companies: string = Array.isArray(this.searchForm.controls['company_id'].value) ? this.searchForm.controls['company_id'].value.join(',') : '';
      let countries: string = Array.isArray(this.searchForm.controls['country_id'].value) ? this.searchForm.controls['country_id'].value.join(',') : '';

      let params: TotalCompanyDeploymentByCountryAndTCParams = {
        companies: companies,
        countries: countries,
        period_id: this.searchForm.controls['period_id'].value,
        therapeutic_category_id: this.searchForm.controls['therapeutic_category_id'].value,
        user_id: this.user_id
      };

      return params;
    }

    else if (reportType == AnalyticsReportType.CompanyPortfolioByTCAndSalesForce) {
      let companies: string = Array.isArray(this.searchForm.controls['company_id'].value) ? this.searchForm.controls['company_id'].value.join(',') : '';

      let params: CompanyPortfolioByTCAndSalesForceParams = {
        companies: companies,
        country_id: this.searchForm.controls['country_id'].value,
        period_id: this.searchForm.controls['period_id'].value,
        therapeutic_category_id: this.searchForm.controls['therapeutic_category_id'].value,
        user_id: this.user_id
      };

      return params;
    }

    else if (reportType == AnalyticsReportType.ProductFTEsByTCAndSalesForceUsingBrandName) {

      let company1: number = this.searchForm.controls['company_id_1'].value;
      let company2: number = this.searchForm.controls['company_id_2'].value;
      let company3: number = this.searchForm.controls['company_id_3'].value;
      let company4: number = this.searchForm.controls['company_id_4'].value;
      let company5: number = this.searchForm.controls['company_id_5'].value;
      let companies: number[] = new Array<number>(company1, company2, company3, company4, company5);

      let brand1: number = this.searchForm.controls['brand_id_1'].value;
      let brand2: number = this.searchForm.controls['brand_id_2'].value;
      let brand3: number = this.searchForm.controls['brand_id_3'].value;
      let brand4: number = this.searchForm.controls['brand_id_4'].value;
      let brand5: number = this.searchForm.controls['brand_id_5'].value;
      let brands: number[] = new Array<number>(brand1, brand2, brand3, brand4, brand5);
      let brandgroups: string = Array.isArray(this.searchForm.controls['brandGroup'].value) ? this.searchForm.controls['brandGroup'].value.join(',') : '';

      let params: ProductFTEsByTCAndSalesForceUsingBrandNameParams = {
        companies: companies.join(','),
        brands: brands.join(','),
        brandgroups: brandgroups ? brandgroups : null,
        country_id: this.searchForm.controls['country_id'].value,
        period_id: this.searchForm.controls['period_id'].value,
        therapeutic_category_id: this.searchForm.controls['therapeutic_category_id'].value,
        user_id: this.user_id
      };

      return params;
    }

    else if (reportType == AnalyticsReportType.ProductFTEsByTCAndSalesForceUsingGenericName) {

      let company1: number = this.searchForm.controls['company_id_1'].value;
      let company2: number = this.searchForm.controls['company_id_2'].value;
      let company3: number = this.searchForm.controls['company_id_3'].value;
      let company4: number = this.searchForm.controls['company_id_4'].value;
      let company5: number = this.searchForm.controls['company_id_5'].value;
      let companies: number[] = new Array<number>(company1, company2, company3, company4, company5);

      let gn1: number = this.searchForm.controls['generic_id_1'].value;
      let gn2: number = this.searchForm.controls['generic_id_2'].value;
      let gn3: number = this.searchForm.controls['generic_id_3'].value;
      let gn4: number = this.searchForm.controls['generic_id_4'].value;
      let gn5: number = this.searchForm.controls['generic_id_5'].value;
      let generic_names: number[] = new Array<number>(gn1, gn2, gn3, gn4, gn5);

      let params: ProductFTEsByTCAndSalesForceUsingGenericNameParams = {
        companies: companies.join(','),
        generic_names: generic_names.join(','),
        country_id: this.searchForm.controls['country_id'].value,
        period_id: this.searchForm.controls['period_id'].value,
        therapeutic_category_id: this.searchForm.controls['therapeutic_category_id'].value,
        user_id: this.user_id
      };

      return params;
    }

    else if (reportType == AnalyticsReportType.SalesRepresentativeCompensationBySalesForceAndProduct) {

      let company1: number = this.searchForm.controls['company_id_1'].value;
      let company2: number = this.searchForm.controls['company_id_2'].value;
      let company3: number = this.searchForm.controls['company_id_3'].value;
      let company4: number = this.searchForm.controls['company_id_4'].value;
      let company5: number = this.searchForm.controls['company_id_5'].value;
      let companies: number[] = new Array<number>(company1, company2, company3, company4, company5);

      let brand1: number = this.searchForm.controls['brand_id_1'].value;
      let brand2: number = this.searchForm.controls['brand_id_2'].value;
      let brand3: number = this.searchForm.controls['brand_id_3'].value;
      let brand4: number = this.searchForm.controls['brand_id_4'].value;
      let brand5: number = this.searchForm.controls['brand_id_5'].value;
      let brands: number[] = new Array<number>(brand1, brand2, brand3, brand4, brand5);

      let sf1: number = this.searchForm.controls['salesForce_id_1'].value;
      let sf2: number = this.searchForm.controls['salesForce_id_2'].value;
      let sf3: number = this.searchForm.controls['salesForce_id_3'].value;
      let sf4: number = this.searchForm.controls['salesForce_id_4'].value;
      let sf5: number = this.searchForm.controls['salesForce_id_5'].value;
      let salesforces: number[] = new Array<number>(sf1, sf2, sf3, sf4, sf5);

      let params: SalesRepresentativeCompensationBySalesForceAndProductParams = {
        companies: companies.join(','),
        brands: brands.join(','),
        salesforces: salesforces.join(','),
        country_id: this.searchForm.controls['country_id'].value,
        period_id: this.searchForm.controls['period_id'].value,
        therapeutic_category_id: this.searchForm.controls['therapeutic_category_id'].value,
        user_id: this.user_id
      };

      return params;
    }

    else if (reportType == AnalyticsReportType.ReachAndFrequencyBySalesForceAndProduct) {

      let company1: number = this.searchForm.controls['company_id_1'].value;
      let company2: number = this.searchForm.controls['company_id_2'].value;
      let company3: number = this.searchForm.controls['company_id_3'].value;
      let company4: number = this.searchForm.controls['company_id_4'].value;
      let company5: number = this.searchForm.controls['company_id_5'].value;
      let companies: number[] = new Array<number>(company1, company2, company3, company4, company5);

      let brand1: number = this.searchForm.controls['brand_id_1'].value;
      let brand2: number = this.searchForm.controls['brand_id_2'].value;
      let brand3: number = this.searchForm.controls['brand_id_3'].value;
      let brand4: number = this.searchForm.controls['brand_id_4'].value;
      let brand5: number = this.searchForm.controls['brand_id_5'].value;
      let brands: number[] = new Array<number>(brand1, brand2, brand3, brand4, brand5);

      let sf1: number = this.searchForm.controls['salesForce_id_1'].value;
      let sf2: number = this.searchForm.controls['salesForce_id_2'].value;
      let sf3: number = this.searchForm.controls['salesForce_id_3'].value;
      let sf4: number = this.searchForm.controls['salesForce_id_4'].value;
      let sf5: number = this.searchForm.controls['salesForce_id_5'].value;
      let salesforces: number[] = new Array<number>(sf1, sf2, sf3, sf4, sf5);

      let params: ReachAndFrequencyBySalesForceAndProductParams = {
        companies: companies.join(','),
        brands: brands.join(','),
        salesforces: salesforces.join(','),
        country_id: this.searchForm.controls['country_id'].value,
        period_id: this.searchForm.controls['period_id'].value,
        therapeutic_category_id: this.searchForm.controls['therapeutic_category_id'].value,
        user_id: this.user_id
      };

      return params;
    }

    else if (reportType == AnalyticsReportType.CompanyCountryAnalysis) {
      let periods: string = Array.isArray(this.searchForm.controls['period_id'].value) ? this.searchForm.controls['period_id'].value.join(',') : '';
      let countries: string = Array.isArray(this.searchForm.controls['country_id'].value) ? this.searchForm.controls['country_id'].value.join(',') : '';

      let params: CompanyCountryAnalysisParams = {
        company_id: this.searchForm.controls['company_id'].value,
        countries: countries,
        periods: periods,
        user_id: this.user_id
      };

      return params;
    }

  }

  onGoClick() {

    let reportType: AnalyticsReportType = this.selectedReport;
    let data: any = this.getReportParameters(reportType);

    if (reportType == AnalyticsReportType.CompanyCountryAnalysis) {
      this.getCompanyCountryAnalysisGridData(data);
      this.getCompanyCountryAnalysisChartData(data);
    }
    else if (reportType == AnalyticsReportType.CompanyPortfolioByTCAndSalesForce) {
      this.getCompanyPortfolioByTCAndSalesForceGridData(data);
      this.getCompanyPortfolioByTCAndSalesForceChartData(data);
    }
    else if (reportType == AnalyticsReportType.ProductFTEsByTCAndSalesForceUsingBrandName) {
      this.getProductFTEsByTCAndSalesForceUsingBrandNameGridData(data);
      this.getProductFTEsByTCAndSalesForceUsingBrandNameChartData(data);
    }
    else if (reportType == AnalyticsReportType.ProductFTEsByTCAndSalesForceUsingGenericName) {
      this.getProductFTEsByTCAndSalesForceUsingGenericNameGridData(data);
      this.getProductFTEsByTCAndSalesForceUsingGenericNameChartData(data);
    }
    else if (reportType == AnalyticsReportType.ReachAndFrequencyBySalesForceAndProduct) {
      this.getReachAndFrequencyBySalesForceAndProductGridData(data);
      this.getReachAndFrequencyBySalesForceAndProductChartData(data);
    }
    else if (reportType == AnalyticsReportType.SalesRepresentativeCompensationBySalesForceAndProduct) {
      this.getSalesRepresentativeCompensationBySalesForceAndProductGridData(data);
      this.getSalesRepresentativeCompensationBySalesForceAndProductChartData(data);
    }
    else if (reportType == AnalyticsReportType.TotalCompanyDeploymentByCountryAndTC) {
      this.getTotalCompanyDeploymentByCountryAndTCGridData(data);
      this.getTotalCompanyDeploymentByCountryAndTCChartData(data);
    }
    else if (reportType == AnalyticsReportType.TotalCompanyDeploymentByCountryPCAndSpecialtyFTEs) {
      this.getCompanyDeploymentByCountryPCAndSpecialtyGridData(data);
      this.getCompanyDeploymentByCountryPCAndSpecialtyChartData(data);
    }


  }

  onchangeCompany1Change(companyId: number) {
    let therapeuticCategory_Id = this.searchForm.controls['therapeutic_category_id'].value;
    this.setBrandList(1, companyId, therapeuticCategory_Id);
  }

  onchangeCompany2Change(companyId: number) {
    let therapeuticCategory_Id = this.searchForm.controls['therapeutic_category_id'].value;
    this.setBrandList(2, companyId, therapeuticCategory_Id);
  }

  onchangeCompany3Change(companyId: number) {
    let therapeuticCategory_Id = this.searchForm.controls['therapeutic_category_id'].value;
    this.setBrandList(3, companyId, therapeuticCategory_Id);
  }

  onchangeCompany4Change(companyId: number) {
    let therapeuticCategory_Id = this.searchForm.controls['therapeutic_category_id'].value;
    this.setBrandList(4, companyId, therapeuticCategory_Id);
  }

  onchangeCompany5Change(companyId: number) {
    let therapeuticCategory_Id = this.searchForm.controls['therapeutic_category_id'].value;
    this.setBrandList(5, companyId, therapeuticCategory_Id);
  }

  setBrandList(serial: number, companyId: number, therapeuticCategory_Id: number) {
    this.loadBrands(companyId, therapeuticCategory_Id).subscribe(response => {
      if (response.status) {
        if (serial == 1)
          this.brandListCompany1 = response.result;
        else if (serial == 2)
          this.brandListCompany2 = response.result;
        else if (serial == 3)
          this.brandListCompany3 = response.result;
        else if (serial == 4)
          this.brandListCompany4 = response.result;
        else if (serial == 5)
          this.brandListCompany5 = response.result;

        this.filterDropdownListByCustomerDropdowns('brand', serial);
        this.onfilterChange('company', serial);
        this.setSalesforceList(serial, companyId);
      }
    });
  }

  loadBrands(company_Id: number, therapeuticCategory_Id: number) {
    return this.apiService.PostAll(GetBrandGroupFilters, {
      type: 2,
      user_id: this.user_id,
      companyId: company_Id,
      therapeuticCategory_Id: therapeuticCategory_Id
    });
  }

  loadPeriod() {
    this.apiService.GetAll(getAdminPeriods, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.periodListBase = response.result;
        this.filterDropdownListByCustomerDropdowns('period');
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  onReportTypeChange(type: number) {
    if (type == 4) {
      this.loadMyBrandGroup();
    } else if (type == 6 || type == 7) {
      this.clearBrandListAndSalesforceList();
    }

    this.cd.detectChanges();

    this.searchForm.reset();

    this.setSavedFilter();

    this.destroyChart();

    this.onAnalyticFilterChanges();
  }

  resetFilters() {
    this.cd.detectChanges();
    this.searchForm.reset();
    this.isUseBrandGroup = false;
  }

  clearBrandListAndSalesforceList() {
    this.brandListCompany1 = new Array<IdNamePair>();
    this.brandListCompany2 = new Array<IdNamePair>();
    this.brandListCompany3 = new Array<IdNamePair>();
    this.brandListCompany4 = new Array<IdNamePair>();
    this.brandListCompany5 = new Array<IdNamePair>();
    this.salesforceListCompany1 = new Array<Salesforce>();
    this.salesforceListCompany2 = new Array<Salesforce>();
    this.salesforceListCompany3 = new Array<Salesforce>();
    this.salesforceListCompany4 = new Array<Salesforce>();
    this.salesforceListCompany5 = new Array<Salesforce>();
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (this.triChart) {
      this.triChart.destroy();
    }

    if (this.pieChart) {
      this.pieChart.destroy();
    }


    this.setChartTitle(this.selectedReport);
  }

  loadTherapeuticCategories() {
    this.apiService.GetAll(getAdminTherapeuticCategories)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.therapeuticCategoriesBase = response.result;
          this.filterDropdownListByCustomerDropdowns('therapeuticCategory');
        }
      });
  }

  loadCompanies() {
    this.apiService.PostAll(getCompany, {
      user_id: this.user_id,
      security_Token: "",
    }).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.companiesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('company');
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  loadCountires() {
    this.apiService.PostAll(getCountry, {
      user_id: this.user_id,
      security_Token: "",
    }).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.countriesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('country');
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  loadCompanyCountry() {
    this.apiService.GetAll(getAllCompanyCountry + "?user_id=" + this.currentUser.id).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.companyCountries = response.result;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  createDatasetForChartOne(): ChartOneDataset {

    let companies_id: number[] = this.searchForm.controls['company_id'].value;
    let countries_id: number[] = this.searchForm.controls['country_id'].value;
    if (!companies_id || !countries_id || companies_id.length < 1 || countries_id.length < 1) {
      let chartDataset: ChartOneDataset = {
        countrylabels: [],
        PCFTEvalues: [],
        SPFTEvalues: [],
        countrylabelsRepeated: [],
        companyNames: []
      };

      return chartDataset;
    }

    let countries_name: string[] = this.countriesBase.filter(c => countries_id.findIndex(i => i == c.country_Id) > -1).map(v => v.country_Name);

    //if company 2 and country 3 then country 2*3 = 6
    let PCFTE_data: number[] = [];
    let SPFTE_data: number[] = [];
    let company_names_sorted: string[] = [];
    let country_names_sorted: string[] = [];

    for (let i = 0; i < companies_id.length; i++) {
      for (let j = 0; j < countries_id.length; j++) {
        let data = this.companyDeploymentByCountryPCAndSpecialtyChartData.find(d => d.company_id == companies_id[i] && d.country_id == countries_id[j]);


        let con = this.countriesBase.find(c => c.country_Id == countries_id[j]);
        if (con)
          country_names_sorted.push(con.country_Name);
        else
          country_names_sorted.push('Unknow Company'); // will never executes

        if (data) {
          PCFTE_data.push(data.pc);
          SPFTE_data.push(data.sp);
        }
        else {
          PCFTE_data.push(0);
          SPFTE_data.push(0);
        }
      }

      let com = this.companiesBase.find(c => c.company_Id == companies_id[i]);
      if (com)
        company_names_sorted.push(com.company_Name);
      else
        company_names_sorted.push('Unknow Company'); // will never executes
    }

    let chartDataset: ChartOneDataset = {
      countrylabels: countries_name,
      PCFTEvalues: PCFTE_data,
      SPFTEvalues: SPFTE_data,
      countrylabelsRepeated: country_names_sorted,
      companyNames: company_names_sorted
    };


    return chartDataset;
  }

  createDatasetForChartTwo(): ChartTwoDataset {

    let therapeutic_category_id: number = this.searchForm.controls['therapeutic_category_id'].value;
    let tc = this.therapeuticCategoriesBase.find(t => t.therapeuticCategory_Id == therapeutic_category_id);
    let therapeutic_category_name: string ='Unknown TC';
    if (tc) {
      therapeutic_category_name = tc.therapeuticCategory_Name;
    }
    let countries_id: number[] = this.searchForm.controls['country_id'].value;
    let countries_name: string[] = this.countriesBase.filter(c => countries_id.findIndex(i => i == c.country_Id) > -1).map(v => v.country_Name);

    let companies_id: number[] = this.searchForm.controls['company_id'].value;
    let PCFTE_data: number[] = [];
    let SPFTE_data: number[] = [];
    let company_names_sorted: string[] = [];
    let country_names_sorted: string[] = [];

    for (let i = 0; i < countries_id.length; i++) {
      for (let j = 0; j < companies_id.length; j++) {
        let data = this.totalCompanyDeploymentByCountryAndTCChartData.find(d => d.company_id == companies_id[j] && d.country_id == countries_id[i]);


        let com = this.companiesBase.find(c => c.company_Id == companies_id[j]);
        if (com)
          company_names_sorted.push(com.company_Name);
        else
          company_names_sorted.push('Unknow Company'); // will never executes

        if (data) {
          PCFTE_data.push(data.pc);
          SPFTE_data.push(data.sp);
        }
        else {
          PCFTE_data.push(0);
          SPFTE_data.push(0);
        }
      }

      let con = this.countriesBase.find(c => c.country_Id == countries_id[i]);
      if (con)
        country_names_sorted.push(con.country_Name);
      else
        country_names_sorted.push('Unknow Company'); // will never executes
    }

    let chartDataset: ChartTwoDataset = {
      TClabels: [therapeutic_category_name],
      PCFTEvalues: PCFTE_data,
      SPFTEvalues: SPFTE_data,
      countrylabels: country_names_sorted,
      companylabelsRepeated: company_names_sorted,
    };


    return chartDataset;
  }

  setChartTitle(type:number) {
    switch (type) {
      case 1:
        this.chartName = "Company Deployment By PC/SP Split";
        break;
      case 2:
        this.chartName = "Total Company Deployment By Country and Therapeutic Category";
        break;
      case 3:
        this.chartName = "Company Portfolio By Therapeutic Category and Sales Force";
        break;
      case 4:
        this.chartName = "Product FTEs By Therapeutic Category and Sales Force (Using Brand Name)";
        break;
      case 5:
        this.chartName = "Product FTEs By Therapeutic Category and Sales Force (Using Generic Name)";
        break;
      case 6:
        this.chartName = "Sales Representative's Compensation By Sales Force and Product";
        break;
      case 7:
        this.chartName = "Reach and Frequency By Sales Force and Product";
        break;
      case 8:
        this.chartName = "Company Country Analysis";
        break;
      default:
        break;
    }
  }

  displayUpdatedChart(value: any) {

    this.isShowPieChart = false;
    this.isShowTriChart = false;
    switch (value) {
      case '1':
        Chart.unregister(this.customLabelsPlugin);
        this.chartName = "Company Deployment By PC/SP Split";
        setTimeout(() => {
          this.createForOptionOne();
        }, 500);
        break;

      case '2':
        Chart.unregister(this.customLabelsPlugin);
        this.chartName = "Total Company Deployment By Country and Therapeutic Category";
        setTimeout(() => {
          this.createForOptionTwo();
        }, 500);
        break;

      case '3':
        this.isShowPieChart = true;
        Chart.unregister(this.customLabelsPlugin);
        this.chartName = "Company Portfolio By Therapeutic Category and Sales Force";
        setTimeout(() => {
          this.createForOptionThree();
        }, 500);

        break;

      case '4':
        this.isShowPieChart = true;
        Chart.unregister(this.customLabelsPlugin);
        this.chartName = "Product FTEs By Therapeutic Category and Sales Force (Using Brand Name)";
        setTimeout(() => {
          this.createForOptionFour();
        }, 500);

        break;

      case '5':

        this.isShowPieChart = true;
        Chart.unregister(this.customLabelsPlugin);
        this.chartName = "Product FTEs By Therapeutic Category and Sales Force (Using Generic Name)";
        setTimeout(() => {
          this.createForOptionFive();
        }, 500);

        break;

      case '6':
        Chart.unregister(this.customLabelsPlugin);
        this.chartName = "Sales Representative's Compensation By Sales Force and Product";
        setTimeout(() => {
          this.createForOptionSix();
        }, 500);
        break;

      case '7':
        Chart.unregister(this.customLabelsPlugin);
        this.chartName = "Reach and Frequency By Sales Force and Product";
        setTimeout(() => {
          this.createForOptionSeven();
        }, 500);
        break;

      case '8':
        this.isShowTriChart = true;
        Chart.unregister(this.customLabelsPlugin);
        this.chartName = "Company Country Analysis";
        setTimeout(() => {
          this.createForOptionEight();
        }, 500);
        break;

      default:

        break;
    }

  }

  createForOptionOne() {

    let dataset: ChartOneDataset = this.createDatasetForChartOne();

    if (this.chart) {
      this.chart.destroy();
    }

    if (this.triChart) {
      this.triChart.destroy();
    }
    Chart.register(this.customLabelsPlugin);

    const ctx = (document.getElementById('MyChart') as HTMLCanvasElement).getContext('2d') as any;
    ctx.companyNames = dataset.companyNames;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataset.countrylabelsRepeated, // Repeated for Abbvie and Amgen
        datasets: [
          {
            label: 'PC FTE',
            data: dataset.PCFTEvalues, // Data for Abbvie and Amgen
            backgroundColor: 'rgb(4 74 152)',
            barThickness: 35
          },
          {
            label: 'SP FTE',
            data: dataset.SPFTEvalues, // Data for Abbvie and Amgen
            backgroundColor: '#f68957',
            barThickness: 35
          },
        ]
      },
      options: {
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            },
            ticks: {
              padding: 5,
              callback: function (value, index, values) {
                // Only show the country names on the x-axis
                const countries = dataset.countrylabels;
                return countries[index % countries.length];
              },
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0
            }
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14 // Adjust font size if needed
              }
            }
          }
        }
      }
    });
  }

  createForOptionTwo() {

    let dataset: ChartTwoDataset = this.createDatasetForChartTwo();

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }

    const ctx = (document.getElementById('MyChart') as HTMLCanvasElement).getContext('2d') as any;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataset.TClabels, //therapeutic Category
        datasets: [
          {
            label: 'PC FTE',
            data: dataset.PCFTEvalues, // Update data as per image for PC FTE
            backgroundColor: '#0D5A8A' // Blue color for PC FTE
          },
          {
            label: 'SP FTE',
            data: dataset.SPFTEvalues, // Update data as per image for SP FTE
            backgroundColor: '#F57C00' // Orange color for SP FTE
          },

        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true, // Ensure the chart is responsive
        maintainAspectRatio: false, // Disable maintaining aspect ratio
        scales: {
          y2: {
            display: true,
            labels: dataset.companylabelsRepeated,
            stacked: true
          },
          y1: {
            display: true,
            labels: dataset.countrylabels,
            border: {
              width: 2,
              display: true,
              color: 'black'
            },
            ticks: {
              autoSkip: false,
              maxRotation: 30,
              minRotation: 90,
            }
          },
          y: {
            grid: {
              display: true,
              drawTicks: true,
              drawOnChartArea: false
            },
            border: {
              width: 2,
              display: true,
              color: 'black'
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90,
            },
            beginAtZero: true // Ensure y-axis starts at 0
          },
          x: {
            stacked: true // Stack the bars
          }
        },
        plugins: {
          legend: {
            position: 'bottom', // Position the legend at the top
            labels: {
              font: {
                size: 14 // Adjust font size if needed
              }
            }
          }
        }
      }
    });


  }


  createForOptionThree() {

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }


    let data = this.companyPortfolioByTCAndSalesForceChartData;

    const uniqueCombinations = new Set<string>();
    const product_data = new Set<number>();
    const sp_data = new Set<number>();

    data.forEach(item => {
      const combination = `${item.therapeuticcategory_name} [${item.company_name}]`;
      product_data.add(item.product_id);
      uniqueCombinations.add(combination);
    });

    const uniqueLabels = Array.from(uniqueCombinations);

    const groupedByCompany = data.reduce((acc, item) => {
      if (!acc[item.company_name]) {
        acc[item.company_name] = [];
      }
      acc[item.company_name].push(item.total);
      return acc;
    }, {} as Record<string, number[]>);

    // Prepare the result
    const result: number[][] = [];
    const companyNames = Object.keys(groupedByCompany);

    // Determine the maximum number of categories per company
    const maxCategories = Math.max(...Object.values(groupedByCompany).map(totals => totals.length));

    // Populate the result with totals and ensure all categories are covered
    for (let i = 0; i < maxCategories; i++) {
      const row = companyNames.map(company => {
        const totals = groupedByCompany[company];
        return totals[i] !== undefined ? totals[i] : 0;
      });
      result.push(row);
    }

    let globalDataSet: any = [];

    result.forEach((dataArray, index) => {
      // Create an array of objects in the format {x: value, y: value}
      const formattedData = dataArray.map(value => ({ x: value, y: value }));

      globalDataSet.push({
        label: ``, // You can set a specific label if needed
        data: formattedData,
        barThickness: 50
      });
    });


    const ctx = (document.getElementById('MyChart') as HTMLCanvasElement).getContext('2d') as any;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: uniqueLabels,
        datasets: Array.from(globalDataSet)
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            grid: {
              display: false,
            },
            stacked: true, // Stack the bars
            ticks: {
              maxRotation: 0, // Disable rotation
              minRotation: 0,
              autoSkip: false, // Don't skip any labels
              callback: function (value: any) {
                const maxWordsPerLine = 5; // Maximum number of words per line
                const label = this.getLabelForValue(value);


                return label.split(' '); // Join the lines with a new line character
                // Join lines with new line character
              },
              font: {
                size: 12 // Adjust font size if needed
              }
            }
          },

        },
        plugins: {
          legend: {
            display: false,
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          title: {
            display: false,
            text: 'France - 2nd Qtr 2024'
          }
        },
        onClick: (event: any, activeElements: any[]) => {
          if (activeElements.length > 0) {
            const datasetIndex = activeElements[0].datasetIndex;
            const dataIndex = activeElements[0].index;
            const label = this.chart.data.labels[dataIndex];
            this.generateThirdReportPieChart(label);
            //alert(`You clicked on ${datasetLabel} in ${label}: ${dataValue}`);
          }
        }
      }
    });
  }
  generateThirdReportPieChart(label: any) {

    let data = this.companyPortfolioByTCAndSalesForceChartData;

    const company = label.match(/\[(.*?)\]/).pop();
    let pieDataset = data.filter(x => x.company_name.includes(company));

    let products = pieDataset.map(x => x.product_name);
    let total = pieDataset.map(x => x.total);

    let globalDataSet: any = [];

    pieDataset.forEach((item) => {
      // Create an array of objects in the format {x: value, y: value}

      globalDataSet.push(
        this.getRandomColor()
      );
    });

    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }

    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d') as any;

    this.pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: Array.from(products),
        datasets: [{
          data: Array.from(total),
          backgroundColor: globalDataSet
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: label
          }
        }
      }
    });


  }

  createForOptionFour() {

    let dataset = this.createChartDatasetForChartFour();

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }

    const ctx = (document.getElementById('MyChart') as HTMLCanvasElement).getContext('2d') as any;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from(dataset.uniqlabels),
        datasets: Array.from(dataset.globalDataSet)
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            grid: {
              display: false,
            },
            stacked: true, // Stack the bars
            ticks: {
              maxRotation: 0, // Disable rotation
              minRotation: 0,
              autoSkip: false, // Don't skip any labels
              callback: function (value: any) {
                const maxWordsPerLine = 5; // Maximum number of words per line
                const label = this.getLabelForValue(value);


                return label.split(' '); // Join the lines with a new line character
                // Join lines with new line character
              },
              font: {
                size: 12 // Adjust font size if needed
              }
            }
          },

        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          title: {
            display: false,
            text: 'France - 2nd Qtr 2024'
          }
        },
        onClick: (event: any, activeElements: any[]) => {
          if (activeElements.length > 0) {
            const datasetIndex = activeElements[0].datasetIndex;
            const dataIndex = activeElements[0].index;
            //const label = this.chart.data.labels[dataIndex];
            var data = this.chart.data;
            var salesforce_name = data.datasets[datasetIndex].label;
            let company_name = data.labels[dataIndex];
            this.generateFourthReportPieChart(company_name, salesforce_name);

          }

        }
      }
    });


  }

  generateFourthReportPieChart(company_name: string, salesforce_name:string) {

    let data = this.productFTEsByTCAndSalesForceUsingBrandNameChartData;

    let title: string = `Product promoted By ${salesforce_name}`;

    let pieDataset = data.filter(x => x.company_name == company_name && x.salesforcename_name == salesforce_name);

    let products = pieDataset.map(x => x.product_name);
    let total = pieDataset.map(x => x.total);

    let globalDataSet: any = [];

    pieDataset.forEach((item) => {
      // Create an array of objects in the format {x: value, y: value}

      globalDataSet.push(
        this.getRandomColor()
      );
    });

    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }

    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d') as any;

    this.pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: Array.from(products),
        datasets: [{
          data: Array.from(total),
          backgroundColor: globalDataSet
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: title
          }
        }
      }
    });


  }

  createForOptionFive() {

    let dataset = this.createChartDatasetForChartFive();

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }
    const ctx = (document.getElementById('MyChart') as HTMLCanvasElement).getContext('2d') as any;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from(dataset.uniqlabels),
        datasets: Array.from(dataset.globalDataSet)
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            grid: {
              display: false,
            },
            stacked: true, // Stack the bars
            ticks: {
              maxRotation: 0, // Disable rotation
              minRotation: 0,
              autoSkip: false, // Don't skip any labels
              callback: function (value: any) {
                const maxWordsPerLine = 5; // Maximum number of words per line
                const label = this.getLabelForValue(value);


                return label.split(' '); // Join the lines with a new line character
                // Join lines with new line character
              },
              font: {
                size: 12 // Adjust font size if needed
              }
            }
          },

        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          title: {
            display: false,
            text: 'France - 2nd Qtr 2024'
          }
        },
        onClick: (event: any, activeElements: any[]) => {
          if (activeElements.length > 0) {
            const datasetIndex = activeElements[0].datasetIndex;
            const dataIndex = activeElements[0].index;
            var data = this.chart.data;
            var salesforce_name = data.datasets[datasetIndex].label;
            let company_name = data.labels[dataIndex];
            this.generateFifthReportPieChart(company_name, salesforce_name);
          }

        }
      }
    });


  }

  generateFifthReportPieChart(company_name: string, salesforce_name: string) {

    let data = this.productFTEsByTCAndSalesForceUsingGenericNameChartData;

    let title: string = `Generic Name promoted By ${salesforce_name}`;

    let pieDataset = data.filter(x => x.company_name == company_name && x.salesforcename_name == salesforce_name);

    let genericnames = pieDataset.map(x => x.genericname_name);
    let total = pieDataset.map(x => x.total);

    let globalDataSet: any = [];

    pieDataset.forEach((item) => {
      // Create an array of objects in the format {x: value, y: value}

      globalDataSet.push(
        this.getRandomColor()
      );
    });

    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }

    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d') as any;

    this.pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: Array.from(genericnames),
        datasets: [{
          data: Array.from(total),
          backgroundColor: globalDataSet
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: title
          }
        }
      }
    });


  }

  createForOptionSix() {

    let dataset: ChartSixDataset = this.createChartDatasetForChartSix(this.salesRepresentativeCompensationBySalesForceAndProductChartData);

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }
    const ctx = (document.getElementById('MyChart') as HTMLCanvasElement).getContext('2d') as any;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataset.companySalesforceProductComposedLabels,
        datasets: [
          {
            label: 'Bonus',
            data: dataset.bonusValues, // Update data as per image for Frequency
            backgroundColor: 'green' // Orange color for Frequency
          },
          {
            label: 'High Salary',
            data: dataset.highSalaryValues, // Update data as per image for Reach
            backgroundColor: 'orange' // Blue color for Reach
          },
          {
            label: 'Low Salary',
            data: dataset.lowSalaryValues, // Update data as per image for Reach
            backgroundColor: 'teal' // Blue color for Reach
          }
        ]
      },
      options: {
        indexAxis: 'y', // Set the index axis to 'y' for a horizontal bar chart
        responsive: true, // Ensure the chart is responsive
        maintainAspectRatio: false, // Disable maintaining aspect ratio
        scales: {
          x: {

            beginAtZero: true // Ensure x-axis starts at 0
          },
          y: {
            grid: {
              display: false
            },
            beginAtZero: true // Ensure y-axis starts at 0
          }
        },
        plugins: {
          legend: {
            position: 'bottom', // Position the legend at the top
            labels: {
              font: {
                size: 14 // Adjust font size if needed
              }
            }
          }
        }
      }
    });
  }

  createForOptionSeven() {

    let dataset: ChartSevenDataset = this.createChartDatasetForChartSeven(this.reachAndFrequencyBySalesForceAndProductChartData);

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }


    const ctx = (document.getElementById('MyChart') as HTMLCanvasElement).getContext('2d') as any;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataset.salesforcelabels,
        datasets: [
          {
            label: 'Frequency',
            data: dataset.frequencyValues, // Update data as per image for Frequency
            backgroundColor: '#FF9800' // Orange color for Frequency
          },
          {
            label: 'Reach',
            data: dataset.reachValues, // Update data as per image for Reach
            backgroundColor: '#00ACC1' // Blue color for Reach
          }
        ]
      },
      options: {
        indexAxis: 'y', // Set the index axis to 'y' for a horizontal bar chart
        responsive: true, // Ensure the chart is responsive
        maintainAspectRatio: false, // Disable maintaining aspect ratio
        scales: {
          x: {

            beginAtZero: true // Ensure x-axis starts at 0
          },
          y: {
            grid: {
              display: false
            },
            beginAtZero: true // Ensure y-axis starts at 0
          }
        },
        plugins: {
          legend: {
            position: 'bottom', // Position the legend at the top
            labels: {
              font: {
                size: 14 // Adjust font size if needed
              }
            }
          }
        }
      }
    });
  }

  loadTherapeuticCategoryForGraphEight() {
    let data: any = {
      user_id: this.user_id,
      companies: this.searchForm.controls['company_id'].value.toString(),
      countries: this.searchForm.controls['country_id'].value.join(','),
      periods: this.searchForm.controls['period_id'].value.join(','),
      columns: "Therapeutic_Category"
    };

    try {
      this.apiService.PostAll(GetCustomerDropdowns, data).subscribe(response => {
        if (response?.status) {
          this.therapeuticCatForCompanyCountryAnalysis = response.result;
        }
      });

    } catch (error) {
      console.error('Error loading therapeutic categories:', error);
    }
  }




  createForOptionEight() {
    this.loadTherapeuticCategoryForGraphEight();
    this.initializeChartEight();
  }



  initializeChartEight() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this. triChart) {
      this.triChart.destroy();
    }

    // Extract unique therapeuticcategory_names for x-axis labels
    const labels = Array.from(new Set(this.CompanyCountryAnalysisChartDataList.map((item: any) => item.therapeuticcategory_name)));
    // Extract unique country names
    const countryNames = Array.from(new Set(this.CompanyCountryAnalysisChartDataList.map((item: any) => item.country_name)));

    const datasets = countryNames.map(country => {
      // Filter the data for the current country
      const countryData = this.CompanyCountryAnalysisChartDataList.filter((item: any) => item.country_name === country);

      // Map the data to match the labels
      const data = labels.map(label => {
        const item = countryData.find((dataItem: any) => dataItem.therapeuticcategory_name === label);
        return item ? item.total_therapeuticategory : 0; // Default to 0 if no matching data is found
      });

      return {
        label: country,
        data: data,
        //backgroundColor: this.getRandomColor() // Function to generate a random color or define specific colors
      };
    });


    const ctx = (document.getElementById('MyChart') as HTMLCanvasElement).getContext('2d') as any;

    // Retrieve selected IDs
    const selectedCompanyId = this.searchForm.controls['company_id'].value.toString();
    const selectedCountryIds = this.searchForm.controls['country_id'].value;
    const selectedPeriodId = this.searchForm.controls['period_id'].value;
    // Get the selected company name
    const selectedCompany = this.companiesBase.find((company: any) => company.company_Id === +selectedCompanyId);
    const companyName = selectedCompany ? selectedCompany.company_Name : 'Unknown Company';

    // Get the selected country names
    const selectedCountries = selectedCountryIds.map((id: number) => {
      const country = this.countriesBase.find((country: any) => country.country_Id === id);
      return country ? country.country_Name : 'Unknown Country';
    }).join(' & ');

    // Get the selected period display name
    const selectedPeriod = this.periodListBase
      .filter((period: any) => Array.isArray(selectedPeriodId) ? selectedPeriodId.includes(period.period_Id) : selectedPeriodId == period.period_Id)
      .map(p => p.displayed_Title);
    const periodDisplayName = selectedPeriod && selectedPeriod.length ? selectedPeriod.join(' & ') : 'Unknown Period';

    // Predefined colors for the first three datasets
    const predefinedColors = ['#FF9800', '#00ACC1', '#4CAF50']; // Orange, Teal, Green

    // Construct the chart title
    const chartTitle = `${companyName} - ${selectedCountries} - ${periodDisplayName}`;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            beginAtZero: true,
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,
              callback: function (value: any) {
                const label = this.getLabelForValue(value);
                return label.split(' ');
              }
            }
          },
          y: {

            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: chartTitle,
            font: {
              size: 22,
              weight: 600
            }
          }
        },
        onClick: (event: any, activeElements: any[]) => {
          if (activeElements.length > 0) {
            const datasetIndex = activeElements[0].datasetIndex;
            const dataIndex = activeElements[0].index;
            const datasetLabel = this.chart.data.datasets[datasetIndex].label;
            //const dataValue = this.chart.data.datasets[datasetIndex].data[dataIndex];
            const label = this.chart.data.labels[dataIndex];
            this.generateStepTwoChart(label + '(' + datasetLabel + ')');
            //alert(`You clicked on ${datasetLabel} in ${label}: ${dataValue}`);
          }
        }
      }
    });

  }

  // Helper function to generate a random color
  getRandomColor() {
    // Generate random hue, saturation, and lightness values
    const hue = Math.floor(Math.random() * 360);  // Hue (0-360)
    const saturation = Math.floor(Math.random() * 30) + 70;  // Saturation (70%-100%)
    const lightness = Math.floor(Math.random() * 30) + 40;   // Lightness (40%-70%) to avoid too dark or too light colors

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }


  generateStepTwoChart(titleLabel: any) {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.triChart) {
      this.triChart.destroy();
    }

    const sanitizedTitleLabel = titleLabel.replace(/\(.*?\)/, '').trim();

    // Filter data based on the titleLabel (therapeuticcategory_name)
    const filteredData = this.CompanyCountryAnalysisChartDataList.filter(
      (item: any) =>
        item.therapeuticcategory_name.trim().toLowerCase() === sanitizedTitleLabel.trim().toLowerCase()
    );



    // Extract unique salesforcename_name and associated total_salesforce
    const labels = Array.from(new Set(filteredData.map((item: any) => item.salesforcename_name)));
    const data = labels.map((label: string) => {
      const entry = filteredData.find((item: any) => item.salesforcename_name === label);
      return entry ? entry.total_salesforce : 0;
    });
    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d') as any;
    this.pieChart = new Chart(pieCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: titleLabel,
            data: data,
            backgroundColor: 'green',
            barThickness: 10
          },

        ]
      },
      options: {
        indexAxis: 'y', // Set the index axis to 'y' for a horizontal bar chart
        responsive: true, // Ensure the chart is responsive
        maintainAspectRatio: false, // Disable maintaining aspect ratio
        scales: {
          x: {

            beginAtZero: true // Ensure x-axis starts at 0
          },
          y: {
            grid: {
              display: false
            },
            beginAtZero: true // Ensure y-axis starts at 0
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'bottom', // Position the legend at the top
            labels: {

              font: {
                size: 14 // Adjust font size if needed
              }
            }
          },
          title: {
            display: true,
            text: titleLabel,
            font: {
              size: 20,
              weight: 800
            }
          }
        },
        onClick: (event: any, activeElements: any[]) => {
          if (activeElements.length > 0) {
            const datasetIndex = activeElements[0].datasetIndex;
            const dataIndex = activeElements[0].index;
            const datasetLabel = this.pieChart.data.datasets[datasetIndex].label;

            let country_name = datasetLabel.match(/\((.*)\)/).pop();
            //const dataValue = this.chart.data.datasets[datasetIndex].data[dataIndex];
            const salesforce_name = this.pieChart.data.labels[dataIndex];
            this.generateStepThreeChart(salesforce_name, country_name);
            //alert(`You clicked on ${datasetLabel} in ${label}: ${dataValue}`);
          }
        }
      }
    });
  }

  generateStepThreeChart(salesforce_name: string, country_name: string) {

    let data = this.CompanyCountryAnalysisChartDataList.filter(d => d.salesforcename_name == salesforce_name && d.country_name == country_name);
    let dataset:any[] = [];
    data.forEach(item => {
      let obj:any = {};
      obj.label = item.product_name;
      obj.barThickness = 50;
      obj.data = [];
      obj.data.push(item.pc_product);
      dataset.push(obj);
    });

    dataset.forEach(item => {
      let d = data.find(i => i.product_name == item.label);
      item.data.push(d?.sp_product || 0);
    });

    if (this.triChart) {
      this.triChart.destroy();
    }
    const triCtx = (document.getElementById('triChart') as HTMLCanvasElement).getContext('2d') as any;
    this.triChart = new Chart(triCtx, {
      type: 'bar',
      data: {
        labels: ['PC FTE', 'SP FTE'],
        datasets: Array.from(dataset)
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            grid: {
              display: false,
            },
            stacked: true, // Stack the bars


          },

        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Migraine Specialty Team - Sleeve ' + salesforce_name
          }
        }
      }
    });
  }

  filterDisplay() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }

  onfilterChange(filterType: string,serial:number=0) {
    let data = {
      user_id: this.user_id,
      companies: null,
      countries: null,
      periods: null,
      brands: null,
      therapeuticcategories: null,
    };
    if (this.selectedReport == 1) {
      if (filterType == 'country') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.join(',') : null;
        this.searchForm.controls['company_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('company', data);
      }
      else if (filterType == 'company') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.join(',') : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        this.searchForm.controls['period_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('period', data);
      }
    }
    else if (this.selectedReport == 2) {
      if (filterType == 'country') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.join(',') : null;
        this.searchForm.controls['company_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('company', data);
      }
      else if (filterType == 'company') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.join(',') : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        this.searchForm.controls['therapeutic_category_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('therapeuticCategory', data);
      }
      else if (filterType == 'therapeuticCategory') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.join(',') : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;
        this.searchForm.controls['period_id'].setValue(null);
        if (data.therapeuticcategories)
          this.getSpecificCustomerData('period', data);
      }
    }
    else if (this.selectedReport == 3) {
      if (filterType == 'country') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        this.searchForm.controls['company_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('company', data);
      }
      else if (filterType == 'company') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        this.searchForm.controls['therapeutic_category_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('therapeuticCategory', data);
      }
      else if (filterType == 'therapeuticCategory') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;
        this.searchForm.controls['period_id'].setValue(null);
        if (data.therapeuticcategories)
          this.getSpecificCustomerData('period', data);
      }
    }
    else if (this.selectedReport == 4) {
      if (filterType == 'country') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        this.searchForm.controls['therapeutic_category_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('therapeuticCategory', data);
      }
      else if (filterType == 'therapeuticCategory') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        this.searchForm.controls['period_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('period', data);
      }
      else if (filterType == 'period') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;
        this.searchForm.controls['company_id_1'].setValue(null);
        this.searchForm.controls['company_id_2'].setValue(null);
        this.searchForm.controls['company_id_3'].setValue(null);
        this.searchForm.controls['company_id_4'].setValue(null);
        this.searchForm.controls['company_id_5'].setValue(null);
        this.searchForm.controls['brand_id_1'].setValue(null);
        this.searchForm.controls['brand_id_2'].setValue(null);
        this.searchForm.controls['brand_id_3'].setValue(null);
        this.searchForm.controls['brand_id_4'].setValue(null);
        this.searchForm.controls['brand_id_5'].setValue(null);
        if (data.therapeuticcategories)
          this.getSpecificCustomerData('company', data);
      }
      else if (filterType == 'company') {
        data.periods = this.searchForm.controls['period_id'].value ? this.searchForm.controls['period_id'].value.toString() : null;
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;

        if (serial == 1) {
          data.companies = this.searchForm.controls['company_id_1'].value ? this.searchForm.controls['company_id_1'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 1);
        }
        else if (serial == 2) {
          data.companies = this.searchForm.controls['company_id_2'].value ? this.searchForm.controls['company_id_2'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 2);
        }
        else if (serial == 3) {
          data.companies = this.searchForm.controls['company_id_3'].value ? this.searchForm.controls['company_id_3'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 3);
        }
        else if (serial == 4) {
          data.companies = this.searchForm.controls['company_id_4'].value ? this.searchForm.controls['company_id_4'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 4);
        }
        else if (serial == 5) {
          data.companies = this.searchForm.controls['company_id_5'].value ? this.searchForm.controls['company_id_5'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 5);
        }
      }
    }
    else if (this.selectedReport == 5) {
      if (filterType == 'country') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        this.searchForm.controls['therapeutic_category_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('therapeuticCategory', data);
      }
      else if (filterType == 'therapeuticCategory') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        this.searchForm.controls['period_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('period', data);
      }
      else if (filterType == 'period') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;
        this.searchForm.controls['company_id_1'].setValue(null);
        this.searchForm.controls['company_id_2'].setValue(null);
        this.searchForm.controls['company_id_3'].setValue(null);
        this.searchForm.controls['company_id_4'].setValue(null);
        this.searchForm.controls['company_id_5'].setValue(null);
        this.searchForm.controls['generic_id_1'].setValue(null);
        this.searchForm.controls['generic_id_2'].setValue(null);
        this.searchForm.controls['generic_id_3'].setValue(null);
        this.searchForm.controls['generic_id_4'].setValue(null);
        this.searchForm.controls['generic_id_5'].setValue(null);
        if (data.therapeuticcategories)
          this.getSpecificCustomerData('company', data);
      }
      else if (filterType == 'genericname') {
        data.periods = this.searchForm.controls['period_id'].value ? this.searchForm.controls['period_id'].value.toString() : null;
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;

        if (serial == 1) {
          data.companies = this.searchForm.controls['company_id_1'].value ? this.searchForm.controls['company_id_1'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('genericname', data, 1);
        }
        else if (serial == 2) {
          data.companies = this.searchForm.controls['company_id_2'].value ? this.searchForm.controls['company_id_2'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('genericname', data, 2);
        }
        else if (serial == 3) {
          data.companies = this.searchForm.controls['company_id_3'].value ? this.searchForm.controls['company_id_3'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('genericname', data, 3);
        }
        else if (serial == 4) {
          data.companies = this.searchForm.controls['company_id_4'].value ? this.searchForm.controls['company_id_4'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('genericname', data, 4);
        }
        else if (serial == 5) {
          data.companies = this.searchForm.controls['company_id_5'].value ? this.searchForm.controls['company_id_5'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('genericname', data, 5);
        }
      }
    }
    else if (this.selectedReport == 6) {
      if (filterType == 'country') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        this.searchForm.controls['therapeutic_category_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('therapeuticCategory', data);
      }
      else if (filterType == 'therapeuticCategory') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        this.searchForm.controls['period_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('period', data);
      }
      else if (filterType == 'period') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;
        this.searchForm.controls['company_id_1'].setValue(null);
        this.searchForm.controls['company_id_2'].setValue(null);
        this.searchForm.controls['company_id_3'].setValue(null);
        this.searchForm.controls['company_id_4'].setValue(null);
        this.searchForm.controls['company_id_5'].setValue(null);
        this.searchForm.controls['brand_id_1'].setValue(null);
        this.searchForm.controls['brand_id_2'].setValue(null);
        this.searchForm.controls['brand_id_3'].setValue(null);
        this.searchForm.controls['brand_id_4'].setValue(null);
        this.searchForm.controls['brand_id_5'].setValue(null);
        if (data.therapeuticcategories)
          this.getSpecificCustomerData('company', data);
      }
      else if (filterType == 'company') {
        data.periods = this.searchForm.controls['period_id'].value ? this.searchForm.controls['period_id'].value.toString() : null;
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;

        if (serial == 1) {
          data.companies = this.searchForm.controls['company_id_1'].value ? this.searchForm.controls['company_id_1'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 1);
        }
        else if (serial == 2) {
          data.companies = this.searchForm.controls['company_id_2'].value ? this.searchForm.controls['company_id_2'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 2);
        }
        else if (serial == 3) {
          data.companies = this.searchForm.controls['company_id_3'].value ? this.searchForm.controls['company_id_3'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 3);
        }
        else if (serial == 4) {
          data.companies = this.searchForm.controls['company_id_4'].value ? this.searchForm.controls['company_id_4'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 4);
        }
        else if (serial == 5) {
          data.companies = this.searchForm.controls['company_id_5'].value ? this.searchForm.controls['company_id_5'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 5);
        }
      }
      else if (filterType == 'brand') {
        data.periods = this.searchForm.controls['period_id'].value ? this.searchForm.controls['period_id'].value.toString() : null;
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;

        if (serial == 1) {
          data.companies = this.searchForm.controls['company_id_1'].value ? this.searchForm.controls['company_id_1'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_1'].value ? this.searchForm.controls['brand_id_1'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_1'].value));
            this.getSpecificCustomerData('salesforce', data, 1);
          }
        }
        else if (serial == 2) {
          data.companies = this.searchForm.controls['company_id_2'].value ? this.searchForm.controls['company_id_2'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_2'].value ? this.searchForm.controls['brand_id_2'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_2'].value));
            this.getSpecificCustomerData('salesforce', data, 2);
          }
        }
        else if (serial == 3) {
          data.companies = this.searchForm.controls['company_id_3'].value ? this.searchForm.controls['company_id_3'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_3'].value ? this.searchForm.controls['brand_id_3'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_3'].value));
            this.getSpecificCustomerData('salesforce', data, 3);
          }

        }
        else if (serial == 4) {
          data.companies = this.searchForm.controls['company_id_4'].value ? this.searchForm.controls['company_id_4'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_4'].value ? this.searchForm.controls['brand_id_4'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_4'].value));
            this.getSpecificCustomerData('salesforce', data, 4);
          }

        }
        else if (serial == 5) {
          data.companies = this.searchForm.controls['company_id_5'].value ? this.searchForm.controls['company_id_5'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_5'].value ? this.searchForm.controls['brand_id_5'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_5'].value));
            this.getSpecificCustomerData('salesforce', data, 5);
          }

        }
      }
    }
    else if (this.selectedReport == 7) {
      if (filterType == 'country') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        this.searchForm.controls['therapeutic_category_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('therapeuticCategory', data);
      }
      else if (filterType == 'therapeuticCategory') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        this.searchForm.controls['period_id'].setValue(null);
        if (data.countries)
          this.getSpecificCustomerData('period', data);
      }
      else if (filterType == 'period') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.join(',') : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;
        this.searchForm.controls['company_id_1'].setValue(null);
        this.searchForm.controls['company_id_2'].setValue(null);
        this.searchForm.controls['company_id_3'].setValue(null);
        this.searchForm.controls['company_id_4'].setValue(null);
        this.searchForm.controls['company_id_5'].setValue(null);
        this.searchForm.controls['brand_id_1'].setValue(null);
        this.searchForm.controls['brand_id_2'].setValue(null);
        this.searchForm.controls['brand_id_3'].setValue(null);
        this.searchForm.controls['brand_id_4'].setValue(null);
        this.searchForm.controls['brand_id_5'].setValue(null);
        if (data.therapeuticcategories)
          this.getSpecificCustomerData('company', data);
      }
      else if (filterType == 'company') {
        data.periods = this.searchForm.controls['period_id'].value ? this.searchForm.controls['period_id'].value.toString() : null;
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;

        if (serial == 1) {
          data.companies = this.searchForm.controls['company_id_1'].value ? this.searchForm.controls['company_id_1'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 1);
        }
        else if (serial == 2) {
          data.companies = this.searchForm.controls['company_id_2'].value ? this.searchForm.controls['company_id_2'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 2);
        }
        else if (serial == 3) {
          data.companies = this.searchForm.controls['company_id_3'].value ? this.searchForm.controls['company_id_3'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 3);
        }
        else if (serial == 4) {
          data.companies = this.searchForm.controls['company_id_4'].value ? this.searchForm.controls['company_id_4'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 4);
        }
        else if (serial == 5) {
          data.companies = this.searchForm.controls['company_id_5'].value ? this.searchForm.controls['company_id_5'].value.toString() : null;
          if (data.companies)
            this.getSpecificCustomerData('brand', data, 5);
        }
      }
      else if (filterType == 'brand') {
        data.periods = this.searchForm.controls['period_id'].value ? this.searchForm.controls['period_id'].value.toString() : null;
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.toString() : null;
        data.therapeuticcategories = this.searchForm.controls['therapeutic_category_id'].value ? this.searchForm.controls['therapeutic_category_id'].value.toString() : null;

        if (serial == 1) {
          data.companies = this.searchForm.controls['company_id_1'].value ? this.searchForm.controls['company_id_1'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_1'].value ? this.searchForm.controls['brand_id_1'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_1'].value));
            this.getSpecificCustomerData('salesforce', data, 1);
          }

        }
        else if (serial == 2) {
          data.companies = this.searchForm.controls['company_id_2'].value ? this.searchForm.controls['company_id_2'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_2'].value ? this.searchForm.controls['brand_id_2'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_2'].value));
            this.getSpecificCustomerData('salesforce', data, 2);
          }

        }
        else if (serial == 3) {
          data.companies = this.searchForm.controls['company_id_3'].value ? this.searchForm.controls['company_id_3'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_3'].value ? this.searchForm.controls['brand_id_3'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_3'].value));
            this.getSpecificCustomerData('salesforce', data, 3);
          }
        }
        else if (serial == 4) {
          data.companies = this.searchForm.controls['company_id_4'].value ? this.searchForm.controls['company_id_4'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_4'].value ? this.searchForm.controls['brand_id_4'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_4'].value));
            this.getSpecificCustomerData('salesforce', data, 4);
          }
        }
        else if (serial == 5) {
          data.companies = this.searchForm.controls['company_id_5'].value ? this.searchForm.controls['company_id_5'].value.toString() : null;
          data.brands = this.searchForm.controls['brand_id_5'].value ? this.searchForm.controls['brand_id_5'].value.toString() : null;
          if (data.companies) {
            this.setSalesforceList(serial, Number(this.searchForm.controls['company_id_5'].value));
            this.getSpecificCustomerData('salesforce', data, 5);
          }
        }
      }
    }
    else if (this.selectedReport == 8) {
      if (filterType == 'company') {
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.toString() : null;
        this.searchForm.controls['country_id'].setValue(null);
        if (data.companies)
          this.getSpecificCustomerData('country', data);
      }
      else if (filterType == 'country') {
        data.countries = this.searchForm.controls['country_id'].value ? this.searchForm.controls['country_id'].value.join(',') : null;
        data.companies = this.searchForm.controls['company_id'].value ? this.searchForm.controls['company_id'].value.toString() : null;
        this.searchForm.controls['period_id'].setValue(null);
        if (data.companies)
          this.getSpecificCustomerData('period', data);
      }
    }

  }

  filterDropdownListByCustomerDropdowns(type:string,serial:number =0) {
    if (this.allCustomerData) {
      const formValue = this.searchForm.value;

      if (type == 'therapeuticCategory' && this.therapeuticCategoriesBase && this.therapeuticCategoriesBase.length && this.allCustomerData.therapeutic_categories && this.allCustomerData.therapeutic_categories.length) {
        this.therapeuticCategories = this.therapeuticCategoriesBase.filter(tc => this.allCustomerData.therapeutic_categories.findIndex(a => a.therapeutic_category == tc.therapeuticCategory_Name) > -1);
        this.buildFilterChipList(formValue);
      }
      if (type == 'country' && this.countriesBase && this.countriesBase.length && this.allCustomerData.countries && this.allCustomerData.countries.length) {
        this.countries = this.countriesBase.filter(c => this.allCustomerData.countries.findIndex(a => a.country_name == c.country_Name) > -1);
        this.buildFilterChipList(formValue);
      }
      if (type == 'company' && this.companiesBase && this.companiesBase.length && this.allCustomerData.companies && this.allCustomerData.companies.length) {
        this.companies = this.companiesBase.filter(c => this.allCustomerData.companies.findIndex(a => a.company_name == c.company_Name) > -1);
        this.buildFilterChipList(formValue);
      }
      if (type == 'period' && this.periodListBase && this.periodListBase.length && this.allCustomerData.periods && this.allCustomerData.periods.length) {
        this.periodList = this.periodListBase.filter(p => this.allCustomerData.periods.findIndex(a => a.period_year == p.period_Year && a.period_quarter == p.period_Quarter) > -1);
        this.buildFilterChipList(formValue);
      }
      if ( type == 'brand') {
        if (this.brandListCompany1 && this.brandListCompany1.length && serial == 1 && this.allCustomerData.brands1 && this.allCustomerData.brands1.length)
          this.brandListCompany1 = this.brandListCompany1.filter(p => this.allCustomerData.brands1.findIndex(a => a.us_product_name_product_promoted == p.name) > -1);
        if (this.brandListCompany2 && this.brandListCompany2.length && serial == 2 && this.allCustomerData.brands2 && this.allCustomerData.brands2.length)
          this.brandListCompany2 = this.brandListCompany2.filter(p => this.allCustomerData.brands2.findIndex(a => a.us_product_name_product_promoted == p.name) > -1);
        if (this.brandListCompany3 && this.brandListCompany3.length && serial == 3 && this.allCustomerData.brands3 && this.allCustomerData.brands3.length)
          this.brandListCompany3 = this.brandListCompany3.filter(p => this.allCustomerData.brands3.findIndex(a => a.us_product_name_product_promoted == p.name) > -1);
        if (this.brandListCompany4 && this.brandListCompany4.length && serial == 4 && this.allCustomerData.brands4 && this.allCustomerData.brands4.length)
          this.brandListCompany4 = this.brandListCompany4.filter(p => this.allCustomerData.brands4.findIndex(a => a.us_product_name_product_promoted == p.name) > -1);
        if (this.brandListCompany5 && this.brandListCompany5.length && serial == 5 && this.allCustomerData.brands5 && this.allCustomerData.brands5.length)
          this.brandListCompany5 = this.brandListCompany5.filter(p => this.allCustomerData.brands5.findIndex(a => a.us_product_name_product_promoted == p.name) > -1);
        this.buildFilterChipList(formValue);
      }
      if (type == 'genericname') {
        if (this.genericNameListCompany1 && this.genericNameListCompany1.length && serial == 1 && this.allCustomerData.genericnames1 && this.allCustomerData.genericnames1.length)
          this.genericNameListCompany1 = this.genericNameListCompany1.filter(p => this.allCustomerData.genericnames1.findIndex(a => a.generic_name == p.generic_Name) > -1);
        if (this.genericNameListCompany2 && this.genericNameListCompany2.length && serial == 2 && this.allCustomerData.genericnames2 && this.allCustomerData.genericnames2.length)
          this.genericNameListCompany2 = this.genericNameListCompany2.filter(p => this.allCustomerData.genericnames2.findIndex(a => a.generic_name == p.generic_Name) > -1);
        if (this.genericNameListCompany3 && this.genericNameListCompany3.length && serial == 3 && this.allCustomerData.genericnames3 && this.allCustomerData.genericnames3.length)
          this.genericNameListCompany3 = this.genericNameListCompany3.filter(p => this.allCustomerData.genericnames3.findIndex(a => a.generic_name == p.generic_Name) > -1);
        if (this.genericNameListCompany4 && this.genericNameListCompany4.length && serial == 4 && this.allCustomerData.genericnames4 && this.allCustomerData.genericnames4.length)
          this.genericNameListCompany4 = this.genericNameListCompany4.filter(p => this.allCustomerData.genericnames4.findIndex(a => a.generic_name == p.generic_Name) > -1);
        if (this.genericNameListCompany5 && this.genericNameListCompany5.length && serial == 5 && this.allCustomerData.genericnames5 && this.allCustomerData.genericnames5.length)
          this.genericNameListCompany5 = this.genericNameListCompany5.filter(p => this.allCustomerData.genericnames5.findIndex(a => a.generic_name == p.generic_Name) > -1);
        this.buildFilterChipList(formValue);
      }
      if (type == 'salesforce') {
        if (this.salesforceListCompany1 && this.salesforceListCompany1.length && serial == 1 && this.allCustomerData.salesforces1 && this.allCustomerData.salesforces1.length)
          this.salesforceListCompany1 = this.salesforceListCompany1.filter(p => this.allCustomerData.salesforces1.findIndex(a => a.salesforce_name == p.salesforceName_Name) > -1);
        if (this.salesforceListCompany2 && this.salesforceListCompany2.length && serial == 2 && this.allCustomerData.salesforces2 && this.allCustomerData.salesforces2.length)
          this.salesforceListCompany2 = this.salesforceListCompany2.filter(p => this.allCustomerData.salesforces2.findIndex(a => a.salesforce_name == p.salesforceName_Name) > -1);
        if (this.salesforceListCompany3 && this.salesforceListCompany3.length && serial == 3 && this.allCustomerData.salesforces3 && this.allCustomerData.salesforces3.length)
          this.salesforceListCompany3 = this.salesforceListCompany3.filter(p => this.allCustomerData.salesforces3.findIndex(a => a.salesforce_name == p.salesforceName_Name) > -1);
        if (this.salesforceListCompany4 && this.salesforceListCompany4.length && serial == 4 && this.allCustomerData.salesforces4 && this.allCustomerData.salesforces4.length)
          this.salesforceListCompany4 = this.salesforceListCompany4.filter(p => this.allCustomerData.salesforces4.findIndex(a => a.salesforce_name == p.salesforceName_Name) > -1);
        if (this.salesforceListCompany5 && this.salesforceListCompany5.length && serial == 5 && this.allCustomerData.salesforces5 && this.allCustomerData.salesforces5.length)
          this.salesforceListCompany5 = this.salesforceListCompany5.filter(p => this.allCustomerData.salesforces5.findIndex(a => a.salesforce_name == p.salesforceName_Name) > -1);
        this.buildFilterChipList(formValue);
      }
    }
  }

  getCustomerDropdowns() {
    this.getSpecificCustomerData('country');
    this.getSpecificCustomerData('company');
    this.getSpecificCustomerData('period');
    this.getSpecificCustomerData('therapeuticCategory');
    this.getSpecificCustomerData('brand');
    this.getSpecificCustomerData('genericname');
    this.getSpecificCustomerData('salesforce');
  }

  getSpecificCustomerData(type: string,params:any=null,serial:number=0) {

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

    let data: any = {
      user_id: this.user_id,
      companies: null,
      countries: null,
      periods: null,
      therapeuticcategories: null,
      columns: columns
    };

    if (params) {
      data = params;
      data.columns = columns;
    }

    //if (this.storageService.UserDetails && this.storageService.UserDetails.userRights) {
    //  let userRights = this.storageService.UserDetails.userRights;

    //  if (type == 'country') {
    //    data.countries = userRights.countries;
    //  }
    //  else if (type == 'company') {
    //    data.companies = userRights.companies;
    //  }
    //  else if (type == 'period') {
    //    data.periods = userRights.periods;
    //  }
    //  else if (type == 'therapeuticCategory') {
    //    data.therapeuticcategories = userRights.therapeuticCategories;
    //  }
    //}

    this.apiService.PostAll(GetCustomerDropdowns, data).subscribe(response => {
      if (response?.status) {
        if (type == 'country') {
          this.allCustomerData.countries = response.result;
          this.filterDropdownListByCustomerDropdowns('country');
        }
        else if (type == 'company') {
          this.allCustomerData.companies = response.result;
          this.filterDropdownListByCustomerDropdowns('company');
        }
        else if (type == 'period') {
          this.allCustomerData.periods = response.result;
          this.filterDropdownListByCustomerDropdowns('period');
        }
        else if (type == 'therapeuticCategory') {
          this.allCustomerData.therapeutic_categories = response.result;
          this.filterDropdownListByCustomerDropdowns('therapeuticCategory');
        }
        else if (type == 'brand') {
          if (serial == 1) {
            this.allCustomerData.brands1 = response.result;
          }
          else if (serial == 2) {
            this.allCustomerData.brands2 = response.result;
          }
          else if (serial == 3) {
            this.allCustomerData.brands3 = response.result;
          }
          else if (serial == 4) {
            this.allCustomerData.brands4 = response.result;
          }
          else if (serial == 5) {
            this.allCustomerData.brands5 = response.result;
          }
          else {
            this.allCustomerData.brands = response.result;
          }

          this.filterDropdownListByCustomerDropdowns('brand', serial);
        }
        else if (type == 'genericname') {
          if (serial == 1) {
            this.allCustomerData.genericnames1 = response.result;
          }
          else if (serial == 2) {
            this.allCustomerData.genericnames2 = response.result;
          }
          else if (serial == 3) {
            this.allCustomerData.genericnames3 = response.result;
          }
          else if (serial == 4) {
            this.allCustomerData.genericnames4 = response.result;
          }
          else if (serial == 5) {
            this.allCustomerData.genericnames5 = response.result;
          }
          else {
            this.allCustomerData.genericnames = response.result;
          }

          this.filterDropdownListByCustomerDropdowns('genericname', serial);
        }
        else if (type == 'salesforce') {
          if (serial == 1) {
            this.allCustomerData.salesforces1 = response.result;
          }
          else if (serial == 2) {
            this.allCustomerData.salesforces2 = response.result;
          }
          else if (serial == 3) {
            this.allCustomerData.salesforces3 = response.result;
          }
          else if (serial == 4) {
            this.allCustomerData.salesforces4 = response.result;
          }
          else if (serial == 5) {
            this.allCustomerData.salesforces5 = response.result;
          }
          else {
            this.allCustomerData.salesforces = response.result;
          }
          this.filterDropdownListByCustomerDropdowns('salesforce', serial);

        }
      }
    });
  }


  exportData(): void {
    switch (this.selectedReport) {
      case 1:
        this.exportCSVForReport1();
        break;
      case 2:
        this.exportCSVForReport2();
        break;
      case 3:
        this.exportCSVForReport3();
        break;
      case 4:
        this.exportCSVForReport4();
        break;
      case 5:
        this.exportCSVForReport5();
        break;
      case 6:
        this.exportCSVForReport6();
        break;
      case 7:
        this.exportCSVForReport7();
        break;
      case 8:
        this.exportCSVForReport8();
        break;
      default:
        console.error('Invalid report selection');
    }
  }
  
  exportCSVForReport1(): void {
    const tableData = [];
    const header = ['Company/Country', 'SalesForce Group', 'SalesForce Group', 'Total Deployment'];
    tableData.push(header);
    this.companyDeploymentByCountryPCAndSpecialtyGridData.forEach(item => {
      tableData.push([item.country_name, 'PC Focused', 'SP Focused', '']);
      tableData.push([`"${item.company_name}"`]);
      tableData.push([item.period, item.pc, item.sp, item.total]);
    });
    const csvContent = tableData.map(row => row.join(',')).join('\n');
    this.downloadCSVFile(csvContent, 'CompanyDeploymentByCountryPCAndSpecialty.csv');
  }

  exportCSVForReport2(): void {
    const tableData = [];
    const header = ['Therapeutic Category', ...this.selectedCountries.map(country => country.country_Name)];
    tableData.push(header);
    this.filteredTotalCompanyDeploymentByCountryAndTCGridData.forEach(item => {
      tableData.push([`"${item.therapeuticcategory_name}"`]);
      tableData.push([item.period, ...item.data.map(d => d !== null ? d : '*')]);
    });
  const csvContent = tableData.map(row => row.join(',')).join('\n');
  this.downloadCSVFile(csvContent, 'TherapeuticCategoryDeployment.csv');
  }

  exportCSVForReport3(): void {
    const tableData = [];
    const header = ['Company', 'Therapeutic Category', 'Country', 'Period', 'Products Promoted', 'Sales Force Size (FTEs)'];
    tableData.push(header);
    this.companyPortfolioByTCAndSalesForceGridData.forEach(item => {
      const productsPromoted = item.products?.map((p, index) => `${index + 1}. ${p.name}-${p.total}`).join(' ') || '';
      const salesForceSize = `"${item.total}\n(Primary Care - ${item.pc})\n(Spec - ${item.sp})"`;
      const row = [
        `"${item.company_name}"`,
        `"${item.therapeuticcategory_name}"`,
        item.country,
        item.period,
        productsPromoted,  
        salesForceSize
      ];
      tableData.push(row);
    });
  
    // Convert array to CSV format
    const csvContent = tableData.map(row => row.join(',')).join('\n');
  
    // Trigger file download
    this.downloadCSVFile(csvContent, 'CompanyPortfolioByTCAndSalesForce.csv');
  }

  exportCSVForReport4(): void { 
    const tableData = [];
    const header = ['Country', 'Company', 'Sales Force Name', 'Physician Focus', 'Sales Force Size', 'Product Promoted(FTEs)'];
    tableData.push(header);
    this.productFTEsByTCAndSalesForceUsingBrandNameGridData.forEach(item => {
      const firstRow = [
        item.country,
        `"${item.company_name}"`,
        `"${item.salesforcename_name}"`,
        item.focused,
      ];
      const productsPromoted = item.products?.map((p, index) => `${index + 1}. ${p.name}-${p.total}`).join(' ') || '';
      const salesForceSize = `"${item.total}"`;
      
      const secondRow = [
        item.period,
        '',
        '',
        '',
        salesForceSize,
        productsPromoted
      ];
      
      tableData.push(firstRow);
      tableData.push(secondRow);
    });
    const csvContent = tableData.map(row => row.join(',')).join('\n');
    this.downloadCSVFile(csvContent, 'ProductFTEsByTCAndSalesForce.csv');
  }

  exportCSVForReport5(): void {
    const tableData = [];
    const header = ['Country', 'Company', 'Sales Force Name', 'Physician Focus', 'Sales Force Size', 'Product Promoted(FTEs)'];
    tableData.push(header);
    this.ProductFTEsByTCAndSalesForceUsingGenericNameGridData.forEach(item => {
      const firstRow = [
        item.country,
        `"${item.company_name}"`,
        `"${item.salesforcename_name}"`,
        item.focused,
      ];
      const productsPromoted = item.products?.map((p, index) => `${index + 1}. ${p.name}-${p.total}`).join(' ') || '';
      const salesForceSize = `"${item.total}"`;

      const secondRow = [
        item.period,
        '',
        '',
        '',
        salesForceSize,
        productsPromoted
      ];
      tableData.push(firstRow);
      tableData.push(secondRow);
    });
    const csvContent = tableData.map(row => row.join(',')).join('\n');
    this.downloadCSVFile(csvContent, 'ProductFTEsByTCAndSalesForceUsingGenericName.csv');
  }
  exportCSVForReport6(): void {
    const tableData = [];
    const header = ['Company', 'Country', 'Sales Force Name', 'Employee Type', 'Low Salary', 'High Salary', 'Target Bonus'];
    tableData.push(header);
    this.salesRepresentativeCompensationBySalesForceAndProductGridData.forEach(item => {
      const salesForceName = `"${item.salesforcename_name}"`;
      const firstRow = [
        item.company_name,
        item.country,
        salesForceName,
        item.employee_type
      ];
      const secondRow = [
        item.period,
        '',
        '',
        '',
        item.salary_low,
        item.salary_high,
        item.target_bonus
      ];
      tableData.push(firstRow);
      tableData.push(secondRow);
    });
    const csvContent = tableData.map(row => row.join(',')).join('\n');
    this.downloadCSVFile(csvContent, 'SalesRepresentativeCompensationBySalesForceandProduct.csv');
  }
  exportCSVForReport7(): void {
    const tableData = [];
    const mainHeader = ['Period', 'Company', 'Sales Force Name', 'Product Promoted(FTEs)', 'Reach'];
    tableData.push(mainHeader);
    const subHeader = ['', '', '', '', '# of HCPs', '% PC vs SP', 'Call Per Qtr'];
    tableData.push(subHeader);
    this.reachAndFrequencyBySalesForceAndProductGridData.forEach(item => {
      const productsPromoted = item.products?.map((p, index) => `${p.name}-${p.total}`).join(' ') || '';
      const salesForceName = `"${item.salesforcename_name}"`;
      const row = [
        item.period,
        item.company_name,
        salesForceName,
        productsPromoted,
        item.hspc,
        item.pc_vs_sp,
        item.calls_per_quarter
      ];
      tableData.push(row);
    });
    const csvContent = tableData.map(row => row.join(',')).join('\n');
    this.downloadCSVFile(csvContent, 'ReachAndFrequencyBySalesForceAndProduct.csv');
  }

  exportCSVForReport8(): void {
    const tableData = [];
    const header = ['Country', 'Company', 'Sales Force Name', 'Physician Focus', 'Sales Force Size', 'Product Promoted(FTEs)'];
    tableData.push(header);
    this.companyCountryAnalysisGridDataList.forEach(item => {
      const firstRow = [item.country_name, `"${item.company}"`, `"${item.salesforcename_name}"`, item.physicianfocus_name, '', ''];
      tableData.push(firstRow);
      const productsPromoted = item.products?.map((p, index) => `${index + 1}. ${p.name}-${p.total ?? ' '}`).join(' ') || '';
      const secondRow = [
        item.period_name, '', '', '', item.salesforce_size,
        `"${productsPromoted}"`
      ];
      tableData.push(secondRow);
    });
    const csvContent = tableData.map(row => row.join(',')).join('\n');
    this.downloadCSVFile(csvContent, 'CompanyCountryAnalysis.csv');
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

  onCountrySelectionChange(maxLimit:any) {
    const selectedCountries = this.searchForm.get('country_id')?.value;
    if (selectedCountries.length > maxLimit) {
      this.searchForm.get('country_id')?.setValue(selectedCountries.slice(0, maxLimit));
    }
  }
  onCompanySelectionChange(maxLimit:any) {
    const selectedCountries = this.searchForm.get('company_id')?.value;
    if (selectedCountries.length > maxLimit) {
      this.searchForm.get('company_id')?.setValue(selectedCountries.slice(0, maxLimit));
    }
  }
  onPeriodSelectionChange(maxLimit:any) {
    const selectedCountries = this.searchForm.get('period_id')?.value;
    if (selectedCountries.length > maxLimit) {
      this.searchForm.get('period_id')?.setValue(selectedCountries.slice(0, maxLimit));
    }
  }

}
