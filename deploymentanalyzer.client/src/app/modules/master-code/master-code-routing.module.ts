import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyMasterCodeComponent } from './company-master-code/company-master-code.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { CountryMasterCodeComponent } from './country-master-code/country-master-code.component';
import { SalesforceNameMasterCodeComponent } from './salesforce-name-master-code/salesforce-name-master-code.component';
import { SalesforceTypeMasterCodeComponent } from './salesforce-type-master-code/salesforce-type-master-code.component';
import { GenericNameMasterCodeComponent } from './generic-name-master-code/generic-name-master-code.component';
import { BrandNameMasterCodeComponent } from './brand-name-master-code/brand-name-master-code.component';
import { TherapeuticCategoryMasterCodeComponent } from './therapeutic-category-master-code/therapeutic-category-master-code.component';
import { PhysicianSpecialtyMasterCodeComponent } from './physician-specialty-master-code/physician-specialty-master-code.component';
import { PhysicianFocusMasterCodeComponent } from './physician-focus-master-code/physician-focus-master-code.component';
import { ContractSalesOrgMasterCodeComponent } from './contract-sales-org-master-code/contract-sales-org-master-code.component';
import { PeriodMasterCodeComponent } from './period-master-code/period-master-code.component';

const routes: Routes = [
  {
    path: 'company', component: CompanyMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'country', component: CountryMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'salesforce', component: SalesforceNameMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'salesforce-type', component: SalesforceTypeMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'generic-name', component: GenericNameMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'brand-name', component: BrandNameMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'therapeutic-category', component: TherapeuticCategoryMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'physician-specialty', component: PhysicianSpecialtyMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'physician-focus', component: PhysicianFocusMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'contract-sales-org', component: ContractSalesOrgMasterCodeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'period', component: PeriodMasterCodeComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterCodeRoutingModule { }
