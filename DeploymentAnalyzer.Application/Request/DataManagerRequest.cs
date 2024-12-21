using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Request
{
    public class DataManagerSalesforceRequest : BaseModel
    {
        //public string Caller { get; set; } = string.Empty;
        public int PageSize { get; set; }
        public int Page { get; set; } = 1;
        public string? Company { get; set; }
        public string? Country { get; set; }
        public string? Salesforce { get; set; }
        public string? Product { get; set; }
        public int? Period_Year { get; set; }
        public int? Period_Quarter { get; set; }
        public int? QCQ_Status { get; set; }
        public string? DADatabase_Id { get; set; } = string.Empty;
        public int? Has_Citation { get; set; }
        //public string Security_Token { get; set; } = string.Empty;
        public string? SortDirection { get; set; } = string.Empty;
        public string? SortField { get; set; } = string.Empty;
        public string? search_text { get; set; }
    }

    public class PublishDataManager : BaseModel
    {
        public int Publish_From_Datamanager { get; set; }
        //public string Security_Token { get; set; } = string.Empty;
    }

    public class DataManagerProductsRequest : BaseModel
    {
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
    }

    public class DataManagerAddRequest : BaseModel
    {
        public string DADatabase_SalesForce_Id { get; set; } = string.Empty;
        public string Country_Name { get; set; } = string.Empty;
        public string Company_Name { get; set; } = string.Empty;
        public int? Period_Year { get; set; }
        public int? Period_Quarter { get; set; }
        public string Salesforce_Name { get; set; } = string.Empty;
        public string Type_of_Salesforce { get; set; } = string.Empty;
        public int? Number_Of_Sales_Representatives { get; set; }
        public int? Number_Of_District_Managers { get; set; }
        public int? Number_Of_Regional_Managers { get; set; }
        public int? Salary_Low { get; set; }
        public int? Salary_High { get; set; }
        public int? Target_Bonus { get; set; }
        public int? Reach { get; set; }
        public int? Frequency { get; set; }

        public string? Country_Name_qcq { get; set; }
        public string? Company_Name_qcq { get; set; }
        public string? Period_Year_qcq { get; set; }
        public string? Period_Quarter_qcq { get; set; }
        public string? Salesforce_Name_qcq { get; set; }
        public string? Type_of_Salesforce_qcq { get; set; }
        public string? Number_Of_Sales_Representatives_qcq { get; set; }
        public string? Number_Of_District_Managers_qcq { get; set; }
        public string? Number_Of_Regional_Managers_qcq { get; set; }
        public string? Salary_Low_qcq { get; set; }
        public string? Salary_High_qcq { get; set; }
        public string? Target_Bonus_qcq { get; set; }
        public string? Reach_qcq { get; set; }
        public string? Frequency_qcq { get; set; }

        public string? Additional_Notes_Salesforce { get; set; }
        public int? Pct_Split_Between_Primary_Care_And_Specialty { get; set; }
        //public string Security_Token { get; set; } = string.Empty;
        public List<DataManagerProductModel>? ProductItems { get; set; }
        public bool IsAddToQCQ { get; set; }

    }

    public class DataManagerByIdRequest : BaseModel
    {
        public string DADatabase_Product_Id { get; set; } = string.Empty;
        //public string Caller { get; set; } = string.Empty;
        //public string Security_Token { get; set; } = string.Empty;
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
    }

    public class DataManagerBySalesForceIdRequest : BaseModel
    {
        public string DADatabase_SalesForce_Id { get; set; } = string.Empty;
        //public string Caller { get; set; } = string.Empty;
        //public string Security_Token { get; set; } = string.Empty;
    }

    public class DataManagerUpdateRequest : BaseModel
    {
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string Country_Name { get; set; } = string.Empty;
        public string Company_Name { get; set; } = string.Empty;
        public int? Period_Year { get; set; }
        public int? Period_Quarter { get; set; }
        public string Salesforce_Name { get; set; } = string.Empty;
        public string Type_of_Salesforce { get; set; } = string.Empty;
        public int? Number_Of_Sales_Representatives { get; set; }
        public int? Number_Of_District_Managers { get; set; }
        public int? Number_Of_Regional_Managers { get; set; }
        public int? Salary_Low { get; set; }
        public int? Salary_High { get; set; }
        public int? Target_Bonus { get; set; }
        public int? Reach { get; set; }
        public int? Frequency { get; set; }

        public string? Country_Name_qcq { get; set; }
        public string? Company_Name_qcq { get; set; }
        public string? Period_Year_qcq { get; set; }
        public string? Period_Quarter_qcq { get; set; }
        public string? Salesforce_Name_qcq { get; set; }
        public string? Type_of_Salesforce_qcq { get; set; }
        public string? Number_Of_Sales_Representatives_qcq { get; set; }
        public string? Number_Of_District_Managers_qcq { get; set; }
        public string? Number_Of_Regional_Managers_qcq { get; set; }
        public string? Salary_Low_qcq { get; set; }
        public string? Salary_High_qcq { get; set; }
        public string? Target_Bonus_qcq { get; set; }
        public string? Reach_qcq { get; set; }
        public string? Frequency_qcq { get; set; }

        public string? Additional_Notes_Salesforce { get; set; }
        public int? Pct_Split_Between_Primary_Care_And_Specialty { get; set; }
        //public string Security_Token { get; set; } = string.Empty;
        public List<DataManagerProductModel>? ProductItems { get; set; }
        public bool IsAddToQCQ { get; set; }
        public string? periodList { get; set; }
    }

    public class DataManagerDeleteRequest
    {
        public int User_id { get; set; }
        public string? DADatabase_Salesforce_Id { get; set; }
        public string? DADatabase_Product_Id { get; set; }

    }
}
