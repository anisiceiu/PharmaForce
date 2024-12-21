using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Request
{
    public class ProductProfileRequest : BaseModel
    {
        public int? country { get; set; }
        public int? region { get; set; }
        public int? company { get; set; }
    }

    public class AddRemoveFavoriteProductRequest : BaseModel
    {
        public int Product_Id { get; set; }
    }

    public class SubscribeUnSubscribeFavoriteProductRequest : BaseRequest
    {
        public int Product_Id { get; set; }
        public bool alerts_enabled { get; set; }
    }
    public class FavoriteProductListRequest : BaseModel
    {

    }

    public class ProductProfileListRequest : BaseRequest
    {
        
        public int product_id { get; set; } = 0;
        public int? period_year { get; set; } = 0;
        public int? period_quarter { get; set; } = 0;
        public string? company { get; set; } = null;

    }
}
