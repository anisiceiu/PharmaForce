using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserPreferenceModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PageId { get; set; }
        public int GridId { get; set; }
        public string? FilterSettings { get; set; }
        public string? ColumnSettings { get; set; }
        public DateTime? CreatedDate { get; set; }
    }

 
}
