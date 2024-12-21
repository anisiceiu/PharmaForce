import { Component, HostListener, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { getAdminCurrentPeriod,getCitationsForDM, deleteDMSalesforceRecord, getUserPreferences, addUserPreference, GetDMSalesforceRecordsFilters, addNewDataManagerItem, deleteDataManagerItem, getAllDataManagerItems, publishDataManagerItems, updateDataManagerItem, getDMCompaniesForCountry, getDMPeriodSalesforceForCompany, GetDataManagerRecordsFilters, UpdateDataManagerItemInlineEdit, GetDataManagerSalesforceExcelData } from '../../../constants/api.constant';
import { SalesforceData, IdNamePair, dropdowncollection } from '../../../models/salesforcedata';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';
/*import { DataManagerAddPopupComponent } from '../../shared/components/data-manager-add-popup/data-manager-add-popup.component';*/
import { DataManagerEditPopupComponent } from '../../shared/components/data-manager-edit-popup/data-manager-edit-popup.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  Observable,
  catchError,
  map,
  merge,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { CitationManagerComponent } from '../../master-data/citation-manager/citationmanager.component';
import { UserPreference } from '../../../models/userPreference';
import { Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { citation } from '../../../models/citation';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { ConfirmActionComponent } from '../../shared/components/confirm-action/confirm-action.component';
import { StorageService } from '../../../services/common/storage.service';
import { SignalRService } from '../../../services/common/signalR.service';
import { DataManagerProduct } from '../../../models/datamanagerproduct';
import { DataManagerAddSalesforcePopupComponent } from '../../shared/data-manager-add-salesforce-popup/data-manager-add-salesforce-popup.component';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import * as _ from 'underscore';
import { SalesforceOption } from '../../../models/SalesforceOption';
import { AddSalesforcePopupComponent } from '../../shared/data-manager/add-salesforce-popup/add-salesforce-popup.component';
import { EditSalesforcePopupComponent } from '../../shared/data-manager/edit-salesforce-popup/edit-salesforce-popup.component';
import * as XLSX from 'xlsx';
import { CellValueChangedEvent, ColDef, ColGroupDef, GridApi, GridOptions, GridReadyEvent, ModuleRegistry, RowSelectionOptions, RowValueChangedEvent } from 'ag-grid-community';
import { AgGridDeleteButtonComponent } from '../../shared/ag-grid-delete-button/ag-grid-delete-button.component';
import { AgGridNumericCellEditorComponent } from '../../shared/ag-grid-numeric-cell-editor/ag-grid-numeric-cell-editor.component';
import { UserPermissionModel } from '../../../models/AppFunction';


@Component({
  selector: 'app-data-manager-list',
  templateUrl: './data-manager-list.component.html',
  styleUrls: ['./data-manager-list.component.scss'],
})
export class DataManagerListComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  isMenuOpen = false;
  exportExcelFileName: string = "DataManager Grid Data.xlsx";

  openMenu() {
    this.isMenuOpen = true;
  }

  // Method to close the menu and reset the state
  closeMenu() {
    this.isMenuOpen = false;
    this.menuTrigger.closeMenu();
  }

  // Close the menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const menuElement = document.querySelector('#manageColumnMenu');

    if (menuElement && !menuElement.contains(target) && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  // Prevent the menu from closing when clicking inside
  @HostListener('click', ['$event'])
  onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  userPreferences: UserPreference = {} as UserPreference;
  all_data: dropdowncollection | undefined;
  product_Names: IdNamePair[] = [];
  countries_Names: IdNamePair[] = [];
  companies_Names: IdNamePair[] = [];
  salesforce_Names: SalesforceOption[] = [];
  period_Years: IdNamePair[] = []; 
  period_Quarters: IdNamePair[] = [
    { id: 4, name: '4' },
    { id: 3, name: '3' },
    { id: 2, name: '2' },
    { id: 1, name: '1' },
  ];
  qcq_Status: IdNamePair[] = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Rejected' }
  ];
  salesforce_type: IdNamePair[] = [];
  salesforce_NameNarrow: IdNamePair[] = [];
  companies_NamesNarrow: IdNamePair[] = [];
  period_YearsNarrow: IdNamePair[] = [];
  period_QuartersNarrow: IdNamePair[] = [];
  periodSalesforceForCompany: any = [];
  searchTextOptions:string[] = [];

  dataItems: SalesforceData[] = [];
  showFilter = false;
  searchForm: FormGroup;
  sortField = '';
  sortDirection = '';
  selectedYear: string = '';

  currentYear = new Date().getFullYear().toString();
  currentQuarter: string = '';
  ifUserFilterPrefExists: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  accordion = viewChild.required(MatAccordion);

  selection = new SelectionModel<SalesforceData>(true, []);
  dataSource = new MatTableDataSource<SalesforceData>(this.dataItems);
  totalRecords: number = 0;
  resultsLength = 0;
  pageSize: number = 10; // Default page size
  pageIndex: number = 0;
  isReset = false;
  user_id = 0;
  currentUser:any;
  citations: citation[] = [];

  isEdited: boolean = false;
 
  displayedColumns: string[] = [
    'select',
    'qcq_status',
    'has_citation',
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
    'additional_Notes_Salesforce',
    'daDatabase_Salesforce_Id',
    'added_date',
    'added_by_name',
    'modified_date',
    'modified_by_name',
    'action'
  ];

  //columnChooserList: string[] = this.displayedColumns.slice(1);
  adminFunctionList = "";
  FN_ExportExcel = "54";
  FN_SaveSearch = "55";

  columnChooserList = [
    { key: 'qcq_status', value: 'QCQ Status' },
    { key: 'has_citation', value: 'Has Citation'},
    { key: 'country_Name', value: 'Country Name' },
    { key: 'company_Name', value: 'Company Name'},
    { key: 'period_Year', value: 'Period Year'},
    { key: 'period_Quarter', value: 'Period Quarter' },
    { key: 'salesforce_Name', value: 'Salesforce Name' },
    { key: 'type_of_Salesforce', value: 'Type Of Salesforce' },
    { key: 'number_Of_Sales_Representatives', value: 'Number Of Sales Representatives'},
    { key: 'number_Of_District_Managers', value: 'Number Of District Managers' },
    { key: 'number_Of_Regional_Managers', value: 'Number Of Regional Managers' },
    { key: 'uS_Product_Name_Product_Promoted', value: 'US Brand Name Product Promoted' },
    { key: 'country_Specific_Product_Name_Product_Promoted', value: 'Country Specific Brand Name Product Promoted' },
    { key: 'generic_Name', value: 'Generic Name'},
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
    { key: 'name_of_a_CSO_Contract_Sales_Organization', value: 'Contract Sales Organization'},
    { key: 'salary_Low', value: 'Salary low' },
    { key: 'salary_High', value: 'Salary High' },
    { key: 'target_Bonus', value: 'Target Bonus'},
    { key: 'reach', value: 'Reach'},
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
  userPermission: UserPermissionModel = {
    canAccessReport: true,
    canExportExcel: true,
    canSaveSearch: true
  } as UserPermissionModel;

  columnsToDisplay: string[] = this.displayedColumns.filter(item => item != 'daDatabase_Salesforce_Id');

  filteredOptionsCountry_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsCompany_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsSalesForce_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsPeriodYear_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsPeriodQuarter_Name: Observable<IdNamePair[]> = new Observable<IdNamePair[]>();
  filteredOptionsSearchText: string[] = [];

  //new grid
  private gridApi!: GridApi<SalesforceData>;
  //end new grid
  constructor(
    private dialog: MatDialog,
    public fb: FormBuilder,
    private apiService: ApiService,
    private _liveAnnouncer: LiveAnnouncer,
    private toasterService: ToasterService,
    private router: Router,
    private storageService: StorageService,
    private signalRService: SignalRService
  ) {
    this.searchForm = this.fb.group({
      country_Name: [''],
      company_Name: [''],
      salesForce_Name: [''],
      period_Year: [''],
      period_Quarter: [''], 
      qcq_status: [null],
      has_citation: [null],
      search_text: [null],
      country_NameAuto: [''],
      company_NameAuto: [''],
      salesForce_NameAuto: [''],
      dadatabase_id: [''], 
      qcq_statusAuto: [null],
      has_citationAuto: [null],
      search_NameAuto:[null]
    });

    this.user_id = this.storageService.UserDetails.id;
    this.currentUser = this.storageService.UserDetails;
    this.adminFunctionList = this.currentUser.adminFunctions.split(",");
    this.getUserPreferences();
    this.setUserPermission();
    
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

  rowSelection:any = {
    mode: 'singleRow',
  };

  setGridRowData() {
    this.gridApi.setGridOption("rowData", this.dataItems);
  }

  onGridReady(params: GridReadyEvent<SalesforceData>) {
    this.gridApi = params.api;
    this.applyVisibilityToGridColumns();
  }

  // Column Definitions: Defines the columns to be displayed.
  defaultColDef: ColDef = {
    editable: true,
    cellDataType: false,
  };

  actionCellRenderer(params:any) {
  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell:any) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
        <button style="padding:5px;" 
          class="btn btn-primary-outline"
          data-action="update">
               update  
        </button>
        <button  style="padding:5px;"
          class="btn btn-primary-outline"
          data-action="cancel">
               cancel
        </button>
        `;
  } else {
    eGui.innerHTML = `
        <button style="padding:5px;"
          class="btn btn-primary-outline"
          data-action="edit">
             edit 
          </button>
        `;
  }

  return eGui;
  };

  onCellClicked(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: 'number_Of_District_Managers'
        });
      }


      if (action === "update") {
        this.isEdited = true;
        params.api.stopEditing(false);

      }

      if (action === "cancel") {
        this.isEdited = false;
        params.api.stopEditing(true);

      }
    }
  }

  gridOptions: any = {
  
  suppressClickEdit: true,

  onRowEditingStarted: (params:any) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  },
  onRowEditingStopped: (params:any) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });

    if (this.isEdited) {
      this.isEdited = false;
      this.updateRecord(params.data);
    }
  },
  editType: "fullRow"
  }

  applyVisibilityToGridColumns() {
    let columns = this.gridApi.getColumns() || [];
    let columnKeys: string[] = columns?.map((c: any) => c.colId as string) || [];
    let buttonCols = ['button', 'action'];
    let columnsVisible = buttonCols.concat(this.columnsToDisplay.map(c => c.toLowerCase()));
    let columnsToHide: string[] = columnKeys?.filter(c => !columnsVisible.includes(c.toLowerCase()));
    //console.log(columns, columnKeys, this.columnsToDisplay, columnsToHide);
    this.gridApi.setColumnsVisible(columnKeys, true); //set all to visiable 
    this.gridApi.setColumnsVisible(columnsToHide,false);
  }

  colDefs: ColDef[] = [
    {
      headerName: '',width:80, editable: false, field: 'button', cellRenderer: AgGridDeleteButtonComponent, valueGetter: (params) => ({ item: params.data, onClick: this.deleteClick }) 
    },
    {
      headerName: 'QCQ Status', field: 'qcQ_Status', valueGetter: function (p: any): any {
        if (p.data.qcQ_Status && p.data.qcQ_Status == 1) {
          return 'Pending';
        }
        else if (p.data.qcQ_Status && p.data.qcQ_Status == 2){
          return 'Approved';
        }
        else if (p.data.qcQ_Status && p.data.qcQ_Status == 3) {
          return 'Rejected';
        }
        else if (p.data.qcQ_Status && p.data.qcQ_Status == 5) {
          return 'Published';
        }
        else {
          return 'N/A';
        }
      }, filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      },editable: false, 
    },
    {
      headerName: 'Has Citation', field: 'has_Citation', valueGetter: function (p: any): any { return p.data.has_Citation? 'Yes' : 'No' }, filter: false, editable: false
    },
    {
      headerName: 'Country Name', field: 'country_Name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      },editable: false, 
    },
    {
      headerName: 'Company Name', field: 'company_Name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false, 
    },
    {
      headerName: 'Period Year', field: 'period_Year', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Period Quarter', field: 'period_Quarter', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Salesforce Name', field: 'salesforce_Name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Type Of Salesforce', field: 'type_of_Salesforce', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Number Of Sales Representatives', field: 'number_Of_Sales_Representatives', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Number Of District Managers', field: 'number_Of_District_Managers', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: true
    },
    {
      headerName: 'Number Of Regional Managers', field: 'number_Of_Regional_Managers', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: true, cellEditor: AgGridNumericCellEditorComponent
    },
    {
      headerName: 'US Brand Name Product Promoted', field: 'uS_Product_Name_Product_Promoted', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Country Specific Brand Name Product Promoted', field: 'country_Specific_Product_Name_Product_Promoted', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Generic Name', field: 'generic_Name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Therapeutic Category', field: 'therapeutic_Category', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Product Promotion Priority Order', field: 'product_Promotion_Priority_Order', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: true, cellEditor: AgGridNumericCellEditorComponent
    },
    {
      headerName: 'Total Number of Full Time Equivalents FTEs', field: 'total_Number_of_Full_Time_Equivalents_FTEs', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Primary Care Full Time Equivalents FTEs', field: 'primary_Care_Full_Time_Equivalents_FTEs', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Specialty Full Time Equivalents FTEs', field: 'specialty_Full_Time_Equivalents_FTEs', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Physicians Focus Primary Care', field: 'physicians_Focus_Primary_Care_Physicians_Specialty_Physicians', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Specialty Physicians Targeted', field: 'specialty_Physicians_Targeted', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Co Promotion YesNo', field: 'co_Promotion_YesNo', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Name Of a Partner Company', field: 'name_of_a_Partner_Company', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Contract Sales Force YesNo', field: 'contract_Sales_Force_YesNo', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Contract Sales Organization', field: 'name_of_a_CSO_Contract_Sales_Organization', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Salary low', field: 'salary_Low', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: true, cellEditor: AgGridNumericCellEditorComponent
    },
    {
      headerName: 'Salary High', field: 'salary_High', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: true, cellEditor: AgGridNumericCellEditorComponent
    },
    {
      headerName: 'Target Bonus', field: 'target_Bonus', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: true, cellEditor: AgGridNumericCellEditorComponent
    },
    {
      headerName: 'Reach', field: 'reach', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: true, cellEditor: AgGridNumericCellEditorComponent
    },
    {
      headerName: 'Pct Split Between Primary Care And Specialty', field: 'pct_Split_Between_Primary_Care_And_Specialty', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Frequency', field: 'frequency', filter: "agNumberColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: true, cellEditor: AgGridNumericCellEditorComponent
    },
    {
      headerName: 'Additional Notes Product', field: 'additional_Notes_Product', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Additional Notes Salesforce', field: 'additional_Notes_Salesforce', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Database Salesforce Id', field: 'daDatabase_Salesforce_Id', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Modified Date', field: 'modified_date', filter: "agDateColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Modified By', field: 'modified_by_name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Added Date', field: 'added_date', filter: "agDateColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: 'Added By', field: 'added_by_name', filter: "agTextColumnFilter", filterParams: {
        buttons: ['apply', 'reset']
      }, editable: false
    },
    {
      headerName: "action",
      minWidth: 150,
      cellRenderer: this.actionCellRenderer,
      editable: false,
      colId: "action"
    }
  ];

  viewRowDetails() {
    let items = this.gridApi.getSelectedRows();
    if (items && this.dataItems && this.dataItems.length) {
      let item: any = items.at(0);
      if (item) {
        this.openEditDialog(item);
      }
    }
    
  }

  editClick(event: any): void {
    let rowIndex: any = event.currentTarget?.parentNode?.attributes['data-row'].value;
    if (rowIndex) {
      let item: any = this.dataItems.at(Number(rowIndex));
      if (item) {
        this.openEditDialog(item);
      }
    }
    //console.log("edit", rowIndex, item)
  };

  deleteClick(item: any): void {
      if (item) {
        this.deleteSalesforce(item.daDatabase_Salesforce_Id);
      }
  };


  exportToexcel(): void {
    /* pass here the table id */

    this.fetchExcelData().subscribe((response: ApiResponse) => {
      if (response.status) {
        if(response.result)
        {
          let records: SalesforceData[] = response.result.records;
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(records);

          var range = XLSX.utils.decode_range(ws['!ref'] as string);
          for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {

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
      }

    });
    
    
  }

  onSearchTextChange(event: MatAutocompleteSelectedEvent) {
    this.searchForm.controls['search_text'].setValue(event.option.value);
    this.onSearch();
  }

  onCountry_NameChange(event: MatAutocompleteSelectedEvent) {
    this.apiService.PostAll(getDMCompaniesForCountry, { user_id: this.user_id, security_token: '', country_name: event.option.value.name }).subscribe(response => {
      if (response && response.status) {
        this.companies_NamesNarrow = this.companies_Names.filter(i => response.result.findIndex((c: { company_Name: string; }) => c.company_Name == i.name) > -1);
        this.filteredOptionsCompany_Name = of(this.companies_NamesNarrow);
        this.filteredOptionsCompany_Name = this.searchForm?.controls['company_NameAuto']?.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filterCompany(name as string) : this.companies_NamesNarrow?.slice();
          }),
        );
      }
    });

    this.searchForm.controls['country_Name'].setValue(event.option.value.name);
    this.onSearch();
  }

  getuniqueSalesforceList(data:any[]) {
    let resultArr:any[] = [];
    data.filter(function (item) {
      var i = resultArr.findIndex(x => (x.name == item.name));
      if (i <= -1) {
        resultArr.push(item);
      }
      return null;
    });

    return resultArr;
  }

  onCompany_NameChange(event: MatAutocompleteSelectedEvent) {
    this.apiService.PostAll(getDMPeriodSalesforceForCompany, { user_id: this.currentUser.id, security_token: '', country_Name: this.searchForm.controls['country_Name'].value, company_name: event.option.value.name }).subscribe(response => {
      if (response && response.status) {
        this.periodSalesforceForCompany = response.result;
        this.period_YearsNarrow = this.period_Years.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; }) => c.period_Year == i.name) > -1);
        const currentYear = new Date().getFullYear().toString();
        this.period_YearsNarrow.forEach((year) => {
          if (year.name === currentYear) {
            year.name = `${year.name} - current`;
          }
        });

        this.salesforce_NameNarrow = this.getuniqueSalesforceList(this.salesforce_Names.filter(c => this.periodSalesforceForCompany.findIndex((u: { salesForce_Name: string; }) => u.salesForce_Name == c.name && c.company == event.option.value.name && c.country == this.searchForm.controls['country_Name'].value) > -1).map(sf => ({id:sf.id,name:sf.name})));
        if (this.searchForm.controls['salesForce_Name'].value && this.salesforce_NameNarrow.findIndex(c => c.name == this.searchForm.controls['salesForce_Name'].value) == -1) {
          this.searchForm.controls['salesForce_Name'].setValue(null);
        }
        
        this.filteredOptionsPeriodYear_Name = of(this.period_YearsNarrow);
        this.filteredOptionsSalesForce_Name = of(this.salesforce_NameNarrow);
        this.filteredOptionsSalesForce_Name = this.searchForm.controls['salesForce_NameAuto'].valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filterSalesForce(name as string) : this.salesforce_NameNarrow.slice();
          }),
        );
      }
    });

    this.searchForm.controls['company_Name'].setValue(event.option.value.name);
    this.onSearch();
  }

  onPeriod_YearChange(periodYear: string) {
    this.selectedYear = periodYear.replace(' - current', '');
    this.salesforce_NameNarrow = this.salesforce_NameNarrow.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; period_Quarter: string, salesForce_Name: string }) => c.period_Year == this.selectedYear && c.salesForce_Name == i.name) > -1);
    this.period_QuartersNarrow = this.period_Quarters.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; period_Quarter: string, salesForce_Name: string }) => c.period_Year == this.selectedYear) > -1);
    
    if (this.searchForm.controls['salesForce_Name'].value && this.salesforce_NameNarrow.findIndex(c => c.name == this.searchForm.controls['salesForce_Name'].value) == -1) {
      this.searchForm.controls['salesForce_Name'].setValue(null);
    }

    this.filteredOptionsPeriodQuarter_Name = of(this.period_QuartersNarrow);
    this.filteredOptionsSalesForce_Name = of(this.salesforce_NameNarrow);
    this.updatePeriodQuarters();
    this.onSearch();
  }

  updatePeriodQuarters(): void {
    this.searchForm.get('period_Quarter')?.setValue(null);

    this.period_QuartersNarrow.forEach((quarter) => {
      if (quarter.name.endsWith(' - current')) {
        quarter.name = quarter.name.replace(' - current', ''); // Remove current if present
      }
      if (this.selectedYear === this.currentYear && quarter.name === this.currentQuarter) {
        quarter.name = `${quarter.name} - current`;
      }
    });
  }

  onPeriod_QuarterChange(periodQuarter: string) {
    this.salesforce_NameNarrow = this.salesforce_NameNarrow.filter(i => this.periodSalesforceForCompany.findIndex((c: { period_Year: string; period_Quarter: string, salesForce_Name: string }) => c.period_Year == this.searchForm.controls['period_Year'].value && c.period_Quarter == periodQuarter && c.salesForce_Name == i.name) > -1);
    if (this.searchForm.controls['salesForce_Name'].value && this.salesforce_NameNarrow.findIndex(c => c.name == this.searchForm.controls['salesForce_Name'].value) == -1) {
      this.searchForm.controls['salesForce_Name'].setValue(null);
    }

    if (this.searchForm.controls['period_Quarter'].value && this.period_QuartersNarrow.findIndex(c => c.name == this.searchForm.controls['period_Quarter'].value) == -1) {
      this.searchForm.controls['period_Quarter'].setValue(null);
    }

    this.filteredOptionsSalesForce_Name = of(this.salesforce_NameNarrow);
    this.onSearch();
  }

  getCurrentPeriod() {
    this.apiService.PostAll(getAdminCurrentPeriod, { user_id: this.user_id, security_token: '' }).subscribe(response => {
      if (response && response.status) {
        if (response.result) {
          let period = response.result;
          let period_quarter = period.name.split(' '); //0 periodYear 1 PeriodQuarter
          //this.searchForm.controls['period_Year'].setValue(period_quarter[0]);
          //this.searchForm.controls['period_Quarter'].setValue(period_quarter[1].replace('Q', ''));
          this.onSearch();
        }
      
      }
    });
  }

  deleteSalesforce(daDatabase_Salesforce_Id: string) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'Salesforce',
          id: daDatabase_Salesforce_Id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.apiService.Update(deleteDMSalesforceRecord, { User_id: this.user_id, DADatabase_Salesforce_Id: daDatabase_Salesforce_Id }).subscribe(data => {
          if (data && data.status) {
            this.onSearch();
            this.toasterService.showSuccess(data.message);
          }
          else {
            this.toasterService.showError(data.message);
          }
        });
      }

    });




  }

  loadCitations() {

    let data = {
      user_id: this.user_id,
      caller: "",
      security_Token: ""
    }

    this.apiService.PostAll(getCitationsForDM, data).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.citations = response.result;
      }

    });
  }

  hasCitationForColumn(salesForceId: string, daDatabase_Product_Id: string, column_name: string) {
    let item = this.citations.filter(c => c.daDatabase_Salesforce_Id == salesForceId && c.column_name.toLowerCase() == column_name.toLowerCase() && (!c.daDatabase_Product_Id || c.daDatabase_Product_Id == daDatabase_Product_Id));
    return item && item.length;
  }

  getUserPreferences() {
    this.apiService.PostAll(getUserPreferences, { UserId: this.user_id, PageId: 1 }).subscribe(response => {
      if (response && response.status && response.result?.length) {
        this.userPreferences = response.result[0];
        if (this.userPreferences.columnSettings && this.isJsonString(this.userPreferences.columnSettings)) {
          let columnSettings = JSON.parse(this.userPreferences.columnSettings);
          
          if (columnSettings & columnSettings.columnsToDisplay) {
            this.columnsToDisplay = columnSettings.columnsToDisplay;
          }

          //this.sortField = columnSettings.sortField;
          //this.sortDirection = columnSettings.sortDirection;
          //this.sort.active = columnSettings.sortField;
          //this.sort.direction = columnSettings.sortDirection;
        }

        if (this.userPreferences.filterSettings && this.isJsonString(this.userPreferences.filterSettings)) {
          let filters = JSON.parse(this.userPreferences.filterSettings);
          this.searchForm.patchValue({
            country_Name: filters.country_Name,
            company_Name: filters.company_Name,
            salesForce_Name: filters.salesForce_Name, 
            qcq_status: filters.qcq_status,
            has_citation: filters.has_citation,
            country_NameAuto: filters.country_Name,
            company_NameAuto: filters.company_Name,
            salesForce_NameAuto: filters.salesForce_Name, 
            qcq_statusAuto: filters.qcq_status,
            dadatabase_id: filters.dadatabase_id,
            has_citationAuto: filters.has_citation,
            period_Year: filters.period_Year,
            period_Quarter: filters.period_Quarter
          });
        }
        this.onSearch();
      }
      else {
        this.userPreferences = {} as UserPreference;
        //this.getCurrentPeriod();
        this.onSearch();
      }
    });
  }


  isJsonString(str:string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

  saveUserPreferences() {
    this.userPreferences.userID = this.user_id;
    this.userPreferences.pageId = 1;
    this.userPreferences.gridId = 1;
    this.userPreferences.columnSettings = JSON.stringify({ columnsToDisplay: this.columnsToDisplay, sortField: this.sortField, sortDirection: this.sortDirection });
    this.userPreferences.filterSettings = JSON.stringify(this.searchForm.value);
    this.apiService.Create(addUserPreference, this.userPreferences).subscribe(response => {
      if (response && response.status) {
        this.toasterService.showSuccess(response.message);
      }
      else {
        this.toasterService.showError(response.message);
      }
    });
    
  }

  resetAllFilters() {
    this.isReset = true;
    if (this.gridApi) {
      //clear filters
      this.gridApi.setFilterModel(null);
      //notify grid to implement the changes
      this.gridApi.onFilterChanged();
    }
    this.accordion().closeAll();
    this.pageIndex = 0;
    this.pageSize = 10;
    this.searchForm.reset({
      country_Name: '',
      company_Name: '',
      salesForce_Name: '',
      dadatabase_id: '',
      search_text:'',
      period_Year: '',
      period_Quarter: '',
      qcq_status: null,
      has_citation: false 
    });
    this.searchForm.controls['country_NameAuto'].setValue(null);
    this.searchForm.controls['company_NameAuto'].setValue(null);
    this.searchForm.controls['salesForce_NameAuto'].setValue(null);
    this.searchForm.controls['search_NameAuto'].setValue(null);
    //this.searchForm.controls['periodAuto'].setValue(null);
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    //this.sort.direction = '';
    //this.sort.active = '';
    //this.sortDirection = '';
    //this.sortField = '';
    this.initializeDataSource();
    this.period_QuartersNarrow.forEach((quarter) => {
      if (quarter.name.endsWith(' - current')) {
        quarter.name = quarter.name.replace(' - current', ''); // Remove current if present
      }
    });
  }

  dynamicSetColumn(item: string, event: any): void {
    const isChecked = event.checked;

    if (isChecked && !this.columnsToDisplay.includes(item)) {
      // Add item to columnsToDisplay maintaining the order
      this.columnsToDisplay.push(item);
      this.columnsToDisplay.sort((a, b) => {
        return this.displayedColumns.indexOf(a) - this.displayedColumns.indexOf(b);
      });
    } else if (!isChecked && this.columnsToDisplay.includes(item)) {
      // Remove item from columnsToDisplay
      this.columnsToDisplay = this.columnsToDisplay.filter(column => column !== item);
    }

    this.applyVisibilityToGridColumns();
  }

  removeToppings(name: string) {
    switch (name) {
      case 'country':
        this.searchForm.get('country_Name')?.setValue(null);
        this.searchForm.controls['country_NameAuto'].setValue(null);
        this.onSearch();
        break;
      case 'company':
        this.searchForm.get('company_Name')?.setValue(null);
        this.searchForm.controls['company_NameAuto'].setValue(null);
        this.onSearch();
        break;
      case 'salesforce':
        this.searchForm.get('salesForce_Name')?.setValue(null);
        this.searchForm.controls['salesForce_NameAuto'].setValue(null);
        this.onSearch();
        break;
      case 'period_Year':
        this.searchForm.get('period_Year')?.setValue(null);
        this.onSearch();
        break;
      case 'period_Quarter':
        this.searchForm.get('period_Quarter')?.setValue(null);
        this.onSearch();
        break;
      case 'qcq_status':
        this.searchForm.get('qcq_status')?.setValue(null);
        this.onSearch();
        break;
      case 'dadatabase_id':
        this.searchForm.get('dadatabase_id')?.setValue(null);
        this.onSearch();
        break;
      case 'has_citation':
        this.searchForm.get('has_citation')?.setValue(null);
        this.onSearch();
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.signalRService.startConnection();

    const currentMonth = new Date().getMonth() + 1;

    if (currentMonth >= 1 && currentMonth <= 3) {
      this.currentQuarter = '1';
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      this.currentQuarter = '2';
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      this.currentQuarter = '3';
    } else if (currentMonth >= 10 && currentMonth <= 12) {
      this.currentQuarter = '4';
    }
    this.signalRService.addTaskCompletedListener((response:any) => {
     
      if (response.status) {
        this.toasterService.showStickySuccess(response.message);
      }
    });

    this.currentUser = this.storageService.UserDetails;

    this.filteredOptionsPeriodYear_Name = this.searchForm.controls['period_Year'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterPeriodYear(name as string) : this.period_YearsNarrow.slice();
      }),
    );

    this.filteredOptionsPeriodQuarter_Name = this.searchForm.controls['period_Quarter'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filterPeriodQuarter(name as string) : this.period_Quarters.slice();
      }),
    );

     this.searchForm.controls['search_NameAuto'].valueChanges.pipe(
      startWith(''),
       map(value => this.filteredOptionsSearchText = this._filterSearchText(value || '')),
    ).subscribe();

    this.initializeSearchFilterData();
    this.loadCitations();
    this.accordion().openAll();
  }

  displayFn(item: IdNamePair): string {
    return item && item.name ? item.name : '';
  }

  private _filterSearchText(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchTextOptions.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  private _filterCountry(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();
    return this.countries_Names.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterCompany(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.companies_NamesNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterSalesForce(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.salesforce_NameNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterPeriodYear(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();
    return this.period_YearsNarrow.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  private _filterPeriodQuarter(name: string): IdNamePair[] {
    const filterValue = name.toLowerCase();

    return this.period_Quarters.filter(option => option.id.toString().toLowerCase().startsWith(filterValue));
  }

  
  onSelectedSalesForceChange(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.searchForm.controls['salesForce_Name'].setValue(event.option.value.name);
    }
    this.onSearch();
  }

  

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch() {
    //this.accordion().closeAll();
    this.initializeDataSource();
    this.paginator.firstPage();
  }

  filterDisplay() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }

  populateSearchTextOptions(salesForces: IdNamePair[], companies: IdNamePair[], products: IdNamePair[]) {
    let list: string[] = new Array<string>();

    if (salesForces && salesForces.length) {
      let s_list = salesForces.map(o => o['name']);
      list = [...new Set(list.concat(s_list))];
    }
    if (companies && companies.length) {
      let s_list = companies.map(o => o['name']);
      list = [...new Set(list.concat(s_list))];
    }
    if (products && products.length) {
      let s_list = products.map(o => o['name']);
      list = [...new Set(list.concat(s_list))];
    }

    this.searchTextOptions = list.sort(function (a, b) {
      if (a < b) return 1;
      if (b < a) return -1;
      return 0;
    });

  }

  initializeSearchFilterData() {
    let data = {};
    this.apiService
      .PostAll(GetDataManagerRecordsFilters, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.all_data = response.result;
          this.companies_Names = response.result.company_Name;
          this.countries_Names = response.result.country_Name;
          this.salesforce_Names = response.result.salesForce_Name;
          this.period_Years = response.result.period_Year;
          this.product_Names = response.result.us_Brand_Name;

          this.filteredOptionsCountry_Name = of(this.countries_Names);

          this.populateSearchTextOptions(this.salesforce_Names, this.companies_Names, this.product_Names);

          if (this.countries_Names && this.countries_Names.length && this.searchForm.controls['country_Name'].value) {
            let selected = this.countries_Names.filter(c => c.name == this.searchForm.controls['country_Name'].value);
            if (selected && selected.length)
              this.searchForm.controls['country_NameAuto'].setValue(selected[0]);
          }

          if (this.companies_Names && this.companies_Names.length && this.searchForm.controls['company_Name'].value) {
            let selected = this.companies_Names.filter(c => c.name == this.searchForm.controls['company_Name'].value);
            if (selected && selected.length)
              this.searchForm.controls['company_NameAuto'].setValue(selected[0]);
          }

          if (this.salesforce_Names && this.salesforce_Names.length && this.searchForm.controls['salesForce_Name'].value) {
            let selected = this.salesforce_Names.filter(c => c.name == this.searchForm.controls['salesForce_Name'].value);
            if (selected && selected.length)
              this.searchForm.controls['salesForce_NameAuto'].setValue(selected[0]);
          }

          this.filteredOptionsCountry_Name = this.searchForm.controls['country_NameAuto'].valueChanges.pipe(
            startWith(''),
            map(value => {
              const name = typeof value === 'string' ? value : value?.name;
              return name ? this._filterCountry(name as string) : this.countries_Names?.slice();
            }),
          );
           
        }
      });
  }

  initializeDataSource() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          if (!this.isReset) {
            this.pageIndex = this.paginator.pageIndex;
            this.pageSize = this.paginator.pageSize;
           // this.sortField = this.sort.active;
            //this.sortDirection = this.sort.direction;
          }
          return this.fetchData();
        }),
        map((data) => {
          this.dataItems = data.result.records;
          this.totalRecords = data.result.totalRecords;
          this.dataSource = new MatTableDataSource<SalesforceData>(
            this.dataItems
          );
          this.paginator.length = this.totalRecords;

          this.setGridRowData();

        }),
        catchError(() => {
          // Handle error, e.g., show error message
          return of(null);
        })
      )
      .subscribe();
  }

  fetchData(): Observable<any> {
    this.isReset = false;
    if (this.userPreferences && this.userPreferences.filterSettings) {
      let filters = JSON.parse(this.userPreferences.filterSettings);
      this.ifUserFilterPrefExists = !Object.values(filters).every(value =>
        value === null || value === '' || value === false
      );
    }
    
    //if (!this.ifUserFilterPrefExists && !this.searchForm.get('country_Name')?.value && !this.searchForm.get('dadatabase_id')?.value && !this.searchForm.get('search_NameAuto')?.value) {
    //  if (!(this.searchForm.get('period_Year')?.value) && !(this.searchForm.get('period_Quarter')?.value)) {
    //    let periodYearValue = this.searchForm.get('period_Year')?.value || this.currentYear.toString();
    //    this.searchForm.get('period_Year')?.setValue(periodYearValue);
    //    let periodQuarterValue = this.searchForm.get('period_Quarter')?.value || this.currentQuarter.toString();
    //    this.searchForm.get('period_Quarter')?.setValue(periodQuarterValue);
    //  }
    //}
    let data = {
      user_id: this.user_id,
      caller: '',
      pageSize: this.pageSize,
      page: this.pageIndex + 1,
      company: this.searchForm.get('company_Name')?.value
        ? this.searchForm.get('company_Name')?.value
        : null,
      country: this.searchForm.get('country_Name')?.value
        ? this.searchForm.get('country_Name')?.value
        : null,
      salesforce: this.searchForm.get('salesForce_Name')?.value
        ? this.searchForm.get('salesForce_Name')?.value
        : null,
      product: null,
      period_Year: this.searchForm.get('period_Year')?.value
        ? this.searchForm.get('period_Year')?.value.replace(' - current', '')
        : null,
      period_Quarter: this.searchForm.get('period_Quarter')?.value
        ? this.searchForm.get('period_Quarter')?.value.replace(' - current', '')
        : null,
      qcq_status: this.searchForm.get('qcq_status')?.value
        ? this.searchForm.get('qcq_status')?.value
        : null,
      dadatabase_id: this.searchForm.get('dadatabase_id')?.value
        ? this.searchForm.get('dadatabase_id')?.value
        : null,
      has_citation: this.searchForm.get('has_citation')?.value
        ? (this.searchForm.get('has_citation')?.value ? 1: 0)
        : null,
      search_text: this.searchForm.get('search_text')?.value
        ? this.searchForm.get('search_text')?.value
        :null,
      security_Token: '',
      sortField: this.sortField ? this.sortField.toLowerCase() : '',
      sortDirection: this.sortDirection,
    };
    return this.apiService.PostAll(getAllDataManagerItems, data);
  }

  fetchExcelData(): Observable<any> {
    
    if (this.userPreferences && this.userPreferences.filterSettings) {
      let filters = JSON.parse(this.userPreferences.filterSettings);
      this.ifUserFilterPrefExists = !Object.values(filters).every(value =>
        value === null || value === '' || value === false
      );
    }

    let data = {
      user_id: this.user_id,
      caller: '',
      pageSize: this.totalRecords,
      page: 1,
      company: this.searchForm.get('company_Name')?.value
        ? this.searchForm.get('company_Name')?.value
        : null,
      country: this.searchForm.get('country_Name')?.value
        ? this.searchForm.get('country_Name')?.value
        : null,
      salesforce: this.searchForm.get('salesForce_Name')?.value
        ? this.searchForm.get('salesForce_Name')?.value
        : null,
      product: null,
      period_Year: this.searchForm.get('period_Year')?.value
        ? this.searchForm.get('period_Year')?.value.replace(' - current', '')
        : null,
      period_Quarter: this.searchForm.get('period_Quarter')?.value
        ? this.searchForm.get('period_Quarter')?.value.replace(' - current', '')
        : null,
      qcq_status: this.searchForm.get('qcq_status')?.value
        ? this.searchForm.get('qcq_status')?.value
        : null,
      dadatabase_id: this.searchForm.get('dadatabase_id')?.value
        ? this.searchForm.get('dadatabase_id')?.value
        : null,
      has_citation: this.searchForm.get('has_citation')?.value
        ? (this.searchForm.get('has_citation')?.value ? 1 : 0)
        : null,
      search_text: this.searchForm.get('search_text')?.value
        ? this.searchForm.get('search_text')?.value
        : null,
      security_Token: '',
      sortField: this.sortField ? this.sortField.toLowerCase() : '',
      sortDirection: this.sortDirection,
    };

    return this.apiService.PostAll(GetDataManagerSalesforceExcelData, data);
  }


  openDialog(item?: SalesforceData): void {
    const dialogRef = this.dialog.open(AddSalesforcePopupComponent, {
      data: {
        dataManager: item ? item : undefined,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        let result = data.value;

        let productItemList: DataManagerProduct[] = [];

        if (result.productItems && result.productItems.length) {
          result.productItems.forEach((p: DataManagerProduct) => {
            let vProduct = p;
            vProduct.product_Promotion_Priority_Order = p.product_Promotion_Priority_Order;
            vProduct.total_Number_of_Full_Time_Equivalents_FTEs = p.total_Number_of_Full_Time_Equivalents_FTEs;
            vProduct.primary_Care_Full_Time_Equivalents_FTEs = p.primary_Care_Full_Time_Equivalents_FTEs;
            vProduct.specialty_Full_Time_Equivalents_FTEs = p.specialty_Full_Time_Equivalents_FTEs;
            vProduct.co_Promotion_YesNo = p.co_Promotion_YesNo;
            vProduct.contract_Sales_Force_YesNo = p.contract_Sales_Force_YesNo;
            vProduct.specialty_Physicians_Targeted = Array.isArray(p.specialty_Physicians_Targeted) == true ? p.specialty_Physicians_Targeted.join(',') : p.specialty_Physicians_Targeted;
            productItemList.push(vProduct);
          });
        }
        

        let request = {
          user_id: this.user_id,
          dADatabase_SalesForce_Id: result.dADatabase_Salesforce_Id,
          country_Name: result.country_Name,
          company_Name: result.company_Name,
          period_Year: result.period_Year,
          period_Quarter: result.period_Quarter,
          salesforce_Name: result.salesforce_Name,
          type_of_Salesforce: result.type_of_Salesforce,
          number_Of_Sales_Representatives: result.number_Of_Sales_Representatives,
          number_Of_District_Managers: result.number_Of_District_Managers,
          number_Of_Regional_Managers: result.number_Of_Regional_Managers,
          salary_Low: result.salary_Low,
          salary_High: result.salary_High,
          target_Bonus: result.target_Bonus,
          reach: result.reach,
          frequency: result.frequency,
          country_Name_qcq: result.country_Name_qcq,
          company_Name_qcq: result.company_Name_qcq,
          period_Year_qcq: result.period_Year_qcq,
          period_Quarter_qcq: result.period_Quarter_qcq,
          salesforce_Name_qcq: result.salesforce_Name_qcq,
          type_of_Salesforce_qcq: result.type_of_Salesforce_qcq,
          number_Of_Sales_Representatives_qcq: result.number_Of_Sales_Representatives_qcq,
          number_Of_District_Managers_qcq: result.number_Of_District_Managers_qcq,
          number_Of_Regional_Managers_qcq: result.number_Of_Regional_Managers_qcq,
          salary_Low_qcq: result.salary_Low_qcq,
          salary_High_qcq: result.salary_High_qcq,
          target_Bonus_qcq: result.target_Bonus_qcq,
          reach_qcq: result.reach_qcq,
          frequency_qcq: result.frequency_qcq,
          additional_Notes_Salesforce: result.additional_Notes,
          pct_Split_Between_Primary_Care_And_Specialty: result.pct_Split_Between_Primary_Care_And_Specialty,
          productItems: productItemList,
          isAddToQCQ: result.isAddToQCQ
        };

        this.apiService
          .Create(addNewDataManagerItem, request)
          .subscribe((response: ApiResponse) => {
            if (response.status) {
              this.toasterService.showSuccess(response.message);
              this.initializeDataSource();
            } else {
              this.toasterService.showError(response.message);
            }
          });
      }
    });
  }


  openEditDialog(item?: SalesforceData): void {
    const dialogRef = this.dialog.open(EditSalesforcePopupComponent, {
      height: '0%',
      data: {
        dataManager: item ? item : undefined,
        countryList: this.countries_Names,
        companyList: this.companies_Names,
        salesForceList: this.salesforce_Names,
        periodYearList: this.period_Years,
        periodQuarterList: this.period_Quarters
      },
    });

    dialogRef.afterClosed().subscribe((request: any) => {
      if (request) {
        let result = request.value;
        let productItemList: DataManagerProduct[] = [];

        if (result.productItems && result.productItems.length) {
          result.productItems.forEach((p: DataManagerProduct) => {
            let vProduct = p;
            vProduct.product_Promotion_Priority_Order = p.product_Promotion_Priority_Order;
            vProduct.total_Number_of_Full_Time_Equivalents_FTEs = p.total_Number_of_Full_Time_Equivalents_FTEs;
            vProduct.primary_Care_Full_Time_Equivalents_FTEs = p.primary_Care_Full_Time_Equivalents_FTEs;
            vProduct.specialty_Full_Time_Equivalents_FTEs = p.specialty_Full_Time_Equivalents_FTEs;
            vProduct.co_Promotion_YesNo = p.co_Promotion_YesNo;
            vProduct.contract_Sales_Force_YesNo = p.contract_Sales_Force_YesNo;
            vProduct.specialty_Physicians_Targeted = Array.isArray(p.specialty_Physicians_Targeted) == true ? p.specialty_Physicians_Targeted.join(',') : p.specialty_Physicians_Targeted;
            productItemList.push(vProduct);
          });
        }
        

        let data = {
          user_id: this.user_id,
          dADatabase_Salesforce_Id: result.dADatabase_Salesforce_Id,
          country_Name: result.country_Name,
          company_Name: result.company_Name,
          period_Year: result.period_Year,
          period_Quarter: result.period_Quarter,
          salesforce_Name: result.salesforce_Name,
          type_of_Salesforce: result.type_of_Salesforce,
          number_Of_Sales_Representatives: result.number_Of_Sales_Representatives,
          number_Of_District_Managers: result.number_Of_District_Managers,
          number_Of_Regional_Managers: result.number_Of_Regional_Managers,
          salary_Low: result.salary_Low,
          salary_High: result.salary_High,
          target_Bonus: result.target_Bonus,
          reach: result.reach,
          frequency: result.frequency,
          country_Name_qcq: result.country_Name_qcq,
          company_Name_qcq: result.company_Name_qcq,
          period_Year_qcq: result.period_Year_qcq,
          period_Quarter_qcq: result.period_Quarter_qcq,
          salesforce_Name_qcq: result.salesforce_Name_qcq,
          type_of_Salesforce_qcq: result.type_of_Salesforce_qcq,
          number_Of_Sales_Representatives_qcq: result.number_Of_Sales_Representatives_qcq,
          number_Of_District_Managers_qcq: result.number_Of_District_Managers_qcq,
          number_Of_Regional_Managers_qcq: result.number_Of_Regional_Managers_qcq,
          salary_Low_qcq: result.salary_Low_qcq,
          salary_High_qcq: result.salary_High_qcq,
          target_Bonus_qcq: result.target_Bonus_qcq,
          reach_qcq: result.reach_qcq,
          frequency_qcq: result.frequency_qcq,
          additional_Notes_Salesforce: result.additional_Notes,
          pct_Split_Between_Primary_Care_And_Specialty: result.pct_Split_Between_Primary_Care_And_Specialty,
          productItems: productItemList,
          isAddToQCQ: result.isAddToQCQ,
          periodList: result.periodList ? result.periodList.join(',') : null
        };

        this.apiService
          .Update(updateDataManagerItem, data)
          .subscribe((response: ApiResponse) => {
            if (response.status) {
              this.toasterService.showSuccess(response.message);
              this.initializeDataSource();
            } else {
              this.toasterService.showError(response.message);
            }
          });
      }
    });
  }

  updateRecord(row: SalesforceData) {
    let data = {
      user_id: this.user_id,
      dADatabase_Salesforce_Id: row.daDatabase_Salesforce_Id,
      DADatabase_Product_Id: row.daDatabase_Product_Id,
      Total_Number_of_Full_Time_Equivalents_FTEs: Number(row.primary_Care_Full_Time_Equivalents_FTEs) + Number(row.specialty_Full_Time_Equivalents_FTEs),
      Primary_Care_Full_Time_Equivalents_FTEs: row.primary_Care_Full_Time_Equivalents_FTEs,
      Specialty_Full_Time_Equivalents_FTEs: row.specialty_Full_Time_Equivalents_FTEs,
      Product_Promotion_Priority_Order: row.product_Promotion_Priority_Order,
      number_Of_Sales_Representatives: row.number_Of_Sales_Representatives,
      number_Of_District_Managers: row.number_Of_District_Managers,
      number_Of_Regional_Managers: row.number_Of_Regional_Managers,
      salary_Low: row.salary_Low,
      salary_High: row.salary_High,
      target_Bonus: row.target_Bonus,
      reach: row.reach,
      frequency: row.frequency
      
    };

    this.apiService
      .Update(UpdateDataManagerItemInlineEdit, data)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.toasterService.showSuccess(response.message);
          this.initializeDataSource();
        } else {
          this.toasterService.showError(response.message);
        }
      });
  }

  ManageCitation(): void {
   
    this.router.navigateByUrl('/citations');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.sortDirection = sortState.direction;
      this.sortField = sortState.active;
      this.initializeDataSource();
    } else {
      this.sortDirection = '';
      this.sortField = '';
      this.initializeDataSource();
    }
  }

  publishDM() {

    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      width: '400px',
      data: {
        result: {
          title: 'Publish DM', 
          id: 1 
        }
      }
    });

    dialogRef.afterClosed().subscribe(result2 => {

      if (result2 == 1) {

        let data = {
          user_id: this.user_id,
          client_id: this.currentUser.clientId,
          publish_From_Datamanager: 1,
          security_Token: ''
        }
        setTimeout(() => {
          this.toasterService.showSuccess("The publish process has started. You will be notified about the progress...");  
        }, 1000);
        
        this.apiService
          .PostAll(publishDataManagerItems, data,false)
          .subscribe();
      }

    })
  }
}
