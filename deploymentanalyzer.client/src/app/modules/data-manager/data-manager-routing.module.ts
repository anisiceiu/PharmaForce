import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataManagerComponent } from './data-manager.component';
import { DataManagerListComponent } from './data-manager-list/data-manager-list.component';
import { AuthGuard } from '../core/guards/auth.guard';



const routes: Routes = [
  {
    path: '', component: DataManagerListComponent,canActivate:[AuthGuard]
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
export class DataManagerRoutingModule {
  
 }
