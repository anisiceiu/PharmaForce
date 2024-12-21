namespace DeploymentAnalyzer.Core.Entities
{
    public class NewsManagementModel : BaseModel
    {
        public int News_Id { get; set; }
        public string Short_Message { get; set; } = string.Empty;
        public string Long_Message { get; set; } = string.Empty;
        public string? News_Url { get; set; }
        public DateTime News_Date { get; set; }
        public int? Country_Id { get; set; }
        public int? Company_Id { get; set; }
        public string? Country_Name { get; set; }
        public string? Company_Name { get; set; }
    }

    public class NewsRequest:BaseModel {
        public int? country_id { get; set; }
        public int? company_id { get; set; }
        public DateTime? news_date_start { get; set; }
        public DateTime? news_date_end { get; set; }
    }
}
