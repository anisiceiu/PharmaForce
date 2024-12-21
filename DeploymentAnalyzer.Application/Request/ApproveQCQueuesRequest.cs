namespace DeploymentAnalyzer.Application.Request
{
    public class ApproveQCQueuesRequest : BaseRequest
    {
        public int id { get; set; }
        //public int user_id { get; set; }
        public string type { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
        //public string caller { get; set; } = string.Empty; //already in base
        public int status { get; set; }
        //public string security_token { get; set; } = string.Empty; // already in base
    }
}
