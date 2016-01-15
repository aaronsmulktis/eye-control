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

    getInitialState() {
        return {
            isList: false,
            isMap: false
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
                scrollwheel: false,
                center: {lat: 51.491194, lng: -0.200085},
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
                    position = home.position == null ? i : home.position;
            processedHomes[position] = <HomeBox key={home._id} home={home} name={home.name} propPic={home.propPic} latitude={home.latitude} longitude={home.longitude} index={position} {...this.movableProps}/>;
        }
        return <ul>{processedHomes}</ul>;
    },

    renderSearchView() {
        var defaultClasses = [''],
            listClasses = classNames(defaultClasses, {active: this.state.isList}),
            mapClasses = classNames(defaultClasses, {active: this.state.isMap});
        return (
            <div id="searchView" className="pull-left">
                <ul className="list-inline">
                    <li>
                        <a onClick={this._toggleViewOption.bind(this, "isList")} data-toggle="button" aria-pressed="false" autoComplete="off">
                            <i className="fa fa-navicon"></i> List
                        </a>
                    </li>
                    <li>
                        <a onClick={this._toggleViewOption.bind(this, "isMap")} data-toggle="button" aria-pressed="false" autoComplete="off">
                            <i className="fa fa-map-marker"></i> Map
                        </a>
                    </li>
                </ul>
            </div>
        );
    },

    _toggleViewOption(optionName) {
        var changedOption = !this.state[optionName];
        var optionState = {};
        optionState[optionName] = changedOption;
        this.setState(optionState);
        var hud = this._getHud();
        hud[optionName] = changedOption;
    },

    render() {
        if (!this.state.items) {
            return (
                    <div className="loader-container">
                        <div className="loader"><span>Loading...</span></div>
                    </div>
            );
        }
        return (

            <div id="contentContainer" className="container-fluid noPadding">
                <div id="mainContent" className="col-sm-12 noPadding">
                    <header>
                            {this.props.header}
                    </header>
                    <div className="container-fluid noPadding">
                        
                        <div id="searchOptions" className="col-sm-12">
                            {this.renderSearchView()}
                            <div id="searchMap">
                                <form className="navbar-form navbar-left noPadding" role="search">
                                  <div className="form-group">
                                    <input id="search-homes" type="text" className="form-control" placeholder="Search Map.."><i id="searchIcon" className="fa fa-search"></i></input>
                                  </div>
                                </form>
                            </div>
                            <div id="propTypes">
                                <ul className="list-inline pull-left">
                                    <li>
                                        <div className="checkbox">
                                            <label>
                                              <input type="checkbox"> For Sale</input>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="checkbox">
                                            <label>
                                              <input type="checkbox"> For Rent</input>
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="propOptions">
                                <div className="form-group pull-left pad10 noMargin">
                                  <select className="form-control" id="roomSelect">
                                    <option>Bedrooms</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                  </select>
                                </div>
                                <div className="form-group pull-left pad10 noMargin">
                                  <select className="form-control" id="bathSelect">
                                    <option>Bathrooms</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                  </select>
                                </div>
                            </div>
                        </div>

                        <div id="mainMap" className="col-sm-12 noPadding"></div>

                        <div className="mapList col-sm-6">

                            <div className="listOptions">
                                <div id="searchBar" className="navbar-left">
                                    <form className="navbar-form navbar-left noPadding" role="search">
                                      <div className="form-group">
                                        <input id="search-homes" type="text" className="form-control" placeholder="Filter listings.."></input>
                                      </div>
                                    </form>
                                </div>
                            </div>

                            <h3 className="propListTitle text-right">All Properties</h3>

                            <div className="propList">
                                {this.renderHomeBoxes()}
                            </div>
                        </div>

                        <div id="mapView" className="col-sm-6"></div>

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
                let data = {homes: []};
                let status = HomeSearch.getStatus();

                if (status.loaded) {
                    data = {homes: HomeSearch.getData()};
                }
                return data;
        },

        _handleKey(event){
            if (document.getElementById('search-homes') === document.activeElement) {
                var text = $(event.target).val().trim();
                HomeSearch.search(text);
                if (event.keyCode == 27) {
                  $(event.target).val("");
                }
            }
        },

        componentWillMount(){
            HomeSearch.search("");
            document.addEventListener("keyup", this._handleKey, false);
        },


        componentWillUnmount() {
            document.removeEventListener("keyup", this._handleKey, false);
        },
/*
        getHomes: function() {
        return HomeSearch.getData({
          transform: function(matchText, regExp) {
            return matchText.replace(regExp, "<b>$&</b>")
          },
          sort: {createdAt: -1}
        });
      },
      isLoading: function() {
        return HomeSearch.getStatus().loading;
      },
      */

        render: function(){

                return(
                        <Map homes={this.data.homes} {...this.props} />
                )
        }
});
