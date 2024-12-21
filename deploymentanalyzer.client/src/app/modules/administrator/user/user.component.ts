import { Component, ViewChild } from '@angular/core';
import { User } from '../../../models/user';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ApiResponse } from '../../../models/ApiResponse';
import { addUser, toggleUser, updateUser, deleteUser, getAdminUsers } from '../../../constants/api.constant';
import { UserDialogComponent } from '../../shared/components/user-dialog/user-dialog.component';
import { StorageService } from '../../../services/common/storage.service';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  currentUser: any;
  users: User[]= [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<User>(true, []);
  dataSource = new MatTableDataSource<User>(this.users);

  selectedUser : any = null;
  displayedColumns: string[] = ['select','name','userName', 'enabled', 'created', 'expires', 'userType', 'disable',];

  constructor(private dialog: MatDialog, private apiService: ApiService, private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.currentUser = this._storageService.UserDetails;
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.GetAll(getAdminUsers).subscribe((response:ApiResponse) => {

      if(response.status){
        this.users = response.result;
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }

  openDialog(user?: User): void {
   
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: user ?user :this.dataSource, showOption: false}
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        if (result.id > 0) {
          let userData = {
            id: result.id,
            name: result.name,
            userName: result.userName,
            password: result.password,
            enabled: Boolean(result.enabled),
            expires: result.expires,
            created: result.created,
            userType: result.userType,
            email: result.email,
            logo: result.logo,
            clientLimit: Number(result.clientLimit),
            description: result.description,
            user_id: this.currentUser.id
          }
         
          this.apiService.Update(updateUser, userData).subscribe((response:ApiResponse) => {
            if(response.status){
              this.toasterService.showSuccess(response.message);
              this.selectedUser = null
              this.loadUsers();
            }else{
              this.toasterService.showError(response.message);
            }
          });
        } else {
          let userData = {
            name: result.name,
            userName: result.userName,
            password: result.password,
            enabled: Boolean(result.enabled),
            expires: result.expires,
            created: result.created,
            userType: result.userType,
            email: result.email,
            logo: result.logo,
            clientLimit: Number(result.clientLimit),
            description: result.description,
            user_id: this.currentUser.id
          }
          this.apiService.Create(addUser, userData).subscribe((response:ApiResponse) => {
            if(response.status){
              this.toasterService.showSuccess(response.message);
              this.loadUsers();
            }else{
              this.toasterService.showError(response.message);
            }
          });
        }
      }
    });
  }

  toggleEnabled(id: any) {
    this.apiService.Update(toggleUser, { id:id,user_id: this.currentUser.id, security_token:'' }).subscribe((response: ApiResponse) => {
      if(response.status){
        this.toasterService.showSuccess(response.message);
        this.loadUsers();
      }else{
        this.toasterService.showError(response.message);
      }
    })
  }

  removeUser(id: any,userName:string) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'User : ' + userName,
          id: id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.apiService.Update(deleteUser, { id: id, user_id: this.currentUser.id, security_token: '' }).subscribe((response: ApiResponse) => {
          if (response.status) {
            this.toasterService.showSuccess(response.message);
            this.loadUsers();
          } else {
            this.toasterService.showError(response.message);
          }
        });
      }

    });




  }

  capitalizeBoolean(value: boolean): string {
    return value ? 'True' : 'False';
  }

  announceSortChange(sortState: Sort) {
    
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
