import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: '', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule)}, 
  { path: '', loadChildren: () => import('./modules/core/core.module').then(m => m.CoreModule) },
  { path: 'data-manager', loadChildren: () => import('./modules/data-manager/data-manager.module').then(m => m.DataManagerModule) },
  { path: 'analytics', loadChildren: () => import('./modules/analytics/analytics.module').then(m => m.AnalyticsModule) },
  { path: 'company-profile', loadChildren: () => import('./modules/company-profile/company-profile.module').then(m => m.CompanyProfileModule) },
  { path: 'product-profile', loadChildren: () => import('./modules/product-profile/product-profile.module').then(m => m.ProductProfileModule) },
  { path: 'qc-queues', loadChildren: () => import('./modules/qc-queues/qc-queues.module').then(m => m.QcQueuesModule) },
  { path: '', loadChildren: () => import('./modules/master-data/master-data.module').then(m => m.MasterDataModule) },
  { path: 'master-code', loadChildren: () => import('./modules/master-code/master-code.module').then(m => m.MasterCodeModule) },
  { path: 'administrator', loadChildren: () => import('./modules/administrator/administrator.module').then(m => m.AdministratorModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
