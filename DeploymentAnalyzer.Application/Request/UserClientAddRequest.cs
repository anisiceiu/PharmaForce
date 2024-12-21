using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class UserClientAddRequest
    {
        public int UserID { get; set; }
        public string EmailID { get; set; }
        public Guid? ActivationCode { get; set; } = Guid.NewGuid();
    }
}
