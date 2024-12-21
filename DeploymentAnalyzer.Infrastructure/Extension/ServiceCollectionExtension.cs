using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Infrastructure.Repository;
using Microsoft.Extensions.DependencyInjection;

namespace DeploymentAnalyzer.Infrastructure.Extension
{
    public static class ServiceCollectionExtension
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddTransient<INewsManagementRepository, NewsManagementRepository>();
            services.AddTransient<ICompanyRepository, CompanyRepository>();
            services.AddTransient<ICompanyProfileRepository, CompanyProfileRepository>();
            services.AddTransient<IDataManagerRepository, DataManagerRepository>();
            services.AddTransient<IDataManagerProductRepository, DataManagerProductRepository>();
            services.AddTransient<ICitationRespository, CitationRepository>();
            services.AddTransient<INotesRespository, NotesRepository>();
            services.AddTransient<IMasterCodeRepository, MastercodeRepository>();
            services.AddTransient<IQCQueuesRepository, QCQueuesRepository>();
            services.AddTransient<IAccountRepository, AccountRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IDepUserRepository, DepUserRepository>();
            services.AddTransient<IUserEmailSuffixRepository, UserEmailSuffixRepository>();
            services.AddTransient<ICountryRepository, CountryRepository>();
            services.AddTransient<IPeriodRepository, PeriodRepository>();
            services.AddTransient<ITherapeuticCategoryRepository, TherapeuticCategoryRepository>();
            services.AddTransient<IUserRightsRepository, UserRightsRepository>();
            services.AddTransient<IAdminRepository, AdminRepository>();
            services.AddTransient<ICountryRepository, CountryRepository>();
            services.AddTransient<ICompanyCountryRepository, CompanyCountryRepository>();
            services.AddTransient<IAdminPermissionRepository, AdminPermissionRepository>();
            services.AddTransient<IUserClientRepository, UserClientRepository>();
            services.AddTransient<IUserPreferenceRepository, UserPreferenceRepository>();
            services.AddTransient<IAdminLogRepository, AdminLogRepository>();
            services.AddTransient<ICountryCompanyRepository, CountryCompanyRepository>();
            services.AddTransient<IPeriodSalesforceRepository, PeriodSalesforceRepository>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddTransient<IUserLoginDetailRepository, UserLoginDetailRepository>();
            services.AddTransient<IKeyUpdateManagementRepository, KeyUpdateManagementRepository>();
            services.AddTransient<IRegionRepository, RegionRepository>();
            services.AddTransient<IProductProfileRepository, ProductProfileRepository>();
            services.AddTransient<IMyBrandRepository, MyBrandRepository>();
            services.AddTransient<IGenericNameRepository, GenericNameRepository>();
            services.AddTransient<ISalesforceRepository, SalesforceRepository>();
            services.AddTransient<IBackgroundJobRepository, BackgroundJobRepository>();
            services.AddTransient<IAnalyticsRepository, AnalyticsRepository>();
            services.AddTransient<IGraphService, GraphService>();
            services.AddTransient<IGraphServiceClientFactory, GraphServiceClientFactory>();
            services.AddTransient<IGraphAuthProvider, GraphAuthProvider>();
            services.AddSingleton<IGraphB2CServiceClientFactory, GraphB2CServiceClientFactory>();
            services.AddSingleton<IGraphB2CAuthProvider, GraphB2CAuthProvider>();
            services.AddTransient<IGraphMailService, GraphMailService>();
        }
    }
}
