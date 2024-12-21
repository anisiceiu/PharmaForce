using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class UserClientActionRequest:BaseRequest
    {
        public int ClientId { get; set; }
        public string ClientEmailId { get; set; } = string.Empty;
        public bool WaiveFlag { get; set; }
        public bool UnsubscribeFlag { get; set; }
        public bool LockStatus { get; set; }
        public DateTime LockUnlockTime { get; set; }
        public bool ActiveFlag { get; set; }
    }
}
