using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Response
{
    public class UserLogInResult
    {
        public string? Token { get; set; }
        public UserModel? User { get; set; }
    }

    public class ClientLoginFirstStepResult {
        public int CompanyUserId { get; set; }
        public int ClientId { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
        public string CompanyCode { get; set; } = string.Empty;
        public bool IsReVerificationNeeded { get; set; }
        public string? Token { get; set; }
        public UserModel? User { get; set; }
    }
}
