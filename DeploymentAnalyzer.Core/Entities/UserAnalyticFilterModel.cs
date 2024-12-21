using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserAnalyticFilterModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int client_id { get; set; }
        public string PageName { get; set; } = string.Empty;
        public string SearchFilterName { get; set;} = string.Empty;
        public int ReportId { get; set; }
        public string? FilterSettings { get; set; }
        public DateTime? CreatedDate { get; set; }

    }
}
