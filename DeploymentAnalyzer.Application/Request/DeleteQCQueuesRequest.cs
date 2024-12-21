using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class DeleteQCQueuesRequest : BaseRequest
    {
        public int id { get; set; }
        //public int user_id { get; set; }
        public int status { get; set; }
        public string msg { get; set; }
        //public string security_token { get; set; }
        //public int permission_granted { get; set; }
    }
}
