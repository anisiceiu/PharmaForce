export interface CompanyProfileTopInfo {
  company_name: string;
  headquarters: string;
  type_of_entity: string;
  number_of_employees: number;
  sales: number;
  primary_care_deployment: number;
  speciality_deployment: number;
  total_deployment: number;
}

export interface CompanyUpdateInfo
{
  year: number;
  month_number: number;
  month_name: string;
  country_name: string;
  company_name: string;
  cnt: number;
  countryList: CompanyUpdateInfo[];
  companyList: CompanyUpdateInfo[];
}
export interface CountryGroup {
  country_name: string;
  company_list: companyInfo[];
}
export interface YearGroup {
  year: number;
  country_list: CountryGroup[];
}
export interface companyInfo {
  company_name: string;
  month: string;
}
