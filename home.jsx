/*global React ReactMeteorData sortable Meteor Homes Rooms Spheres */

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
            sphere: Spheres.find({_id: "5ff7bef11efaf8b657d709b9"}).fetch()[0]
        }
    },

    getInitialState() {
        return {
            isPopup: false,
            isPlaque: false,
            isFloorplan: false,
            rooms: []
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
        this.setState({'items': nextProps.rooms});
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
        $(document).on('click', 'li.roomBox', function(evt) {
            if (window.moving) {
                return false;
            }
            evt.preventDefault();
            // Set the checked property to the opposite of its current value
            Spheres.update({_id:"5ff7bef11efaf8b657d709b9"}, {$set: {sphereUrl:$(evt.target).data('url')}});
            $('#circTitle').text($(evt.target).closest("li").find(".roomName").text());
            $('#desc').text($(evt.target).closest("li").find(".roomDesc").text());
            return false;
        })

            return (

                <div id="contentContainer">

                    <div id="mainContent" className="col-sm-12 noPadding">

                        {this.props.header}

                        <div id="content" className="col-sm-8 noPadding">
                            <h3 id="propTitle"><span>{this.data.home.name}</span></h3>
                            <div id="viewVR">
                                {this.renderSphere()}
                                {this._renderViewOptions()}
                            </div>

                            <div id="propDetails">

                                <div id="viewDetails" className="col-sm-8">
                                    <div>
                                        <h4>Room Details</h4>
                                        <p id="desc">{this.state.items && this.state.items.length ? this.state.items[0].desc : ""}</p>
                                    </div>
                                </div>

                                <div id="plaque" className="col-sm-4">
                                    {this._renderPlaque()}
                                </div>

                            </div>
                        </div>

                        <div id="rooms" className="col-sm-4">
                            <h3><i className="fa fa-home"></i> Rooms</h3>
                            <header id="roomHeader">
                                <form className="new-note">
                                    <input
                                        id="search-rooms"
                                        type="text"
                                        ref="roomInput"
                                        placeholder="Filter.." />
                                </form>
                                <div id="addRoomBtn" className="">
                                    <a href="javascript:;" onClick={this._togglePopup}><i className="fa fa-plus"></i> Add Room</a>
                                </div>

                            </header>
                            <div id="roomPics" className="noPadding">

                                {this.renderRoomBoxes()}

                            </div>

                            <div className="roomsToggle">
                              <span><i className="fa fa-bars"></i></span>
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

        Rooms.insert({
            name: name,
            desc: desc,
            picUrl: picUrl,
            homeId: this.props.id,
            createdAt: new Date() // current time
        });

        // Clear form
        React.findDOMNode(this.refs.nameInput).value = "";
        React.findDOMNode(this.refs.descInput).value = "";
        React.findDOMNode(this.refs.picUrl).value = "";

        this._togglePopup();
    },

    _renderAddRoom() {

        if(!this.state.isPopup) {
            return null;
        }
        return (
            <div id="addRoom" className="container-fluid">
                <a href="javascript:;" className="close" onClick={this._togglePopup}><i className="fa fa-close fa-lg"></i></a>
                <h3>Add room to {this.data.home.name}</h3>
                <form role="addHome vertCenter" onSubmit={this._addRoom}>
                    <div className="form-group">
                        <input type="text" className="form-control" ref="nameInput" placeholder="Kitchen, Living Room,"></input>
                    </div>
                    <div className="form-group">
                        <textarea type="text" className="form-control" ref="descInput" placeholder="Tell us about this room.."></textarea>
                    </div>
                    <div className="form-group">
                        <label for="picUrl">Room Picture URL:</label>
                        <input type="text" className="form-control" ref="picUrl" placeholder="Dropbox much?"></input>
                    </div>

                    <button type="submit" className="btn btn-default">Add Room</button>
                </form>
            </div>
        );
    },

    _renderViewOptions() {
        return (
            <div id="viewOptions">
                <ul className="list-inline">
                    <li>
                        <button onClick={this._togglePlaque} type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autoComplete="off">
                            Plaque
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleFloorplan} type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autoComplete="off">
                            Floorplan
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

    _togglePlaque() {
        var isPlaque = !this.state.isPlaque;
        this.setState({isPlaque : isPlaque });
        Spheres.update({_id: "5ff7bef11efaf8b657d709b9"}, {$set: {hud: JSON.stringify({'hud': isPlaque, 'text': $('#circTitle').text()})}});
    },

    _toggleFloorplan() {
        var isFloorplan = !this.state.isFloorplan;
        this.setState({isFloorplan : isFloorplan});
        Spheres.update({_id: "5ff7bef11efaf8b657d709b9"}, {$set: {hud: JSON.stringify({'hud': this.state.isPlaque, 'floorplan': isFloorplan, 'text': $('#circTitle').text()})}});
    }
});

HomeWrapper = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        var data = {};
        var handle = Meteor.subscribe("rooms");
        if (handle.ready() && !RoomSearch.getCurrentQuery()) {
            var rooms = Rooms.find({homeId: this.props.id}, {
                sort: {
                    position: 1
                }
            }).fetch()
                data = {rooms: rooms}
            return data;
        }
        var status = RoomSearch.getStatus();
        if (status.loaded) {
            data = {rooms: RoomSearch.getData()};
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
            <Home rooms={this.data.rooms} {...this.props} />
        )
    }
});
