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
        private IMapHelper mapHelper = null;
        #endregion

        #region .ctor

        /// <summary>
        /// Initializes a new instance of the <see cref="MapController"/> class.
        /// </summary>
        /// <param name="mapHelper">The map helper.</param>
        public MapController(IMapHelper mapHelper)
        {
            this.mapHelper = mapHelper;
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

        /// <summary>
        /// Returns markers
        /// </summary>
        /// <returns>JsonResult.</returns>
        [HttpPost]
        public JsonResult Markers()
        {
            return Json(this.mapHelper.GetAllRegions());
        }

        #endregion
    }
}