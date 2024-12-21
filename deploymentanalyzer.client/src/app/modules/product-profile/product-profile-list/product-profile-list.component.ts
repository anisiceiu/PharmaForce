import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getCountryList, getRegionList, GetProductForProfileList, addRemoveFavoriteForProduct, GetRegionListHavingCountry, GetCustomerDropdowns, getCallPlanningFilters } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ApiService } from '../../../services/Api/api.service';
import { StorageService } from '../../../services/common/storage.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { Product } from '../../../models/Product';
import { Country } from '../../../models/country';
import { CustomerDropdownGroupModel } from '../../../models/CustomerDropdown';
import { Company } from '../../../models/company';
import { IdNamePair } from '../../../models/salesforcedata';
import { CommonMethodService } from '../../../services/common/common-method.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-product-profile-list',
  templateUrl: './product-profile-list.component.html',
  styleUrl: './product-profile-list.component.scss'
})
export class ProductProfileListComponent implements OnInit {
  showFilter = false;
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  currentUser: any;
  products: Product[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<Product>(true, []);
  dataSource = new MatTableDataSource<Product>(this.products);
  regions: any;
  countries: any;
  all_countries: Country[] = [];
  all_countriesBase: Country[] = [];
  companies: Company[]=[];
  companiesBase: Company[]=[];
  unique_id: string = uuidv4();
  selectedCountry: number | null = null;
  selectedCompany: number | null = null;
  selectedRegion: number | null = null;

  displayedColumns: string[] = ['isFavorite', 'uS_Brand_Name', 'company_Specific_Brand_Name', 'generic_Name'];
  firstRendered: boolean = false;
  constructor(private dialog: MatDialog, private apiService: ApiService,
    private storageService: StorageService, private commonMethodService: CommonMethodService,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle("Product List");
    this.currentUser = this.storageService.UserDetails;
    this.loadProducts();
    this.loadRegions();
    this.loadCountries();
    this.getCustomerDropdowns();
  }

  loadCountries() {
    let data = {
      user_id: this.currentUser.id
    }
    this.apiService.PostAll(getCountryList, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.all_countriesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('country');
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadRegions() {
    let data = {
      user_id: this.currentUser.id
    }
    this.apiService.PostAll(GetRegionListHavingCountry, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.regions = response.result;
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  resetFiltersForProductProfile() {
    this.selectedCountry = null;
    this.selectedRegion = null;
    this.selectedCompany = null;
    this.searchTextField = '';
    this.loadProducts();
  }


  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.value) {
      this.dataSource.filter = inputElement.value;
    }
  }

  changeRegion(region: any) {
    this.selectedRegion = region;
    if (region) {
      this.countries = this.all_countries.filter(c => c.region_Id == region);
    }

    if (this.countries.length)
      this.selectedCountry = null;
    else
      this.selectedCountry = 0;

    this.loadProducts();
  }

  changeCountry(country: any) {
    this.selectedCountry = country;
    sessionStorage.setItem('product-profile-selected-country', country);
    this.getCompanyFilters();
    this.loadProducts();
  }

  changeCountryRegionForDefault(region:any, country:any) {
    this.selectedRegion = region;
    if (region) {
      this.countries = this.all_countries.filter(c => c.region_Id == region);
    }

    this.selectedCountry = country;
    sessionStorage.setItem('product-profile-selected-country', country);
    this.getCompanyFilters();
    this.loadProducts();
  }

  changeCompany(company: any) {
    this.selectedCompany = company;
    sessionStorage.setItem('product-profile-selected-company', company);
    this.loadProducts();
  }

  toggleFavourite(row: any) {
     this.AddRemoveFavoriteForProduct(row);
  }

  getCompanyFilters() {
    if (this.companiesBase && this.companiesBase.length) {
      let data = {
        user_id: this.currentUser.id,
        companies: null,
        countries: this.selectedCountry?.toString(),
        periods: null,
        brands: null,
        therapeuticcategories: null,
      };

      this.getSpecificCustomerData('company', data);
    }
    else {
      let data = {
        type: 2,
        regionId: Number(this.selectedRegion),
        countryId: Number(this.selectedCountry)
      };
      this.apiService
        .PostAll(getCallPlanningFilters, data)
        .subscribe((response: ApiResponse) => {
          if (response.status) {
            this.companiesBase = response.result.map((c: IdNamePair) => ({ company_Id: c.id, company_Name :c.name}));
            this.filterDropdownListByCustomerDropdowns('company');
          }
        });

    }


  }


  AddRemoveFavoriteForProduct(row: any) {
    let data = {
      product_Id: row.product_Id,
      client_id: this.currentUser.clientId,
      user_Id: this.currentUser.id
    }
    this.apiService.PostAll(addRemoveFavoriteForProduct, data, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        if (response.result == 3) {
          this.toasterService.showWarning(response.message);
        } else {
          this.toasterService.showSuccess(response.message);
          row.isFavorite = !row.isFavorite;
        }
      } else {
        this.toasterService.showError(response.message);
      }

    });

  }

  loadProducts() {
    let data = {
      user_Id: this.currentUser.id,
      client_id: this.currentUser.clientId,
      country: this.selectedCountry,
      company: this.selectedCompany,
      region: this.selectedRegion
    };

    this.apiService.PostAll(GetProductForProfileList, data).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.products = response.result;
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }


  filterProduct(data: Event) {
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getCustomerDropdowns() {
    this.getSpecificCustomerData('country');
    this.getSpecificCustomerData('company');
  }

  setDefaultCountry() {
    if (this.all_countries && this.all_countries.length > 0 && this.regions && this.regions.length > 0) {
      if (this.all_countries.findIndex(c => c.country_Name == 'United States') > -1) {
        let country = this.all_countries.find(r => r.country_Name == 'United States');
        if (country) {
          this.changeCountryRegionForDefault(country.region_Id, country.country_Id);
        }
      }
      else {
        this.sortCountryArray();
        let country = this.all_countries[0];
        if (country) {
          this.changeCountryRegionForDefault(country.region_Id, country.country_Id);
        }
      }
      this.firstRendered = true;
    }
  }

  sortCountryArray() {
    this.all_countries.sort(function (a, b) {
      if (a.country_Name < b.country_Name) {
        return -1;
      }
      if (a.country_Name > b.country_Name) {
        return 1;
      }
      return 0;
    });

  }

  filterDropdownListByCustomerDropdowns(type: string, serial: number = 0) {
    if (this.allCustomerData) {
      if (type == 'country' && this.all_countriesBase && this.all_countriesBase.length && this.allCustomerData.countries && this.allCustomerData.countries.length) {
        this.all_countries = this.all_countriesBase.filter(c => this.allCustomerData.countries.findIndex(a => a.country_name == c.country_Name) > -1);
       
      }
      if (type == 'company' && this.companiesBase && this.companiesBase.length && this.allCustomerData.companies && this.allCustomerData.companies.length) {
        this.companies = this.companiesBase.filter(c => this.allCustomerData.companies.findIndex(a => a.company_name == c.company_Name) > -1);
      }

      if (!this.firstRendered) {
        this.setDefaultCountry();
      }
      
    }
  }

    getSpecificCustomerData(type: string, params: any = null) {

      let columns: string = 'Period_Year,Period_Quarter,Country_Name,Company_Name,SalesForce_Name,US_Product_Name_Product_Promoted,Generic_Name,Therapeutic_Category';
      if (type == 'country')
        columns = 'Country_Name'
      else if (type == 'company')
        columns = 'Company_Name';

      let data: any = {
        user_id: this.currentUser.id,
        companies: null,
        countries: null,
        periods: null,
        therapeuticcategories: null,
        columns: columns
      };

      if (params) {
        data = params;
        data.columns = columns;
      }

      //if (this.storageService.UserDetails && this.storageService.UserDetails.userRights) {
      //  let userRights = this.storageService.UserDetails.userRights;

      //  //data.therapeuticcategories = userRights.therapeuticCategories;
      //  if (type == 'country') {
      //    data.countries = userRights.countries;
      //  }
      //  else if (type == 'company') {
      //    data.companies = userRights.companies;
      //  }
      //  else if (type == 'period') {
      //    data.periods = userRights.periods;
      //  }
      //}

      this.apiService.PostAll(GetCustomerDropdowns, data).subscribe(response => {
        if (response?.status) {
          if (type == 'country') {
            this.allCustomerData.countries = response.result;
            this.filterDropdownListByCustomerDropdowns('country');
          }
          else if (type == 'company') {
            this.allCustomerData.companies = response.result;
            this.filterDropdownListByCustomerDropdowns('company');
          }

        }
      });
    }

    applyFilter(value: string, column: keyof Product) {
      value = value.trim().toLowerCase(); // Remove whitespace and lowercase the input
    
      this.dataSource.filterPredicate = (data: Product, filter: string) => {
        const columnValue = data[column]?.toString().toLowerCase() || '';
        return columnValue.includes(filter);
      };
    
      this.dataSource.filter = value; // Trigger the filter
    }
  

}
