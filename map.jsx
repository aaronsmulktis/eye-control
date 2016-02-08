let styles = [
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

let bedOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' }
];

let bathOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' }
];

let sortOptions = [
    { value: 'price:hi-lo', label: 'Price: Hi - Lo' },
    { value: 'price:lo-hi', label: 'Price: Lo - Hi ' },
    { value: 'city:a-z', label: 'City: A - Z' },
    { value: 'city:z-a', label: 'City: Z - A' },
    { value: 'beds:hi-lo', label: 'Beds: Hi - Lo' },
    { value: 'beds:lo-hi', label: 'Beds: Lo - Hi' },
    { value: 'baths:hi-lo', label: 'Baths: Hi - Lo' },
    { value: 'baths:lo-hi', label: 'Baths: Lo - Hi' }
];

let searchTimeout;

// Map component - entry component setup in router
Map = React.createClass({
    // This mixin makes the getMeteorData method work

    mixins: [sortable.ListMixin],

    onBeforeSetState: function(items){
        for(let i = 0; i < items.length; i++) {
            items[i].position = i;
            Homes.update({_id:items[i]._id}, {$set: {position: i}});
        }
    },

    initialize() {
        if (this.state.mainMap) {
                return;
        }
        let initialize = this.initialize;
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
            // will be used to detect map or list view
            isList: false,
            isMap: false,

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
        let state = this.state;
        let house = {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: 'red',
                fillOpacity: 0.66,
                strokeWeight: 0.33,
                scale: 8
        };

        let image = {
            url: 'img/flag.svg',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(20, 26),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
        };

        let shape = {
                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                type: 'poly'
        };

        let newMarker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lon),
                map: state.mainMap,
                icon: image,
                shape: shape,
                path: google.maps.SymbolPath.CIRCLE,
                title: html
        });

        newMarker['infowindow'] = new google.maps.InfoWindow({
                content: html
        });

        google.maps.event.addListener(newMarker, 'click', function() {
                this['infowindow'].open(state.mainMap, this);
        });

        google.maps.event.addListener(newMarker, 'mouseover', function() {
                // this['infowindow'].open(state.mainMap, this);
        });

        google.maps.event.addListener(newMarker, 'mouseout', function(){
                // this['infowindow'].close(state.mainMap, this);
        });

        this.state.markers.push(newMarker);
    },

    processHomes(homes) {
        let processHomes = this.processHomes;

        if (!window.google || !this.state.mainMap) {
            setTimeout(function() { processHomes(homes) }, 300);
            return;
        }
        for (let i = 0; i < homes.length; i++) {
            let homeName = homes[i].name,
                homeDesc = homes[i].notes,
                homePrice = homes[i].price,
                homeRooms = homes[i].numBedrooms,
                homeBaths = homes[i].numBathrooms;
            homePrice = homePrice && accounting.formatMoney(homePrice, "£", 0, ".", ",");
            let content = "<h3>" + homeName + "</h3><p>" + homeDesc + "</p> <p>" + homeRooms + " <i class='fa fa-bed'></i> | " + homeBaths + " <i class='fa fa-recycle'></i></p> <h6>" + homePrice + "</h6>";

            this.createMarker(homes[i].latitude, homes[i].longitude, content, 'home/' + homes[i]._id);
        }
    },

    renderSearchIcon() {
        return {__html:('<i id="searchIcon" class="fa fa-search"></i>')};
    },

    renderHomeBoxes() {
        let homes = this.state.items;
        let processedHomes = [];
        for (let i=0; i<homes.length;i++) {
            let home = homes[i],
                    position = home.position == null ? i : home.position;
            processedHomes[position] = <HomeBox 
                                        key={home._id} 
                                        home={home} 
                                        name={home.name} 
                                        propPic={home.propPic} 
                                        numBedrooms={home.numBedrooms} 
                                        numBaths={home.numBaths} 
                                        latitude={home.latitude} 
                                        longitude={home.longitude} 
                                        index={position} 
                                        {...this.movableProps} />;
        }
        return <ul>{processedHomes}</ul>;
    },

    renderSearchView() {
        let defaultClasses = [''],
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
                    {/*
                    <li>
                        <a onClick={this._toggleViewOption.bind(this, "isMap")} data-toggle="button" aria-pressed="false" autoComplete="off">
                            <i className="fa fa-map-marker"></i> Map
                        </a>
                    </li>
                    */}
                </ul>
            </div>
        );
    },

    _toggleViewOption(optionName) {
        let changedOption = !this.state[optionName];
        let optionState = {};
        optionState[optionName] = changedOption;
        this.setState(optionState);
        let hud = this._getHud();
        hud[optionName] = changedOption;
    },

    _handleForSale(){
        this.setState({
          forSale: !this.state.forSale
        });
    },

    _handleForRent(){
        this.setState({
          forRent: !this.state.forRent
        });
    },

    _handleBeds(val) {
        this.props.handleBeds(val);
    },

    _handleBaths(val) {
        this.props.handleBaths(val);
    },

    // logChange(val) {
    //     console.log("Selected: " + val);
    // },

    render() {

        let bedroomVal = this.props.numBedrooms || "";
        let bathroomVal = this.props.numBathrooms || "";

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
                                <form className="navbar-form navbar-left noPadding" role="search" action="javascript:;">
                                  <div className="form-group">
                                      <input id="searchMapInput" type="text" className="font4 form-control" placeholder="Search..."></input>
                                  </div>
                                </form>
                            </div>

                            <div id="propOptions">
                                <div className="navbar-form form-group pull-left">
                                    <Select
                                        id="bedsInput"
                                        name="beds"
                                        value={bedroomVal}
                                        placeholder="Bedrooms"
                                        options={bedOptions}
                                        onChange={this._handleBeds}
                                    />
                                </div>
                                <div className="navbar-form form-group pull-left">
                                    <Select
                                        id="bathsInput"
                                        name="baths"
                                        value={bathroomVal}
                                        placeholder="Baths"
                                        options={bathOptions}
                                        onChange={this._handleBaths}
                                    />
                                </div>
                            </div>
                        </div>

                        <div id="mainMap" className="col-sm-12 noPadding"></div>

                        <div className="mapList col-sm-6">

                            <div className="listOptions">

                                <div className="filter-results form-group pull-left noMargin">
                                    <Select
                                        name="bedrooms"
                                        placeholder="Sort"
                                        options={sortOptions}
                                    />
                                </div>

                            </div>

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
        let data = {homes: [], avgLat: []};
        let handles = [Meteor.subscribe("homes"),
                       Meteor.subscribe("avgLat")];
        if (!handles.every(utils.isReady)) {
            return data;
        }

        let status = HomeSearch.getStatus();
        if (status.loaded) {
            data.homes = HomeSearch.getData();
        }

        console.log(data);
        return data;
    },

    getInitialState() {
        return {
            forSale: false,
            forRent: false,
            numBedrooms: 0,
            numBathrooms: 0,
            searchText: ""
        }
    },

    _handleKey(event){
        if (document.getElementById('searchMapInput') === document.activeElement) {
            var _this = this;
            event.preventDefault();
            var text = $(event.target).val().trim();
            searchTimeout = setTimeout(function() {
                _this._setStateAndSearch({
                    searchText: text
                });
            }, 500);
            if (event.keyCode == 27) {
                clearTimeout(searchTimeout);
                $(event.target).val("");
                _this._setStateAndSearch({
                    searchText: text
                });
            }
            return false;
        }
    },

    _setStateAndSearch(obj) {
        this.setState(obj, this._doSearch);
    },

    _handleBeds(val) {
        this._setStateAndSearch({numBedrooms: val})
    },

    _handleBaths(val) {
        this._setStateAndSearch({numBathrooms: val})
    },

    _doSearch() {
      HomeSearch.search(this.state.searchText,
                        {sort: {position: 1},
                         requirements: {
                             numBedrooms: {$gt: parseInt(this.state.numBedrooms)},
                             numBathrooms: {$gt: parseInt(this.state.numBathrooms)},
                         }
                        });
    },

    componentWillMount(){
        this._doSearch();
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
            <Map homes={this.data.homes} handleBeds={this._handleBeds} handleBaths={this._handleBaths} numBedrooms={this.state.numBedrooms} numBathrooms={this.state.numBathrooms} {...this.props} />
        )
    }
});
