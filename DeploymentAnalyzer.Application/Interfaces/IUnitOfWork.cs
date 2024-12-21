namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IUnitOfWork
    {
        INewsManagementRepository NewsManagement { get; }

        ICompanyRepository Company { get; }

        IAccountRepository Account { get; }

        IDataManagerRepository DataManager { get; }

        IDataManagerProductRepository DataManagerProduct { get; }

        ICitationRespository Citation { get; }

        INotesRespository Notes { get; }

        IMasterCodeRepository MasterCode { get; }

        IQCQueuesRepository QCQueues { get; }
        IUserRepository User { get; }
        IDepUserRepository DepUser { get; }
        IUserEmailSuffixRepository UserEmailSuffix { get; }
        ICountryRepository Country { get; }
        IPeriodRepository Period { get; }
        ITherapeuticCategoryRepository TherapeuticCategory { get; }
        IUserRightsRepository UserRights { get; }
        IAdminRepository Admin { get; }
        ICompanyCountryRepository CompanyCountry { get; }
        IAdminPermissionRepository AdminPermission { get; }
        IUserClientRepository UserClient { get; }
        IUserPreferenceRepository UserPreference { get; }
        IAdminLogRepository AdminLog { get; }
        IUserLoginDetailRepository UserLoginDetails { get; }
        ICountryCompanyRepository   CountryCompany { get; }
        IPeriodSalesforceRepository  PeriodSalesforce { get; }

        ICompanyProfileRepository CompanyProfile { get; }
        IProductProfileRepository ProductProfile { get; }

        IKeyUpdateManagementRepository KeyUpdateManagement { get; }

        IRegionRepository Region { get; }
        IMyBrandRepository  MyBrandRepository { get; }
        IGenericNameRepository GenericNameRepository { get; }
        ISalesforceRepository   SalesforceRepository { get; }
        IBackgroundJobRepository BackgroundJobRepository { get; }
        IAnalyticsRepository AnalyticsRepository { get; }
    }
}
