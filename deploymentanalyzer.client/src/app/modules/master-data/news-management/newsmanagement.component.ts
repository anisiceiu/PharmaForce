import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { news } from '../../../models/news';
import { ApiService } from '../../../services/Api/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AddNews, DeleteNews, GetallNews, UpdateNews } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { NewsDialogPopupComponent } from '../../shared/components/news-dialog-popup/news-dialog-popup.component';
import { StorageService } from '../../../services/common/storage.service';

@Component({
  selector: 'app-newsmanagement',
  templateUrl: './newsmanagement.component.html',
  styleUrls: ['./newsmanagement.component.scss']
})
export class NewsManagementComponent implements OnInit {

  showFilter = false;
  currentUser: any;

  newsmanagement: news[] = [];
  filteredNewsManagement: news[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  selection = new SelectionModel<news>(true, []);
  dataSource = new MatTableDataSource<news>(this.newsmanagement);



  displayedColumns: string[] = []; // = ['select', 'company_Name', 'country_Name', 'Long_Message', 'News_Url', 'News_Date' ];

  constructor(private storageService: StorageService, private dialog: MatDialog, private apiService: ApiService, private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {

    this.currentUser = this.storageService.UserDetails;
    if (this.currentUser.userType == "SA" || this.currentUser.userType == "A") {
      this.displayedColumns = ['select', 'company_Name', 'country_Name', 'long_Message', 'news_Url', 'news_Date'];
    } else {
      this.displayedColumns = ['company_Name', 'country_Name', 'long_Message', 'news_Url', 'news_Date'];
    }
    this.loadNewsManagement();
  }

  loadNewsManagement() {
    this.apiService.PostAll(GetallNews, { user_id: this.currentUser.id }).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.newsmanagement = response.result;
        this.filteredNewsManagement = response.result;
        this.dataSource = new MatTableDataSource<news>(this.newsmanagement);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }


  openDialog(news?: news): void {

    const dialogRef = this.dialog.open(NewsDialogPopupComponent, {
      width: '400px',
      data: { news: news ? news : this.dataSource }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let result = data.value;
        if (result.news_id > 0) {
          let data = {
            news_id: result.news_id,
            short_message: result.short_message,
            long_message: result.long_message,
            news_url: result.news_url,
            news_date: result.news_date,
            country_Id: result.country_id,
            company_Id: result.company_id
          }

          this.apiService.Update(UpdateNews, data).subscribe((response: ApiResponse) => {
            if (response.status) {
              this.toasterService.showSuccess(response.message);
              this.loadNewsManagement();
              this.searchTextField = '';
            } else {
              this.toasterService.showError(response.message);
            }
          });
        } else {
          let data = {
            news_id: 0,
            short_message: result.short_message,
            long_message: result.long_message,
            news_url: result.news_url,
            news_date: result.news_date,
            country_Id: result.country_id,
            company_Id: result.company_id
          }
          this.apiService.Create(AddNews, data).subscribe((response: ApiResponse) => {
            if (response.status) {
              this.toasterService.showSuccess(response.message);
              this.loadNewsManagement();
              this.searchTextField = '';
            } else {
              this.toasterService.showError(response.message);
            }
          });
        }
      }
    });
  }

  deleteNews(news: news) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        result: {
          title: 'news',
          id: news.news_Id,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.Delete(DeleteNews + result).subscribe((response: ApiResponse) => {
          if (response.status) {
            this.toasterService.showSuccess(response.message);
            this.loadNewsManagement();
            this.searchTextField = '';
          } else {
            this.toasterService.showError(response.message);
          }
        });
      }
    });
  }

  filterNewsManagement(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    // this.dataSource.filter = value;

    this.newsmanagement = value ? this.filteredNewsManagement.filter(news => {
      return news.company_Name.toLowerCase().includes(value.toLowerCase()) ||
        news.country_Name.toLowerCase().includes(value.toLowerCase()) ||
        news.long_Message.toLowerCase().includes(value.toLowerCase());
    }) : this.filteredNewsManagement;
  }



  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
