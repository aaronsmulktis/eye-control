/*global google*/

// var homes = [
//   ['Elysten', 51.523325, -0.183299, '/home1'],
//   ['Gateways', 51.501483, -0.141948, '/home1'],
//   ['Ministry of Sound', 51.497740, -0.099440, '/home1'],
//   ['22 Hugon Road', 51.467892, -0.191422, '/home1'],
//   ['Radcliff House', 51.490478, -0.061075, '/home1']
// ];

var handle = Meteor.subscribe("homes");
window.handle_coords = Meteor.subscribe("coords");
var homes;
if (!handle.ready()) {
    function loadHomes() {
        if (!handle.ready()) {
            setTimeout(loadHomes, 100);
            return;
        }
        homes = Homes.find().fetch();
    }
    setTimeout(loadHomes, 100);
}

var fadeTime = 300;
var mainMap;

var infowindow = [];
var marker = [];

var styles = [
  {
    stylers: [
      { hue: "#00ffe6" },
      { saturation: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

function initialize() {

    if (!window.google) {
        return;
    }
    mainMap = new google.maps.Map(document.getElementById('mainMap'), {
        center: {lat: 51.507194, lng: -0.118085},
        zoom: 12,
        styles: styles
    });

    processHomes(homes);
    // setMarkers(mainMap);
}

// function initialize() {
//     var myLatlng = new google.maps.LatLng(51.523325, -0.183299);
//     var myOptions = {
//         zoom: 9,
//         center: myLatlng,
//         mapTypeId: google.maps.MapTypeId.TERRAIN
//     }
//     mainMap = new google.maps.Map(document.getElementById("mainMap"), myOptions);

// }

function createMarker(lat, lon, html, link) {
    var house = {
        // path: 'M 0.9,7.4 6,2.3 11.1,7.3 9.8,9.7 6.9,9.7 6.9,6.9 5.9,6.9 5.1,6.9 5.1,9.7 2.2,9.7 z',
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: 0.66,
        // strokeColor: black,
        strokeWeight: 0.33,
        scale: 8
    };

    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    var newMarker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: mainMap,
        icon: house,
        shape: shape,
        path: google.maps.SymbolPath.CIRCLE,
        title: html
    });

    newMarker['infowindow'] = new google.maps.InfoWindow({
        content: html
    });

    google.maps.event.addListener(newMarker, 'click', function() {
        window.location = link;
    });

    google.maps.event.addListener(newMarker, 'mouseover', function() {
        this['infowindow'].open(mainMap, this);
        // mainMap.panTo(newMarker.getPosition());
    });

    google.maps.event.addListener(newMarker, 'mouseout', function(){
        this['infowindow'].close(mainMap, this);
    });

    marker.push(newMarker);
}

function processHomes(markers) {
    for (var i = 0; i < markers.length; i++) {
        createMarker(markers[i].latitude, markers[i].longitude, markers[i].name, 'home/' + markers[i]._id);
    }
 //    homes.forEach(function(home){
	// 	console.log(home.latitude, home.longitude);
	// 	createMarker(home.latitude, home.longitude, home.name, home.slug);
	// });
}

jQuery(window).on('load', function($) {

});

jQuery(document).ready(function($) {
    var deleteLinks = document.querySelectorAll('.delete');

    for (var i = 0; i < deleteLinks.length; i++) {
        deleteLinks[i].addEventListener('click', function(event) {
            event.preventDefault();

            var choice = confirm(this.getAttribute('data-confirm'));

            if (choice) {
                document.querySelector(".trigger").onclick()
            }
        });
    }

    if (!window.handle_coords.ready()) {
        function loadCoords() {
            if (!window.handle_coords.ready()) {
                setTimeout(loadCoords, 100);
                return;
            }
            var query = Coords.find();
            window.handle_coords = query.observeChanges({
                added: function (id, coord) {
                    if (id !== "headset") {
                        return;
                    }
                    var frame = $('.vr-iframe').first()[0];
                    if (!frame) {
                        return;
                    }
                    var idx = frame.src.indexOf('#'), url = frame.src;
                    if ( idx > -1 ){
                        url = url.substr(0, idx);
                    }

                    frame.src = url + '#' + coord.coord;
                },
                changed: function (id, coord) {
                    if (id !== "headset") {
                        return;
                    }
                    var frame = $('.vr-iframe').first()[0];
                    if (!frame) {
                        return;
                    }
                    var idx = frame.src.indexOf('#'), url = frame.src;
                    if ( idx > -1 ){
                        url = url.substr(0, idx);
                    }

                    frame.src = url + '#' + coord.coord;
                }
            });
        }
        setTimeout(loadCoords, 100);
    }

});

// HTML5 Events

// var editable = document.getElementById('circTitle');

// addEvent(editable, 'blur', function () {
//   // lame that we're hooking the blur event
//   localStorage.setItem('contenteditable', this.innerHTML);
//   document.designMode = 'off';
// });

// addEvent(editable, 'focus', function () {
//   document.designMode = 'on';
// });

// addEvent(document.getElementById('clear'), 'click', function () {
//   localStorage.clear();
//   window.location = window.location; // refresh
// });

// if (localStorage.getItem('contenteditable')) {
//   editable.innerHTML = localStorage.getItem('contenteditable');
// }
