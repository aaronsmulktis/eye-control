/*global React ReactMeteorData sortable Meteor Homes Rooms Spheres classNames */

function getCurrentSphere() {
    return Spheres.find({_id: "5ff7bef11efaf8b657d709b9"}).fetch()[0];
}

function getCurrentHud() {
    return JSON.parse(getCurrentSphere().hud)
}

let searchTimeout;

// Property component
Home = React.createClass({
    mixins: [ReactMeteorData, sortable.ListMixin],

    getMeteorData() {
        let data = {}
        let handles = [Meteor.subscribe("home", this.props.id),
                       Meteor.subscribe("sphere", "5ff7bef11efaf8b657d709b9")];

        if (!handles.every(utils.isReady)) {
            data.loading = true;
            return data;
        }
        let homes = Homes.find({_id: this.props.id}).fetch(),
            thisHome = homes[0];

        return {
            home: thisHome,
            sphere: getCurrentSphere()
        }
    },

    getInitialState() {
        return {
            isPopup: false,
            isIntroVideo: false,
            isMap: false,
            isFloorLogo: false,
            isPlaque: false,
            isFloorplan: false,
            isInfoWindow: false,
            rooms: [],
            // items: [] // Added automatically by the mixin
        }
    },

    componentDidMount() {
        let handle_coords = Meteor.subscribe("coords");

        let updateFrame = function(id, coord) {
            if (id !== "headset") {
                return;
            }
            let frame = $('.vr-iframe').first()[0];
            if (!frame) {
                return;
            }
            let idx = frame.src.indexOf('#'), url = frame.src;
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
                let query = Coords.find();
                handle_coords = query.observeChanges({
                    added: updateFrame,
                    changed: updateFrame
                });
            }
            setTimeout(loadCoords, 100);
        }
    },

    componentWillReceiveProps(nextProps) {
        this.setState({items: nextProps.rooms,
                       isMap: nextProps.hud.isMap,
                       isFloorLogo: nextProps.hud.isFloorLogo,
                       isIntroVideo: nextProps.hud.isIntroVideo,
                       isPlaque: nextProps.hud.isPlaque,
                       isFloorplan: nextProps.hud.isFloorplan,
                       isInfoWindow: nextProps.hud.isInfoWindow});
    },

    renderRoomBoxes() {
        let rooms = this.state.items;
        let processedRooms = [];
        for (let i=0; i<rooms.length;i++) {
            let room = rooms[i],
                position = room.position == null ? i : room.position;
            processedRooms[position] = <RoomBox key={room._id} room={room} desc={room.desc} index={position} {...this.movableProps}/>
                                          }
            return <ul>{processedRooms}</ul>;
    },

    onBeforeSetState: function(items){
        for(let i = 0; i < items.length; i++) {
            items[i].position = i;
            Rooms.update({_id:items[i]._id}, {$set: {position: i}});
        }
    },

    renderSphere() {
        if (!this.data.sphere) {
            return;
        }
        let sphere = "http://vault.ruselaboratories.com/vr?image_url=" + encodeURIComponent(this.data.sphere.sphereUrl) + "&resize=1&width=3000#0,0,1";

        return (
            <iframe src={sphere} frameBorder="0" className="vr-iframe" height="100%" width="100%"></iframe>

        );
    },

    render() {
        if (this.data.loading) {
            return (
                <div className="loader-container">
                    <div className="loader"><span>Loading...</span></div>
                </div>
            )
        }

        var price = this.data.home.price;
        price = price && accounting.formatMoney(price, "£", 0, ".", ",");
        var mapPath = "/img/map-round.png";
        var floorplanPath = "/img/floorplan-round.png";
        var infoPath = "/img/info-round.png";
        var mapStyle = {display: this.state.isMap ? 'block' : 'none'};
        var floorplanStyle = {display: this.state.isFloorplan ? 'block' : 'none'};
        var infoStyle = {display: this.state.isInfoWindow ? 'block' : 'none'};
        return (

            <div id="contentContainer">

                <div id="mainContent" className="col-sm-12 noPadding">

                    {this.props.header}

                    <div id="rooms" className="col-sm-4">

                        <div className="row-fluid">
                            <h2 id="propTitle">{this.data.home.name}</h2>
                            <h5>{price}</h5>
                            <p>
                                {this.data.home.address}
                            </p>
                            <p>{this.data.home.numBedrooms} <i className="fa fa-bed"></i> | {this.data.home.numBathrooms} <i className="fa fa-recycle"></i></p>
                            <p>
                                {this.data.home.desc}
                            </p>

                        </div>

                        <hr></hr>

                        <div id="roomHeader" className="row-fluid">
                            <h5><i className="fa fa-home"></i> Rooms</h5>
                            <div id="roomFilter">
                                <form className="new-note">
                                    <input
                                        id="search-rooms"
                                        type="text"
                                        ref="roomInput"
                                        placeholder="Filter.." />
                                </form>
                                <div id="addRoomBtn" className="pull-right">
                                    <a href="javascript:;" onClick={this._togglePopup}><i className="fa fa-plus"></i> Add Room</a>
                                </div>

                            </div>
                            <div id="roomPics" className="noPadding">

                                {this.renderRoomBoxes()}

                            </div>
                        </div>
                    </div>

                    <div id="content" className="col-sm-8 noPadding">

                      <div id="viewVR">
                          <img id="map-overlay" style={mapStyle} className="generic-overlay" src={mapPath} />
                          <img id="floorplan-overlay" style={floorplanStyle} className="generic-overlay" src={floorplanPath} />
                          <img id="info-overlay" style={infoStyle} className="generic-overlay" src={infoPath} />
                          {this.renderSphere()}
                      </div>

                      <div id="propDetails">

                        <div id="viewDetails" className="col-sm-8">
                            <h4>Viewer Options:</h4>
                            {this._renderViewOptions()}

                            <hr></hr>

                            <div>
                                <h4>Room Details</h4>
                                <p id="desc">{this.state.items.length ? this.state.items[0].desc : ""}</p>
                            </div>
                        </div>

                        <div id="plaque" className="col-sm-4">
                            {this._renderPlaque()}
                        </div>

                      </div>
                    </div>

                    {this._renderAddRoom()}

                </div>

            </div>

        );
    },

    _togglePopup() {
        this.setState({ isPopup: !this.state.isPopup });z
    },

    _addRoom(e) {
        e.preventDefault();

        // Find the text field via the React ref
        let name = React.findDOMNode(this.refs.nameInput).value.trim();
        let desc = React.findDOMNode(this.refs.descInput).value.trim();
        let picUrl = React.findDOMNode(this.refs.picUrl).value.trim();

        let rooms = Rooms.find({homeId: this.props.id}).fetch(),
            highest_position = utils.getHighestPosition(rooms);

        Rooms.insert({
            name: name,
            desc: desc,
            picUrl: picUrl,
            homeId: this.props.id,
            position: highest_position,
            createdAt: new Date()
        });

        // Clear form
        React.findDOMNode(this.refs.nameInput).value = "";
        React.findDOMNode(this.refs.descInput).value = "";
        React.findDOMNode(this.refs.picUrl).value = "";
    },

    _renderAddRoom() {

        if(!this.state.isPopup) {
            return null;
        }
        return (
            <div id="addRoom" className="container-fluid">
                <a href="javascript:;" className="close" onClick={this._togglePopup}><i className="fa fa-close fa-lg"></i></a>

                <form className="col-sm-8 col-sm-offset-2" role="addHome" onSubmit={this._addRoom}>
                  <h3>Add room to {this.data.home.name}</h3>
                  <hr></hr>
                  <div className="form-group">
                      <input type="text" className="form-control" ref="nameInput" placeholder="Kitchen, Living Room,"></input>
                  </div>
                  <div className="form-group">
                      <textarea type="text" className="form-control" ref="descInput" placeholder="Tell us about this room.."></textarea>
                  </div>
                  <h4>Room Picture URL:</h4>
                  <div className="form-group">
                      <input type="text" className="form-control" ref="picUrl" placeholder="Dropbox much?"></input>
                  </div>

                  <button type="submit" className="btn btn-default">Add Room</button>
                </form>
            </div>
        );
    },

    _renderViewOptions() {
        let defaultClasses = ['btn', 'btn-default'],
            introVideoClasses = classNames(defaultClasses, {active: this.state.isIntroVideo}),
            mapClasses = classNames(defaultClasses, {active: this.state.isMap}),
            floorLogoClasses = classNames(defaultClasses, {active: this.state.isFloorLogo}),
            plaqueClasses = classNames(defaultClasses, {active: this.state.isPlaque}),
            floorplanClasses = classNames(defaultClasses, {active: this.state.isFloorplan}),
            infoWindowClasses = classNames(defaultClasses, {active: this.state.isInfoWindow});

        return (
            <div id="viewOptions">
                <ul className="list-inline">
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isIntroVideo")} type="button" className={introVideoClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Intro Video
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isFloorLogo")} type="button" className={floorLogoClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Logo
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isMap")} id="mapButton" type="button" className={mapClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Map
                        </button>   
                    </li>
                    {/*
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isPlaque")} type="button" className={plaqueClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Plaque
                        </button>
                    </li>
                    */}
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isFloorplan")} type="button" className={floorplanClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Floorplan
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isInfoWindow")} type="button" className={infoWindowClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Info
                        </button>
                    </li>
                </ul>

                {/*
                <div className="hudOptions">
                    {this.props.radioBtns}
                </div>
                */}
            </div>
        );
    },

    _renderPlaque() {
        return (
            <div id="circ" className="center-block">
                <h4 id="circTitle">{this.data.home.name}</h4>
                {/*                <p>Built {this.data.home.year}</p>  */}
            </div>
        );
    },

    _getHud() {
        return {'isIntroVideo': this.state.isIntroVideo,
                'isMap': this.state.isMap,
                'isFloorLogo': this.state.isFloorLogo,
                'isPlaque': this.state.isPlaque,
                'isFloorplan': this.state.isFloorplan,
                'isInfoWindow': this.state.isInfoWindow,
                'text': $('#circTitle').text()}
    },

    _toggleViewOption(optionName) {
        let changedOption = !this.state[optionName];
        let optionState = {};
         optionState[optionName] = changedOption;
        if (optionName === "isMap") 
            if (changedOption) {
                optionState['isFloorplan'] = false;
                optionState['isInfoWindow'] = false;
            } 
        if (optionName === "isFloorplan") 
            if (changedOption) {
                optionState['isMap'] = false;
                optionState['isInfoWindow'] = false;
            }  
        if (optionName === "isFullscreen") {
            let vrIframeDiv = $('#vr-iframe'),
                vrIframe = $('.vr-iframe')[0],
                sphere = "http://vault.ruselaboratories.com/vr?image_url=" + encodeURIComponent(this.data.sphere.sphereUrl) + "&resize=1&width=3000#0,0,1",
                sphereIframe = "<iframe src="+sphere+" frameBorder=\"0\" className=\"vr-iframe\" height=\"100%\" width=\"100%\"></iframe>";
            vrIframeDiv.empty();
            requestFullScreen(vrIframeDiv[0]);
            vrIframeDiv.append(sphereIframe);
            //this._toggleViewOption.bind(this, "isFullscreen");
        }
        if (optionName === "isInfoWindow") 
            if (changedOption) {
                optionState['isMap'] = false;
                optionState['isFloorplan'] = false;
            } 
        this.setState(optionState);
        let hud = this._getHud();
        hud[optionName] = changedOption;
        for (let s in optionState){
            hud[s] = optionState[s];
        }
        Spheres.update({_id: "5ff7bef11efaf8b657d709b9"}, {$set: {hud: JSON.stringify(hud)}});
    }

});

HomeWrapper = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        let data = {rooms: [], hud: {}};
        let handles = [Meteor.subscribe("rooms"),
                       Meteor.subscribe("sphere", "5ff7bef11efaf8b657d709b9")];
        if (!handles.every(utils.isReady)) {
            return data;
        }
        data.hud = getCurrentHud();
        if (RoomSearch.getCurrentQuery()) {
            let status = RoomSearch.getStatus();
            if (status.loaded) {
                data.rooms = RoomSearch.getData();
            }
        } else {
            let rooms = Rooms.find({homeId: this.props.id}, {
                sort: {
                    position: 1
                }
            }).fetch();
            data.rooms = rooms;
        }
        return data;
    },

    _handleKey(event){
        let search = document.getElementById('search-rooms');
        if (search === document.activeElement) {
            let homeId = this.props.id;
            event.preventDefault();
            if (event.keyCode == 27) {
                $(event.target).val("");
                RoomSearch.search("", {homeId: homeId});
                return false;
            }
            let text = $(event.target).val().trim();
            searchTimeout = setTimeout(function() {
                RoomSearch.search(text, {homeId: homeId});
            }, 500);
            return false;
        }
    },

    componentWillMount(){
        RoomSearch.search("", {homeId: this.props.id});
        Cookie.setViewed(this.props.id);
        document.addEventListener("keyup", this._handleKey, false);     
    },


    componentWillUnmount() {
        document.removeEventListener("keyup", this._handleKey, false);

    },


    render: function(){
        return(
            <Home rooms={this.data.rooms} hud={this.data.hud} {...this.props} />
        )
    }
});