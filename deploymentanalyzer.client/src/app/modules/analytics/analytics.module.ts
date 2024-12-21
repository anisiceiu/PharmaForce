import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsDataComponent } from './analytics-data/analytics-data.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    SharedModule
  ],
  declarations: [AnalyticsComponent,AnalyticsDataComponent]
})
export class AnalyticsModule { }
