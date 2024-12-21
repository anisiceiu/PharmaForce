using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IProductProfileRepository : IGenericRepository<ProductProfileModel>
    {
        Task<IReadOnlyList<ProductProfileModel>> GetProductForProfileListAsync(ProductProfileRequest request);
        Task<int> AddRemoveFavoriteProductAsync(AddRemoveFavoriteProductRequest request);

        Task<IReadOnlyList<ProductProfileModel>> GetFavoriteProductListAsync(FavoriteProductListRequest request);
        Task<IReadOnlyList<ProductProfileDataModel>> GetProductProfileRecordsAsync(ProductProfileListRequest request);
        Task<ProductProfileTopInfoModel> GetProductProfileTopInfoAsync(ProductProfileListRequest request);
        Task<IReadOnlyList<TherapeuticCategoryWiseProductInfoModel>> GetTherapeuticCategoryWiseProductInfoAsync(ProductProfileListRequest request);
        Task<IReadOnlyList<AdditionalNote>> GetAdditionalNoteListAsync(ProductProfileListRequest request);
        Task<int> SubscribeUnSubscribeFavoriteProductAsync(SubscribeUnSubscribeFavoriteProductRequest request);
    }
}
