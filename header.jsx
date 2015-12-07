Header = React.createClass({

  getInitialState() {
    return {
        isPopup: false
    }
  },

  _togglePopup() {
    this.setState({ isPopup: !this.state.isPopup });
  },

  _addHome(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    var name = React.findDOMNode(this.refs.nameInput).value.trim();
    var address = React.findDOMNode(this.refs.addressInput).value.trim();
    var latitude = React.findDOMNode(this.refs.latitudeInput).value.trim();
    var longitude = React.findDOMNode(this.refs.longitudeInput).value.trim();
    var propPic = React.findDOMNode(this.refs.propPicInput).value.trim();
    var slug = React.findDOMNode(this.refs.slugInput).value.trim();
    var notes = React.findDOMNode(this.refs.notesInput).value.trim();

 
    Homes.insert({
      name: name,
      address: address,
      latitude: latitude,
      longitude: longitude,
      propPic: propPic,
      slug: slug,
      notes: notes,

      createdAt: new Date() // current time
    });
 
    // Clear form
    React.findDOMNode(this.refs.nameInput).value = "";
    React.findDOMNode(this.refs.addressInput).value = "";
    React.findDOMNode(this.refs.latitudeInput).value = "";
    React.findDOMNode(this.refs.longitudeInput).value = "";
    React.findDOMNode(this.refs.propPicInput).value = "";
    React.findDOMNode(this.refs.slugInput).value = "";
    React.findDOMNode(this.refs.notesInput).value = "";

    this._togglePopup;
  },

  _renderAddHome() {
    if(!this.state.isPopup) {
      return null;
    }
    return (
      <div id="addRoom" className="container-fluid">
        <div className="col-sm-8 col-sm-offset-2">

          <a href="javascript:;" className="close" onClick={this._togglePopup}><i className="fa fa-close fa-lg"></i></a>
          <h3>Add A Property</h3>

          <hr></hr>

          <form role="addHome vertCenter" onSubmit={this.addHome}>
            <div className="form-group">
              <input type="text" className="form-control" ref="nameInput" placeholder="Name"></input>
            </div>
            <div className="form-group">
              <input type="text" className="form-control" ref="addressInput" placeholder="Address"></input>
            </div>
            <div className="form-group col-sm-6 noPadding">
              <input type="text" className="form-control" ref="latitudeInput" placeholder="Latitude"></input>
            </div>
            <div className="form-group col-sm-6 noPadRight">
              <input type="text" className="form-control" ref="longitudeInput" placeholder="Longitude"></input>
            </div>
            <div className="form-group">
              <label for="picUrl">Property Picture URL:</label>
              <input type="text" className="form-control" ref="propPicInput" placeholder="Dropbox much?"></input>
            </div>
            <div className="form-group">
              <label for="slug">Home URL or slug:</label>
              <input type="text" className="form-control" ref="slugInput" placeholder="/home-1"></input>
            </div>
            <div className="form-group">
              <textarea type="text" className="form-control" ref="notesInput" placeholder="Notes"></textarea>
            </div>
            <button type="submit" className="btn btn-default">Add</button>
          </form>

        </div>
      </div>
 
    );
  },

  render() {
    return (
        
      <div>

        <nav id="topBar" className="navbar navbar-fixed">
          <div className="container-fluid">

            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a href="/" className="navbar-brand"><span id="innerLogo">Eye <i id="logoEye" className="fa fa-eye 90degCC"></i> Control</span></a>
            </div>

            <div className="collapse navbar-collapse">
              <ul className="navbar-nav navbar-right">
                <li><a href="/">Map</a></li>
                <li><a href="javascript:;" onClick={this._togglePopup}><i className="fa fa-plus"></i> Add Property</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {this._renderAddHome()}

      </div>

    );
  }
});