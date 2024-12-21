using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class AddUpdateMyBrandRequest : BaseRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public int userId { get; set; }
        public string? brands { get; set; }
        public bool isChemicalGroup { get; set; }
    }

    public class BrandGroupFilterRequest : BaseRequest
    {
        public int type { get; set; } = 0;
        public int companyId { get; set; } = 0;
        public int therapeuticCategory_Id { get; set; } = 0;
    }
}
