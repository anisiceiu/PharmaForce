import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { keyUpdate } from '../../../models/keyUpdate';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '../../../services/common/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AddKeyUpdates, DeleteKeyUpdates, GetCustomerDropdowns, getKeyUpdates } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { KeyUpdateDialogPopupComponent } from '../../shared/components/key-update-dialog-popup/key-update-dialog-popup.component';
import { CustomerDropdownGroupModel } from '../../../models/CustomerDropdown';

@Component({
  selector: 'app-key-update-management',
  templateUrl: './key-update-management.component.html',
  styleUrls: ['./key-update-management.component.scss']
})
export class KeyUpdateManagementComponent {
  showFilter = false;
  currentUser: any;

  keyUpdateManagement: keyUpdate[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<keyUpdate>(true, []);
  dataSource = new MatTableDataSource<keyUpdate>(this.keyUpdateManagement);

  displayedColumns: string[] = [];

  constructor(private storageService: StorageService, private dialog: MatDialog, private apiService: ApiService, private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {

    this.currentUser = this.storageService.UserDetails;
    if (this.currentUser.userType == "SA" || this.currentUser.userType == "A") {
      this.displayedColumns = ['select', 'company_Name', 'country_Name', 'period_Name', 'updateTag', 'note'];
    } else {
      this.displayedColumns = ['company_Name', 'country_Name', 'period_Name', 'updateTag', 'note'];
    }
    this.loadKeyUpdates();
  }

  onSearch(event: Event) {
    if (this.searchTextField == '') {
      this.dataSource.filter = '';
    }
  }

  loadKeyUpdates() {
    this.apiService.GetAll(getKeyUpdates + "?user_id=" + this.currentUser.id).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.keyUpdateManagement = response.result;
        this.dataSource = new MatTableDataSource<keyUpdate>(this.keyUpdateManagement);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  getEmptyKeyUpdate() {
    let ku: keyUpdate = {
      id:0,
      keyUpdate_Id: 0,
      companyCountry_Id: null,
      company_Name: null,
      country_Name: null,
      country_Id: null,
      company_Id: null,
      therapeuticCategory_Id:null,
      note: null,
      description: null,
      period_Id:  null,
      updateTag:  null,
      period_Name: null
    };

    return ku;
  }

  openDialog(keyUpdate?: keyUpdate): void {
    const dialogRef = this.dialog.open(KeyUpdateDialogPopupComponent, {
      width: '400px',
      data: { keyUpdate: keyUpdate ? keyUpdate : this.getEmptyKeyUpdate() }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        console.log("result", result)
        if (result.id > 0) {
          let data = {
            id: result.id,
            description: result.description,
            companyCountry_Id: result.companyCountry_Id,
            therapeuticCategory_Id: result.therapeuticCategory_Id,
            note: result.note,
            period_Id: result.period_Id,
            updateTag: result.updateTag,
            userId: this.currentUser.id,
            securityToken: "string",
            permissionGranted: 0
          }

          this.apiService.PostAll(AddKeyUpdates, data).subscribe((response: ApiResponse) => {
            if (response.status) {
              this.toasterService.showSuccess(response.message);
              this.loadKeyUpdates();
              this.searchTextField = '';
            } else {
              this.toasterService.showError(response.message);
            }
          });
        } else {
          let data = {
            id: 0,
            description: result.description,
            companyCountry_Id: result.companyCountry_Id,
            therapeuticCategory_Id: result.therapeuticCategory_Id,
            note: result.note,
            period_Id: result.period_Id,
            updateTag: result.updateTag,
            userId: this.currentUser.id,
            securityToken: "stringA",
            permissionGranted: 0
          }
          this.apiService.Create(AddKeyUpdates, data).subscribe((response: ApiResponse) => {
            if (response.status) {
              this.toasterService.showSuccess(response.message);
              this.loadKeyUpdates();
              this.searchTextField = '';
            } else {
              this.toasterService.showError(response.message);
            }
          });
        }
      }
    });
  }

  deleteKeyUpdate(keyUpdate_id: number) {
    this.apiService.Delete(DeleteKeyUpdates + keyUpdate_id).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.toasterService.showSuccess(response.message);
        this.loadKeyUpdates();
        this.searchTextField = '';
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }


  filterKeyUpdateManagement(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
