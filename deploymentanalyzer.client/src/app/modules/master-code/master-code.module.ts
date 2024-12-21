import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterCodeRoutingModule } from './master-code-routing.module';
import { CountryMasterCodeComponent } from './country-master-code/country-master-code.component';
import { CompanyMasterCodeComponent } from './company-master-code/company-master-code.component';
import { SalesforceNameMasterCodeComponent } from './salesforce-name-master-code/salesforce-name-master-code.component';
import { SalesforceTypeMasterCodeComponent } from './salesforce-type-master-code/salesforce-type-master-code.component';
import { GenericNameMasterCodeComponent } from './generic-name-master-code/generic-name-master-code.component';
import { BrandNameMasterCodeComponent } from './brand-name-master-code/brand-name-master-code.component';
import { TherapeuticCategoryMasterCodeComponent } from './therapeutic-category-master-code/therapeutic-category-master-code.component';
import { PhysicianSpecialtyMasterCodeComponent } from './physician-specialty-master-code/physician-specialty-master-code.component';
import { PhysicianFocusMasterCodeComponent } from './physician-focus-master-code/physician-focus-master-code.component';
import { ContractSalesOrgMasterCodeComponent } from './contract-sales-org-master-code/contract-sales-org-master-code.component';
import { PeriodMasterCodeComponent } from './period-master-code/period-master-code.component';
import { SharedModule } from '../shared/shared.module';
import { MasterCodeComponent } from './master-code.component';


@NgModule({
  declarations: [
    CountryMasterCodeComponent,
    CompanyMasterCodeComponent,
    SalesforceNameMasterCodeComponent,
    SalesforceTypeMasterCodeComponent,
    GenericNameMasterCodeComponent,
    BrandNameMasterCodeComponent,
    TherapeuticCategoryMasterCodeComponent,
    PhysicianSpecialtyMasterCodeComponent,
    PhysicianFocusMasterCodeComponent,
    ContractSalesOrgMasterCodeComponent,
    PeriodMasterCodeComponent,
    MasterCodeComponent,
  ],
  imports: [
    CommonModule,
    MasterCodeRoutingModule,
    SharedModule
  ]
})
export class MasterCodeModule { }
