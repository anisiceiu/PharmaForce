import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Brand, MyBrand } from '../../../models/brand';
import { StorageService } from '../../../services/common/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AddMyBrandGroupPopupComponent } from '../../shared/add-my-brand-group-popup/add-my-brand-group-popup.component';
import { ApiResponse } from '../../../models/ApiResponse';
import { AddUpdateMyBrandGroup, DeleteMyBrandGroup, GetMyBrandGroups } from '../../../constants/api.constant';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-brand-group',
  templateUrl: './brand-group.component.html',
  styleUrl: './brand-group.component.css'
})
export class BrandGroupComponent implements OnInit {
  showFilter = false;
  currentUser: any;

  myBrandGroups: MyBrand[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<MyBrand>(this.myBrandGroups);

  displayedColumns: string[] = ['select', 'name'];

  constructor(private storageService: StorageService, private dialog: MatDialog, private apiService: ApiService, private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {

    this.currentUser = this.storageService.UserDetails;
    this.loadMyBrandGroup();
  }

  loadMyBrandGroup() {
    this.apiService.PostAll(GetMyBrandGroups, { user_id: this.currentUser.id }).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.myBrandGroups = response.result;
        this.dataSource = new MatTableDataSource<MyBrand>(this.myBrandGroups);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  getEmptyBrandGroup() {
    let myBrand: MyBrand = {
      id: 0,
      name: '',
      userId: this.currentUser.id,
      brands: '',
      isChemicalGroup: false
    };

    return myBrand;
  }

  openDialog(myBrandGroup?: MyBrand): void {
    const dialogRef = this.dialog.open(AddMyBrandGroupPopupComponent, {
      width: '400px',
      data: { myBrandGroup: myBrandGroup ? myBrandGroup : this.getEmptyBrandGroup() }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        console.log("result", result)
        if (result.id > 0) {
          let data = {
            id: result.id,
            name: result.name,
            isChemicalGroup: result.isChemicalGroup,
            brands: result.brands,
            user_id: this.currentUser.id,
            userId: this.currentUser.id,
            securityToken: "string",
            permissionGranted: 0
          }

          this.apiService.PostAll(AddUpdateMyBrandGroup, data).subscribe((response: ApiResponse) => {
            if (response.status) {
              this.toasterService.showSuccess(response.message);
              this.loadMyBrandGroup();
              this.searchTextField = '';
            } else {
              this.toasterService.showError(response.message);
            }
          });
        } else {
          let data = {
            id: 0,
            brands: result.brands,
            isChemicalGroup: result.isChemicalGroup,
            name: result.name,
            user_id: this.currentUser.id,
            userId: this.currentUser.id,
            securityToken: "stringA",
            permissionGranted: 0
          }
          this.apiService.Create(AddUpdateMyBrandGroup, data).subscribe((response: ApiResponse) => {
            if (response.status) {
              this.toasterService.showSuccess(response.message);
              this.loadMyBrandGroup();
              this.searchTextField = '';
            } else {
              this.toasterService.showError(response.message);
            }
          });
        }
      }
    });
  }

  deleteMyBrandGroup(row: MyBrand) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'Brand Group :' + row.name,
          id: row.id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.Delete(DeleteMyBrandGroup + row.id.toString()).subscribe((response: ApiResponse) => {
          if (response.status) {
            this.toasterService.showSuccess(response.message);
            this.loadMyBrandGroup();
            this.searchTextField = '';
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
