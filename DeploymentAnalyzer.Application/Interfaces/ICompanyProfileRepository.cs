using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface ICompanyProfileRepository : IGenericRepository<CompanyProfileModel>
    {
        Task<IReadOnlyList<CompanyProfileModel>> GetCompanyForProfileListAsync(CompanyProfileRequest request);

        Task<IReadOnlyList<CompanyProfileModel>> GetFavoriteCompanyListAsync(FavoriteCompanyListRequest request);
        Task<int> AddRemoveFavoriteCompanyAsync(AddRemoveFavoriteCompanyRequest request);
        Task<IReadOnlyList<CompanyProfileDataModel>> GetCompanyProfileRecordsAsync(CompanyProfileListRequest request);
        Task<CompanyProfileTopInfoModel> GetCompanyProfileTopInfoAsync(CompanyProfileListRequest request);
        Task<IReadOnlyList<TherapeuticCategoryWiseCompanyInfoModel>> GetTherapeuticCategoryWiseCompanyInfoAsync(CompanyProfileListRequest request);
        Task<IReadOnlyList<AdditionalNote>> GetAdditionalNoteListAsync(CompanyProfileListRequest request);
        Task<IReadOnlyList<CompanyProductProfileUserFilterModel>> GetCompanyProductProfileUserPreferences(CompanyProductProfileUserPreferenceRequest request);
        Task<int> AddUpdateCompanyProductProfileUserPreference(AddUpdateCompanyProductProfileUserPreferenceRequest request);
        Task<IReadOnlyList<CompanyUpdateInfoModel>> GetCompanyUpdateInfoAsync(BaseRequest request);
        Task<int> SubscribeUnSubscribeFavoriteCompanyAsync(SubscribeUnSubscribeFavoriteCompanyRequest request);
    }
}
