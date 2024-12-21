using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class AzureB2CUserDetails
    {
        public int? user_id { get; set; }
        public string user_name { get; set; }
        public string email { get; set; }
        public string country { get; set; }
        public string city { get; set; }
        public string name { get; set; }
        public string jobTitle { get; set; }
        public string postCode { get; set; }
        public string state { get; set; }
        public string StreetAddress { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string mobile_phone { get; set; }
        public string pwd { get; set; }
        public string azure_guid { get; set; }
        public DateTime? register_dt { get; set; }
        public DateTime? expiration_dt { get; set; }
        public int selected_user_id { get; set; }
    }
}
