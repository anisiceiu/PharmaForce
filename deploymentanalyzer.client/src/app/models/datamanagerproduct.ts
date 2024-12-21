export interface DataManagerProduct {
  daDatabase_Product_Id: string;
  daDatabase_Salesforce_Id: string;
  uS_Product_Name_Product_Promoted: string;
  country_Specific_Product_Name_Product_Promoted: string;
  generic_Name: string;
  therapeutic_Category: string;
  product_Promotion_Priority_Order: number | null;
  total_Number_of_Full_Time_Equivalents_FTEs: number | null;
  primary_Care_Full_Time_Equivalents_FTEs: number | null;
  specialty_Full_Time_Equivalents_FTEs: number | null;
  physicians_Focus_Primary_Care_Physicians_Specialty_Physicians: string;
  specialty_Physicians_Targeted: string;
  co_Promotion_YesNo: boolean | null;
  name_of_a_Partner_Company: string;
  contract_Sales_Force_YesNo: boolean | null;
  name_of_a_CSO_Contract_Sales_Organization: string;
  additional_Notes_Product: string;

  uS_Product_Name_Product_Promoted_qcq: string | null;
  country_Specific_Product_Name_Product_Promoted_qcq: string | null;
  generic_Name_qcq: string | null;
  therapeutic_Category_qcq: string | null;
  product_Promotion_Priority_Order_qcq: string | null;
  total_Number_of_Full_Time_Equivalents_FTEs_qcq: string | null;
  primary_Care_Full_Time_Equivalents_FTEs_qcq: string | null;
  specialty_Full_Time_Equivalents_FTEs_qcq: string | null;
  physicians_Focus_Primary_Care_Physicians_Specialty_Physicians_qcq: string | null;
  specialty_Physicians_Targeted_qcq: string | null;
  co_Promotion_YesNo_qcq: string | null;
  name_of_a_Partner_Company_qcq: string | null;
  contract_Sales_Force_YesNo_qcq: string | null;
  name_of_a_CSO_Contract_Sales_Organization_qcq: string | null;
}
