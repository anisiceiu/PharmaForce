namespace DeploymentAnalyzer.Core.Entities
{
    public class CompanyModel : BaseModel
    {
        public int Company_Id { get; set; }
        public string Company_Name { get; set; } = string.Empty;
        public string Company_Website_Global { get; set; } = string.Empty;
        public string HeadQuarters { get; set; } = string.Empty;
        public int Number_of_Employees { get; set; }
        public string Type_of_Entity_Public_Private { get; set; } = string.Empty;
        public string Sales_Previous_Year { get; set; } = string.Empty;

    }

    public class CountryCompanyModel {
        public string Country_Name { get; set; } = string.Empty;
        public string Company_Name { get; set; } = string.Empty;
    }
}
