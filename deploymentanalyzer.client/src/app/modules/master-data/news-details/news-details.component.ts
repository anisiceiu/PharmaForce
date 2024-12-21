import { Component } from '@angular/core';
import { news } from '../../../models/news';
import { StorageService } from '../../../services/common/storage.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/Api/api.service';
import { GetNewsById } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.css'
})
export class NewsDetailsComponent {
  news: news = {} as news;
  news_id: number = 0;

  constructor(private storageService: StorageService, private apiService: ApiService,  private activatedRoute: ActivatedRoute) {

    this.activatedRoute.params.subscribe(params => {
      this.news_id = params['news_id'];
      if (this.news_id > 0) {
        this.loadNews();
      }
    });

    
  }

  loadNews() {
    this.apiService.GetById(GetNewsById+'/' + this.news_id, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.news = response.result;
      }

    });
  }

}
