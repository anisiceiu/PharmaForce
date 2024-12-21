using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IGraphB2CServiceClientFactory
    {
        GraphServiceClient GetB2CAuthenticatedGraphClient();
    }
}
