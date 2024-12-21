import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getAllCompany, updateCompany, addCompany, deleteCompany, getCompanyForProfileList, getMasterCodeAllCategories, addRemoveFavoriteForCompany, getRegionList, getCountryList, GetRegionListHavingCountry, GetCustomerDropdowns, getAdminTherapeuticCategories } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { Company } from '../../../models/company';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { CompanyDialogComponent } from '../../shared/components/company-dialog/company-dialog.component';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { StorageService } from '../../../services/common/storage.service';
import { Country } from '../../../models/country';
import { CustomerDropdownGroupModel } from '../../../models/CustomerDropdown';
import { CommonMethodService } from '../../../services/common/common-method.service';
import { v4 as uuidv4 } from 'uuid';
import { TherapeuticCategory } from '../../../models/therapeuticCategory';

@Component({
  selector: 'app-company-profile-list',
  templateUrl: './company-profile-list.component.html',
  styleUrls: ['./company-profile-list.component.scss']
})
export class CompanyProfileListComponent implements OnInit {

  showFilter = false;

  currentUser: any;
  companies: Company[] = [];
  companiesBase: Company[] = [];
  searchTextField: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<Company>(true, []);
  dataSource = new MatTableDataSource<Company>(this.companies);
  regions: any[] = [];
  countries: any[] = [];
  countriesBase: any[] = [];
  all_countries: Country[] = [];
  allCustomerData: CustomerDropdownGroupModel = {} as CustomerDropdownGroupModel;
  unique_id: string = uuidv4();
  selectedCountry: number | null = null; 
  selectedRegion: number | null = null;
  therapeutic_category_id: number | null = null;
  therapeuticCategories: TherapeuticCategory[] = [];
  therapeuticCategoriesBase: TherapeuticCategory[] = [];

  displayedColumns: string[] = ['isFavorite','company_Name', 'company_Website_Global', 'type_of_Entity_Public_Private'];

  constructor(private dialog: MatDialog, private apiService: ApiService,
    private storageService: StorageService, private commonMethodService: CommonMethodService,
    private toasterService:ToasterService,private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle("Company List");
    this.currentUser = this.storageService.UserDetails;
    this.getCustomerDropdowns();
    this.loadCompanies();
    this.loadRegions();
    this.loadCountries();
    this.loadTherapeuticCategories();
  }

  loadCountries(){
    let data = {
      user_id:this.currentUser.id
    }
    this.apiService.PostAll(getCountryList,data,true).subscribe((response:ApiResponse) => {
      if (response.status) {
        this.countriesBase = response.result;
        this.filterDropdownListByCustomerDropdowns('country');
      }else{
        this.toasterService.showError(response.message);
      }
      
    });
  }

  loadTherapeuticCategories() {
    this.apiService.GetAll(getAdminTherapeuticCategories)
      .subscribe((response: ApiResponse) => {
        if (response.status) {
          this.therapeuticCategoriesBase = response.result;
          this.filterDropdownListByCustomerDropdowns('therapeuticCategory');
        }
      });
  }

  loadRegions(){
    let data = {
      user_id:this.currentUser.id
    }
    this.apiService.PostAll(GetRegionListHavingCountry,data,true).subscribe((response:ApiResponse) => {
      if(response.status){
        this.regions = response.result;
      }else{
        this.toasterService.showError(response.message);
      }
      
    });
  }

  resetFiltersForCompanyProfile(){
    this.selectedCountry = null;
    this.selectedRegion = null;
    this.searchTextField = '';
    this.loadCompanies();
  }


  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.value) {
      this.dataSource.filter = inputElement.value;
    }
  }

  changeRegion(region:any){
    this.selectedRegion = region;
    if (region) {
      this.countries = this.all_countries.filter(c => c.region_Id == region);
    }
    if (this.countries.length)
      this.selectedCountry = null;
    else
      this.selectedCountry = 0;
    
    this.loadCompanies();
  }

  changeCountry(country:any){
    this.selectedCountry = country;
    sessionStorage.setItem('company-profile-selected-country', country);
    this.loadCompanies();
  }

  changeTC(tc: any) {
    this.therapeutic_category_id = tc;
    sessionStorage.setItem('company-profile-selected-therapeutic_category', tc);
    this.loadCompanies();
  }

  toggleFavourite(row:any){
    this.AddRemoveFavoriteForCompany(row);
  }

  AddRemoveFavoriteForCompany(row:any){
    let data = {
      company_Id: row.company_Id,
      client_id: this.currentUser.clientId,
      user_Id: this.currentUser.id
    }
    this.apiService.PostAll(addRemoveFavoriteForCompany,data,true).subscribe((response:ApiResponse) => {
      if(response.status){
        if(response.result == 3){
          this.toasterService.showWarning(response.message);
        }else{
          this.toasterService.showSuccess(response.message);
          row.isFavorite = !row.isFavorite;
        }
      }else{
        this.toasterService.showError(response.message);
      }
      
    });

  }

  loadCompanies() {
    let data = {
      user_Id: this.currentUser.id,
      client_id: this.currentUser.clientId,
      country: this.selectedCountry,
      region: this.selectedRegion,
      therapeutic_category_id: this.therapeutic_category_id
    };
    
      this.apiService.PostAll(getCompanyForProfileList, data).subscribe((response: ApiResponse) => {

        if (response.status) {
          this.companies = response.result;
          //this.filterDropdownListByCustomerDropdowns('company');
          this.dataSource = new MatTableDataSource<Company>(this.companies);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
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
            headQuarters: result.headQuarters,
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
            headQuarters: result.headQuarters,
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

  applyFilter(value: string, column: keyof Company) {
    value = value.trim().toLowerCase(); // Remove whitespace and lowercase the input

    this.dataSource.filterPredicate = (data: Company, filter: string) => {
      const columnValue = data[column]?.toString().toLowerCase() || '';
      return columnValue.includes(filter);
    };

    this.dataSource.filter = value; // Trigger the filter
  }

  filterDropdownListByCustomerDropdowns(type: string) {
    if (this.allCustomerData) {
      if (type == 'therapeuticCategory' && this.therapeuticCategoriesBase && this.therapeuticCategoriesBase.length && this.allCustomerData.therapeutic_categories && this.allCustomerData.therapeutic_categories.length) {
        this.therapeuticCategories = this.therapeuticCategoriesBase.filter(tc => this.allCustomerData.therapeutic_categories.findIndex(a => a.therapeutic_category == tc.therapeuticCategory_Name) > -1);
      }
      if (type == 'country' && this.countriesBase && this.countriesBase.length && this.allCustomerData.countries && this.allCustomerData.countries.length) {
        this.all_countries = this.countriesBase.filter(c => this.allCustomerData.countries.findIndex(a => a.country_name == c.country_Name) > -1);
      }
      if (type == 'company' && this.companiesBase && this.companiesBase.length && this.allCustomerData.companies && this.allCustomerData.companies.length) {
        this.companies = this.companiesBase.filter(c => this.allCustomerData.companies.findIndex(a => a.company_name == c.company_Name) > -1);
      }
      //if (type == 'period' && this.periodListBase && this.periodListBase.length && this.allCustomerData.periods && this.allCustomerData.periods.length) {
      //  this.periodList = this.periodListBase.filter(p => this.allCustomerData.periods.findIndex(a => a.period_year == p.period_Year && a.period_quarter == p.period_Quarter) > -1);
      //}

      this.setDefaultCountry();
    }
  }

  setDefaultCountry() {
    if (this.all_countries && this.all_countries.length > 0 && this.regions && this.regions.length > 0) {
      if (this.all_countries.findIndex(c => c.country_Name == 'United States') > -1) {
        let country = this.all_countries.find(r => r.country_Name == 'United States');
        if (country) {
          this.changeRegion(country.region_Id);
          this.changeCountry(country.country_Id);        
        }
      }
      else {
        this.sortCountryArray();
        let country = this.all_countries[0];
        if (country) {
          this.changeRegion(country.region_Id);
          this.changeCountry(country.country_Id);
        }
      }
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

  getCustomerDropdowns() {
    this.getSpecificCustomerData('country');
    this.getSpecificCustomerData('therapeuticCategory');
    //this.getSpecificCustomerData('company');
    //this.getSpecificCustomerData('period');
  }

  getSpecificCustomerData(type: string, params: any = null) {

    let columns: string = 'Period_Year,Period_Quarter,Country_Name,Company_Name,SalesForce_Name,US_Product_Name_Product_Promoted,Generic_Name,Therapeutic_Category';
    if (type == 'country')
      columns = 'Country_Name'
    else if (type == 'company')
      columns = 'Company_Name';
    else if (type == 'period')
      columns = 'Period_Year,Period_Quarter';
    else if (type == 'therapeuticCategory')
      columns = 'Therapeutic_Category';
    else if (type == 'brand')
      columns = 'US_Product_Name_Product_Promoted';
    else if (type == 'genericname')
      columns = 'Generic_Name';
    else if (type == 'salesforce')
      columns = 'SalesForce_Name';

    
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
        else if (type == 'period') {
          this.allCustomerData.periods = response.result;
          this.filterDropdownListByCustomerDropdowns('period');
        }
        else if (type == 'therapeuticCategory') {
          this.allCustomerData.therapeutic_categories = response.result;
          this.filterDropdownListByCustomerDropdowns('therapeuticCategory');
        }

      }
    });
  }


}
