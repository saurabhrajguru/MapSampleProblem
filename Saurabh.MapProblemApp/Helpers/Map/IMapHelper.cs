using Saurabh.MapProblemApp.Models.Map;
using System.Collections.Generic;

namespace Saurabh.MapProblemApp.Helpers.Map
{
    /// <summary>
    /// Interface IMapHelper
    /// </summary>
    public interface IMapHelper
    {
        /// <summary>
        /// Gets all regions.
        /// </summary>
        /// <returns>IList&lt;Marker&gt;.</returns>
        IList<Marker> GetAllRegions();
    }
}