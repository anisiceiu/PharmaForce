import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../core/guards/auth.guard";
import { CompanyProfileListComponent } from "./company-profile-list/company-profile-list.component";
import { CompanyProfileDetailComponent } from "./company-profile-detail/company-profile-detail.component";

const routes: Routes = [
    {
      path: '', component: CompanyProfileListComponent,canActivate:[AuthGuard]
    },
    {
      path: 'company-detail/:company_Id/:guid', component: CompanyProfileDetailComponent,canActivate:[AuthGuard]
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
  export class CompanyProfileRoutingModule {
    
   }
