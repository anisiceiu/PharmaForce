using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Request
{
    public class CompanyCountryAnalysisParams:BaseRequest
    {
        public int company_id { get; set; }
        public string countries { get; set; } = string.Empty;
        public string periods { get; set; } = string.Empty;

    }

    public class CompanyDeploymentByCountryPCAndSpecialtyParams:BaseRequest
    {
        public int period_id { get; set; }
        public string companies { get; set; } = string.Empty;
        public string countries { get; set; } = string.Empty;
    }

    public class TotalCompanyDeploymentByCountryAndTCParams : BaseRequest 
    {
        public int period_id { get; set; }
        public string companies { get; set; } = string.Empty;
        public string countries { get; set; } = string.Empty;
        public int therapeutic_category_id { get; set; }
    
    }

    public class CompanyPortfolioByTCAndSalesForceParams : BaseRequest
    {
        public string companies { get; set; } = string.Empty;
        public int country_id { get; set; }
        public int period_id { get; set; }
        public int therapeutic_category_id { get; set; }

    }

    public class ProductFTEsByTCAndSalesForceUsingBrandNameParams : BaseRequest
    {
        public string companies { get; set; } = string.Empty;
        public string brands { get; set; } = string.Empty;
        public int country_id { get; set; }
        public int period_id { get; set; }
        public int therapeutic_category_id { get; set; }
        public string? brandgroups { get; set; }
    }

    public class ProductFTEsByTCAndSalesForceUsingGenericNameParams : BaseRequest 
    {
        public string companies { get; set; } = string.Empty;
        public string generic_names { get; set; } = string.Empty;
        public int country_id { get; set; }
        public int period_id { get; set; }
        public int therapeutic_category_id { get; set; }
    }

    public class SalesRepresentativeCompensationBySalesForceAndProductParams : BaseRequest
    {
        public string companies { get; set; } = string.Empty;
        public string brands { get; set; } = string.Empty;
        public string salesforces { get; set; } = string.Empty;
        public int country_id { get; set; }
        public int period_id { get; set; }
        public int therapeutic_category_id { get; set; }
    }

    public class ReachAndFrequencyBySalesForceAndProductParams : BaseRequest
    {
        public string companies { get; set; } = string.Empty;
        public string brands { get; set; } = string.Empty;
        public string salesforces { get; set; } = string.Empty;
        public int country_id { get; set; }
        public int period_id { get; set; }
        public int therapeutic_category_id { get; set; }
    }

    public class CustomerDropdownListFilters:BaseRequest
    {
        public string? countries { get; set; }
        public string? companies { get; set; }
        public string? salesforces { get; set; }
        public string? brands { get; set; }
        public string? genericnames { get; set; }
        public string? therapeuticcategories { get; set; }
        public string? periods { get; set; }
        public string? columns { get; set; }
    }
}
