// Main map styles
let styles = [
    {
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

// TODO: Move this to a service

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
//END

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
            mainMap: false,
            markers: [],
            filterText: '',
            inStockOnly: false,
            isList: false,
            isMap: false
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

    createMarker(lat, lon, html, link, position) {
        let state = this.state;
       
        let shape = {
                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                type: 'poly'
        };

        let newMarker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lon),
                map: state.mainMap,
                icon: {url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+position+"|338000|FFFFFF"},
                shape: shape,
                path: google.maps.SymbolPath.CIRCLE,
                title: ''
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
                homeBaths = homes[i].numBathrooms,
                homeThumb = homes[i].propPic;
            homePrice = homePrice && accounting.formatMoney(homePrice, "£", 0, ".", ",");
            let homeThumbUrl = homeThumb && 'http://vault.ruselaboratories.com/proxy?url=' + encodeURIComponent(homeThumb) + '&resize=1&width=200',
                imageDiv =  "<div class='col-sm-4 noPadding pull-left'> <img data-url='"+ homeThumb +"' src='"+ homeThumbUrl +"'></img> </div>" ,
                descriptionDiv = "<div class=' col-sm-8 pull-right'> <h3 class='no-margin'>" + homeName + "</h3><p class='no-margin'>" + homeDesc + "</p> <p class='no-margin'>" + homeRooms + " <i class='fa fa-bed'></i> | " + homeBaths + " <i class='fa fa-recycle'></i></p> <h6 class='no-margin'>" + homePrice + "</h6></div>",
                content = imageDiv + descriptionDiv;
            this.createMarker(homes[i].latitude, homes[i].longitude, content, 'home/' + homes[i]._id, homes[i].position);
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
            processedHomes[position] = <HomeBox key={home._id} home={home} name={home.name} propPic={home.propPic} latitude={home.latitude} longitude={home.longitude} index={position} {...this.movableProps}/>;
        }
        return <ul>{processedHomes}</ul>;
    },
    handleUserInput: function(filter) {
          
        //FORMAT FILTER
        var buildRegExp = function(searchText) {
            // this is a dumb implementation
            var parts = searchText.trim().split(/[ \-\:]+/);
            return new RegExp("(" + parts.join('|') + ")", "ig");
        };
        let query = {$and:[]};
        if (filter.text!=""){
            var regExp = buildRegExp(filter.text);
            var selector =  {$or:
                                    [
                                        {name: regExp},
                                        {desc: regExp},
                                        {address: regExp},
                                        {city: regExp},
                                        {country: regExp},
                                        {postal: regExp},
                                    ]};
           
            query.$and.push(selector);
        }
        if (filter.numBedrooms!="")
             query.$and.push({ numBedrooms: parseInt(filter.numBedrooms) } );
        if (filter.numBathrooms!="")
             query.$and.push({ numBathrooms: parseInt(filter.numBathrooms) } );
        if ((filter.minValue!="") && (filter.maxValue!=""))
             query.$and.push({ price: {$in: [parseInt(filter.minValue),parseInt(filter.maxValue)] }} );
        else if (filter.minValue!="")
             query.$and.push({ price:{ $gt: parseInt(filter.minValue) } });
        else if (filter.maxValue!="")
             query.$and.push({ price:{$lt: parseInt(filter.maxValue)} } );
        //END FORMAT FILTER
        // SEARCH
        this.setState({items:Homes.find(query.$and.length ? query: {}).fetch()});
        
        let qLength = this.state.items.length;
        //format the search title label
        let seachTitle = "";
        if (query.$and.length)
            seachTitle = qLength + (qLength == 1 ? " Result of ":" Results of ") + filter.text;
        
        $(".results-label").text(seachTitle);


        return true;
  
        
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
           
                        <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
                       
                        <div id="mainMap" className="col-sm-12 noPadding"></div>

                        <div className="mapList col-sm-6">

                            <div className="listOptions">
                                
                                <h3 className="results-label"></h3>
                                
                                <div className="filter-results form-group pull-left noMargin">
                                  <div className="input-group">
                                    <div className="addon-min addon-selected input-group-addon "><i className="glyphicon glyphicon-menu-hamburger"/></div>
                                    <div className="addon-min input-group-addon "><i className="glyphicon glyphicon-map-marker"/></div>
                                    <Select
                                        name="bedrooms"
                                        placeholder="Sort"
                                        options={sortOptions}
                                    />
                                    </div>
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
        let data = {homes: []};
        console.log("reload data");
        var handles = [Meteor.subscribe("homes")];
        if (!handles.every(utils.isReady)) {
            return data;
        }

      
            var homes = Homes.find({}, {
                sort: {
                    position: 1
                }
            }).fetch();
            data.homes = homes;
       

        return data;
    },

    componentWillMount(){
     
    },


    componentWillUnmount() {
    
    },
       

    render: function(){

        return(
            <Map homes={this.data.homes} {...this.props} />
        )
    }
});

