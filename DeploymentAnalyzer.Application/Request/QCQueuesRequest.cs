using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Request
{
    public class QCQueuesRequest : BaseRequest
    {
        public string DADatabase_Salesforce_id { get; set; } = string.Empty;
        public string DADatabase_Product_id { get; set; } = string.Empty;
        public string column_name { get; set; } = string.Empty;
        //public int user_id { get; set; }
        public string message { get; set; } = string.Empty;
        public int status { get; set; }
        public string msg { get; set; } = string.Empty;
        //public string security_token { get; set; } = string.Empty;
        //public string permission_granted { get; set; } = string.Empty;
    }

    public class QCQueueHistoryListRequest : BaseRequest
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
        public bool is_pending { get; set; }
        public bool is_reviewed { get; set; }
        public bool is_approved { get; set; }
        public bool is_rejected { get; set; }
        public string? DADatabase_Salesforce_id { get; set; }
        public string? search_text { get; set; }
    }

    public class QCQueueListRequest : BaseRequest
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
        public string? search_text { get; set; }
    }

    public class QCQueueListResponse
    {

        public IReadOnlyList<QCQueuesModel> Records { get; set; }
        public int TotalRecords { get; set; }
    }
}