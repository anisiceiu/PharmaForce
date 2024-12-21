import { Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ApiResponse } from '../../../models/ApiResponse';
import { User } from '../../../models/user';
import { MatTableDataSource } from '@angular/material/table';
import { UserEmailSuffix } from '../../../models/UserEmailSuffix';
import { addUserRestrictedEmailSuffix, getAllUsers, getUserRestrictedEmailSuffix, removeUserRestrictedEmailSuffix } from '../../../constants/api.constant';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from '../../../services/common/toaster.service';
import { CommonMethodService } from '../../../services/common/common-method.service';
import { ApiService } from '../../../services/Api/api.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { AddUserRestrictedEmailSuffixPopupComponent } from '../../shared/add-user-restricted-email-suffix-popup/add-user-restricted-email-suffix-popup.component';

@Component({
  selector: 'app-user-restricted-email-suffix-management',
  templateUrl: './user-restricted-email-suffix-management.component.html',
  styleUrl: './user-restricted-email-suffix-management.component.css'
})
export class UserRestrictedEmailSuffixManagementComponent {
  showFilter = false;
  userList: User[] = [];
  selectedUser: User = {} as User;

  userEmailSuffixList: UserEmailSuffix[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<UserEmailSuffix>(this.userEmailSuffixList);

  displayedColumns: string[] = [
    'select',
    'emailSuffix',
  ];
  constructor(private dialog: MatDialog, private apiService: ApiService,
    private commonMethodService: CommonMethodService,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) { }
  
  ngOnInit(): void {
    this.commonMethodService.setTitle("Restricted Email Suffix");
    //this.loadUsers();
  }

  loadUsers() {
    let data = {}
    this.apiService.GetAll(getAllUsers, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.userList = response.result;

        if (this.userList && this.userList.length) {
          this.selectedUser = this.userList[0];
          this.loadUserRestrictedEmailSuffix(this.selectedUser);
        }

      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(AddUserRestrictedEmailSuffixPopupComponent, {
      width: '400px',
      data: {
        selectedUser: this.selectedUser,
        userList: this.userList
      }
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        let result = data.value;
        let request = {};
        request = {
          userID: result.userID,
          emailSuffix: result.emailSuffix
        };


        this.apiService.Create(addUserRestrictedEmailSuffix, request).subscribe((response: ApiResponse) => {
          if (response.status) {
            this.toasterService.showSuccess(response.message);
            this.loadUserRestrictedEmailSuffix(this.selectedUser);
            this.searchTextField = '';
          } else {
            this.toasterService.showError(response.message);
          }
        });
      }
    });
  }

  RemoveUserRestrictedEmailSuffix(id: number, name: string) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'EmailSuffix :' + name,
          id: id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.apiService.Update(removeUserRestrictedEmailSuffix, { Id: id, Name: name }).subscribe(data => {
          if (data && data.status) {
            this.loadUserRestrictedEmailSuffix(this.selectedUser);
            this.toasterService.showSuccess(data.message);
          }
          else {
            this.toasterService.showError(data.message);
          }
        });
      }

    });


  }

  loadUserRestrictedEmailSuffix(user: User) {
    this.apiService.PostAll(getUserRestrictedEmailSuffix, { Id: user.id, Name: user.name }).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.userEmailSuffixList = response.result;
        this.dataSource = new MatTableDataSource<UserEmailSuffix>(this.userEmailSuffixList);
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
