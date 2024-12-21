using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class AdminFunctionModel
    {
        public int AdminFunctionId { get; set; }
        public string FunctionName { get; set;} = string.Empty; 
        public string ParentMenu { get; set; } = string.Empty; 
    }
}
