using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class CascadingSelectRequest : BaseRequest
    {
        public string? Country_Name { get; set; }
        public string? Company_Name { get; set; }
    }
}
