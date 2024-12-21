using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class UserEmailSuffixAddRequest
    {
        public int UserId { get; set; }
        public string EmailSuffix { get; set; } = string.Empty;
    }

    public class UserRestrictedEmailSuffixAddRequest
    {
        public int UserId { get; set; }
        public string EmailSuffix { get; set; } = string.Empty;
    }
}
