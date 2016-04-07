var gmc;

(function ($) {
    gmc = {
        markers: [], // markers on screen    
        map: undefined,
        infowindow: undefined,
        debugMarker: undefined,
        debuginfo: undefined,
        geocoder: new google.maps.Geocoder(),
        debug: {
            showGridLines: false,
            showBoundaryMarker: false
        },
        log: function (s) {
            if (console && console.log) {
                console.log(s);
            }
        },
        round: function (num, decimals) {
            return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
        },
        zoomIn: function () {
            var z = gmc.map.getZoom();
            gmc.map.setZoom(z + 1);
        },
        zoomOut: function () {
            var z = gmc.map.getZoom();
            gmc.map.setZoom(z - 1);
        },
        mymap: {
            initialize: function () {
                gmc.map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: 21.767, lng: -78.871 },
                    zoom: gmc.mymap.settings.zoomLevel,
                    streetViewControl: false,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_TOP
                    }
                });

                google.maps.event.addListener(gmc.map, 'idle', function () { gmc.mymap.events.getBounds(); });
                google.maps.event.trigger(gmc.map, 'zoom_changed');
            },
            settings: {
                mapCenterLat: 35,
                mapCenterLon: 10,
                zoomLevel: 2,

                alwaysClusteringEnabledWhenZoomLevelLess: 2,

                jsonGetMarkersUrl: '/Map/GetMarkers/',
                jsonGetMarkerInfoUrl: '/Map/GetMarkerInfo',

                clusterImage: {
                    src: $.getUrl('Images/clusters/clusterinvisible.png'),
                    height: 60,
                    width: 60,
                    offsetH: 30,
                    offsetW: 30
                },

                pinImage: {
                    src: $.getUrl('Images/pin-blue.png'),
                    height: 28,
                    width: 21,
                    offsetH: 0,
                    offsetW: 0
                }
            },
            events: {
                getBounds: function () {

                    var bounds = gmc.map.getBounds()
                    , NE = bounds.getNorthEast()
                    , SW = bounds.getSouthWest()
                    , mapData = [];

                    mapData.neLat = gmc.round(NE.lat(), 7); // round to precision needed
                    mapData.neLon = gmc.round(NE.lng(), 7);
                    mapData.swLat = gmc.round(SW.lat(), 7);
                    mapData.swLon = gmc.round(SW.lng(), 7);
                    mapData.zoomLevel = gmc.map.getZoom();

                    gmc.mymap.events.loadMarkers(mapData);
                },

                polys: [],
                loadMarkers: function (mapData) {

                    var clusterImg = new google.maps.MarkerImage(gmc.mymap.settings.clusterImage.src,
                            new google.maps.Size(gmc.mymap.settings.clusterImage.width, gmc.mymap.settings.clusterImage.height),
                            null, new google.maps.Point(gmc.mymap.settings.clusterImage.offsetW, gmc.mymap.settings.clusterImage.offsetH)
                        );

                    var pinImg = new google.maps.MarkerImage(gmc.mymap.settings.pinImage.src,
                        new google.maps.Size(gmc.mymap.settings.pinImage.width, gmc.mymap.settings.pinImage.height), null, null)

                    var params = {
                        NorthEastLatitude: mapData.neLat,
                        NorthEastLongitude: mapData.neLon,
                        SouthWestLatitude: mapData.swLat,
                        SouthWestLongitude: mapData.swLon,
                        ZoomLevel: mapData.zoomLevel,
                        Filter: '',
                        ClientWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                        ClientHeigth: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                    };

                    $.ajax({
                        type: 'GET',
                        url: gmc.mymap.settings.jsonGetMarkersUrl,
                        data: params,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: function (data) {

                            var markersDrawTodo = gmc.dynamicUpdateMarkers(data.Markers, gmc.markers, gmc.getKey, true);

                            $.each(markersDrawTodo, function () {
                                var item = this;
                                var lat = item.Y; // lat
                                var lon = item.X; // lon

                                var latLng = new google.maps.LatLng(lat, lon, true);

                                // identify type and select icon
                                var iconImg;
                                if (item.Count === 1) {
                                    iconImg = pinImg; // fallback                                
                                } else {
                                    iconImg = clusterImg;
                                }

                                // this draws a new marker on map
                                var marker = new google.maps.Marker({
                                    position: latLng,
                                    map: gmc.map,
                                    icon: iconImg,
                                    zIndex: 1
                                });
                                var key = gmc.getKey(item);
                                marker.set('key', key); // ref used for next event, remove or keep the marker

                                if (item.Count === 1) { // single item, no cluster
                                    var boxdiv = document.createElement("div");
                                    boxdiv.className = "infobox-container";
                                    var image = document.createElement("img");
                                    image.src = $.getUrl('Images/loading.gif');
                                    image.className = "infobox-img";

                                    boxdiv.appendChild(image);

                                    var bubbledown = document.createElement("div");
                                    bubbledown.className = "bubble-down";
                                    boxdiv.appendChild(bubbledown);

                                    var boxOptions = {
                                        content: boxdiv
                                            , disableAutoPan: true
                                            , maxWidth: 55
                                            , pixelOffset: new google.maps.Size(-30, -30)
                                            , zIndex: null
                                            , boxStyle: {
                                                width: "55px"
                                            }
                                            , infoBoxClearance: new google.maps.Size(1, 1)
                                            , isHidden: false
                                            , pane: "floatPane"
                                            , closeBoxURL: ""
                                            , enableEventPropagation: false
                                            , alignBottom: true
                                    };
                                    var ib = new InfoBox(boxOptions);
                                    ib.open(gmc.map, marker);
                                    gmc.mymap.events.fetchpopupimage(image, item);

                                    google.maps.event.addListener(marker, 'map_changed', function () {
                                        if (this.getMap()) {
                                        } else {
                                            ib.close()
                                        }
                                    });
                                }
                                else { // cluster marker
                                    google.maps.event.addListener(marker, 'click', function (event) {
                                        var z = gmc.map.getZoom();
                                        var n;
                                        // zoom in steps are depended on current zoom level
                                        if (z <= 8) { n = 3; }
                                        else if (z <= 12) { n = 2; }
                                        else { n = 1; }

                                        gmc.map.setZoom(z + n);
                                        gmc.map.setCenter(latLng);
                                    });

                                    var label = new gmc.Label({
                                        map: gmc.map
                                    }, key, item.Count);

                                    label.bindTo('position', marker, 'position');
                                    label.bindTo('visible', marker, 'visible');
                                    var text = item.Count === undefined ? 'error' : item.Count;
                                    label.set('text', text);
                                }

                                gmc.markers.push(marker);
                            });

                            // clear array
                            markersDrawTodo.length = 0;
                        },
                        error: function (xhr, err) {
                        }
                    });
                },

                // marker detail
                fetchpopupimage: function (image, item) {
                    $.ajax({
                        type: 'GET',
                        url: gmc.mymap.settings.jsonGetMarkerInfoUrl,
                        data: { id: item.Uid },
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: function (data) {

                            $.loadImage($.getUrl('Images/' + data.Image + '.gif'))
                                .done(function (img) {
                                 image.src = img.src;
                            });
                        }
                    });
                }
            },
        },
        // lon, lat, count, type
        getKey: function (p) {
            var s = p.X + '__' + p.Y + '__' + p.C + '__' + p.T;
            return s.replace(/\./g, '_'); //replace . with _
        },
        // binary sum for toggle values
        toggleVal: function (arr) {
            return arr.reduce(function (p, c, i, a) {
                return p + (c * Math.pow(2, i));
            }, 0);
        },
        // set count labels, style and class for the clusters
        Label: function (optOptions, id, count) {
            this.setValues(optOptions);
            var span = this.span_ = document.createElement('span');

            if (count >= 10000) span.className = 'gmc_clustersize5';
            else if (count >= 1000) span.className = 'gmc_clustersize4';
            else if (count >= 100) span.className = 'gmc_clustersize3';
            else if (count >= 10) span.className = 'gmc_clustersize2';
            else span.className = 'gmc_clustersize1';

            var div = this.div_ = document.createElement('div');
            div.appendChild(span);
            div.className = 'countinfo_' + id;
            div.style.cssText = 'position: absolute; display: none;';
        },
        // Only update new markers not currently drawn and remove obsolete markers on screen
        dynamicUpdateMarkers: function (markers, cache, keyfunction, isclusterbased) {
            var markersCacheIncome = [] // points to be drawn, new points received
            , markersCacheOnMap = []  // current drawn points
            , p
            , key;

            // points to be displayed, diff of markersCacheIncome and markersCacheOnMap
            var markersDrawTodo = [];

            // store new points to be drawn                  
            for (i in markers) {
                if (markers.hasOwnProperty(i)) {
                    p = markers[i];
                    key = keyfunction(p); //key                            
                    markersCacheIncome[key] = p;
                }
            }
            // store current existing valid markers
            for (i in cache) {
                if (cache.hasOwnProperty(i)) {
                    m = cache[i];
                    key = m.get('key'); // key  
                    if (key !== 0) { // 0 is used as has been deleted
                        markersCacheOnMap[key] = 1;
                    }

                    if (key === undefined) {
                        gmc.log('error in code: key'); // catch error in code
                    }
                }
            }

            // add new markers from event not already drawn
            for (var i in markers) {
                if (markers.hasOwnProperty(i)) {
                    p = markers[i];
                    key = keyfunction(p); //key                            
                    if (markersCacheOnMap[key] === undefined) {
                        if (markersCacheIncome[key] === undefined) {
                            gmc.log('error in code: key2'); //catch error in code
                        }
                        var newmarker = markersCacheIncome[key];
                        markersDrawTodo.push(newmarker);
                    }
                }
            }

            // remove current markers which should not be displayed
            for (i in cache) {
                if (cache.hasOwnProperty(i)) {
                    var m = cache[i];
                    key = m.get('key'); //key                            
                    if (key !== 0 && markersCacheIncome[key] === undefined) {
                        if (isclusterbased === true) {
                            $('.countinfo_' + key).remove();
                        }
                        cache[i].set('key', 0); // mark as deleted
                        cache[i].setMap(null); // this removes the marker from the map
                    }
                }
            }

            // trim markers array size
            var temp = [];
            for (i in cache) {
                if (cache.hasOwnProperty(i)) {
                    key = cache[i].get('key'); //key                            
                    if (key !== 0) {
                        tempItem = cache[i];
                        temp.push(tempItem);
                    }
                }
            }

            cache.length = 0;
            for (i in temp) {
                if (temp.hasOwnProperty(i)) {
                    var tempItem = temp[i];
                    cache.push(tempItem);
                }
            }

            // clear array
            markersCacheIncome.length = 0;
            markersCacheOnMap.length = 0;
            temp.length = 0;

            return markersDrawTodo;
        },
    };

    gmc.Label.prototype = new google.maps.OverlayView;
    gmc.Label.prototype.onAdd = function () {
        var pane = this.getPanes().overlayLayer;
        pane.appendChild(this.div_);

        var that = this;
        this.listeners_ = [
            google.maps.event.addListener(this, 'idle', function () { that.draw(); }),
            google.maps.event.addListener(this, 'visible_changed', function () { that.draw(); }),
            google.maps.event.addListener(this, 'position_changed', function () { that.draw(); }),
            google.maps.event.addListener(this, 'text_changed', function () { that.draw(); })
        ];
    };

    gmc.Label.prototype.onRemove = function () {
        this.div_.parentNode.removeChild(this.div_);

        for (var i = 0, I = this.listeners_.length; i < I; ++i) {
            google.maps.event.removeListener(this.listeners_[i]);
        }
    };
    gmc.Label.prototype.draw = function () {
        var projection = this.getProjection();
        var position = projection.fromLatLngToDivPixel(this.get('position'));

        var div = this.div_;
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';

        var visible = this.get('visible');
        div.style.display = visible ? 'block' : 'none';

        this.span_.innerHTML = this.get('text').toString();
    };
    google.maps.event.addDomListener(window, 'load', gmc.mymap.initialize); // load map
})(jQuery);

$.loadImage = function (url) {
    var loadImage = function (deferred) {
        var image = new Image();

        image.onload = loaded;
        image.onerror = errored;
        image.onabort = errored;

        image.src = url;

        function loaded() {
            unbindEvents();
            deferred.resolve(image);
        }
        function errored() {
            unbindEvents();
            deferred.reject(image);
        }
        function unbindEvents() {
            image.onload = null;
            image.onerror = null;
            image.onabort = null;
        }
    };

    return $.Deferred(loadImage).promise();
};