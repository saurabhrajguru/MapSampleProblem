using System.Web.Optimization;

namespace Saurabh.MapProblemApp.App_Start
{
    /// <summary>
    /// Class BundleConfig.
    /// </summary>
    public class BundleConfig
    {
        /// <summary>
        /// Registers the bundles.
        /// </summary>
        /// <param name="bundles">The bundles.</param>
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                       "~/scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                     "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/gmaps-libs").Include(
                     "~/scripts/markerclusterer.js",
                     "~/scripts/infobox.js"));

            bundles.Add(new ScriptBundle("~/bundles/map").Include(
                     "~/scripts/Map.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                     "~/Content/bootstrap.css",
                     "~/Content/layout.css"));

            bundles.Add(new StyleBundle("~/Content/map").Include(
                     "~/Content/map.css"));
        }
    }
}