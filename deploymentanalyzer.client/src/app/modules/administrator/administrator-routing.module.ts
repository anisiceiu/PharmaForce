import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministratorComponent } from './administrator.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { ManageAdminAccessRightsComponent } from '../core/manage-admin-access-rights/manage-admin-access-rights.component';
import { ManageAdminAccountsComponent } from '../core/manage-admin-accounts/manage-admin-accounts.component';
import { AdminActivityLogComponent } from './admin-activity-log/admin-activity-log.component';
import { ClientsComponent } from './clients/clients.component';

const routes: Routes = [
  {
    path: '',
    component: AdministratorComponent,
    children: [
      {
        path: 'user',
        component: UserComponent,
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
        path: 'manage-admin-accounts',
        component: ManageAdminAccountsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'admin-activity-log',
        component: AdminActivityLogComponent,
        canActivate: [AuthGuard],
      },
    ]
  },
 
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
