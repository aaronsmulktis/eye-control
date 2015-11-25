/*global google*/

var homes = [
  ['Elysten', 51.523325, -0.183299, '/home1'],
  ['Gateways', 51.501483, -0.141948, '/home1'],
  ['Ministry of Sound', 51.497740, -0.099440, '/home1'],
  ['22 Hugon Road', 51.467892, -0.191422, '/home1'],
  ['Radcliff House', 51.490478, -0.061075, '/home1']
];

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
    if (!google) {
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

function processHomes(homes) {
    for (var i = 0; i < homes.length; i++) {
        console.log(homes[i][3]);
        createMarker(homes[i][1], homes[i][2], homes[i][0], homes[i][3]);
    }
}


// function goSharp() {
//   $('#viewVR').toggleClass('sharp');
// }

// $('#viewVR').on('mouseover', goSharp);

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
});

// HTML5 Events

var editable = document.getElementById('circTitle');

addEvent(editable, 'blur', function () {
  // lame that we're hooking the blur event
  localStorage.setItem('contenteditable', this.innerHTML);
  document.designMode = 'off';
});

addEvent(editable, 'focus', function () {
  document.designMode = 'on';
});

addEvent(document.getElementById('clear'), 'click', function () {
  localStorage.clear();
  window.location = window.location; // refresh
});

if (localStorage.getItem('contenteditable')) {
  editable.innerHTML = localStorage.getItem('contenteditable');
}
