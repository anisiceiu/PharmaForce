namespace DeploymentAnalyzer.Application.Request
{
    public class NewsManagementAddRequest:BaseRequest
    {
        public int News_id { get; set; }
        public string Short_Message { get; set; } = string.Empty;
        public string Long_Message { get; set; } = string.Empty;
        public string? News_Url { get; set; }
        public DateTime News_Date { get; set; }
        public int? Company_Id { get; set; }
        //public int user_id { get; set; } 
        public int? Country_Id { get; set; }
    }
}
