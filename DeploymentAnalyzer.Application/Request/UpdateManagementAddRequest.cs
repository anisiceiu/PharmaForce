using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class UpdateManagementAddRequest
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Description { get; set; } = string.Empty;
        public int CompanyCountry_Id { get; set; }
        public int? TherapeuticCategory_Id { get; set; }
        public string Note { get; set; } = string.Empty;
        public string SecurityToken { get; set; } = string.Empty;
        public int PermissionGranted { get; set; }
        public int Period_Id { get; set; }
        public string UpdateTag { get; set; } = string.Empty;
    }

    public class KeyUpdateRequest : BaseRequest
    {
        public int? country_id { get; set; }
        public int? company_id { get; set; }
        public int? therapeuticcategory_id { get; set; }
        public int? period_id { get; set; }
        public string? updatetag { get; set; }
    }
}
