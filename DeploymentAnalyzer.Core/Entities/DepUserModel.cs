using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class DepUserModel
    {
        public int id { get; set; }
        public string? name { get; set; }
        public DateTime? lockTime { get; set; }
        public bool? isLocked { get; set; }
    }
}
