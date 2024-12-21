import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { citation } from '../../../models/citation';
import { ApiService } from '../../../services/Api/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { GetCitationManager } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';

@Component({
  selector: 'app-citationmanager',
  templateUrl: './citationmanager.component.html',
  styleUrls: ['./citationmanager.component.scss']
})
export class CitationManagerComponent implements OnInit {

    showFilter = false;
   
    citationmanager: citation[] = [];
    searchTextField: string = '';
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    selection = new SelectionModel<citation>(true, []);
    dataSource = new MatTableDataSource<citation>(this.citationmanager);
    
   
  
    displayedColumns: string[] = ['description', 'date', 'url', 'added_dt'];
  
    constructor(private dialog: MatDialog, private apiService: ApiService,private toasterService:ToasterService,private _liveAnnouncer: LiveAnnouncer) { }
  
    ngOnInit(): void {
  
      this.loadCitationManager();
    }
  
    loadCitationManager() {
      this.apiService.GetAll(GetCitationManager).subscribe((response:ApiResponse) => {
  
        if(response.status){
          this.citationmanager = response.result;
          this.dataSource = new MatTableDataSource<citation>(this.citationmanager);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
          this.toasterService.showError(response.message);
        }
      });
    }
   
    filterCitationManager(data:Event){
      const value = (data.target as HTMLInputElement).value;
      this.dataSource.filter = value;
    }
    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }
  }
  