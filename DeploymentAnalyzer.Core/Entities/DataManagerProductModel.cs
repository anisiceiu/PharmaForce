namespace DeploymentAnalyzer.Core.Entities
{
    public class DataManagerProductModel
    {
        public string DADatabase_Product_Id { get; set; } = string.Empty;
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string US_Product_Name_Product_Promoted { get; set; } = string.Empty;
        public string? Country_Specific_Product_Name_Product_Promoted { get; set; }
        public string Generic_Name { get; set; } = string.Empty;
        public string Therapeutic_Category { get; set; } = string.Empty;
        public int? Product_Promotion_Priority_Order { get; set; }
        public float? Total_Number_of_Full_Time_Equivalents_FTEs { get; set; }
        public float? Primary_Care_Full_Time_Equivalents_FTEs { get; set; }
        public float? Specialty_Full_Time_Equivalents_FTEs { get; set; }
        public string? Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians { get; set; }
        public string? Specialty_Physicians_Targeted { get; set; }
        public bool? Co_Promotion_YesNo { get; set; }
        public string? Name_of_a_Partner_Company { get; set; }
        public bool? Contract_Sales_Force_YesNo { get; set; }
        public string? Name_of_a_CSO_Contract_Sales_Organization { get; set; }
        public string? Additional_Notes_Product { get; set; }

        public string? US_Product_Name_Product_Promoted_qcq { get; set; }

        public string? Country_Specific_Product_Name_Product_Promoted_qcq { get; set; }

        public string? Generic_Name_qcq { get; set; }

        public string? Therapeutic_Category_qcq { get; set; }

        public string? Product_Promotion_Priority_Order_qcq { get; set; }

        public string? Total_Number_of_Full_Time_Equivalents_FTEs_qcq { get; set; }

        public string? Primary_Care_Full_Time_Equivalents_FTEs_qcq { get; set; }

        public string? Specialty_Full_Time_Equivalents_FTEs_qcq { get; set; }

        public string? Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians_qcq { get; set; }

        public string? Specialty_Physicians_Targeted_qcq { get; set; }

        public string? Co_Promotion_YesNo_qcq { get; set; }

        public string? Name_of_a_Partner_Company_qcq { get; set; }

        public string? Contract_Sales_Force_YesNo_qcq { get; set; }

        public string? Name_of_a_CSO_Contract_Sales_Organization_qcq { get; set; }
    }
}
