import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../services/Api/api.service';
import { ToasterService } from '../../../../services/common/toaster.service';
import { StorageService } from '../../../../services/common/storage.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserAnalyticFilters } from '../../../../models/userPreference';
import { DeleteUserAnalyticFilter, GetUserAnalyticFilters, SaveUserAnalyticFilters } from '../../../../constants/api.constant';
import { ApiResponse } from '../../../../models/ApiResponse';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user-saved-searchs-popup',
  templateUrl: './user-saved-searchs-popup.component.html',
  styleUrl: './user-saved-searchs-popup.component.css'
})
export class UserSavedSearchsPopupComponent {
  isOpenManageSavedSearchesSidebar = false;
  savedSearchForm: FormGroup;
  searchList: UserAnalyticFilters[] = [];
  currentUser: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<UserAnalyticFilters>(this.searchList);


  displayedColumns: string[] = [
    'select',
    'searchFilterName',
    'createdDate',
    'action'
  ];

  editedRowIndex: number = -1;
  filterTosave!: UserAnalyticFilters;
  
  constructor(
    public dialogRef: MatDialogRef<UserSavedSearchsPopupComponent>, public fb: FormBuilder, private apiService: ApiService,
    private toasterService: ToasterService, private storageService: StorageService, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { filterToSave: UserAnalyticFilters, setSavedFilter:any  }) {

    if (data.filterToSave) {
      this.filterTosave = data.filterToSave;
    }
    this.savedSearchForm = this.fb.group({
      savedName: [data.filterToSave ? data.filterToSave.searchFilterName : null, [Validators.required]]
    });
    this.isOpenManageSavedSearchesSidebar = true;

  }

  onSaveClick() {
    let searchName = this.savedSearchForm.controls['savedName'].value;
    if (this.filterTosave && this.filterTosave.filterSettings && searchName) {
      this.filterTosave.searchFilterName = searchName;
      this.saveUserFilters(this.filterTosave);
    }
  }

  applyFilter(record: UserAnalyticFilters) {
    if (this.data.setSavedFilter) {
      this.data.setSavedFilter(record);
      this.dialogRef.close();
    }
  }

  saveUserFilters(record: UserAnalyticFilters) {
    
    let data = {
      Id: record.id,
      UserId: record.userId,
      SearchFilterName: record.searchFilterName,
      PageName: 'Analytics',
      ReportId: record.reportId,
      FilterSettings: record.filterSettings
    };

    this.apiService.PostAll(SaveUserAnalyticFilters, data).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.toasterService.showSuccess(response.message);
        this.getUserSavedFilters();
        if (this.filterTosave)
          this.filterTosave = {} as UserAnalyticFilters;
      } else {
        this.toasterService.showError(response.message);
      }
    });

  }

  deleteSearch(row: UserAnalyticFilters) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: row.searchFilterName,
          id: row.id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUserSavedSearch(row.id)
      }
    });
  }

  deleteUserSavedSearch(id: number) {
    this.apiService.Delete(DeleteUserAnalyticFilter + id).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.toasterService.showSuccess(response.message);
        this.getUserSavedFilters();
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }
  
  startEditing(index: number) {
    this.editedRowIndex = index;
  }
  cancelEditing() {
    this.editedRowIndex = -1;
  }
  saveRow(row: UserAnalyticFilters) {
    this.saveUserFilters(row);
    this.editedRowIndex = -1;
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.getUserSavedFilters();
  }

  getUserSavedFilters() {
    let data = {
      UserId: this.currentUser.id,
      PageName: 'Analytics'
    };

    this.apiService.PostAll(GetUserAnalyticFilters, data).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.searchList = response.result;
        this.dataSource = new MatTableDataSource<UserAnalyticFilters>(this.searchList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else {
        this.searchList = [];
      }
    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get userFormControls() { return this.savedSearchForm.controls; }

}
