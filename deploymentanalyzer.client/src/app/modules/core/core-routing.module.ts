import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { CompanyComponent } from '../master-data/company/company.component';
import { CitationComponent } from '../master-data/citations/citations.component';
import { MasterCodeComponent } from '../master-data/master-code/master-code.component';
import { ManageAdminAccessRightsComponent } from './manage-admin-access-rights/manage-admin-access-rights.component';
import { ManageAdminAccountsComponent } from './manage-admin-accounts/manage-admin-accounts.component';
import { NewsManagementComponent } from '../master-data/news-management/newsmanagement.component';
import { CitationManagerComponent } from '../master-data/citation-manager/citationmanager.component';
import { UnlockUsersComponent } from './unlock-users/unlock-users.component';
import { ExpirationDateComponent } from './expiration-date/expiration-date.component';
import { UserEmailSuffixManagementComponent } from './user-email-suffix-management/user-email-suffix-management.component';
import { ManageUserAccessRightsComponent } from './manage-user-access-rights/manage-user-access-rights.component'; 
import { ManageClientsComponent } from './manage-clients/manage-clients.component';
import { CommingSoonComponent } from './comming-soon/comming-soon.component';
import { AdminActivityLogComponent } from '../administrator/admin-activity-log/admin-activity-log.component';
import { UserLoginDetailComponent } from './user-login-detail/user-login-detail.component'; 
import { ClientsComponent } from '../administrator/clients/clients.component';
import { CountryManagementComponent } from '../master-data/country-management/country-management.component';
import { PeriodManagementComponent } from '../master-data/period-management/period-management.component';
import { NotesComponent } from '../master-data/notes/notes.component';
import { KeyUpdateManagementComponent } from '../master-data/key-update-management/key-update-management.component';
import { CompanyProfileDetailComponent } from '../company-profile/company-profile-detail/company-profile-detail.component';
import { CompensationListComponent } from './compensation-list/compensation-list.component';
import { CallPlanningComponent } from './call-planning/call-planning.component';
import { BrandGroupComponent } from './brand-group/brand-group.component';
import { ProductProfileDetailComponent } from '../product-profile/product-profile-detail/product-profile-detail.component';
import { QcQueueHistoryComponent } from '../qc-queues/qc-queue-history/qc-queue-history.component';
import { NewsHistoryComponent } from '../master-data/news-history/news-history.component';
import { KeyUpdateHistoryComponent } from '../master-data/key-update-history/key-update-history.component';
import { CompanyUpdateComponent } from '../master-data/company-update/company-update.component';
import { UserRestrictedEmailSuffixManagementComponent } from './user-restricted-email-suffix-management/user-restricted-email-suffix-management.component';
import { NewsDetailsComponent } from '../master-data/news-details/news-details.component';
import { EventEmailConfigComponent } from '../master-data/event-email-config/event-email-config.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'data-manager',
        loadChildren: () =>
          import('../data-manager/data-manager.module').then(
            (m) => m.DataManagerModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'company-profile',
        loadChildren: () =>
          import('../company-profile/company-profile.module').then(
            (m) => m.CompanyProfileModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'product-profile',
        loadChildren: () =>
          import('../product-profile/product-profile.module').then(
            (m) => m.ProductProfileModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('../analytics/analytics.module').then(
            (m) => m.AnalyticsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'country',
        component: CountryManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'event-email-config',
        component: EventEmailConfigComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'period',
        component: PeriodManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'qc-queue',
        loadChildren: () =>
          import('../qc-queues/qc-queues.module').then(
            (m) => m.QcQueuesModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'company-detail/:company_Id/:guid',
        component: CompanyProfileDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'product-detail/:product_Id/:guid',
        component: ProductProfileDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'citations',
        component: CitationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'citation-manager',
        component: CitationManagerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'master-code',
        component: MasterCodeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'recent-news',
        component: NewsManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'news-detail/:news_id',
        component: NewsDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'key-updates',
        component: KeyUpdateManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'news-history', component: NewsHistoryComponent, canActivate: [AuthGuard]
      },
      {
        path: 'key-update-history', component: KeyUpdateHistoryComponent, canActivate: [AuthGuard]
      },
      {
        path: 'company-update', component: CompanyUpdateComponent, canActivate: [AuthGuard]
      },
      {
        path: 'manage-admin-accounts',
        component: ManageAdminAccountsComponent,
        canActivate: [AuthGuard],
      }, 
      {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-admin-access-rights',
        component: ManageAdminAccessRightsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'unlock-users',
        component: UnlockUsersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'expiration-date',
        component: ExpirationDateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-email-suffix-management',
        component: UserEmailSuffixManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-restricted-email-suffix-management',
        component: UserRestrictedEmailSuffixManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-user-access-rights',
        component: ManageUserAccessRightsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-clients',
        component: ManageClientsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'impersonation/:storage_id',
        component: ManageClientsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'comming-soon',
        component: CommingSoonComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin-activity-log',
        component: AdminActivityLogComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-login-detail',
        component: UserLoginDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'notes',
        component: NotesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'compensations',
        component: CompensationListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'call-planning',
        component: CallPlanningComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'brand-groups',
        component: BrandGroupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'qc-queue-history',
        component: QcQueueHistoryComponent,
        loadChildren: () =>
          import('../qc-queues/qc-queues.module').then(
            (m) => m.QcQueuesModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'master-code',
        loadChildren: () =>
          import('../master-code/master-code.module').then(
            (m) => m.MasterCodeModule
          ),
        canActivate: [AuthGuard],
      },
    ],

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
