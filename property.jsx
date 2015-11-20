// MapKey = AIzaSyDI1UZpsaowlO7XYZK1V1d7cCRZ-fymBOs;

// Property component
Property = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    return {
      tasks: Tasks.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch(),
      rooms: Homes.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch()
    }
  },

  renderTasks() {
    // Get tasks from this.data.tasks
    return this.data.tasks.map((task) => {
      return <Task key={task._id} task={task} />;
    });
  },

  renderRoomBoxes() {
    // Get tasks from this.data.tasks
    return this.data.rooms.map((room) => {
      return <RoomBox key={room._id} home={room} />;
    });
  },

  addNote(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.noteInput).value.trim();

    Tasks.insert({
      text: text,
      createdAt: new Date() // current time
    });

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  addRoom(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.roomInput).value.trim();

    Rooms.insert({
      text: text,
      createdAt: new Date() // current time
    });

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  render() {
    return (

      <div id="contentContainer">

        <div id="mainContent" className="col-sm-12 col-lg-10 col-lg-offset-1 noPadding">

          {this.props.header}

          <div id="viewVR">
            <iframe src={this.props.sphere} frameborder="0" class="vr-iframe" height="100%" width="100%"></iframe>
          </div>

          <div id="propDetails">
            <div id="viewDetails" className="col-sm-4 noPadding">
              <div id="viewOptions" className="20padding">
                <ul className="list-inline nav-justified">
                  <li><span className="glyphicon glyphicon-comment"></span></li>
                  <li><span className="glyphicon glyphicon-headphones"></span></li>
                  <li><span className="glyphicon glyphicon-globe"></span></li>
                  <li><span className="glyphicon glyphicon-map-marker"></span></li>
                </ul>
              </div>
              <div id="viewNotes">
                <header>
                  {/* This is a comment */}
                  <form className="new-note" onSubmit={this.addNote} >
                    <input
                      type="text"
                      ref="noteInput"
                      placeholder="Add a note..." />
                  </form>
                  <ul>
                    {this.renderTasks()}
                  </ul>
                </header>
              </div>
            </div>

            <div id="placque" className="col-sm-4">
              <div id="circ" className="center-block">
                <h4>Official Name of Place</h4>
                <p>Est. 1894</p>
              </div>
            </div>
            <div id="room" className="col-sm-4 noPadding">
              <h3>Rooms</h3>
              <header id="roomHeader">
                <form className="new-note" onSubmit={this.addNote} >
                  <input
                    type="text"
                    ref="roomInput"
                    placeholder="Filter.." />
                </form>
                <div id="addRoomBtn" className="">
                  <a href="#addRoom"><i className="fa fa-plus"></i> Room</a>
                </div>
              </header>
              <div id="roomPics">
                <ol className="noPadding">
                  {this.renderRoomBoxes()}
                </ol>
              </div>
            </div>

          </div>

        </div>

      </div>

    );
  }
});