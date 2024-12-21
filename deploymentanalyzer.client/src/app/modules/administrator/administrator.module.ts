import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { AdministratorComponent } from './administrator.component';
import { UserComponent } from './user/user.component';
import { SharedModule } from '../shared/shared.module';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminActivityLogComponent } from './admin-activity-log/admin-activity-log.component';
import { ClientsComponent } from './clients/clients.component';


@NgModule({
  declarations: [
    AdministratorComponent,
    UserComponent,
    AdminPanelComponent,
    AdminActivityLogComponent,
    ClientsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    AdministratorRoutingModule
  ]
})
export class AdministratorModule { }
