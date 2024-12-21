export interface CustomerDropdownModel {
  period_year: number;
  period_quarter: number;
  country_name: string;
  company_name: string;
  salesforcename_id: number;
  salesforce_name: string;
  us_product_name_product_promoted: string;
  generic_name: string;
  therapeutic_category: string;
}
export interface CustomerDropdownGroupModel {
  periods: Array<CustomerDropdownModel>;
  countries: Array<CustomerDropdownModel>;
  companies: Array<CustomerDropdownModel>;
  therapeutic_categories: Array<CustomerDropdownModel>;
  brands: Array<CustomerDropdownModel>;
  brands1: Array<CustomerDropdownModel>;
  brands2: Array<CustomerDropdownModel>;
  brands3: Array<CustomerDropdownModel>;
  brands4: Array<CustomerDropdownModel>;
  brands5: Array<CustomerDropdownModel>;
  genericnames: Array<CustomerDropdownModel>;
  genericnames1: Array<CustomerDropdownModel>;
  genericnames2: Array<CustomerDropdownModel>;
  genericnames3: Array<CustomerDropdownModel>;
  genericnames4: Array<CustomerDropdownModel>;
  genericnames5: Array<CustomerDropdownModel>;
  salesforces: Array<CustomerDropdownModel>;
  salesforces1: Array<CustomerDropdownModel>;
  salesforces2: Array<CustomerDropdownModel>;
  salesforces3: Array<CustomerDropdownModel>;
  salesforces4: Array<CustomerDropdownModel>;
  salesforces5: Array<CustomerDropdownModel>;
}
