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


// Map component - entry component setup in router
Map = React.createClass({
    // This mixin makes the getMeteorData method work

    mixins: [sortable.ListMixin],

    onBeforeSetState: function(items){
        for(var i = 0; i < items.length; i++) {
            items[i].position = i;
            Homes.update({_id:items[i]._id}, {$set: {position: i}});
        }
    },

    initialize() {
        if (this.state.mainMap) {
            return;
        }
        var initialize = this.initialize;
        if (!window.google || !document.getElementById('mainMap')) {
            setTimeout(initialize, 300);
            return;
        }
        this.setState({"mainMap":
                       new google.maps.Map(document.getElementById('mainMap'), {
                           center: {lat: 51.507194, lng: -0.118085},
                           zoom: 12,
                           styles: styles
                       })
        });
    },

    getInitialState() {
        return {
            mainMap: false,
            markers: []
        }
    },

    componentDidMount() {
        this.initialize();

        var handle_coords = Meteor.subscribe("coords");

        var updateFrame = function(id, coord) {
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

        if (!handle_coords.ready()) {
            function loadCoords() {
                if (!handle_coords.ready()) {
                    setTimeout(loadCoords, 100);
                    return;
                }
                var query = Coords.find();
                handle_coords = query.observeChanges({
                    added: updateFrame,
                    changed: updateFrame
                });
            }
            setTimeout(loadCoords, 100);
        }
    },

    componentDidUpdate() {
        this.initialize();
    },

    componentWillReceiveProps(nextProps) {
        this.setState({'items': nextProps.homes});
        this.processHomes(nextProps.homes);
    },

    createMarker(lat, lon, html, link) {
        var state = this.state;
        var house = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: 0.66,
            strokeWeight: 0.33,
            scale: 8
        };

        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
        };

        var newMarker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map: state.mainMap,
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
            this['infowindow'].open(state.mainMap, this);
        });

        google.maps.event.addListener(newMarker, 'mouseout', function(){
            this['infowindow'].close(state.mainMap, this);
        });

        this.state.markers.push(newMarker);
    },

    processHomes(homes) {
        var processHomes = this.processHomes;
        if (!window.google || !this.state.mainMap) {
            setTimeout(function() { processHomes(homes) }, 300);
            return;
        }
        for (var i = 0; i < homes.length; i++) {
            this.createMarker(homes[i].latitude, homes[i].longitude, homes[i].name, 'home/' + homes[i]._id);
        }
    },

    renderHomeBoxes() {
        var homes = this.state.items;
        var processedHomes = [];
        for (var i=0; i<homes.length;i++) {
            var home = homes[i],
                position = home.position;
            processedHomes[position] = <HomeBox key={home._id} home={home} name={home.name} propPic={home.propPic} latitude={home.latitude} longitude={home.longitude} index={position} {...this.movableProps}/>;
        }
        return <ul>{processedHomes}</ul>;
    },


    render() {
        if (!this.state.items) {
            return (
                <div>Loading...</div>
            );
        }
        return (

            <div id="contentContainer" className="container-fluid noPadding">
                <div id="mainContent" className="col-sm-12 col-lg-10 col-lg-offset-1 noPadding">
                    <header>
                        {this.props.header}
                    </header>
                    <div className="container-fluid noPadding">
                        <div className="propList col-xs-6">
                            <h4 className="text-right">Property List</h4>
                            {this.renderHomeBoxes()}
                        </div>
                        <div id="mainMap" className="col-xs-6 noPadding">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

MapWrapper = React.createClass({
    mixins: [ReactMeteorData],
    // Loads items from the Homes collection and puts them on this.data.homes
    getMeteorData() {
        var data = {homes: []};
        var handle = Meteor.subscribe("homes");

        if (handle.ready()) {
            data = {homes: Homes.find({}, {
                sort: {
                    position: 1
                }
            }).fetch()
            }
        }
        return data;
    },
    render: function(){
        return(
            <Map homes={this.data.homes} />
        )
    }
});
