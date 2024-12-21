namespace DeploymentAnalyzer.Core.Entities
{
    public class CitationModel 
    {
        public int Id { get; set; }
        public DateTime date { get; set; }
        public string url { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string column_name { get; set; } = string.Empty;
        public int added_by { get; set; }
        public DateTime added_dt { get; set; }
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string DADatabase_Product_Id { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
        public DateTime? interview_date { get; set; }
        public string source_function { get; set; } = string.Empty;
        public string source_type { get; set; } = string.Empty;
        public string comments { get; set; } = string.Empty;
        public string company_overview { get; set; } = string.Empty;
        public string analyst_comments { get; set; } = string.Empty;
        public string? added_by_name { get; set; }
    }

    public class CitationSmallModel
    {
        public int Id { get; set; }
        public string analyst_comments { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string? added_by_name { get; set; }
    }

}
