using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class AdminLogModel
    {
        public int AdminLogId { get; set; }
        public int UserID { get; set; }
        public string? UserFullName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public DateTime? LogInTime { get; set; }
        public DateTime? LogOutTime { get; set; }
        public string? Category { get; set; }
        public string? Item { get; set; }
        public string? Notes { get; set; }
        public bool Reviewed { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
