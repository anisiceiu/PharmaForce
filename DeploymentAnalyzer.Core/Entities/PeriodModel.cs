using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class PeriodModel
    {
        public int Period_Id { get; set; }
        public int Period_Year { get; set; }
        public int Period_Quarter { get; set; }
        public string? Displayed_Title { get; set; }
    }

    public class PeriodSalesforceModel {
        public int Period_Year { get; set; }
        public int Period_Quarter { get; set; }
        public string? SalesForce_Name { get; set; }
    }
}
