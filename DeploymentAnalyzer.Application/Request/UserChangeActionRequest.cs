using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class UserChangeActionRequest : BaseRequest
    {
        public int Id { get; set; }
        public string? Email { get; set; }
    }
}
