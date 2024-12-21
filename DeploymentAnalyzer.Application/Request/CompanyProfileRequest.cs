using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Request
{
    public class CompanyProfileRequest : BaseModel
    {
        public int? country { get; set; }
        public int? region { get; set; }
        public int? therapeutic_category_id { get; set; }
    }

    public class CountryForCompanyProfileModel : BaseModel
    {
     
    }

    public class FavoriteCompanyListRequest : BaseModel
    {

    }

    public class CompanyProfileListRequest : BaseRequest
    {

        public int company_id { get; set; } = 0;
        public int period_year { get; set; } = 0;
        public int period_quarter { get; set; } = 0;
        public string? country { get; set; } = null;

    }

    public class AddRemoveFavoriteCompanyRequest : BaseModel
    {
        public int Company_Id { get; set; }
    }

    public class SubscribeUnSubscribeFavoriteCompanyRequest : BaseRequest
    {
        public int Company_Id { get; set; }
        public bool alerts_enabled { get; set; }
    }

    public class CompanyProductProfileUserPreferenceRequest : BaseRequest
    {
        public string item_type { get; set; } = string.Empty;
        public int company_id { get; set; }
        public int product_id { get; set; }
    }

    public class AddUpdateCompanyProductProfileUserPreferenceRequest : BaseRequest
    {
        public string item_type { get; set; } = string.Empty;
        public int company_id { get; set; }
        public int product_id { get; set; }
        public string country_name { get; set; } = string.Empty;
        public string company_name { get; set; } = string.Empty;
        public int period_id { get; set; }
    }
}
