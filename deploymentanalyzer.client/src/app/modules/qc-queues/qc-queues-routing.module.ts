import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { QcQueueListComponent } from './qc-queue-list/qc-queue-list.component';



const routes: Routes = [
  {
    path: '', component: QcQueueListComponent,canActivate:[AuthGuard]
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
export class QcQueuesRoutingModule {
  
 }
