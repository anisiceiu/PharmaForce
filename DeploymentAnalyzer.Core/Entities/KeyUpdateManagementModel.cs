using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class KeyUpdateManagementModel
    {
        public int keyUpdate_Id { get; set; }
        public int CompanyCountry_Id { get; set; }
        public string Company_Name { get; set; } = string.Empty;
        public string Country_Name { get; set; } = string.Empty;
        public int Company_Id { get; set; }
        public int Country_Id { get; set; }
        public string Note { get; set; } = string.Empty;
        public int TherapeuticCategory_Id { get; set; }
        public string Description {  get; set; } = string.Empty;
        public int Period_Id { get; set; }
        public string UpdateTag { get; set; } = string.Empty;
        public string Period_Name { get; set; } = string.Empty;
    }

    public class KeyUpdateTagModel
    {
        public int Tag_Id { get; set; }
        public string TagName { get; set; } = string.Empty;
    }
 }
