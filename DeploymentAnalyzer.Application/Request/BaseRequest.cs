using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class BaseRequest
    {
        public int user_id { get; set; }
        public string? caller { get; set; }
        public string security_token { get; set; } = string.Empty;
        public int permission_granted { get; set; }
        public int client_id { get; set; }
    }
}
