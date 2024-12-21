export interface SalesforceData {
    daDatabase_Salesforce_Id: string;
    qCQ_Status:number;
    has_Citation:boolean;
    country_Name: string;
    company_Name: string;
    period_Year: number;
    period_Quarter: number;
    salesforce_Name: string;
    type_of_Salesforce: string;
    number_Of_Sales_Representatives: number;
    number_Of_District_Managers: number;
    number_Of_Regional_Managers: number;
    salary_Low: number;
    salary_High: number;
    target_Bonus: number;
    reach: number;
    frequency: number;
    additional_Notes_Salesforce: string;
    pct_Split_Between_Primary_Care_And_Specialty: number;
    daDatabase_Product_Id: string;
    uS_Product_Name_Product_Promoted: string;
    country_Specific_Product_Name_Product_Promoted: string;
    generic_Name: string;
    therapeutic_Category: string;
    product_Promotion_Priority_Order: number;
    total_Number_of_Full_Time_Equivalents_FTEs: number;
    primary_Care_Full_Time_Equivalents_FTEs: number;
    specialty_Full_Time_Equivalents_FTEs: number;
    physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: string;
    specialty_Physicians_Targeted: string;
    co_Promotion_YesNo: boolean;
    name_of_a_Partner_Company: string;
    contract_Sales_Force_YesNo: boolean;
    name_of_a_CSO_Contract_Sales_Organization: string;
    additional_Notes_Product: string;
    region_Name: string;
    product_id: number;
    column_names: string;
    citations_text: string;
    hasAsterisk: { [key: string]: boolean };
    citationValue: { [key: string]: string };
    isEdit: boolean;
}


export interface IdNamePair {
    id:number;
    name: string;
}

export interface dropdowncollection {
  country_Name: IdNamePair[];
  company_Name: IdNamePair[];
  salesForce_Name: IdNamePair[];
  period_Year: IdNamePair[];
  type_of_salesforce: IdNamePair[];
  physician_Focus: IdNamePair[];
  us_Brand_Name: IdNamePair[];
  country_Specific_Product: IdNamePair[];
  generic_Name: IdNamePair[];
  therapeutic_Category: IdNamePair[];
  name_of_cso: IdNamePair[];
  physician_Targeted: IdNamePair[];
  period: IdNamePair[];
}
