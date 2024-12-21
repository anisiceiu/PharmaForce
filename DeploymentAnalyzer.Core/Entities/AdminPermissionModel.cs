using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class AdminPermissionModel:BaseModel
    {
        public int AdminPermissionID { get; set; }
        public int UserID { get; set; }
        public string Countries { get; set; } = string.Empty;
        public string Companies { get; set; } = string.Empty;
        public string AdminFunctions { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }
}
