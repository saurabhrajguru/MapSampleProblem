using GoogleMaps.Net.Clustering.Data.Params;
using Saurabh.MapProblemApp.Helpers.Map;
using System.Web.Mvc;

namespace Saurabh.MapProblemApp.Controllers.Map
{
    /// <summary>
    /// Class MapController.
    /// </summary>
    /// <seealso cref="System.Web.Mvc.Controller" />
    public class MapController : Controller
    {
        #region Attributes
        private IClusteredMarkerHelper markerHelper = null;
        #endregion

        #region .ctor

        /// <summary>
        /// Initializes a new instance of the <see cref="MapController"/> class.
        /// </summary>
        /// <param name="mapHelper">The map helper.</param>
        public MapController(IClusteredMarkerHelper markerHelper)
        {
            this.markerHelper = markerHelper;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Action for Index
        /// </summary>
        /// <returns>ActionResult.</returns>
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetMarkers(GetMarkersParams markerparams)
        {
            return Json(this.markerHelper.GetClusters(markerparams), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMarkerInfo(int? id)
        {
            return Json(this.markerHelper.GetMarkerInfo(id.Value), JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}