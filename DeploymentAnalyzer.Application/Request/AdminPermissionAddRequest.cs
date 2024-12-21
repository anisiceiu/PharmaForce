using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class AdminPermissionAddRequest
    {
        public int UserID { get; set; }
        public string Countries { get; set; } = string.Empty;
        public string Companies { get; set; } = string.Empty;
        public string AdminFunctions { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }
}
