using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserEmailSuffixModel
    {
        public int EmailSuffixId { get; set; }
        public int UserID { get; set; }
        public string? EmailSuffix { get; set; }
    }

    public class UserRestrictedEmailSuffixModel
    {
        public int EmailSuffixId { get; set; }
        public int UserID { get; set; }
        public string? EmailSuffix { get; set; }
    }

    public class EmailModel
    {
        public string ToEmailAddress { get; set;}
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
