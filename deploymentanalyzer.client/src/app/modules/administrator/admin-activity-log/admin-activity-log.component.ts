import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminLog } from '../../../models/adminLog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../services/Api/api.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { getAdminLog } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';
import { AccountService } from '../../../services/account/account.service';
import { StorageService } from '../../../services/common/storage.service';

@Component({
  selector: 'app-admin-activity-log',
  templateUrl: './admin-activity-log.component.html',
  styleUrl: './admin-activity-log.component.css'
})
export class AdminActivityLogComponent implements OnInit {

  showFilter = false;

  currentUser: any;
  adminLogs: AdminLog[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<AdminLog>(this.adminLogs);

  displayedColumns: string[] = [ 'userName', 'userFullName','email', 'lastUpdated', 'logInTime', 'logOutTime', 'category', 'item', 'notes'];

  constructor(private apiService: ApiService, private _liveAnnouncer: LiveAnnouncer, private _toastrService: ToasterService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.currentUser = this._storageService.UserDetails || {};
    this.loadAdminLogs();
  }

  filterAdminLog(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  loadAdminLogs() {
    this.apiService.PostAll(getAdminLog, { user_id: this.currentUser.id, security_token : ''}).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.adminLogs = response.result;
        this.dataSource = new MatTableDataSource<AdminLog>(this.adminLogs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this._toastrService.showError(response.message);
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

  onSearch(event: Event) {
    if (this.searchTextField == '') {
      this.dataSource.filter = '';
    }
  }

}
