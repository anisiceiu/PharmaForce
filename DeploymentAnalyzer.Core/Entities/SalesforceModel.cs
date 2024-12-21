using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class SalesforceModel
    {
        public int Salesforce_Id { get; set; }
        public string SalesforceName_Name { get; set; } = string.Empty;
        public int SalesforceType_Id { get; set; }
        public int CompanyCountry_Id { get; set; }
    }
}
