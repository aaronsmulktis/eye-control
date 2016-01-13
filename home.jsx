/*global React ReactMeteorData sortable Meteor Homes Rooms Spheres classNames */

function getCurrentSphere() {
    return Spheres.find({_id: "5ff7bef11efaf8b657d709b9"}).fetch()[0];
}

function getCurrentHud() {
    return JSON.parse(getCurrentSphere().hud)
}

// Property component
Home = React.createClass({
    mixins: [ReactMeteorData, sortable.ListMixin],

    getMeteorData() {
        var data = {}
        var handles = [Meteor.subscribe("home", this.props.id),
                       Meteor.subscribe("sphere", "5ff7bef11efaf8b657d709b9")];

        function isReady(handle) {
            return handle.ready();
        }
        if (!handles.every(isReady)) {
            data.loading = true;
            return data;
        }
        var homes = Homes.find({_id: this.props.id}).fetch(),
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
            isPlaque: false,
            isFloorplan: false,
            isInfoWindow: false,
            rooms: [],
            // items: [] // Added automatically by the mixin
        }
    },

    componentDidMount() {
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

    componentWillReceiveProps(nextProps) {
        this.setState({items: nextProps.rooms,
                       isIntroVideo: nextProps.hud.isIntroVideo,
                       isPlaque: nextProps.hud.isPlaque,
                       isFloorplan: nextProps.hud.isFloorplan,
                       isInfoWindow: nextProps.hud.isInfoWindow});
    },

    renderRoomBoxes() {
        var rooms = this.state.items;
        var processedRooms = [];
        for (var i=0; i<rooms.length;i++) {
            var room = rooms[i],
                position = room.position == null ? i : room.position;
            processedRooms[position] = <RoomBox key={room._id} room={room} desc={room.desc} index={position} {...this.movableProps}/>
                                          }
            return <ul>{processedRooms}</ul>;
    },

    onBeforeSetState: function(items){
        for(var i = 0; i < items.length; i++) {
            items[i].position = i;
            Rooms.update({_id:items[i]._id}, {$set: {position: i}});
        }
    },

    renderSphere() {
        if (!this.data.sphere) {
            return;
        }
        var sphere = "http://vault.ruselaboratories.com/vr?image_url=" + encodeURIComponent(this.data.sphere.sphereUrl) + "&resize=1&width=3000";

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

        return (

            <div id="contentContainer">

                <div id="mainContent" className="col-sm-12 noPadding">

                    {this.props.header}

                    <div id="rooms" className="col-sm-4">

                        <div className="row-fluid">
                            <h3 id="propTitle">{this.data.home.name}</h3>
                            <h5>{this.data.home.address}</h5>
                            <p>8 <i className="fa fa-bed"></i> | 2 <i className="fa fa-recycle"></i></p>
                            <p>
                                Buckingham Palace is the London residence and principal workplace of the reigning monarch of the United Kingdom. Located in the City of Westminster, the palace is often at the centre of state occasions and royal hospitality.
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
                          {this.renderSphere()}
                          {this._renderViewOptions()}
                      </div>

                      <div id="propDetails">

                        <div id="viewDetails" className="col-sm-8">
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
        this.setState({ isPopup: !this.state.isPopup });
    },

    _addRoom(e) {
        e.preventDefault();

        // Find the text field via the React ref
        let name = React.findDOMNode(this.refs.nameInput).value.trim();
        let desc = React.findDOMNode(this.refs.descInput).value.trim();
        let picUrl = React.findDOMNode(this.refs.picUrl).value.trim();

        var rooms = Rooms.find({homeId: this.props.id}).fetch(),
            highest_position = 0;
        for (var i=0; i<rooms.length; i++) {
            var position = rooms[i];
            if (position && position > highest_position) {
                highest_position = position;
            }
        }

        Rooms.insert({
            name: name,
            desc: desc,
            picUrl: picUrl,
            homeId: this.props.id,
            position: highest_position === 0 ? 0 : highest_position + 1,
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
        var defaultClasses = ['btn', 'btn-default'],
            introVideoClasses = classNames(defaultClasses, {active: this.state.isIntroVideo}),
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
                        <button onClick={this._toggleViewOption.bind(this, "isPlaque")} type="button" className={plaqueClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Plaque
                        </button>
                    </li>
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
                'isPlaque': this.state.isPlaque,
                'isFloorplan': this.state.isFloorplan,
                'isInfoWindow': this.state.isInfoWindow,
                'text': $('#circTitle').text()}
    },

    _toggleViewOption(optionName) {
        var changedOption = !this.state[optionName];
        var optionState = {};
        optionState[optionName] = changedOption;
        this.setState(optionState);
        var hud = this._getHud();
        hud[optionName] = changedOption;
        Spheres.update({_id: "5ff7bef11efaf8b657d709b9"}, {$set: {hud: JSON.stringify(hud)}});
    }

});

HomeWrapper = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        var data = {rooms: [], hud: {}};
        var handles = [Meteor.subscribe("rooms"),
                       Meteor.subscribe("sphere", "5ff7bef11efaf8b657d709b9")];
        function isReady(handle) {
            return handle.ready();
        }
        if (!handles.every(isReady)) {
            return data;
        }
        data.hud = getCurrentHud();
        if (RoomSearch.getCurrentQuery()) {
            var status = RoomSearch.getStatus();
            if (status.loaded) {
                data.rooms = RoomSearch.getData();
            }
        } else {
            var rooms = Rooms.find({homeId: this.props.id}, {
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
            var text = $(event.target).val().trim();
            RoomSearch.search(text, {homeId: this.props.id});
            if (event.keyCode == 27) {
              $(event.target).val("");
            }
        }
    },

    componentWillMount(){
        RoomSearch.search("", {homeId: this.props.id});
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
