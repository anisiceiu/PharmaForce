using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class CompensationFilterRequest : BaseRequest
    {
        public int type { get; set; } = 0;
        public int regionId { get; set; } = 0;
        public int countryId { get; set; } = 0;
        public int companyId { get; set; } = 0;
        public int periodId { get; set; } = 0;
        public int salesforce_Id { get; set; } = 0;
        public int therapeuticCategory_Id { get; set; } = 0;
    }

    public class CompensationListRequest : BaseRequest
    {
        public int pageSize { get; set; }
        public int page { get; set; } = 1;
        public int regionId { get; set; } = 0;
        public int countryId { get; set; } = 0;
        public int companyId { get; set; } = 0;
        public int periodId { get; set; } = 0;
        public string? salesforceName { get; set; } = null;
        public string? productName { get; set; } = null;
        public int therapeuticCategory_Id { get; set; } = 0;
        public string? SortDirection { get; set; } = string.Empty;
        public string? SortField { get; set; } = string.Empty;
    }
}
