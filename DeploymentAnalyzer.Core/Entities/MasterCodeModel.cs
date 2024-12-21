namespace DeploymentAnalyzer.Core.Entities
{
    public class MasterCodeModel:BaseModel
    {
        public int id { get; set; }
        public string category { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public string region { get; set; } = string.Empty;
        public string currency_symbol { get; set; } = string.Empty;
        public string country { get; set; } = string.Empty;
        public string company { get; set; } = string.Empty;
        public string added_by_name { get; set; } = string.Empty;
        public DateTime? added_dt { get; set; }
        public string website { get; set; } = string.Empty;
        public string headquarters { get; set; } = string.Empty;
        public int number_of_employees { get; set; }
        public string type_of_entity { get; set; } = string.Empty;
        public string sales_previous_year { get; set; } = string.Empty;
        public string salesforce_name { get; set; } = string.Empty;
        public string generic_name { get; set;} = string.Empty;
        public string us_name { get; set; } = string.Empty;
        public string product_name { get; set; } = string.Empty;
        public int year { get; set; }
        public int quarter { get; set; }
        public string type_of_salesforce { get; set; } = string.Empty; 

    }

    public class MasterCodeFilterRequest:BaseModel
    {
        public int type { get; set; }
        public string? region { get; set; }
        public string? country { get; set; }
        public string? company { get; set; }
    }

    public class MasterCodeListRequest : BaseModel
    {
        public string category { get; set; } = string.Empty;
    }

}
