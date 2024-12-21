using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class CustomerDropdownModel
    {
        public int period_year { get; set; }
        public int period_quarter { get; set; }
        public string country_name { get; set; } = string.Empty;
        public string company_name { get; set; } = string.Empty;
        public string salesforce_name { get; set; } = string.Empty;
        public string us_product_name_product_promoted { get; set; } = string.Empty;
        public string generic_name { get; set; } = string.Empty;
        public string therapeutic_category { get; set; } = string.Empty;
    }
}
