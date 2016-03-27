using CsvHelper;
using Saurabh.MapProblemApp.Models.Map;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;

namespace Saurabh.MapProblemApp.Helpers.Map.Implementation
{
    /// <summary>
    /// Class MapHelper.
    /// </summary>
    /// <seealso cref="Saurabh.MapProblemApp.Helpers.Map.IMapHelper" />
    public class MapHelper : IMapHelper
    {
        IList<Marker> IMapHelper.GetAllRegions()
        {
            var csvFilePath = HostingEnvironment.MapPath(@"~/App_Data/Markers.csv");
            using (var textReader = new StreamReader(csvFilePath))
            {
                var csv = new CsvReader(textReader);
                var records = csv.GetRecords<Marker>().ToList();
                return records;
            }
        }
    }
}