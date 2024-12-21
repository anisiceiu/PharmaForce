using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserExpiryModel
    {
        public int Id { get; set; }
        public DateTime Expires { get; set; }
    }

    public class UserAddUpdateResult {
        public int AffectedRows { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
