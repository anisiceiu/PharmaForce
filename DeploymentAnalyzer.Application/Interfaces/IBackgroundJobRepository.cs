

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IBackgroundJobRepository
    {
        Task<int> AddNewJob ();
    }
}
