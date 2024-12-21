using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Request
{
    public class CompanyAddRequest:BaseModel
    {
        public string Company_Name { get; set; } = string.Empty;
        public string Company_Website_Global { get; set; } = string.Empty;
        public string HeadQuarters { get; set; } = string.Empty;
        public int Number_of_Employees { get; set; }
        public string Type_of_Entity_Public_Private { get; set; } = string.Empty;
        public string Sales_Previous_Year { get; set; }=string.Empty;

    }
}
