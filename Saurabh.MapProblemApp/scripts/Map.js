$(document).ready(function () {
    showloading();
    initMap();
});

function initMap() {
   var mapDiv = document.getElementById('map');
   var map = new google.maps.Map(mapDiv, {
        center: { lat: 21.767, lng: -78.871 },
        zoom: 8,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        fitToMarkersBounds: true
    });

    $.ajax({
        type: 'POST',
        url: '/Map/Markers',
        success: function (Data) {
            onMarkersReceived(Data,map);
        }
    });
}

function onMarkersReceived(markers,map) {
    var markersArray = [];
    var markerBounds = new google.maps.LatLngBounds();
    $.each(markers, function (index, value) {
        var markerLocation = new google.maps.LatLng(value.Latitude, value.Longitude);
        markerBounds.extend(markerLocation);
        var marker = new google.maps.Marker({ position: markerLocation, icon: $.getUrl('Images/pin-blue.png') });
        markersArray.push(marker);

        var boxdiv = document.createElement("div");
        boxdiv.className = "infobox-container"
        var image = document.createElement("img");
        image.src = $.getUrl('Images/' + value.Image + '.gif')
        image.className = "infobox-img";

        boxdiv.appendChild(image)

        var bubbledown = document.createElement("div");
        bubbledown.className = "bubble-down";
        boxdiv.appendChild(bubbledown);

        var boxOptions = {
            content: boxdiv
                , disableAutoPan: false
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
        google.maps.event.addListener(marker, 'map_changed', function () {
            if (this.getMap()) {
                ib.open(this.getMap(), this);
            } else {
                ib.close()
            }
        });
    });

    var markerCluster = new MarkerClusterer(map, markersArray);
    map.fitBounds(markerBounds);
    hideLoading();
}

function showloading() {
    var loadingDiv = document.createElement("div");
    loadingDiv.id = "overlay";

    var image = document.createElement("img");
    image.id = "loading";
    image.src = $.getUrl('Images/loading.gif')
    loadingDiv.appendChild(image);

    $(loadingDiv).appendTo('body');
}

function hideLoading() {
    $('#overlay').remove();
}