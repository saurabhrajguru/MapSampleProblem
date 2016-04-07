using GoogleMaps.Net.Clustering.Data.Params;
using GoogleMaps.Net.Clustering.Data.Responses;
using Saurabh.MapProblemApp.Models.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saurabh.MapProblemApp.Helpers.Map
{
    public interface IClusteredMarkerHelper
    {
        ClusterMarkersResponse GetClusters(GetMarkersParams param);

        MarkerInfo GetMarkerInfo(int uid);
    }
}
