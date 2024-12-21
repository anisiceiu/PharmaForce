namespace DeploymentAnalyzer.Core.Entities
{
    public class BaseModel
    {
        public int user_id { get; set; }
        public string security_token { get; set; } = string.Empty;
        public string? caller { get; set; }
        public int permission_granted { get; set; }
        public int client_id { get; set; }
    }
}
