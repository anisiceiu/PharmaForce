import { Component } from '@angular/core';
import { DualListBoxComponent } from './dual-list-box/dual-list-box.component';
import { User } from '../../../models/user';
import { addOrUpdateUserRights, getUserRights, getAllUsers, getAdminCountries, getAdminCompanies, getAdminPeriods, getAdminTherapeuticCategories, getAllCompanyCountry } from '../../../constants/api.constant';
import { ApiResponse } from '../../../models/ApiResponse';
import { ApiService } from '../../../services/Api/api.service';
import { CommonMethodService } from '../../../services/common/common-method.service';
import { ToasterService } from '../../../services/common/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Country } from '../../../models/country';
import { Company } from '../../../models/company';
import { Period } from '../../../models/period';
import { TherapeuticCategory } from '../../../models/therapeuticCategory';
import { UserRight } from '../../../models/userRights';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { StorageService } from '../../../services/common/storage.service';

@Component({
  selector: 'app-manage-user-access-rights',
  templateUrl: './manage-user-access-rights.component.html',
  styleUrl: './manage-user-access-rights.component.css'
})
export class ManageUserAccessRightsComponent {

  userRights: UserRight = {} as UserRight;
  countryList: Country[] = [];
  companyList: Company[] = [];
  periodList: Period[] = [];
  therapeuticCategoryList: TherapeuticCategory[] = [];
  countryListFiltered: Country[] = [];
  companyListFiltered: Company[] = [];
  periodListFiltered: Period[] = [];
  therapeuticCategoryListFiltered: TherapeuticCategory[] = [];
  companyCountries: any[] = [];

  selectedCountryIds: number[] = [];
  selectedCompanyIds: number[] = [];
  selectedPeriodIds: number[] = [];
  selectedTherapeuticCategoryIds: number[] = [];
  selectAllCountryChecked: boolean = false;
  selectAllCompanyChecked: boolean = false;
  selectAllPeriodChecked: boolean = false;
  selectAllTherapeuticCategoryChecked: boolean = false;

  userList: User[] = [];
  selectedUser: User = {} as User;
  tab = 1;
  keepSorted = true;
  filter = false;
  disabled = false;
  sourceLeft = true;
  format: any = DualListBoxComponent.DEFAULT_FORMAT;
  isEditMode: boolean = false;

  //keyCountry: string = 'country_Id';
  //displayCountry: string = 'country_Name';
  //sourceCountry: Array<any> = [];
  //confirmedCountry: Array<any> = [];
  //previousCountryList: Array<string> = [];

  //keyCompany: string = 'company_Id';
  //displayCompany: string = 'company_Name';
  //sourceCompany: Array<any> = [];
  //confirmedCompany: Array<any> = [];
  //previousCompanyList: Array<string> = [];

  //keyPeriod: string = 'period_Id';
  //displayPeriod: string = 'displayed_Title';
  //sourcePeriod: Array<any> = [];
  //confirmedPeriod: Array<any> = [];
  //previousPeriodList: Array<string> = [];

  //keyTherapeuticCategory: string = 'therapeuticCategory_Id';
  //displayTherapeuticCategory: string = 'therapeuticCategory_Name';
  //sourceTherapeuticCategory: Array<any> = [];
  //confirmedTherapeuticCategory: Array<any> = [];
  //previousTherapeuticCategoryList: Array<string> = [];
  searchTextFieldCountry: string = '';
  searchTextFieldPeriod: string = '';
  searchTextFieldCompany: string = '';
  searchTextFieldTherapeuticCategory: string = '';
  currentUser: any;

  constructor(private dialog: MatDialog, private apiService: ApiService,
    private commonMethodService: CommonMethodService,
    private toasterService: ToasterService, private _liveAnnouncer: LiveAnnouncer, private _storageService: StorageService) {

      this.loadCompany();
      this.loadCountry();
      this.loadPeriod();
      this.loadTherapeuticCategory();
      
  }

  ngOnInit(): void {
    this.currentUser = this._storageService.UserDetails;
    this.commonMethodService.setTitle("Manage User Access Rights");
    this.loadUsers();
    this.loadCompanyCountry();
  }

  reset() {
    this.selectedCountryIds = [];
    this.selectedCompanyIds = [];
    this.selectedPeriodIds = [];
    this.selectedTherapeuticCategoryIds = [];
  }

  //onEditClick() {
  //  this.isEditMode = true;
  //}

  onSearchCountry(event: Event) {
    if (this.searchTextFieldCountry == '') {
      this.countryListFiltered = this.countryList;
    }
  }


  filterCountries(event: Event) {
    this.countryListFiltered = this.countryList.filter(c => c.country_Name.toLowerCase().startsWith(this.searchTextFieldCountry.toLowerCase()));
  }

  onSearchCompany(event: Event) {
    if (this.searchTextFieldCompany == '') {
      this.companyListFiltered = this.filteredCompanies;
    }
  }


  filterCompanies(event: Event) {
    this.companyListFiltered = this.filteredCompanies.filter((c:any) => c.company_Name.toLowerCase().startsWith(this.searchTextFieldCompany.toLowerCase()));
  }

  onSearchPeriod(event: Event) {
    if (this.searchTextFieldPeriod == '') {
      this.periodListFiltered = this.periodList;
    }
  }


  filterPeriods(event: Event) {
    this.periodListFiltered = this.periodList.filter((c: any) => c.displayed_Title.toLowerCase().startsWith(this.searchTextFieldPeriod.toLowerCase()));
  }

  onSearchTherapeuticCategory(event: Event) {
    if (this.searchTextFieldTherapeuticCategory == '') {
      this.therapeuticCategoryListFiltered = this.therapeuticCategoryList;
    }
  }


  filterTherapeuticCategorys(event: Event) {
    this.therapeuticCategoryListFiltered = this.therapeuticCategoryList.filter((c: any) => c.therapeuticCategory_Name.toLowerCase().startsWith(this.searchTextFieldTherapeuticCategory.toLowerCase()));
  }

  onCountrySelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedCountryIds = this.countryList.map(c => c.country_Id);
    }
    else {
      this.selectedCountryIds = [];
    }
  }

  onCompanySelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedCompanyIds = this.companyList.map(c => c.company_Id);
    }
    else {
      this.selectedCompanyIds = [];
    }
  }

  onTherapeuticCategorySelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedTherapeuticCategoryIds = this.therapeuticCategoryList.map(c => c.therapeuticCategory_Id);
    }
    else {
      this.selectedTherapeuticCategoryIds = [];
    }
  }

  onPeriodSelectAllChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedPeriodIds = this.periodList.map(c => c.period_Id);
    }
    else {
      this.selectedPeriodIds = [];
    }
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
    if (this.selectedCountryIds.length > 0 && this.countryListFiltered.length == this.selectedCountryIds.length) {
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
    if (this.selectedCompanyIds.length > 0 && this.companyListFiltered.length == this.selectedCompanyIds.length) {
      this.selectAllCompanyChecked = true;
    }
    else {
      this.selectAllCompanyChecked = false;
    }
  }

  onTherapeuticCategoryChange(event: any, therapeuticCategoryId: number) {
    if (event.checked) {
      this.selectedTherapeuticCategoryIds = [...this.selectedTherapeuticCategoryIds, therapeuticCategoryId];
    } else {
      this.selectedTherapeuticCategoryIds = this.selectedTherapeuticCategoryIds.filter(id => id !== therapeuticCategoryId);
    }

    this.therapeuticCategorySelectAllChecking();
  }

  therapeuticCategorySelectAllChecking() {
    if (this.selectedTherapeuticCategoryIds.length > 0 && this.therapeuticCategoryListFiltered.length == this.selectedTherapeuticCategoryIds.length) {
      this.selectAllTherapeuticCategoryChecked = true;
    }
    else {
      this.selectAllTherapeuticCategoryChecked = false;
    }
  }

  onPeriodChange(event: any, periodId: number) {
    if (event.checked) {
      this.selectedPeriodIds = [...this.selectedPeriodIds, periodId];
    } else {
      this.selectedPeriodIds = this.selectedPeriodIds.filter(id => id !== periodId);
    }

    this.periodSelectAllChecking();
  }

  periodSelectAllChecking() {
    if (this.selectedPeriodIds.length > 0 && this.periodListFiltered.length == this.selectedPeriodIds.length) {
      this.selectAllPeriodChecked = true;
    }
    else {
      this.selectAllPeriodChecked = false;
    }
  }


  SaveUserRights() {

    this.apiService.Update(addOrUpdateUserRights, this.getUserRightsData()).subscribe(data => {
      if (data && data.status) {
        this.toasterService.showSuccess(data.message);
        this.loadUserRights(this.selectedUser);
        //this.isEditMode = false;
      }
      else {
        this.toasterService.showError(data.message);
      }
    });
  }

  getUserRightsData() {
    this.userRights.companies = this.selectedCompanyIds.join(',');
    this.userRights.countries = this.selectedCountryIds.join(',');
    this.userRights.periods = this.selectedPeriodIds.join(',');
    this.userRights.therapeuticCategories = this.selectedTherapeuticCategoryIds.join(',');
    this.userRights.userID = this.selectedUser.id;
    return this.userRights;
  }

  setUserRightsData() {
    if (this.userRights && this.userRights.countries)
      this.selectedCountryIds = this.userRights.countries.split(',').map(Number);

    if (this.userRights && this.userRights.companies)
      this.selectedCompanyIds = this.userRights.companies.split(',').map(Number);

    if (this.userRights && this.userRights.periods)
      this.selectedPeriodIds = this.userRights.periods.split(',').map(Number);

    if (this.userRights && this.userRights.therapeuticCategories)
      this.selectedTherapeuticCategoryIds = this.userRights.therapeuticCategories.split(',').map(Number);

    this.countrySelectAllChecking();
    this.companySelectAllChecking();
    this.periodSelectAllChecking();
    this.therapeuticCategorySelectAllChecking();
  }

  loadUserAccessRights(user: User) {
    this.reset();
    this.countrySelectAllChecking();
    this.companySelectAllChecking();
    this.periodSelectAllChecking();
    this.therapeuticCategorySelectAllChecking();
    this.loadUserRights(user);
  }

  //InitializeDualBoxes() {
  //  this.loadCompany();
  //  this.loadCountry();
  //  this.loadPeriod();
  //  this.loadTherapeuticCategory();
  //}

  loadCompanyCountry() {
    this.apiService.GetAll(getAllCompanyCountry + "?user_id=" + this.currentUser.id).subscribe((response: ApiResponse) => {

      if (response.status) {
        this.companyCountries = response.result;
      } else {
        this.toasterService.showError(response.message);
      }
    });
  }

  get filteredCompanies() {
    if (this.selectedCountryIds.length === 0) {
      return this.companyList;
    }
    const companyIds = this.companyCountries
      .filter(cc => this.selectedCountryIds.includes(cc.country_Id))
      .map(cc => cc.company_Id);
    return this.companyList.filter(company => companyIds.includes(company.company_Id));
  }


  loadUserRights(user: User) {
    this.apiService.PostAll(getUserRights, { Id: user.id, Name: user.name }).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.userRights = response.result;
        this.setUserRightsData();
        //this.InitializeDualBoxes();
      } else {
        this.userRights = {} as UserRight;
        //this.InitializeDualBoxes();
      }
    });
  }

  loadCountry() {
    this.apiService.GetAll(getAdminCountries, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.countryList = response.result;
        this.countryListFiltered = response.result;
        //this.initCountryDualList();
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadCompany() {
    this.apiService.GetAll(getAdminCompanies, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.companyList = response.result;
        this.companyListFiltered = this.filteredCompanies;
        //this.initCompanyDualList();
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadTherapeuticCategory() {
    this.apiService.GetAll(getAdminTherapeuticCategories, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.therapeuticCategoryList = response.result;
        this.therapeuticCategoryListFiltered = response.result;
        //this.initTherapeuticCategoryDualList();
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadPeriod() {
    this.apiService.GetAll(getAdminPeriods, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.periodList = response.result;
        this.periodListFiltered = response.result;
        //this.initPeriodDualList();
      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  loadUsers() {
    this.apiService.GetAll(getAllUsers, true).subscribe((response: ApiResponse) => {
      if (response.status) {
        this.userList = response.result;

        if (this.userList && this.userList.length) {
          this.selectedUser = this.userList[0];
          this.loadUserRights(this.selectedUser);
        }

      } else {
        this.toasterService.showError(response.message);
      }

    });
  }

  //initCountryDualList() {
  //  this.sourceCountry = JSON.parse(JSON.stringify(this.countryList));
  //  this.previousCountryList = new Array<string>();
  //  this.confirmedCountry = new Array<any>();

  //  let country_Ids = this.userRights.countries!.split(',').map(Number);
  //  country_Ids.forEach(id => {
  //    let selCountry = this.countryList.filter(c => c.country_Id == id);
  //    if (selCountry.length) {
  //      this.previousCountryList.push(selCountry[0].country_Name);
  //      this.confirmedCountry.push(selCountry[0]);
  //    }
  //  });
  //}

  //initCompanyDualList() {
  //  this.sourceCompany = JSON.parse(JSON.stringify(this.companyList));

  //  this.previousCompanyList = new Array<string>();
  //  this.confirmedCompany = new Array<any>();

  //  let company_Ids = this.userRights.companies!.split(',').map(Number);
  //  company_Ids.forEach(id => {
  //    let selCompany = this.companyList.filter(c => c.company_Id == id);
  //    if (selCompany.length) {
  //      this.previousCompanyList.push(selCompany[0].company_Name);
  //      this.confirmedCompany.push(selCompany[0]);
  //    }
  //  });
  //}

  //initPeriodDualList() {
  //  this.sourcePeriod = JSON.parse(JSON.stringify(this.periodList));
  //  this.previousPeriodList = new Array<string>();
  //  this.confirmedPeriod = new Array<any>();

  //  let period_Ids = this.userRights.periods!.split(',').map(Number);
  //  period_Ids.forEach(id => {
  //    let selPeriod = this.periodList.filter(c => c.period_Id == id);
  //    if (selPeriod.length) {
  //      this.previousPeriodList.push(selPeriod[0].displayed_Title);
  //      this.confirmedPeriod.push(selPeriod[0]);
  //    }
  //  });

  //}

  //initTherapeuticCategoryDualList() {
  //  this.sourceTherapeuticCategory = JSON.parse(JSON.stringify(this.therapeuticCategoryList));

  //  this.previousTherapeuticCategoryList = new Array<string>();
  //  this.confirmedTherapeuticCategory = new Array<any>();

  //  let therapeuticCategory_Ids = this.userRights.therapeuticCategories!.split(',').map(Number);
  //  therapeuticCategory_Ids.forEach(id => {
  //    let therapeuticCategory = this.therapeuticCategoryList.filter(c => c.therapeuticCategory_Id == id);
  //    if (therapeuticCategory.length) {
  //      this.previousTherapeuticCategoryList.push(therapeuticCategory[0].therapeuticCategory_Name);
  //      this.confirmedTherapeuticCategory.push(therapeuticCategory[0]);
  //    }
  //  });

  //}

}
