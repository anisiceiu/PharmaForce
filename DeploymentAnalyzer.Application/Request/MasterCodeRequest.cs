using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Request
{
    public class MasterCodeRequest:BaseModel
    {
        public int Id { get; set; }
        //public string Category { get; set; } = string.Empty;
        //public string Name { get; set; } = string.Empty;
        //public string Security_Token { get; set; } = string.Empty;
        public string category { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public string? region { get; set; } 
        public string? currency_symbol { get; set; } 
        public string? country { get; set; } 
        public string? company { get; set; } 
        public string added_by_name { get; set; } = string.Empty;
        public DateTime? added_dt { get; set; }
        public string? website { get; set; } 
        public string? headquarters { get; set; }
        public int? number_of_employees { get; set; }
        public string? type_of_entity { get; set; } 
        public string? sales_previous_year { get; set; } 
        public string? salesforce_name { get; set; } 
        public string? generic_name { get; set; } 
        public string? us_name { get; set; } 
        public string? product_name { get; set; } 
        public int? year { get; set; }
        public int? quarter { get; set; }
        public string? type_of_salesforce { get; set; }
    }

    public class MasterCodeAddUpdateResult
    {
        public int row_affected { get; set; }
        public string? message { get; set; }
    }
}
