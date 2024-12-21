import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { UserLoginDetail } from '../../../models/userlogindetail';
import { ApiResponse } from '../../../models/ApiResponse';
import { getUserLoginDetail } from '../../../constants/api.constant';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';

@Component({
  selector: 'app-user-login-detail',
  templateUrl: './user-login-detail.component.html',
  styleUrl: './user-login-detail.component.scss',
})
export class UserLoginDetailComponent implements OnInit {
  users: UserLoginDetail[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<UserLoginDetail>(this.users);
  columnsToDisplay: string[] = [
    'company',
    'userName',
    'clientEmail',
    'login',
    'ipAddress',
  ];

  constructor(private apiService: ApiService, private toasterService: ToasterService) { }
  ngOnInit(): void {
    this.loadExpiryUsers();
  }
  loadExpiryUsers() {
    this.apiService.GetAll(getUserLoginDetail).subscribe((response: ApiResponse) => {

      if (response.status) {
        console.log(response.result);
        this.users = response.result;
        this.dataSource = new MatTableDataSource<UserLoginDetail>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }


  
  
}
