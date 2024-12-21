using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class AdminRequest: BaseModel
    {
        //public string Security_Token { get; set; } = string.Empty;
    }

    public class GetEventEmailConfigRequest : BaseRequest
    {
        public string event_name { get; set; } = string.Empty;
    }
}
