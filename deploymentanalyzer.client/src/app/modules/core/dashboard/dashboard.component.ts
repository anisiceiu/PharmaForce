import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/common/storage.service';
import { ApiService } from '../../../services/Api/api.service';
import { ApiResponse } from '../../../models/ApiResponse';
import { ToasterService } from '../../../services/common/toaster.service';
import { GetallNews, SubscribeUnSubscribeFavoriteCompany, SubscribeUnSubscribeFavoriteProduct, getFavoriteCompanyList, getFavoriteProductList, getKeyUpdates } from '../../../constants/api.constant';
import { AccountService } from '../../../services/account/account.service';
import { news } from '../../../models/news';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser:any;
  favoriteCompanies: any;
  favoriteProducts: any;
  newsmanagement: Array<news>=[];
  keyUpdates: any;

  constructor(private apiService: ApiService,
    private toasterService: ToasterService, accountService: AccountService,
    private storageService: StorageService) {
    if (accountService.getIsAccountSwitched()) {
        accountService.setIsAccountSwitched(false);
        window.location.reload();
      }
    }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.loadFavoriteCompany();
    this.loadFavoriteProducts();
    this.getKeyNews();
    this.getKeyUpdates();
  }

  subscribeCompany(company_Id: number, flag: boolean) {
    this.SubscribeUnSubscribeFavoriteCompany(company_Id, flag);
  }

  subscribeProduct(product_Id: number, flag: boolean) {
    this.SubscribeUnSubscribeFavoriteProduct(product_Id, flag);
  }

  SubscribeUnSubscribeFavoriteProduct(product_Id: number, alerts_enabled: boolean) {
    let data = {
      product_Id: product_Id,
      alerts_enabled: alerts_enabled,
      client_id: this.currentUser.clientId,
      user_Id: this.currentUser.id
    }
    this.apiService.PostAll(SubscribeUnSubscribeFavoriteProduct, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.loadFavoriteProducts();
        this.toasterService.showSuccess(response.message);
      } else {
        this.toasterService.showError(response.message);
      }

    });

  }

  SubscribeUnSubscribeFavoriteCompany(company_Id: number, alerts_enabled: boolean) {
    let data = {
      company_Id: company_Id,
      alerts_enabled: alerts_enabled,
      client_id: this.currentUser.clientId,
      user_Id: this.currentUser.id
    }
    this.apiService.PostAll(SubscribeUnSubscribeFavoriteCompany, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.loadFavoriteCompany();
        this.toasterService.showSuccess(response.message);
      } else {
        this.toasterService.showError(response.message);
      }

    });

  }

  getKeyUpdates(){
    this.apiService.GetAll(getKeyUpdates + "?user_id=" + this.currentUser.id).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.keyUpdates = response.result;
        
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  getKeyNews() {
    this.apiService.PostAll(GetallNews, { user_id: this.currentUser.id }).subscribe((response: ApiResponse) => {
  
      if(response.status){
        this.newsmanagement = response.result;
        if (this.newsmanagement && this.newsmanagement.length) {
          this.newsmanagement = this.newsmanagement.map(n => ({ ...n, short_Message: n.short_Message?.substring(0, 56).concat('...') }));
        }
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }

  loadFavoriteCompany(){
    let data = {
      user_id: this.currentUser.id,
      client_id: this.currentUser.clientId
    }
    this.apiService.PostAll(getFavoriteCompanyList,data,true).subscribe((response:ApiResponse) => {
      if(response.status){
        this.favoriteCompanies = response.result;
      }else{
        this.toasterService.showError(response.message);
      }
      
    });
  }

  loadFavoriteProducts(){
    let data = {
      user_id: this.currentUser.id,
      client_id: this.currentUser.clientId
    }
    this.apiService.PostAll(getFavoriteProductList,data,true).subscribe((response:ApiResponse) => {
      if(response.status){
        this.favoriteProducts = response.result;
      }else{
        this.toasterService.showError(response.message);
      }
      
    });
  }

}
