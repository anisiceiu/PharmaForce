import { Component, ViewChild } from '@angular/core';
import { ApiResponse } from '../../../models/ApiResponse';
import { GetMasterCodeRecords, addUpdateMasterCode, deleteMasterCode } from '../../../constants/api.constant';
import { MatSort, Sort } from '@angular/material/sort';
import { MasterCode } from '../../../models/mastercode';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { AddGenericNameMasterCodeComponent } from '../../shared/master-code/add-generic-name-master-code/add-generic-name-master-code.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from '../../../services/common/toaster.service';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../services/Api/api.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { StorageService } from '../../../services/common/storage.service';

@Component({
  selector: 'app-generic-name-master-code',
  templateUrl: './generic-name-master-code.component.html',
  styleUrl: './generic-name-master-code.component.css'
})
export class GenericNameMasterCodeComponent {

  mastercodes: MasterCode[] = [];
  currentUser: any;
  masterCodeCategory: string = 'Generic_Name';
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<MasterCode>(this.mastercodes);


  displayedColumns: string[] = [
    'select',
    'name'
  ];

  constructor(private dialog: MatDialog, private apiService: ApiService,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.loadSalesForceTypeMasterCodes();

  }

  onSearch(event: Event) {
    if (this.searchTextField == '') {
      this.dataSource.filter = '';
    }
  }

  filterMasterCode(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  loadSalesForceTypeMasterCodes() {
    let data = { category: this.masterCodeCategory }
    this.apiService.PostAll(GetMasterCodeRecords, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.mastercodes = response.result;
        this.dataSource = new MatTableDataSource<MasterCode>(this.mastercodes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        if (this.searchTextField) {
          this.dataSource.filter = this.searchTextField;
        }
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  getEmptyMasterCode() {
    let mc: MasterCode = {
      id: 0,
      name: null,
      category: this.masterCodeCategory,
      added_by: null,
      added_date: null,
      added_dt: null,
      region: null,
      currency_symbol: null,
      company: null,
      country: null,
      website: null,
      headquarters: null,
      number_of_employees: null,
      type_of_entity: null,
      sales_previous_year: null,
      salesforce_name: null,
      generic_name: null,
      us_name: null,
      product_name: null,
      year: null,
      quarter: null,
      added_by_name: null,
      type_of_salesforce: null
    };

    return mc;
  }

  openDialog(mastercode?: MasterCode): void {

    const dialogRef = this.dialog.open(AddGenericNameMasterCodeComponent, {
      width: '400px',
      data: {
        mastercode: mastercode ? mastercode : this.getEmptyMasterCode(),
      }
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        let result = data.value;
        let request = {};
        if (result.id > 0) {
          request = {
            id: result.id,
            name: result.name,
            category: this.masterCodeCategory,
            user_id: this.currentUser.id
          }
        } else {
          request = {
            name: result.name,
            category: this.masterCodeCategory,
            user_id: this.currentUser.id
          }
        }

        this.apiService.Create(addUpdateMasterCode, request).subscribe((response: ApiResponse) => {
          if (response.status) {
            this.toasterService.showSuccess(response.message);
            this.loadSalesForceTypeMasterCodes();
            //this.searchTextField = '';
          } else {
            this.toasterService.showError(response.message);
          }
        });
      }
    });
  }

  deleteMasterCode(mastercode?: MasterCode) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'master code',
          id: mastercode?.id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.Delete(deleteMasterCode + result).subscribe((response: ApiResponse) => {
          if (response.status) {
            this.toasterService.showSuccess(response.message);
            this, this.loadSalesForceTypeMasterCodes();
            //this.searchTextField = '';
          } else {
            this.toasterService.showError(response.message);
          }
        });
      }
    });
  }

  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
