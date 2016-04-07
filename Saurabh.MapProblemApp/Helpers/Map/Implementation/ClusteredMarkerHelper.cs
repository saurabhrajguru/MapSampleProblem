using GoogleMaps.Net.Clustering.Data.Geometry;
using GoogleMaps.Net.Clustering.Data.Params;
using GoogleMaps.Net.Clustering.Data.Responses;
using GoogleMaps.Net.Clustering.Infrastructure;
using GoogleMaps.Net.Clustering.Services;
using Saurabh.MapProblemApp.Models.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saurabh.MapProblemApp.Helpers.Map.Implementation
{
   public class ClusteredMarkerHelper : IClusteredMarkerHelper
    {
       private IMapHelper mapHelper= null;
       private string clusterPointsCacheKey = null;

       public ClusteredMarkerHelper(IMapHelper mapHelper)
       {
           this.mapHelper = mapHelper;
           this.clusterPointsCacheKey = "cachekey";
       }

        ClusterMarkersResponse IClusteredMarkerHelper.GetClusters(GetMarkersParams param)
        {
            var points = GetClusterPointCollection(this.clusterPointsCacheKey);

            var mapService = new ClusterService(points);
            param.PointType = this.clusterPointsCacheKey;
            var markers = mapService.GetClusterMarkers(param);

            return markers;
        }

        MarkerInfo IClusteredMarkerHelper.GetMarkerInfo(int uid)
        {
            var points = GetClusterPointCollection(this.clusterPointsCacheKey);
            var point = points.Get(this.clusterPointsCacheKey).SingleOrDefault(a => a.Uid == uid);
            return new MarkerInfo() { Image = (string)point.Data };
        }

        private PointCollection GetClusterPointCollection(string clusterPointsCacheKey)
        {
            var points = new PointCollection();
            if (points.Exists(clusterPointsCacheKey))
                return points;

            var dbPoints = this.mapHelper.GetAllRegions(); // Get your points here
            var mapPoints = dbPoints.Select(p => new MapPoint() { X = p.Longitude, Y = p.Latitude, Data = p.Image }).ToList();
            var cacheDuration = TimeSpan.FromHours(6);
            points.Set(mapPoints, cacheDuration, clusterPointsCacheKey);

            return points;
        }
    }
}
