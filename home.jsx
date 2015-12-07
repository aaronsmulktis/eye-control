/*global React ReactMeteorData sortable Meteor Homes Rooms Notes Spheres */

// Property component
Home = React.createClass({
    mixins: [ReactMeteorData, sortable.ListMixin],

    getMeteorData() {
        var data = {}
        var handles = [Meteor.subscribe("home", this.props.id),
                       Meteor.subscribe("sphere", "5ff7bef11efaf8b657d709b9"),
                       Meteor.subscribe("notes")];

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
            notes: Notes.find({}, {
                sort: {
                    createdAt: -1
                }
            }).fetch(),
            sphere: Spheres.find({_id: "5ff7bef11efaf8b657d709b9"}).fetch()[0]
        }
    },

    getInitialState() {
        return {
            isPopup: false,
            rooms: []
        }
    },

    onBeforeSetState: function(items){
        for(var i = 0; i < items.length; i++) {
            items[i].position = i;
            Rooms.update({_id:items[i]._id}, {$set: {position: i}});
        }
    },

    renderNotes() {
        // Get notes from this.data.notes
        let notes = this.data.notes.map((note) => {
            return <Note key={note._id} note={note} />;
        });

    return (
      <div id="viewNotes">
        <header>
          {/* This is a comment */}
          <form className="new-note" onSubmit={this._addNote} >
            <input
              type="text"
              ref="noteInput"
              placeholder="Add a note about this property..." />
          </form>
          <ul>
            {notes}
          </ul>
        </header>
      </div>
    );
  },

    renderSphere() {
        // Get notes from this.data.notes
        if (!this.data.sphere) {
            return;
        }
        var sphere = "http://vault.ruselaboratories.com/vr?image_url=" + encodeURIComponent(this.data.sphere.sphereUrl) + "&resize=1&width=3000";

        return (
                <iframe src={sphere} frameborder="0" className="vr-iframe" height="100%" width="100%"></iframe>
        );
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
      processedRooms[position] = <RoomBox key={room._id} room={room} index={position} {...this.movableProps}/>
      }
    return <ul>{processedRooms}</ul>;
  },

  render() {
      if (this.data.loading) {
          return (
                  <div>Loading...</div>
          )
      }
      $(document).on('click', 'li.roomBox', function(evt) {
          if (window.moving) {
          return false;
          }
          evt.preventDefault();
          // Set the checked property to the opposite of its current value
          Spheres.update({_id:"5ff7bef11efaf8b657d709b9"}, {$set: {sphereUrl:$(evt.target).data('url')}});
          return false;
      })

    return (

      <div id="contentContainer">

        <div id="mainContent" className="col-sm-12 noPadding">

          {this.props.header}

          <div className="col-sm-9 noPadding">
            <div id="viewVR">
               {this.renderSphere()}
            </div>

            <div id="propDetails">

              <div id="viewDetails" className="col-sm-8 noPadding">
                {this._renderViewOptions()}
                {this.renderNotes()}
              </div>

              <div id="placque" className="col-sm-4">
                {this._renderPlacque()}
              </div>

            </div>
          </div>

          <div id="rooms" className="col-sm-3">
            <h3>Rooms</h3>
            <header id="roomHeader">
              <form className="new-note">
                <input
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
          </div>

          {this._renderAddRoom()}

        </div>

      </div>

    );
  },

  _togglePopup() {
    this.setState({ isPopup: !this.state.isPopup });
  },

  _addNote(e) {
    e.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.noteInput).value.trim();

    Notes.insert({
      text: text,
      createdAt: new Date() // current time
    });

    // Clear form
    React.findDOMNode(this.refs.noteInput).value = "";

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

      this._togglePopup;
  },

  _renderAddRoom() {

    if(!this.state.isPopup) {
    return null;
    }
    return (
      <div id="addRoom" className="container-fluid">
        <a href="javascript:;" className="close" onClick={this._togglePopup}><i className="fa fa-close fa-lg"></i></a>
        <h3>Add a room to 100 Freeman St.</h3>
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
      <div id="viewOptions" className="20padding">
        <ul className="list-inline nav-justified">
          <li>
            <button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
              <span className="glyphicon glyphicon-comment"></span>
            </button>
          </li>
          <li>
            <button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
              <span className="glyphicon glyphicon-home"></span>
            </button>
          </li>
          <li>
            <button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
              <span className="glyphicon glyphicon-headphones"></span>
            </button>
          </li>
          <li>
            <button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
              <span className="glyphicon glyphicon-heart"></span>
            </button>
          </li>
          <li>
            <button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
              <span className="glyphicon glyphicon-map-marker"></span>
            </button>
          </li>
        </ul>
      </div>
    );
  },

  _renderPlacque() {
    return (
        <div id="circ" className="center-block">
          <h4 id="circTitle">{this.data.home.name}</h4>
          <p>{this.data.home.address}</p>
          <a href="javascript:;"><i className="fa fa-pencil"></i></a>
        </div>
    );
  }
});

HomeWrapper = React.createClass({
    mixins: [ReactMeteorData],
    // Loads items from the Homes collection and puts them on this.data.homes
    getMeteorData() {
        var data = {};
        var handle = Meteor.subscribe("rooms");
        if (!handle.ready()) {
            return data;
        }
        var rooms = Rooms.find({homeId: this.props.id}, {
            sort: {
                position: 1
            }
        }).fetch()
            data = {rooms: rooms}
        return data;
    },
    render: function(){
        return(
            <Home rooms={this.data.rooms} {...this.props} />
        )
    }
});
