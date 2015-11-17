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
      }).fetch()
    }
  },
 
  renderTasks() {
    // Get tasks from this.data.tasks
    return this.data.tasks.map((task) => {
      return <Task key={task._id} task={task} />;
    });
  },
 
  addNote(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();
 
    Tasks.insert({
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
            <div className="tint"></div>
          </div>

          <div id="propDetails">
            <div id="viewDetails" className="col-sm-4 noPadding">
              <div id="viewOptions" className="20padding">
                <ul className="list-inline">
                  <li><span className="glyphicon glyphicon-comment"></span></li>
                  <li><span className="glyphicon glyphicon-headphones"></span></li>
                  <li><span className="glyphicon glyphicon-globe"></span></li>
                  <li><span className="glyphicon glyphicon-map-marker"></span></li>
                </ul>
              </div>
              <div id="viewNotes">
                <header>
                  {/* This is a comment */}
                  <form className="new-task" onSubmit={this.addNote} >
                    <input
                      type="text"
                      ref="textInput"
                      placeholder="Add a note..." />
                  </form>
                  <ul>
                    {this.renderTasks()}
                  </ul>
                </header>
              </div>
            </div>

            <div id="placque" className="col-sm-4">
              <div id="circ">
                <h4>Official Name of Place</h4>
                <p>Est. 1894</p>
              </div>
            </div>
            <div id="room" className="col-sm-4">
              <div id="roomPics">
                <ol>
                  <li></li>
                </ol>
              </div>
            </div>

          </div>
        
        </div>

      </div>
 
    );
  }
});