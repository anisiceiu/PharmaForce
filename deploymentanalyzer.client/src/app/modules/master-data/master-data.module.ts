import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataComponent } from './master-data.component';
import { MasterDataRoutingModule } from './master-data-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CompanyComponent } from './company/company.component';
import { CitationComponent } from './citations/citations.component';
import { MasterCodeComponent } from './master-code/master-code.component';
import { NewsManagementComponent } from './news-management/newsmanagement.component';
import { CitationManagerComponent } from './citation-manager/citationmanager.component';
import { PeriodManagementComponent } from './period-management/period-management.component';
import { CountryManagementComponent } from './country-management/country-management.component';
import { KeyUpdateManagementComponent } from './key-update-management/key-update-management.component';
import { NewsHistoryComponent } from './news-history/news-history.component';
import { KeyUpdateHistoryComponent } from './key-update-history/key-update-history.component';
import { CompanyUpdateComponent } from './company-update/company-update.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { EventEmailConfigComponent } from './event-email-config/event-email-config.component';




@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MasterDataRoutingModule,
  ],
  declarations: [
    MasterDataComponent,
    CompanyComponent,
    CitationComponent,
    MasterCodeComponent,
    NewsManagementComponent,
    PeriodManagementComponent,
    CountryManagementComponent,
    CitationManagerComponent,
    KeyUpdateManagementComponent,
    NewsHistoryComponent,
    KeyUpdateHistoryComponent,
    CompanyUpdateComponent,
    NewsDetailsComponent,
    EventEmailConfigComponent

  ]
})
export class MasterDataModule { }
