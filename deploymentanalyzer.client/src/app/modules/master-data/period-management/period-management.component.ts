import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getMasterCodeAllCategories, getMasterCodeByCategory, addUpdateMasterCode, deleteMasterCode } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { MasterCode } from '../../../models/mastercode';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { AddEditMastercodePopupComponent } from '../../shared/components/add-edit-mastercode-popup/add-edit-mastercode-popup.component';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { StorageService } from '../../../services/common/storage.service';

@Component({
  selector: 'app-period-management',
  templateUrl: './period-management.component.html',
  styleUrls: ['./period-management.component.scss']
})
export class PeriodManagementComponent implements OnInit {

  mastercodes: MasterCode[] = [];
  categories: string[] = [];
  selectedCategory: string = 'Period';

  currentUser:any;
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<MasterCode>(this.mastercodes);
  
 
  displayedColumns: string[] = ['select','name', 'category'];

  constructor(private dialog: MatDialog, private apiService: ApiService,
    private toasterService:ToasterService,private _liveAnnouncer: LiveAnnouncer,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.loadMasterCodeCategories();
   
  }

  loadMasterCodeCategories(){
    let data = {}
    this.apiService.PostAll(getMasterCodeAllCategories,data,true).subscribe((response:ApiResponse) => {
      if(response.status){
        this.categories = response.result;
        this.loadMasterCodes(this.selectedCategory);
      }else{
        this.toasterService.showError(response.message);
      }
      
    });
  }

  loadMasterCodes(selectedCategory?:any) {
    let data = {
      category : selectedCategory
    }
    this.apiService.PostAll(getMasterCodeByCategory,data,true).subscribe((response:ApiResponse) => {

      if(response.status){
        this.mastercodes = response.result;
        this.dataSource = new MatTableDataSource<MasterCode>(this.mastercodes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }else{
        this.toasterService.showError(response.message);
      }
      
    });
  }

  openDialog(mastercode?: MasterCode): void {
   
    const dialogRef = this.dialog.open(AddEditMastercodePopupComponent, {
      width: '400px',
      data: { mastercode: mastercode ? mastercode :this.dataSource,
        categories: this.categories, masterCodeCategory: 'Period'
      }
    });

    dialogRef.afterClosed().subscribe((data:any) => {
      if (data) {
        let result = data.value;
        let request = {}; 
        if (result.id > 0) {
          request = {
            id: result.id,
            name: result.name,
            category: result.category,
            user_id: this.currentUser.id
          }
        }else{
          request = {
            name: result.name,
            category: result.category,
            user_id: this.currentUser.id
          }
        }
         
          this.apiService.Create(addUpdateMasterCode,request).subscribe((response:ApiResponse) => {
            if(response.status){
              this.toasterService.showSuccess(response.message);
              this.loadMasterCodes(result.category);
              this.searchTextField = '';
            }else{
              this.toasterService.showError(response.message);
            }
          });
      }
    });
  }

  filterMasterCode(data:Event){
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  deleteMasterCode(id: number) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { result: {
        title:'master code',
        id:id,
      }}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.Delete(deleteMasterCode + result).subscribe((response:ApiResponse) => { 
          if(response.status){
            this.toasterService.showSuccess(response.message);
            this.loadMasterCodes(this.selectedCategory);
            this.searchTextField = '';
          }else{
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
