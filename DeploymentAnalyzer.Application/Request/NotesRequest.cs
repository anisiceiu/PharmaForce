using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Request
{
    public class NotesRequest:BaseModel
    {
        public int Id { get; set; }
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string DADatabase_Product_Id { get; set; } = string.Empty;
        public string Column_Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Note_For { get; set; } = string.Empty;
        public int Status { get;set; } 
        public string Type { get; set; } = string.Empty;
        public string Msg { get; set; } = string.Empty;
        //public string Security_Token { get; set; } = string.Empty;
       // public int Permission_Granted { get; set; }
    }

    public class GetNotesRequest: BaseModel
    {
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string DADatabase_Product_id {  get; set; } = string.Empty;
        //public string Security_Token { get; set; } = string.Empty;
    }

    public class NoteListRequest : BaseRequest
    {
        
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
        public string? SortDirection { get; set; } = string.Empty;
        public string? SortField { get; set; } = string.Empty;
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string DADatabase_Product_id { get; set; } = string.Empty;
        public string? search_text { get; set; }
    }
}
