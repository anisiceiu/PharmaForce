import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { getAllUsers, getUserClients, addUserClient, removeUserClient, waiveActivationToClient, unsubscribeClient, lockUnlockClientAccount, activeDeactiveToClient, getUserRights } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ApiService } from '../../../services/Api/api.service';
import { CommonMethodService } from '../../../services/common/common-method.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { User } from '../../../models/user';
import { AddClientPopupComponent } from '../../shared/add-client-popup/add-client-popup.component';
import { UserClient } from '../../../models/userClient';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { StorageService } from '../../../services/common/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account/account.service';
import { UserRight } from '../../../models/userRights';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-manage-clients',
  templateUrl: './manage-clients.component.html',
  styleUrl: './manage-clients.component.css'
})
export class ManageClientsComponent {
  showFilter = false;
  userList: User[] = [];
  selectedUser: User = {} as User;
  activeClientsCount: number = 0;
  currentUser: any;
  userRights: UserRight = {} as UserRight;

  userClientList: UserClient[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<UserClient>(this.userClientList);

  displayedColumns: string[] = [
    'select',
    'emailID',
    'dateCreated',
    'lastLogin',
    'isActive',
    'isLocked',
    'unsubscribe',
    'waiveActivation',
    'otp'
  ];
  constructor(private dialog: MatDialog, private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute,
    private commonMethodService: CommonMethodService, private storageService: StorageService, private accountService: AccountService,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer)
  {
    this.activatedRoute.params.subscribe(params => {
      let storage_id = params['storage_id'];

      if (storage_id) {
        if (localStorage.getItem(storage_id)) { 
          let switchtoUser = JSON.parse(localStorage.getItem(storage_id)!);
          localStorage.removeItem(storage_id);
          this.accountService.switchAccount(switchtoUser);
          this.router.navigate(['/dashboard']);
        }
      }


    });

    this.currentUser = this.storageService.UserDetails;

    if (this.currentUser && this.currentUser.userType == 'SA') {
      this.displayedColumns.push('action');
    }
  }

  ngOnInit(): void {
    this.commonMethodService.setTitle("User Clients");
    this.loadUsers();
  }

  loadUserRights(userId: number, userName:string): Observable<ApiResponse> {
    return this.apiService.PostAll(getUserRights, { Id: userId, Name: userName });
  }

  onClickImpersonate(client: UserClient) {
    if (client) {
      if (!client.isActive) {
        this.toasterService.showWarning(`Selected client with email address: ${client.emailID} is not active.\nTo impersonate client must be in active state.`);
      }
      else if (client.isLocked) {
        this.toasterService.showWarning(`Selected client with email address: ${client.emailID} is locked.\nTo impersonate client must be unlocked.`);
      }
      else {
        let switchtoUser = {
          id: client.userID,
          clientId: client.clientID,
          userName: client.emailID,
          name: client.emailID,
          logo: null,
          clientLimit: 0,
          description: null,
          adminFunctions:'',
          password: '',
          enabled: true,
          expires: null,
          created:null,
          userType: 'U',
          email: client.emailID,
          userRights: null
        };
        this.loadUserRights(switchtoUser.id, "client").subscribe(response => {
          if (response.status) {
            switchtoUser.userRights = response.result;

            let unique_id = uuidv4();
            localStorage.setItem(unique_id, JSON.stringify(switchtoUser));
            window.open(`/impersonation/${unique_id}`,"_blank");
            //this.accountService.switchAccount(switchtoUser);
            //this.router.navigate(['/dashboard']);
          }
        });
        
      }
    }
  }

  loadUsers() {
    let data = {}
    this.apiService.GetAll(getAllUsers, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.userList = response.result;

        if (this.userList && this.userList.length) {
          this.selectedUser = this.userList[0];
          this.loadClients(this.selectedUser);
        }

      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(AddClientPopupComponent, {
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
          emailID: result.emailID
        };


        this.apiService.Create(addUserClient, request).subscribe((response: ApiResponse) => {
          if (response.status) {
            if (response.message == 'Client added successfully.')
              this.toasterService.showSuccess(response.message);
            else
              this.toasterService.showWarning(response.message);

            this.loadClients(this.selectedUser);
            this.searchTextField = '';
          } else {
            this.toasterService.showError(response.message);
          }
        });
      }
    });
  }

  ActiveDeactiveToClient(clientId: number, flag: boolean) {
    this.apiService.Update(activeDeactiveToClient, { user_id: this.currentUser.id, ClientId: clientId, ActiveFlag: flag }).subscribe(data => {
      if (data && data.status) {
        this.loadClients(this.selectedUser);
        this.toasterService.showSuccess(data.message);
      }
      else {
        this.toasterService.showError(data.message);
      }
    });
  }

  WaiveActivationToClient(clientId: number, waiveFlag: boolean) {
    this.apiService.Update(waiveActivationToClient, { user_id: this.currentUser.id, ClientId: clientId, WaiveFlag: waiveFlag }).subscribe(data => {
      if (data && data.status) {
        this.loadClients(this.selectedUser);
        this.toasterService.showSuccess(data.message);
      }
      else {
        this.toasterService.showError(data.message);
      }
    });
  }

  UnsubscribeClient(clientId: number, unsubscribeFlag: boolean) {
    this.apiService.Update(unsubscribeClient, { user_id: this.currentUser.id, ClientId: clientId, UnsubscribeFlag: unsubscribeFlag }).subscribe(data => {
      if (data && data.status) {
        this.loadClients(this.selectedUser);
        this.toasterService.showSuccess(data.message);
      }
      else {
        this.toasterService.showError(data.message);
      }
    });
  }

  LockUnlockClientAccount(ClientEmailId: string, lockStatus: boolean) {
    this.apiService.Update(lockUnlockClientAccount, { user_id: this.currentUser.id, ClientEmailId: ClientEmailId, LockStatus: lockStatus, LockUnlockTime: new Date() }).subscribe(data => {
      if (data && data.status) {
        this.loadClients(this.selectedUser);
        this.toasterService.showSuccess(data.message);
      }
      else {
        this.toasterService.showError(data.message);
      }
    });
  }


  RemoveUserClient(id: number, email: string) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'Client : ' + email,
          id: id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.Update(removeUserClient, { clientId: id, clientEmailId: email }).subscribe(data => {
          if (data && data.status) {
            this.loadClients(this.selectedUser);
            this.toasterService.showSuccess(data.message);
          }
          else {
            this.toasterService.showError(data.message);
          }
        });
      }
    });

   
  }

  loadClients(user: User) {
    this.apiService.PostAll(getUserClients, { Id: user.id, Name: user.name }).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.userClientList = response.result;
        this.dataSource = new MatTableDataSource<UserClient>(this.userClientList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.activeClientsCount = this.userClientList.filter(c => c.isActive == true).length;
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
