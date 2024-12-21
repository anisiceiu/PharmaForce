using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class UserPreferenceRequest
    {
        public int UserId { get; set; }
        public int PageId { get; set; }
    }

    public class UserAnalyticFilterRequest
    {
        public int UserId { get; set; }
        public int client_id { get; set; }
    }
}
