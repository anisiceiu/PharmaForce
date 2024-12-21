import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/Api/api.service';
import { StorageService } from '../../../services/common/storage.service';
import { GetCompanyUpdateInfo } from '../../../constants/api.constant';
import { CompanyUpdateInfo, CountryGroup, YearGroup, companyInfo } from '../../../models/CompanyProfileTopInfo';

@Component({
  selector: 'app-company-update',
  templateUrl: './company-update.component.html',
  styleUrl: './company-update.component.css'
})
export class CompanyUpdateComponent implements OnInit {
  currentUser: any;
  companyInfoList: Array<CompanyUpdateInfo>;
  yearMonthwiseList: CompanyUpdateInfo[] = [];
  constructor(private apiService: ApiService, private storageService: StorageService) {
    this.companyInfoList = new Array<CompanyUpdateInfo>();
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.UserDetails;
    this.getCompanyUpdateInfo();
  }

  manipulateCompanyUpdateInfo(arr: CompanyUpdateInfo[]) {
    let list_yearMonthwise = this.getListGroupByYearMonth(arr);

    list_yearMonthwise.forEach(item => {
      item.countryList = this.getListGroupByCountry(item.countryList);
      item.countryList.forEach(c => {
        c.companyList = c.companyList.filter(e => e.country_name == c.country_name && e.month_name == item.month_name && e.year == item.year);
      });
    });

    this.yearMonthwiseList = list_yearMonthwise;
  }

  getListGroupByYearMonth(arr: CompanyUpdateInfo[]): CompanyUpdateInfo[] {
    let helper: any = {};
    var result = arr.reduce(function (r: any, o: any) {
      var key = o.year + '-' + o.month_number;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        if (helper[key].countryList && Array.isArray(helper[key].countryList)) {
          helper[key].countryList.push({ country_name: o.country_name, company_name: o.company_name, year: o.year, month_name: o.month_name });
        }
        else {
          helper[key].countryList = [];
          helper[key].countryList.push({ country_name: o.country_name, company_name: o.company_name, year: o.year, month_name: o.month_name });
        }

        r.push(helper[key]);
      } else {
        if (helper[key].countryList && Array.isArray(helper[key].countryList)) {
          helper[key].countryList.push({ country_name: o.country_name, company_name: o.company_name, year: o.year, month_name: o.month_name });
        }
        else {
          helper[key].countryList = [];
          helper[key].countryList.push({ country_name: o.country_name, company_name: o.company_name, year: o.year, month_name: o.month_name });
        }

      }

      return r;
    }, []);

    return result;
  }

  getListGroupByCountry(arr: any[]): CompanyUpdateInfo[] {
    let helper: any = {};
    var result = arr.reduce(function (r: any, o: any) {
      var key = o.country_name + '-' + o.year + '-' + o.month_number;;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        if (helper[key].companyList && Array.isArray(helper[key].companyList)) {
          helper[key].companyList.push({ country_name: o.country_name, company_name: o.company_name, year: o.year, month_name: o.month_name });
        }
        else {
          helper[key].companyList = [];
          helper[key].companyList.push({ country_name: o.country_name, company_name: o.company_name, year: o.year, month_name: o.month_name });
        }

        r.push(helper[key]);
      } else {
        if (helper[key].companyList && Array.isArray(helper[key].companyList)) {
          helper[key].companyList.push({ country_name: o.country_name, company_name: o.company_name, year: o.year, month_name: o.month_name });
        }
        else {
          helper[key].companyList = [];
          helper[key].companyList.push({ country_name: o.country_name, company_name: o.company_name, year: o.year, month_name: o.month_name });
        }

      }

      return r;
    }, []);

    return result;
  }

  getListGroupByCompany(arr: any[]): CompanyUpdateInfo[] {
    let helper: any = {};
    var result = arr.reduce(function (r: any, o: any) {
      var key = o.company_name;

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
      
        r.push(helper[key]);
      }

      return r;
    }, []);

    return result;
  }

  getCompanyUpdateInfo() {
    let data = {
      user_id: this.currentUser.id,
      security_token: ''
    };

    this.apiService.PostAll(GetCompanyUpdateInfo, data).subscribe(response => {
      if (response.status) {
        this.companyInfoList = response.result;
      }
      else {
        this.companyInfoList = new Array<CompanyUpdateInfo>();
      }
      this.manipulateCompanyUpdateInfo(this.companyInfoList);
    });
  }

}
