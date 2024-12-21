export interface CompanyCountryAnalysisParams {
  company_id: number;
  countries: string;
  periods: string;
  user_id: number;
}

export interface CompanyDeploymentByCountryPCAndSpecialtyParams {
  companies: string;
  countries: string;
  period_id: number;
  user_id: number;
}

export interface TotalCompanyDeploymentByCountryAndTCParams {
  companies: string;
  countries: string;
  period_id: number;
  therapeutic_category_id: number;
  user_id: number;
}

export interface CompanyPortfolioByTCAndSalesForceParams {
  companies: string;
  country_id: number;
  period_id: number;
  therapeutic_category_id: number;
  user_id: number;
}

export interface ProductFTEsByTCAndSalesForceUsingBrandNameParams {
  companies: string;
  brands: string;
  country_id: number;
  period_id: number;
  therapeutic_category_id: number;
  user_id: number;
  brandgroups: string | null;
}

export interface ProductFTEsByTCAndSalesForceUsingGenericNameParams {
  companies: string;
  generic_names: string;
  country_id: number;
  period_id: number;
  therapeutic_category_id: number;
  user_id: number;
}

export interface SalesRepresentativeCompensationBySalesForceAndProductParams {
  companies: string;
  brands: string;
  salesforces: string;
  country_id: number;
  period_id: number;
  therapeutic_category_id: number;
  user_id: number;
}

export interface ReachAndFrequencyBySalesForceAndProductParams {
  companies: string;
  brands: string;
  salesforces: string;
  country_id: number;
  period_id: number;
  therapeutic_category_id: number;
  user_id: number;
}
