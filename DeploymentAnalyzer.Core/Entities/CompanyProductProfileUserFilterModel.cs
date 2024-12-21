using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class CompanyProductProfileUserFilterModel
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public string item_type { get; set; } = string.Empty;
        public int company_id { get; set; }
        public int product_id { get; set; }
        public string country_name { get; set; } = string.Empty;
        public string company_name { get; set; } = string.Empty;
        public int period_id { get; set; }
    }
}
