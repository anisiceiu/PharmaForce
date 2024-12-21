import { MatTableDataSource } from "@angular/material/table";

export interface qcqueues {
  id: number;
  daDatabase_Salesforce_id: string;
  daDatabase_Product_id: string;
  column_Name: string;
  approval_code: string;
  date_Added: Date;
  message: string;
  reviewed_by: string;
  reviewed_dt: Date;
  approved_by: string;
  approved_dt: Date;
  rejected_by: string;
  rejected_dt: Date;
  country: string;
  company_name: string;
  period_year: number;
  period_quarter: number;
  salesforce_name: string;
  product_promoted: string;
  previous_value: string;
  added_by: string;
  qcq_note: string;
  childRecords: qcqueuesChildRecord[] | MatTableDataSource<qcqueuesChildRecord>;
  changedColumns: string[];
}

export interface qcqueuesChildRecord {
  daDatabase_Product_id: string;
  column_Name: string;
  message: string;//new_value
  previous_value: string;
  date_Added: Date;
  added_by: string;
  qcq_note: string;
}
