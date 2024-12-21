namespace DeploymentAnalyzer.Utility.Common
{
    public class JwtSettings
    {
        public string Secret { get; set; }

        public int ExpiresInMinutes { get; set; }
    }
}
