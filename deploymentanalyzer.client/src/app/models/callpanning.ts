export interface CallPlanning {
  company_id: number;
  company_name: string;
  product_id: number;
  product_name: string;
  salesforcename_id: number;
  salesforcename_name: string;
  employee_type: string;
  hspc: number;
  pc: number;
  sp: number;
  calls_per_quarter: number;
  products: productInfoPCSP[] | null;
  period: string;
  country: string;
  pc_vs_sp: string;
}

export interface productInfoPCSP {
  name: string;
  pc: number;
  sp: number;
  total: number;
}
