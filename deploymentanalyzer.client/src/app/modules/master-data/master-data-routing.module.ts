import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { CompanyComponent } from './company/company.component';
import { CitationComponent } from './citations/citations.component';
import { MasterCodeComponent } from './master-code/master-code.component';
import { NewsManagementComponent } from './news-management/newsmanagement.component';
import { KeyUpdateManagementComponent } from './key-update-management/key-update-management.component';
import { NewsHistoryComponent } from './news-history/news-history.component';
import { KeyUpdateHistoryComponent } from './key-update-history/key-update-history.component';
import { CompanyUpdateComponent } from './company-update/company-update.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { EventEmailConfigComponent } from './event-email-config/event-email-config.component';



const routes: Routes = [
  {
    path: '', component: CompanyComponent,canActivate:[AuthGuard]
  }, 
  {
    path: 'citations', component: CitationComponent,canActivate:[AuthGuard]
  },
  {
    path: 'old-master-code', component: MasterCodeComponent,canActivate:[AuthGuard]
  },
  {
    path: 'recent-news', component: NewsManagementComponent,canActivate:[AuthGuard]
  },
  {
    path: 'event-email-config', component: EventEmailConfigComponent, canActivate: [AuthGuard]
  },
  {
    path: 'news-detail/:news_id',
    component: NewsDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'key-updates', component: KeyUpdateManagementComponent,canActivate:[AuthGuard]
  },
  {
    path: 'news-history', component: NewsHistoryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'key-update-history', component: KeyUpdateHistoryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'company-update', component: CompanyUpdateComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MasterDataRoutingModule {
  
 }
