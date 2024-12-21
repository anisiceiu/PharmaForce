using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserAnalyticSearchLogModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ReportId { get; set; }
        public string? FilterSettings { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
