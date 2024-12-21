export interface CompanyCountryAnalysisGridData {
  country_id: number;
  country_name: string;
  period_id: number;
  period_name: string;
  year: number;
  quarter: number;
  salesforcename_id: number;
  salesforcename_name: string;
  physicianfocus_id: number;
  physicianfocus_name: string;
  product_id: number;
  product_name: string;
  salesforce_size: number;
  pc: number;
  sp: number;
  total: number;
  products: productInfoPCSP[] | null;
  company: string;
  column_names: string;
  citations_text: string;
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}

export interface CompanyCountryAnalysisChartData {
  country_id: number;
  country_name: string;
  period_id: number;
  period_name: string;
  year: number;
  quarter: number;
  therapeuticcategory_id: number;
  therapeuticcategory_name: string;
  salesforcename_id: number;
  salesforcename_name: string;
  physicianfocus_id: number;
  physicianfocus_name: string;
  product_id: number;
  product_name: string;
  salesforce_size: number;
  pc_product: number;
  sp_product: number;
  total_therapeuticategory: number;
  total_salesforce: number;
  sp_salesforce: number;
  pc_salesforce: number;
}

export interface ReachAndFrequencyBySalesForceAndProductGridData {
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
  column_names: string;
  citations_text: string;
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}

export interface ReachAndFrequencyBySalesForceAndProductChartData {
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
  totalFrequency: number;
  totalReach: number;
}

export interface SalesRepresentativeCompensationBySalesForceAndProductGridData {
  company_id: number;
  company_name: string;
  product_id: number;
  product_name: string;
  salesforcename_id: number;
  salesforcename_name: string;
  employee_type: string;
  salary_low: number;
  salary_high: number;
  target_bonus: number;
  country: string;
  period: string;
  column_names: string;
  citations_text: string;
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}

export interface SalesRepresentativeCompensationBySalesForceAndProductChartData {
  company_id: number;
  company_name: string;
  product_id: number;
  product_name: string;
  salesforcename_id: number;
  salesforcename_name: string;
  employee_type: string;
  salary_low: number;
  salary_high: number;
  target_bonus: number;
  products: productInfoSales[];
}

export interface ProductFTEsByTCAndSalesForceUsingGenericNameGridData {
  company_id: number;
  company_name: string;
  genericname_id: number;
  genericname_name: string;
  salesforcename_id: number;
  salesforcename_name: string;
  pc: number;
  sp: number;
  total: number;
  products: productInfoPCSP[] | null;
  period: string;
  country: string;
  focused: string;
  column_names: string;
  citations_text: string;
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}
export interface ProductFTEsByTCAndSalesForceUsingGenericNameChartData {
  company_id: number;
  company_name: string;
  genericname_id: number;
  genericname_name: string;
  salesforcename_id: number;
  salesforcename_name: string;
  pc: number;
  sp: number;
  total: number;
}

export interface ProductFTEsByTCAndSalesForceUsingBrandNameGridData {
  company_id: number;
  company_name: string;
  product_id: number;
  product_name: string;
  salesforcename_id: number;
  salesforcename_name: string;
  pc: number;
  sp: number;
  total: number;
  products: productInfoPCSP[] | null;
  period: string;
  country: string;
  focused: string;
  column_names: string;
  citations_text: string;
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}

export interface ProductFTEsByTCAndSalesForceUsingBrandNameChartData {
  company_id: number;
  company_name: string;
  product_id: number;
  product_name: string;
  salesforcename_id: number;
  salesforcename_name: string;
  pc: number;
  sp: number;
  total: number;
}

export interface productInfoSales {
  name: string;
  salary_low: number;
  salary_high: number;
  target_bonus: number;
}

export interface productInfoPCSP {
  name: string;
  pc: number;
  sp: number;
  total: number;
}
export interface CompanyPortfolioByTCAndSalesForceGridData {
  company_id: number;
  company_name: string;
  therapeuticcategory_id: number;
  therapeuticcategory_name: string;
  product_id: number;
  product_name: string;
  pc: number;
  sp: number;
  total: number;
  products: productInfoPCSP[] | null;
  country: string;
  period: string;
  column_names: string;
  citations_text: string;
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}

export interface CompanyPortfolioByTCAndSalesForceChartData {
  company_id: number;
  company_name: string;
  therapeuticcategory_id: number;
  therapeuticcategory_name: string;
  product_id: number;
  product_name: string;
  pc: number;
  sp: number;
  total: number;
}

export interface TotalCompanyDeploymentByCountryAndTCGridData {
  company_id: number;
  company_name: string;
  country_id: number;
  country_name: string;
  therapeuticcategory_id: number;
  therapeuticcategory_name: string;
  pc: number;
  sp: number;
  total: number;
  period: string;
  column_names: string;
  citations_text: string;
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}

export interface TotalCompanyDeploymentByCountryAndTCChartData {
  company_id: number;
  company_name: string;
  country_id: number;
  country_name: string;
  therapeuticcategory_id: number;
  therapeuticcategory_name: string;
  pc: number;
  sp: number;
  total: number;
}

export interface CompanyDeploymentByCountryPCAndSpecialtyGridData {
  company_id: number;
  company_name: string;
  country_id: number;
  country_name: string;
  pc: number;
  sp: number;
  total: number;
  period: string;
  column_names: string;
  citations_text: string;
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}
export interface CompanyDeploymentByCountryPCAndSpecialtyChartData {
  company_id: number;
  company_name: string;
  country_id: number;
  country_name: string;
  pc: number;
  sp: number;
  total: number;
}

export interface FilteredTotalCompanyDeploymentByCountryAndTCGridData {
  therapeuticcategory_name: string, 
  period: string, 
  data: number[],
  hasAsterisk: { [key: string]: boolean };
  citationValue: { [key: string]: string };
}
