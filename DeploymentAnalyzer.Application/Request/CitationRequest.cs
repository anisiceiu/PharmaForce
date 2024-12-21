using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Request
{
    public class CitationRequest : BaseModel
    {
        public int Id { get; set; }
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string DADatabase_Product_Id { get; set; } = string.Empty;
        public string ColumnName { get; set; } = string.Empty;
        public DateTime? Date { get; set; }
        public string URL { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string SourceFunction { get; set; } = string.Empty;
        public string SourceType { get; set; } = string.Empty;
        public string CompanyOverview { get; set; } = string.Empty;
        public DateTime? InterviewDate { get; set; }
        public string Comments { get; set; } = string.Empty;
        public string AnalystComments { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        //public string SecurityToken { get; set; } = string.Empty;

        public CitationRequest()
        {
            Date = null;  // Ensure Date starts as null
            InterviewDate = null;  // Ensure InterviewDate starts as null
        }
    }


    public class GetCitationRequest: BaseModel
    {
        public int Topn { get; set; }
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string DADatabase_Product_Id { get; set; } = string.Empty;
        public string? Column_List { get; set; } = string.Empty;
        public int? added_by { get; set; }
        public DateTime? added_from { get; set; }
        public DateTime? added_to { get; set; }
        public string? dadatabase_id { get; set; }
        public string? type { get; set; }
    }

    public class DeleteCitationRequest : BaseModel
    {
        public int Id { get; set; }
        //public string Security_Token { get; set; } = string.Empty;

    }
    public class GetCitationManagerRequest : BaseModel
    {
        //public string Security_Token { get; set; } = string.Empty;

    }

    public class GetCitationByIdCSVRequest : BaseRequest
    {
        public string id_list { get; set; } = string.Empty;
    }

    public class GetGenericNameRequest {
        public int companyId { get; set; }
    }

    public class GetSalesforceRequest
    {
        public int companyId { get; set; }
        public int countryId { get; set; }
        public int salesforceTypeId { get; set; }
    }
}
