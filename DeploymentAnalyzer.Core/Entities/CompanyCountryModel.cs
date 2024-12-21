using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class CompanyCountryModel
    {
        public int CompanyCountry_Id { get; set; }
        public int Company_Id { get; set; }
        public int Country_Id { get; set; }  
        public bool Is_Current { get; set; }
    }
}
