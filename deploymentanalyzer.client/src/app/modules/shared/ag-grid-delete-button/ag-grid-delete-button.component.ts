import { Component } from '@angular/core';
import { AgGridAngular, ICellRendererAngularComp } from "ag-grid-angular";
import {
  ColDef,
  ICellRendererParams,
  ValueGetterParams,
} from "ag-grid-community";

@Component({
  selector: 'app-ag-grid-delete-button',
  templateUrl: './ag-grid-delete-button.component.html',
  styleUrl: './ag-grid-delete-button.component.css'
})
export class AgGridDeleteButtonComponent implements ICellRendererAngularComp {
  item: any;
  onClick: any;
  agInit(params: ICellRendererParams): void {
    this.item = params.value.item;
    this.onClick = params.value.onClick;
  }
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    console.log(this.item);
    this.onClick(this.item);
  }

}
