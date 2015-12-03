

// Property component
Home = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData, sortable.ListMixin],

    // Loads items from the Homes collection and puts them on this.data.homes
    getMeteorData() {
        var data = {}
        var handles = [Meteor.subscribe("home", this.props.id),
                       Meteor.subscribe("rooms"),
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

        var rooms = Rooms.find({homeId: thisHome._id}, {
            sort: {
                createdAt: -1
            }
        }).fetch()

    return {

      home: thisHome,
      notes: Notes.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch(),
      rooms: rooms,
      sphere: Spheres.find({_id: "5ff7bef11efaf8b657d709b9"}).fetch()[0]
    }
  },

  getInitialState() {
    return {
      isPopup: false
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

  renderRoomBoxes() {
  //debugger;
      var rooms = this.state.items && this.state.items.length > 0 ? this.state.items : this.data.rooms;
      //rooms.sort({position: -1});
      var processedRooms = [];
      console.log(rooms, "rooms");
      for (var i=0; i < rooms.length; i++) {
            var room = rooms[i];
      var processedRoom = <RoomBox key={room._id} room={room} index={i} {...this.movableProps}/>
      processedRooms.push(processedRoom);
      }
    console.log(processedRooms, "pr");
    return <ul>{processedRooms}</ul>;
  },

  render() {
  if (this.data.loading) {
   return (
   <div>Loading...</div>
   )
  }
//         $(document).on('click', '#addRoomBtn', function(e) {
//             e.preventDefault();
//             // $("#email-signup").fadeIn(fadeTime);
//             // $('#fieldName').focus();
//             $("#addRoom").fadeIn(fadeTime);
//         });

//         $(document).on('click', '#addRoom .close', function(e) {
//             e.preventDefault();
//             // $("#email-signup").fadeIn(fadeTime);
//             // $('#fieldName').focus();
//             $("#addRoom").fadeOut(fadeTime);
//         });

//         $(document).keyup(function(e) {
//             if (e.keyCode == 27) {
//                 $("#addRoom").fadeOut(fadeTime);
//             }
//         });
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

        <div id="mainContent" className="col-sm-12 col-lg-10 col-lg-offset-1 noPadding">

          {this.props.header}

          <div id="viewVR">
             {this.renderSphere()}
          </div>

          <div id="propDetails">
            <div id="viewDetails" className="col-sm-4 noPadding">
              {this._renderViewOptions()}
              {this.renderNotes()}
            </div>

            {this._renderPlacque()}

            <div id="rooms" className="col-sm-4 noPadding">
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
      createdAt: new Date(), // current time
      //position: number
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
      let homeId = React.findDOMNode(this.refs.homeId).value.trim();


      Rooms.insert({
        name: name,
        desc: desc,
        picUrl: picUrl,
        homeId: homeId,
        createdAt: new Date(), // current time
        position: 0
      });

      // Clear form
      React.findDOMNode(this.refs.nameInput).value = "";
      React.findDOMNode(this.refs.descInput).value = "";
      React.findDOMNode(this.refs.picUrl).value = "";
      React.findDOMNode(this.refs.homeId).value = "";


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
          <div className="form-group">
            <label for="homeId">Home ID:</label>
            <input type="text" className="form-control" ref="homeId" placeholder="ID of the property or home"></input>
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
      <div id="placque" className="col-sm-4">
        <div id="circ" className="center-block">
          <h4 id="circTitle">{this.data.home.name}</h4>
          <p>{this.data.home.address}</p>
          <a href="javascript:;"><i className="fa fa-pencil"></i></a>
        </div>
      </div>
    );
  }
});
