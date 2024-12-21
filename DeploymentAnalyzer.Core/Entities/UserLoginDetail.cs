using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserLoginDetail
    {
        public string Company { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string ClientEmail {  get; set; } = string.Empty;
        public DateTime Login { get; set; }
        public string IPAddress { get; set; } = string.Empty;
     }
}
