using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Core.Entities
{
    public class AnalyticsModel
    {

    }

    public class ReachAndFrequencyBySalesForceAndProductGridDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public string employee_type { get; set; } = string.Empty;
        public int hspc { get; set; }
        public float pc { get; set; }
        public float sp { get; set; }
        public int calls_per_quarter { get; set; }
        public string? column_names { get; set; }
        public string? citations_text { get; set; }
    }

    public class ReachAndFrequencyBySalesForceAndProductChartDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public string employee_type { get; set; } = string.Empty;
        public int hspc { get; set; }
        public float pc { get; set; }
        public float sp { get; set; }
        public int calls_per_quarter { get; set; }
    }
    public class SalesRepresentativeCompensationBySalesForceAndProductGridDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public string employee_type { get; set; } = string.Empty;
        public int salary_low { get; set; }
        public int salary_high { get; set; }
        public int target_bonus { get; set; }
        public string? column_names { get; set; }
        public string? citations_text { get; set; }
    }

    public class SalesRepresentativeCompensationBySalesForceAndProductChartDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public string employee_type { get; set; } = string.Empty;
        public int salary_low { get; set; }
        public int salary_high { get; set; }
        public int target_bonus { get; set; }
    }

    public class ProductFTEsByTCAndSalesForceUsingGenericNameGridDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int genericname_id { get; set; }
        public string genericname_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
        public string? column_names { get; set; }
        public string? citations_text { get; set; }
    }
    public class ProductFTEsByTCAndSalesForceUsingGenericNameChartDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int genericname_id { get; set; }
        public string genericname_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
    }
    public class ProductFTEsByTCAndSalesForceUsingBrandNameGridDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
        public string? column_names { get; set; }
        public string? citations_text { get; set; }
    }
    public class ProductFTEsByTCAndSalesForceUsingBrandNameChartDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
    }

    public class CompanyPortfolioByTCAndSalesForceGridDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int therapeuticcategory_id { get; set; }
        public string therapeuticcategory_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
        public string? column_names { get; set; }
        public string? citations_text { get; set; }

    }

    public class CompanyPortfolioByTCAndSalesForceChartDataModel
    {
        public int company_id { get; set; }
        public string company_name { get; set; } = string.Empty;
        public int therapeuticcategory_id { get; set; }
        public string therapeuticcategory_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
    }

    public class CompanyCountryAnalysisGridDataModel
    {
        public int country_id { get; set; }
        public string country_name { get; set; } = string.Empty;
        public int period_id { get; set; }
        public string period_name { get; set; } = string.Empty;
        public int year { get; set; }
        public int quarter { get; set; }
        public int therapeuticcategory_id { get; set; }
        public string therapeuticcategory_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public int physicianfocus_id { get; set; }
        public string physicianfocus_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public float salesforce_size { get; set; }
        public int pc_product { get; set; }
        public int sp_product { get; set; }
        public int total_therapeuticategory { get; set; }
        public string? column_names { get; set; }
        public string? citations_text { get; set; }
    }

    public class CompanyCountryAnalysisChartDataModel
    {
        public int country_id { get; set; }
        public string country_name { get; set; } = string.Empty;
        public int period_id { get; set; }
        public string period_name { get; set; } = string.Empty;
        public int year { get; set; }
        public int quarter { get; set; }
        public int therapeuticcategory_id { get; set; }
        public string therapeuticcategory_name { get; set; } = string.Empty;
        public int salesforcename_id { get; set; }
        public string salesforcename_name { get; set; } = string.Empty;
        public int physicianfocus_id { get; set; }
        public string physicianfocus_name { get; set; } = string.Empty;
        public int product_id { get; set; }
        public string product_name { get; set; } = string.Empty;
        public float salesforce_size { get; set; }
        public int pc_product { get; set; }
        public int sp_product { get; set; }
        public int total_therapeuticategory{ get; set; }
        public int pc_salesforce { get; set; }
        public int total_salesforce { get; set; }
        public int sp_salesforce { get; set; }
    }

    public class TotalCompanyDeploymentByCountryAndTCGridDataModel
    {
        public int company_id { get; set; }
        public string? company_name { get; set; }
        public int country_id { get; set; }
        public string? country_name { get; set; }
        public int therapeuticcategory_id { get; set; }
        public string therapeuticcategory_name { get; set; } = string.Empty;
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
        public string? column_names { get; set; }
        public string? citations_text { get; set; }
    }

    public class TotalCompanyDeploymentByCountryAndTCChartDataModel
    {
        public int company_id { get; set; }
        public string? company_name { get; set; }
        public int country_id { get; set; }
        public string? country_name { get; set; }
        public int therapeuticcategory_id { get; set; }
        public string therapeuticcategory_name { get; set; } = string.Empty;
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
    }

    public class CompanyDeploymentByCountryPCAndSpecialtyGridDataModel
    {
        public int company_id { get; set; }
        public string? company_name { get; set; }
        public int country_id { get; set; }
        public string? country_name { get; set; }
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
        public string? column_names { get; set; }
        public string? citations_text { get; set; }
    }

    public class CompanyDeploymentByCountryPCAndSpecialtyChartDataModel
    {
        public int company_id { get; set; }
        public string? company_name { get; set; }
        public int country_id { get; set; }
        public string? country_name { get; set; }
        public float pc { get; set; }
        public float sp { get; set; }
        public float total { get; set; }
    }
}
