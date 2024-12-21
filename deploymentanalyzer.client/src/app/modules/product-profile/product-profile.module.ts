import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductProfileRoutingModule } from './product-profile-routing.module';
import { ProductProfileListComponent } from './product-profile-list/product-profile-list.component';
import { SharedModule } from '../shared/shared.module';
import { ProductProfileDetailComponent } from './product-profile-detail/product-profile-detail.component';


@NgModule({
  declarations: [
    ProductProfileListComponent,
    ProductProfileDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductProfileRoutingModule
  ]
})
export class ProductProfileModule { }
