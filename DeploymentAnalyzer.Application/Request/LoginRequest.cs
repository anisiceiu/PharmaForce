namespace DeploymentAnalyzer.Application.Request
{
    public class LoginRequest
    {
        
        public string? UserName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } 
        public string Password { get; set; } = string.Empty;
        public string? IPAddress { get; set; }
        public bool IsB2CEnabled { get; set; }
    }

    public class OTPVerificationRequest {
        public string OTP { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public int CompanyUserId { get; set; }
        public bool IsB2CEnabled { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
        public string CompanyCode { get; set; } = string.Empty;
    }

    public class ProceedClientRequest
    {
        public string OTP { get; set; } = string.Empty;
        public string CompanyCode { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public bool IsB2CEnabled { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
        public int CompanyUserId { get; set; }
    }
}
