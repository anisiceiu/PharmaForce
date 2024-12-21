using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserModel:BaseModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password {  get; set; } = string.Empty;
        public bool Enabled { get; set; }
        public DateTime? Expires { get; set; }
        public DateTime? Created { get; set; }
        //some record contains more than one charecter e.g. SA
        public string? UserType { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? Logo {  get; set; } = string.Empty;
        public int ClientLimit { get; set; }
        public string? Description { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public string? AdminFunctions { get; set; } = string.Empty;
        public UserRightsModel?  UserRights { get; set; }
        public bool WaiveActivation { get; set; }
        public DateTime? VerificationDate { get; set; }
    }

    public class TryAddUserClientResult {
        public string Message { get; set; } = string.Empty;
        public UserModel? User { get; set; }
    }

    public class UserVerifyLoginResult
    {
        public string Message { get; set; } = string.Empty;
        public UserModel? User { get; set; }
    }
}
