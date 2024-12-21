namespace DeploymentAnalyzer.Application.Response
{
#nullable disable
    public class DataManagerFilterSetResponse
    {
        public List<IdNamePair> Country_Name { get; set; }
        public List<IdNamePair> Company_Name { get; set; }
        public List<SalesForceOptions> SalesForce_Name { get; set; }
        public List<IdNamePair> Period_Year { get; set; }
        public List<IdNamePair> Type_of_salesforce { get; set; }
        public List<IdNamePair> Physician_Focus { get; set; }
        public List<ProductOptions> Us_Brand_Name { get; set; }
        public List<ProductOptions> Country_Specific_Product { get; set; }
        public List<IdNamePair> Generic_Name { get; set; }
        public List<IdNamePair> Therapeutic_Category { get; set; }
        public List<IdNamePair> Name_of_cso { get; set; }
        public List<IdNamePair> Physician_Targeted { get; set; }
        public List<IdNamePair> Period { get; set; }
        public List<IdNamePair> Currency_Symbol { get; set; }
    }

    public class IdNamePair
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class USNameOptions
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Generic_Name { get; set; } = string.Empty;
    }

    public class SalesForceOptions
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Type_of_SalesForce { get; set; } = string.Empty;
    }

    public class ProductOptions
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Generic_Name { get; set; } = string.Empty;
        public string US_Name { get; set; } = string.Empty;
    }

    public class UpdatedFavoritesForEmailNotificationModel
    {
        public string Email { get; set; }
        public string username { get; set; }
    }
}
