using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class CountryModel
    {
        public int Country_Id { get; set; }
        public string Country_Name { get; set;} = string.Empty;
        public int Region_Id { get; set; }
        public string Flag_path { get; set; } = string.Empty;
        public string Country_Code { get; set; } = string.Empty;    
        public string Currency_Symbol { get; set; } = string.Empty;
    }
}
