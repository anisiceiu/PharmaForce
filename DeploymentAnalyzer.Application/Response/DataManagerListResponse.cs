using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Response
{
#nullable disable
    public class DataManagerListResponse
    {

        public IReadOnlyList<DataManagerModel> Records { get; set; }
        public int TotalRecords { get; set; }
    }

    public class CallPlaningListResponse
    {

        public IReadOnlyList<CallPlanningModel> Records { get; set; }
        public int TotalRecords { get; set; }
    }

    public class CallPlanningModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public string period { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public string employee_type { get; set; } = string.Empty;
        public int hspc { get; set; }
        public float pc { get; set; }
        public float sp { get; set; }
        public int calls_per_quarter { get; set; }
    }
}
