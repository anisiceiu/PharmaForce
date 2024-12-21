import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CompanyProfileComponent } from './company-profile.component';
import { SharedModule } from '../shared/shared.module';
import { CompanyProfileListComponent } from './company-profile-list/company-profile-list.component';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';
import { CompanyProfileDetailComponent } from './company-profile-detail/company-profile-detail.component';
import { NumberFormatPipe } from '../../services/common/number-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    SharedModule
  ],
  declarations: [CompanyProfileComponent,
    CompanyProfileDetailComponent,
    CompanyProfileListComponent,
    NumberFormatPipe],
})
export class CompanyProfileModule { } 
