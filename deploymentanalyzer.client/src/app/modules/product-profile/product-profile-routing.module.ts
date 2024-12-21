import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductProfileListComponent } from './product-profile-list/product-profile-list.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { ProductProfileDetailComponent } from './product-profile-detail/product-profile-detail.component';

const routes: Routes = [
  {
    path: '', component: ProductProfileListComponent,canActivate:[AuthGuard]
  },
  {
    path: 'product-detail/:product_Id/:guid', component: ProductProfileDetailComponent,canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductProfileRoutingModule { }
