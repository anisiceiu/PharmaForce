import { Component, ViewChild, OnInit } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { User } from '../../../models/user';
import { ApiResponse } from '../../../models/ApiResponse';
import { getUsersExpiry, updateUserExpiry } from '../../../constants/api.constant';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';

@Component({
  selector: 'app-expiration-date',
  templateUrl: './expiration-date.component.html',
  styleUrl: './expiration-date.component.scss',
})
export class ExpirationDateComponent implements OnInit {
  users: User[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<User>(this.users);
  columnsToDisplay: string[] = [
    'username',
    'expires',
    'extend_one_year',
    'edit_expiry',
  ];


  constructor(private dialog: MatDialog, private apiService: ApiService, private toasterService: ToasterService, private datepipe: DatePipe) { }
  ngOnInit(): void {
    this.loadExpiryUsers();
  }
  loadExpiryUsers() {
    this.apiService.GetAll(getUsersExpiry).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.users = response.result;
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }


  updateUserExpiry(Id: number, expires: Date) {
    var d = new Date(expires);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day);
    //console.log(c);
    let data = {
      Id: Id,
      Expires: c,
    }
    console.log(data);
    this.apiService.Update(updateUserExpiry, data).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.toasterService.showSuccess(response.message);
        this.loadExpiryUsers();

      } else {
        this.toasterService.showError(response.message);
      }
    });

  }
  myFunction(event: any): any {
    console.log(event); // here you are getting the value
  }
  updateUserExp(id: number) {
    //console.log(event);
    var expiry;
    let myRow = document.getElementById('td' + id);
    if (myRow !== null) {
      expiry = new Date((myRow.querySelector('.expiryDate') as HTMLInputElement).value); 
      (myRow.querySelector('.expiryDate') as HTMLInputElement).className = "expiryDate disnone";
      (myRow.querySelector('.expDate') as HTMLInputElement).className = "expDate";
    }
    let myButton = document.getElementById('btn' + id);
    if (myButton !== null) {
      myButton.classList.remove('disnone');
    }
    let myUpdateButton = document.getElementById('btnUpdate' + id);
    if (myUpdateButton !== null) {
      myUpdateButton.classList.add("disnone");
    }
    console.log(expiry);
    let data = {
      Id: id,
      Expires: expiry,
    }
    console.log(data);
    this.apiService.Update(updateUserExpiry, data).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.toasterService.showSuccess(response.message);
        this.loadExpiryUsers();

      } else {
        this.toasterService.showError(response.message);
      }
    });
    
  }
  addInput(id: number) {

    let myRow = document.getElementById('td' + id);
    if (myRow !== null) {
      (myRow.querySelector('.expiryDate') as HTMLInputElement).className = "expiryDate";
      (myRow.querySelector('.expDate') as HTMLInputElement).className = "expDate disnone";
    }
    let myButton = document.getElementById('btn' + id);
    if (myButton !== null) {
      myButton.classList.add("disnone");
    }
    let myUpdateButton = document.getElementById('btnUpdate' + id);
    if (myUpdateButton !== null) {
      myUpdateButton.classList.remove('disnone');
    }
    
  }
}
