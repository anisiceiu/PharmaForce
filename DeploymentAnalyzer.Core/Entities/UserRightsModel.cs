using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserRightsModel
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string? Countries { get; set; }
        public string? Companies { get; set; }
        public bool ReportAccess { get; set; }
        public string? TherapeuticCategories { get; set; }
        public string? Searches { get; set; }
        public string? LinkedAccounts { get; set; }
        public string? Periods { get; set; }
        public bool CurrentPeriodAccess { get; set; }
        public bool SaveSearchAccess { get; set; }
        public bool ExcelDownloadRights { get; set; }
        public bool PDFDownloadRights { get; set; }
        public bool PrintDataRights { get; set; }
        public bool DataVisualRights { get; set; }
    }
}
