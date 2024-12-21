import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsDataComponent } from './analytics-data/analytics-data.component';


const routes: Routes = [
  {
    path: '', component: AnalyticsDataComponent
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
export class AnalyticsRoutingModule {
  
 }
