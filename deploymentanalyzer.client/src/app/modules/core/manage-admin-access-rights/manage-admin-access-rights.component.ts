import { Component } from '@angular/core';
import { ApiService } from '../../../services/Api/api.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ApiResponse } from '../../../models/ApiResponse';
import { addAdminPermission, getAdminPermissionByUserId, getAllCompanyCountry, getCompany, getCountry, getFunction, getAdminUsers, updateAdminPermission } from '../../../constants/api.constant';
import { FormControl } from '@angular/forms';
import { User } from '../../../models/user';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StorageService } from '../../../services/common/storage.service';
import { Country } from '../../../models/country';
import { Company } from '../../../models/company';
import { AppFunction } from '../../../models/AppFunction';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-manage-admin-access-rights',
  templateUrl: './manage-admin-access-rights.component.html',
  styleUrl: './manage-admin-access-rights.component.scss',
})
export class ManageAdminAccessRightsComponent {

  userControl = new FormControl<string | User>('');
  filteredOptions!: Observable<User[]>;

  companies: Company[] = [];
  countries: Country[] = [];
  functions: AppFunction[] = [];
  companiesFiltered: any[] = [];
  countriesFiltered: any[] = [];
  functionsFiltered: any[] = [];
  users: User[] = [];
  companyCountries : any[] = [];

  selectedCountryIds: number[] = [];
  selectedCompanyIds: number[] = [];
  selectedFunctionIds: number[] = [];
  selectAllCountryChecked: boolean = false;
  selectAllCompanyChecked: boolean = false;
  selectAllFunctionChecked: boolean = false;


  selectedUser: User = {} as User;
  adminPermissionId: number = 0;
  currentUser: any;
  searchTextFieldCountry: string = '';
  searchTextFieldCompany: string = '';
  searchTextFieldFunction: string = '';

  data = {
    user_id : 1,
    security_Token : "",
  }

  constructor(private apiService: ApiService, private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.filteredOptions = this.userControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.users.slice();
      }),
    );

    this.currentUser = this._storageService.UserDetails;
    this.data.user_id = this.currentUser.id;
    
    this.loadUsers();
    this.loadCompanies();
    this.loadCountires();
    this.loadFunctions();
    this.loadCompanyCountry();

    this.reset();
  }

  onCountrySelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedCountryIds = this.countries.map(c => c.country_Id);
    }
    else {
      this.selectedCountryIds = [];
    }
  }

  onCompanySelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedCompanyIds = this.companies.map(c => c.company_Id);
    }
    else {
      this.selectedCompanyIds = [];
    }
  }

  onFunctionSelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedFunctionIds = this.functions.map(c => c.adminFunctionId);
    }
    else {
      this.selectedFunctionIds = [];
    }
  }

  onSearchCountry(event: Event) {
    if (this.searchTextFieldCountry == '') {
      this.countriesFiltered = this.countries;
    }
  }


  filterCountries(event: Event) {
    this.countriesFiltered = this.countries.filter(c => c.country_Name.toLowerCase().startsWith(this.searchTextFieldCountry.toLowerCase()));
  }

  onSearchCompany(event: Event) {
    if (this.searchTextFieldCompany == '') {
      this.companiesFiltered = this.filteredCompanies;
    }
  }


  filterCompanies(event: Event) {
    this.companiesFiltered = this.filteredCompanies.filter(c => c.company_Name.toLowerCase().startsWith(this.searchTextFieldCompany.toLowerCase()));
  }

  onSearchFunction(event: Event) {
    if (this.searchTextFieldFunction == '') {
      this.functionsFiltered = this.functions;
    }
  }


  filterAppFunctions(event: Event) {
    this.functionsFiltered = this.functions.filter(c => c.functionName.toLowerCase().startsWith(this.searchTextFieldFunction.toLowerCase()));
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.users.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  reset(){
    this.adminPermissionId = 0;
    this.selectedCountryIds = []
    this.selectedCompanyIds = []
    this.selectedFunctionIds = []
  }

  loadUsers(){
    this.apiService.GetAll(getAdminUsers).subscribe((response:ApiResponse) => {

      if(response.status){
        this.users = response.result;
        if (this.users && this.users.length) {

          if (!this.selectedUser || !this.selectedUser.id) {
            this.selectedUser = this.users[0];
          }
          
          this.userControl.setValue(this.selectedUser);
          this.loadPermissions();
        }
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }

  loadCompanies(){

    this.apiService.PostAll(getCompany, this.data).subscribe((response:ApiResponse) => {

      if(response.status){
        this.companies = response.result;
        this.companiesFiltered = this.filteredCompanies;
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }

  loadCountires(){
    this.apiService.PostAll(getCountry, this.data).subscribe((response:ApiResponse) => {

      if(response.status){
        this.countries = response.result;
        this.countriesFiltered = response.result;
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }

  loadFunctions(){
    this.apiService.PostAll(getFunction, this.data).subscribe((response:ApiResponse) => {

      if(response.status){
        this.functions = response.result;
        this.functionsFiltered = response.result;
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }

  loadCompanyCountry(){
    this.apiService.GetAll(getAllCompanyCountry + "?user_id=" + this.currentUser.id).subscribe((response:ApiResponse) => {

      if(response.status){
        this.companyCountries = response.result;
      }else{
        this.toasterService.showError(response.message);
      }
    });
  }

  get filteredCompanies() {
    if (this.selectedCountryIds.length === 0) {
      return this.companies;
    }
    const companyIds = this.companyCountries
      .filter(cc => this.selectedCountryIds.includes(cc.country_Id))
      .map(cc => cc.company_Id);
    return this.companies.filter(company => companyIds.includes(company.company_Id));
  }

  onCountryChange(event: any, countryId: number) {
    if (event.checked) {
      this.selectedCountryIds = [...this.selectedCountryIds, countryId];
    } else {
      this.selectedCountryIds = this.selectedCountryIds.filter(id => id !== countryId);
    }

    this.countrySelectAllChecking();
  }

  countrySelectAllChecking() {
    if (this.selectedCountryIds.length > 0 && this.countriesFiltered.length == this.selectedCountryIds.length) {
      this.selectAllCountryChecked = true;
    }
    else {
      this.selectAllCountryChecked = false;
    }
  }

  onCompanyChange(event: any, companyId: number) {
    if (event.checked) {
      this.selectedCompanyIds = [...this.selectedCompanyIds, companyId];
    } else {
      this.selectedCompanyIds = this.selectedCompanyIds.filter(id => id !== companyId);
    }

    this.companySelectAllChecking();
  }

  companySelectAllChecking() {
    if (this.selectedCompanyIds.length > 0 && this.companiesFiltered.length == this.selectedCompanyIds.length) {
      this.selectAllCompanyChecked = true;
    }
    else {
      this.selectAllCompanyChecked = false;
    }
  }

  onFunctionChange(event: any, functionId: number){
    if (event.checked) {
      this.selectedFunctionIds = [...this.selectedFunctionIds, functionId];
    } else {
      this.selectedFunctionIds = this.selectedFunctionIds.filter(id => id !== functionId);
    }

    this.functionSelectAllChecking();
  }

  functionSelectAllChecking() {
    if (this.selectedFunctionIds.length > 0 && this.functionsFiltered.length == this.selectedFunctionIds.length) {
      this.selectAllFunctionChecked = true;
    }
    else {
      this.selectAllFunctionChecked = false;
    }
  }

  saveAdminPermission(selectedUserId: number) {
 
    if(this.adminPermissionId > 0){
      let data = {
        AdminPermissionID: this.adminPermissionId,
        UserID : selectedUserId,
        Countries: this.selectedCountryIds.toString(),
        Companies: this.selectedCompanyIds.toString(),
        AdminFunctions: this.selectedFunctionIds.toString(),
        LastUpdated: new Date().toISOString(),
        user_id: this.currentUser.id,
        security_token : ''
      }
  
      this.apiService.PostAll(updateAdminPermission, data).subscribe((response:ApiResponse) => {
        if(response.status){
         console.log(response.result);
         this.toasterService.showSuccess(response.message);
         //this.reset();
         //this.loadUsers();
        }else{
          this.toasterService.showError(response.message);
        }
      });
    }
    else{
      let data = {
        UserID : selectedUserId,
        Countries: this.selectedCountryIds.toString(),
        Companies: this.selectedCompanyIds.toString(),
        AdminFunctions: this.selectedFunctionIds.toString(),
        LastUpdated : new Date().toISOString() 
      }
  
      this.apiService.PostAll(addAdminPermission, data).subscribe((response:ApiResponse) => {
        if(response.status){
         console.log(response.result);
         this.toasterService.showSuccess(response.message);
         this.reset();
         this.loadUsers();
        }else{
          this.toasterService.showError(response.message);
        }
      });
    }
    
  }


  loadPermissions() {

    this.apiService.GetById(getAdminPermissionByUserId + this.selectedUser.id).subscribe((response: ApiResponse) => {

      if (response.status) {
        if (response.result.adminPermissionID > 0) {
          this.adminPermissionId = response.result.adminPermissionID;
          this.selectedCountryIds = response.result.countries.split(',').map((num: string) => +num);
          this.selectedCompanyIds = response.result.companies.split(',').map((num: string) => +num);
          this.selectedFunctionIds = response.result.adminFunctions.split(',').map((num: string) => +num);
        }
        else {
          this.reset();
        }

        this.countrySelectAllChecking();
        this.companySelectAllChecking();
        this.functionSelectAllChecking();

      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  // onSelectedUserChange(event: MatAutocompleteSelectedEvent) {
  //   if (event.option.value) {
  //     this.selectedUser = event.option.value;
  //     this.loadPermissions();
  //   }
  // }

  onSelectedUserChange(event: any, id: number) { 

    this.apiService.GetById(getAdminPermissionByUserId + id).subscribe((response:ApiResponse) => {

      if(response.status){
        if(response.result.adminPermissionID > 0){
          this.adminPermissionId = response.result.adminPermissionID;
          this.selectedCountryIds = response.result.countries.split(',').map((num : string) => +num);
          this.selectedCompanyIds = response.result.companies.split(',').map((num : string) => +num);
          this.selectedFunctionIds = response.result.adminFunctions.split(',').map((num: string) => +num);
          
        }
        else{
          this.reset();
        }

        this.countrySelectAllChecking();
        this.companySelectAllChecking();
        this.functionSelectAllChecking();

      }else{
        this.toasterService.showError(response.message);
      }
    });
  }
}
