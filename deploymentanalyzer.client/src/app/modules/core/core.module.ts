import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CoreRoutingModule } from './core-routing.module';
import { HeaderComponent } from './header/header.component';
import { ApiService } from '../../services/Api/api.service';
import { ManageAdminAccountsComponent } from './manage-admin-accounts/manage-admin-accounts.component';
import { ManageAdminAccessRightsComponent } from './manage-admin-access-rights/manage-admin-access-rights.component';
import { UnlockUsersComponent } from './unlock-users/unlock-users.component';
import { UserEmailSuffixManagementComponent } from './user-email-suffix-management/user-email-suffix-management.component';
import { ExpirationDateComponent } from './expiration-date/expiration-date.component';
import { ManageUserAccessRightsComponent } from './manage-user-access-rights/manage-user-access-rights.component';
import { DualListBoxComponent } from './manage-user-access-rights/dual-list-box/dual-list-box.component';
import { ManageClientsComponent } from './manage-clients/manage-clients.component';
import { CommingSoonComponent } from './comming-soon/comming-soon.component';
import { AdminLoginComponent } from '../account/admin-login/admin-login.component';
import { VerfyOtpComponent } from '../account/verfy-otp/verfy-otp.component';
import { UserLoginDetailComponent } from './user-login-detail/user-login-detail.component'; 
import { KeyUpdateManagementComponent } from '../master-data/key-update-management/key-update-management.component';
import { CompensationListComponent } from './compensation-list/compensation-list.component';
import { CallPlanningComponent } from './call-planning/call-planning.component';
import { BrandGroupComponent } from './brand-group/brand-group.component';
import { UserRestrictedEmailSuffixManagementComponent } from './user-restricted-email-suffix-management/user-restricted-email-suffix-management.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreRoutingModule
  ],
  declarations: [CoreComponent, DashboardComponent, HeaderComponent, ManageAdminAccountsComponent, ManageAdminAccessRightsComponent, UnlockUsersComponent, UserEmailSuffixManagementComponent, ExpirationDateComponent, ManageUserAccessRightsComponent, DualListBoxComponent, ManageClientsComponent, CommingSoonComponent, AdminLoginComponent, VerfyOtpComponent, UserLoginDetailComponent, CompensationListComponent, CallPlanningComponent, BrandGroupComponent, UserRestrictedEmailSuffixManagementComponent],
  providers: [ApiService]
})
export class CoreModule { }
