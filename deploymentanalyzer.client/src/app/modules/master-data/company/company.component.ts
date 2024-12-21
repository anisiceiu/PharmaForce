import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Company } from '../../../models/company';
import { CompanyDialogComponent } from '../../shared/components/company-dialog/company-dialog.component';
import { ApiService } from '../../../services/Api/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { addCompany, deleteCompany, getAllCompany, updateCompany } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  
  showFilter = false;
 
  
  companies: Company[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<Company>(true, []);
  dataSource = new MatTableDataSource<Company>(this.companies);
  
 

  
  displayedColumns: string[] = ['select','company_Name', 'company_Website_Global', 'headPeriods', 'number_of_Employees', 'type_of_Entity_Public_Private', 'sales_Previous_Year'];

  constructor(private dialog: MatDialog, private apiService: ApiService,private toasterService:ToasterService,private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {

    this.loadCompanies();
  }

  loadCompanies() {
    this.apiService.GetAll(getAllCompany).subscribe((response:ApiResponse) => {

      if(response.status){
        this.companies = response.result;
        this.dataSource = new MatTableDataSource<Company>(this.companies);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }else{
        this.toasterService.showError(response.message);
      }
      
    });
  }

  openDialog(company?: Company): void {
   
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '400px',
      data: { company: company ?company :this.dataSource}
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        if (result.company_Id > 0) {
          let data = {
            company_Name: result.company_Name,
            company_Website_Global: result.company_Website_Global,
            HeadPeriods: result.headPeriods,
            number_of_Employees: result.number_of_Employees,
            type_of_Entity_Public_Private: result.type_of_Entity_Public_Private,
            sales_Previous_Year: result.sales_Previous_Year,
            company_Id: result.company_Id
          }
         
          this.apiService.Update(updateCompany,data).subscribe((response:ApiResponse) => {
            if(response.status){
              this.toasterService.showSuccess(response.message);
              this.loadCompanies();
              this.searchTextField = '';
            }else{
              this.toasterService.showError(response.message);
            }
          });
        } else {
          let data = {
            company_Name: result.company_Name,
            company_Website_Global: result.company_Website_Global,
            HeadPeriods: result.headPeriods,
            number_of_Employees: result.number_of_Employees,
            type_of_Entity_Public_Private: result.type_of_Entity_Public_Private,
            sales_Previous_Year: result.sales_Previous_Year
          }
          this.apiService.Create(addCompany,data).subscribe((response:ApiResponse) => {
            if(response.status){
              this.toasterService.showSuccess(response.message);
              this.loadCompanies();
              this.searchTextField = '';
            }else{
              this.toasterService.showError(response.message);
            }
          });
        }
      }
    });
  }

  filterCompany(data:Event){
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  deleteCompany(companyId: number) {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { result: {
        title:'company',
        id:companyId,
      }}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.Delete(deleteCompany + result).subscribe((response:ApiResponse) => { 
          if(response.status){
            this.toasterService.showSuccess(response.message);
            this.loadCompanies();
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  
}
