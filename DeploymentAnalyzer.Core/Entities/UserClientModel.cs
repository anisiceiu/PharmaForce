using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class UserClientModel
    {
        public int UserID { get; set; }
        public int ClientID { get; set; }
        public int Status { get; set; }
        public string EmailID { get; set; }
        public string ClientStatus { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastLogin { get; set; }
        public DateTime VerificationDate { get; set; }
        public DateTime LockTime { get; set; }
        public bool IsActive { get; set; }
        public bool Unsubscribe { get; set; }
        public bool IsLocked { get; set; }
        public bool WaiveActivation { get; set; }
        public Guid? ActivationCode { get; set; }
        public string otp { get; set; }
    }
}
