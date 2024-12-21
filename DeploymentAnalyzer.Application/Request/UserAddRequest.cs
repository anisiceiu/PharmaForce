using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class UserAddRequest:BaseRequest
    {
        public string Name { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool Enabled { get; set; }
        public DateTime? Expires { get; set; }
        public DateTime? Created { get; set; }
        public string? UserType { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? Logo { get; set; } = string.Empty;
        public int ClientLimit { get; set; }
        public string? Description { get; set; } = string.Empty;
    }
}
