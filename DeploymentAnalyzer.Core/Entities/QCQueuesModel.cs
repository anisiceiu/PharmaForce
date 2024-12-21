namespace DeploymentAnalyzer.Core.Entities
{
    public class QCQueuesModel
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Column_Name { get; set; } = string.Empty;
        public DateTime? Date_Added { get; set; }  
        public string DADatabase_Salesforce_id { get; set; } = string.Empty;
        public string DADatabase_Product_id { get; set; } = string.Empty;
        public string added_by { get; set; } = string.Empty;    
        public DateTime? Added_Dt { get; set; }
        public string approved_by { get; set; } = string.Empty;
        public DateTime? Approved_Dt { get; set; }
        public string rejected_by { get; set; } = string.Empty;
        public DateTime? Rejected_Dt {  get; set; }
        public string Country { get; set; } = string.Empty;
        public string Company_Name { get; set; } = string.Empty;
        public int? Period_Year { get; set; }
        public int? Period_Quarter { get; set; }
        public string Salesforce_Name { get; set; } = string.Empty;
        public string Product_Promoted { get; set; } = string.Empty;
        public string previous_value { get; set; } = string.Empty;
        public string Country_Name { get; set; } = string.Empty;
        public string Type_of_Salesforce { get; set; } = string.Empty;
        public int Number_Of_Sales_Representatives { get; set; }
        public int Number_Of_District_Managers { get; set; }
        public int Number_Of_Regional_Managers { get; set; }
        public int Salary_Low { get; set; }
        public int Salary_High { get; set; }
        public int Target_Bonus { get; set; }
        public int Reach { get; set; }
        public int Frequency { get; set; }
        public string Additional_Notes_Salesforce { get; set; } = string.Empty;
        public int Pct_Split_Between_Primary_Care_And_Specialty { get; set; }
        public string US_Product_Name_Product_Promoted { get; set; } = string.Empty;
        public string Country_Specific_Product_Name_Product_Promoted { get; set; } = string.Empty;
        public string Generic_Name { get; set; } = string.Empty;
        public string Therapeutic_Category { get; set; } = string.Empty;
        public int Product_Promotion_Priority_Order { get; set; }
        public float? Total_Number_of_Full_Time_Equivalents_FTEs { get; set; }
        public float? Primary_Care_Full_Time_Equivalents_FTEs { get; set; }
        public float? Specialty_Full_Time_Equivalents_FTEs { get; set; }
        public string Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians { get; set; } = string.Empty;
        public string Specialty_Physicians_Targeted { get; set; } = string.Empty;
        public bool Co_Promotion_YesNo { get; set; }
        public string Name_of_a_Partner_Company { get; set; } = string.Empty;
        public bool Contract_Sales_Force_YesNo { get; set; }
        public string Name_of_a_CSO_Contract_Sales_Organization { get; set; } = string.Empty;
        public string Additional_Notes_Product { get; set; } = string.Empty;
        public int? QCQ_Status { get; set; }
        public bool? Has_Citation { get; set; }
        public DateTime? modified_date { get; set; }
        public DateTime? added_date { get; set; }
        public string added_by_name { get; set; } = string.Empty;
        public string modified_by_name { get; set; } = string.Empty;
        public int modified_by { get; set; }
        public string product_added_by_name { get; set; } = string.Empty;
        public DateTime? product_added_date { get; set; }
        public string? qcq_note { get; set; }
    }
}
