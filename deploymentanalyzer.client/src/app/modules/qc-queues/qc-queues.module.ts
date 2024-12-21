import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QcQueuesComponent } from './qc-queues.component';
import { QcQueuesRoutingModule } from './qc-queues-routing.module';
import { SharedModule } from '../shared/shared.module';
import { QcQueueListComponent } from './qc-queue-list/qc-queue-list.component';
import { QcQueueHistoryComponent } from './qc-queue-history/qc-queue-history.component';

@NgModule({
  imports: [
    CommonModule,
    QcQueuesRoutingModule,
    SharedModule
  ],
  declarations: [QcQueuesComponent,QcQueueListComponent, QcQueueHistoryComponent]
})
export class QcQueuesModule { }
