import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManagerComponent } from './data-manager.component';
import { DataManagerRoutingModule } from './data-manager-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DataManagerListComponent } from './data-manager-list/data-manager-list.component';

@NgModule({
  imports: [
    CommonModule,
    DataManagerRoutingModule,
    SharedModule
  ],
  declarations: [DataManagerComponent,DataManagerListComponent]
})
export class DataManagerModule { }
