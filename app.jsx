// MapKey = AIzaSyDI1UZpsaowlO7XYZK1V1d7cCRZ-fymBOs;

// App component - represents the whole app
App = React.createClass({
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
 
  handleSubmit(event) {
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
        <div id="viewDetails" className="col-sm-4">
          <nav id="viewMenu" className="navbar navbar-fixed">
            <span className="pull-right glyphicon glyphicon-menu-hamburger"></span>
          </nav>
          <div id="viewVR"></div>
          <div id="viewOptions">
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
              <form className="new-task" onSubmit={this.handleSubmit} >
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

        <div id="mainContent" className="col-sm-8">

          <nav id="topBar" className="navbar navbar-fixed">
            <div className="container-fluid">

              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
              </div>

              <div className="collapse navbar-collapse">
                <ul className="navbar-nav navbar-right">
                  <li><a href="#">Map</a></li>
                  <li><a href="#">Add Property</a></li>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Logo</a></li>
                </ul>
              </div>
            </div>
          </nav>

          <div id="searchBar">
            <form className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Search"></input>
              </div>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
          </div>

          <div id="mainMap"></div>

          <div id="propDetails"></div>
        </div>
      </div>
 
    );
  }
});