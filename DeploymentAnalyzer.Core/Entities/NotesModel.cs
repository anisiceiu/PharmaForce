namespace DeploymentAnalyzer.Core.Entities
{
    public class NotesModel:BaseModel
    {
        public int Id { get; set; }
        public string DADatabase_Salesforce_Id { get; set; } = string.Empty;
        public string DADatabase_Product_Id { get; set; } = string.Empty;
        public DateTime Added_Dt { get; set; }   
        public string Note_For { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Column_name { get; set; } = string.Empty;
        public string Full_Name { get; set; } = string.Empty;
        public string Company_Name { get; set; } = string.Empty;
        public string Country_Name { get; set; } = string.Empty;
        public string Salesforce_Name { get; set; } = string.Empty;
        public int Period_Year { get; set; }
        public int Period_Quarter { get; set; }
        public string Description { get; set; } = string.Empty;
        public string US_Product_Name_Product_Promoted { get; set; } = string.Empty;

    }
}
