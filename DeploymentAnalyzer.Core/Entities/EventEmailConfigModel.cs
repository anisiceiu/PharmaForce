using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class EventEmailConfigModel
    {
        public int id { get; set; }
        public string event_name { get; set; } = string.Empty;
        public string event_subscribers { get; set; } = string.Empty;
        public DateTime? created_date { get; set; }
        public DateTime? modified_date { get; set; }
        public int? modified_by { get; set; }
    }
}
