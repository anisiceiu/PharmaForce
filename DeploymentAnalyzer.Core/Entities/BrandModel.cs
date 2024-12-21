using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class MyBrandModel
    {
        public int id { get; set; }
        public string? name { get; set; }
        public int userId { get; set; }
        public string? brands { get; set; }
        public bool isChemicalGroup { get; set; }
    }

    public class BrandModel
    {
        public int id { get; set; }
        public string? usName { get; set; }
        public int chemicalproductid { get; set; }
    }

    public class CompanyTherapeuticBrandAssociationRequest {
        public int myBrandId { get; set; }
    }

    public class CompanyTherapeuticBrandAssociationModel
    {
        public int companyId { get; set; }
        public int therapeuticCategoryId { get; set; }
        public int brandId { get; set; }
    }
}
