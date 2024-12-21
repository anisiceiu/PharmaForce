using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Common
{
    public class LicenseMailSetting
    {
        public string? SMTPEmailFrom { get; set; }
        public int GmailSMTPPort { get; set; }
        public bool GmailSMTPSSL { get; set; }
        public string? GmailSMTPServer { get; set; }
        public string? GmailSMTPPwd { get; set; }
        public string? GmailSMTPUserName { get; set; }
    }
}
