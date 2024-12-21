import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { deleteAnyUser,getDepUsers, unlockUser } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { DepUser } from '../../../models/depUser';
import { ApiService } from '../../../services/Api/api.service';
import { CommonMethodService } from '../../../services/common/common-method.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { StorageService } from '../../../services/common/storage.service';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';



@Component({
  selector: 'app-unlock-users',
  templateUrl: './unlock-users.component.html',
  styleUrl: './unlock-users.component.css'
})
export class UnlockUsersComponent implements OnInit {
  showFilter = false;

  depUsers: DepUser[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<DepUser>(this.depUsers);

  currentUser: any;

  displayedColumns: string[] = [
    'select',
    'name',
    'lockTime',
    'isLocked',
  ];
  selection = new SelectionModel<DepUser>(true, []);
  constructor(private dialog: MatDialog, private apiService: ApiService,
    private commonMethodService: CommonMethodService, private _storageService: StorageService,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.currentUser = this._storageService.UserDetails;
    this.commonMethodService.setTitle("Unlock Users");
    this.loadDepUsers();
  }

  removeUser(id: any,name:string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'User : '+name,
          id: id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.Update(deleteAnyUser, { id: id, user_id: this.currentUser.id, security_token: '' }).subscribe((response: ApiResponse) => {
          if (response.status) {
            this.toasterService.showSuccess(response.message);
            this.loadDepUsers();
          } else {
            this.toasterService.showError(response.message);
          }
        });
      }

    });


  }

  onCheckedChange($event: MatCheckboxChange, index: number) {

    this.depUsers[index].isLocked = $event.checked;
    if (!this.depUsers[index].isLocked) {
      this.UnlockUser(this.depUsers[index].id, this.depUsers[index].name);
    }
  }

  UnlockUser(id: number,name:string) {
    this.apiService.Update(unlockUser, { Id: id,Name:name }).subscribe(data => {
      if (data && data.status) {
        this.toasterService.showSuccess(data.message);
      }
      else {
        this.toasterService.showError(data.message);
      }
    });
  }

  loadDepUsers() {
    this.apiService.GetAll(getDepUsers).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.depUsers = response.result;
        this.dataSource = new MatTableDataSource<DepUser>(this.depUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toasterService.showError(response.message);
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
