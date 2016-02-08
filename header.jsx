Header = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        var data = {}
        var handles = [Meteor.subscribe("homes")];

        if (!handles.every(utils.isReady)) {
            data.loading = true;
            return data;
        }
        var homes = Homes.find().fetch();

        return {
            homes: homes
        }
    },

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
    let name = React.findDOMNode(this.refs.nameInput).value.trim();
    let desc = React.findDOMNode(this.refs.propDesc).value.trim();
    let price = React.findDOMNode(this.refs.priceInput).value.trim();
    let address = React.findDOMNode(this.refs.addressInput).value.trim();
    let latitude = React.findDOMNode(this.refs.latitudeInput).value.trim();
    let longitude = React.findDOMNode(this.refs.longitudeInput).value.trim();
    let rooms = React.findDOMNode(this.refs.roomsInput).value.trim();
    let baths = React.findDOMNode(this.refs.bathsInput).value.trim();
    let year = React.findDOMNode(this.refs.yearInput).value.trim();
    let propPic = React.findDOMNode(this.refs.propPicInput).value.trim();

    let homes = this.data.homes,
        highest_position = utils.getHighestPosition(homes);

    Homes.insert({
      name: name,
      desc: desc,
      price: price,
      address: address,
      latitude: latitude,
      longitude: longitude,
      numBedrooms: rooms,
      numBathrooms: baths,
      year: year,
      propPic: propPic,
      position: highest_position,
      createdAt: new Date() // current time
    });

    // Clear form
    React.findDOMNode(this.refs.nameInput).value = "";
    React.findDOMNode(this.refs.propDesc).value = "";
    React.findDOMNode(this.refs.priceInput).value = "";
    React.findDOMNode(this.refs.addressInput).value = "";
    React.findDOMNode(this.refs.latitudeInput).value = "";
    React.findDOMNode(this.refs.longitudeInput).value = "";
    React.findDOMNode(this.refs.yearInput).value = "";
    React.findDOMNode(this.refs.roomsInput).value = "";
    React.findDOMNode(this.refs.bathsInput).value = "";
    React.findDOMNode(this.refs.propPicInput).value = "";

    {this._togglePopup()}
  },

  _renderAddHome() {
    if(!this.state.isPopup) {
      return null;
    }
    return (
      <div id="addHome" className="container-fluid">

        <a href="javascript:;" className="close" onClick={this._togglePopup}><i className="fa fa-close fa-lg"></i></a>

        <div className="col-sm-8 col-sm-offset-2">

          <h3>Add a Property</h3>

          <hr></hr>

          <form role="addHome vertCenter" onSubmit={this._addHome}>
            <h4>Details</h4>
            <div className="form-group">
              <input type="text" className="form-control" ref="nameInput" placeholder="Property/Building Name"></input>
            </div>
            <div className="form-group">
              <textarea className="form-control" ref="propDesc" placeholder="Tell us about this property"></textarea>
            </div>
            <div className="form-group">
              <input type="text" className="form-control" ref="priceInput" placeholder="Price"></input>
            </div>

            <div className="form-group col-sm-5 noPadding">
              <input type="text" className="form-control" ref="roomsInput" placeholder="How many rooms?"></input>
            </div>
            <div className="form-group col-sm-6 col-sm-offset-1 noPadding">
              <input type="text" className="form-control" ref="bathsInput" placeholder="How many baths?"></input>
            </div>
            <div className="form-group">
              <input type="text" className="form-control" ref="yearInput" placeholder="Year Built"></input>
            </div>

            <hr></hr>
            
            <h4>Location</h4>
            <div className="form-group col-sm-12 noPadding">
              <input type="text" className="form-control" ref="addressInput" placeholder="Address"></input>
            </div>
            
            <div className="form-group col-sm-5 noPadding">
              <input type="text" className="form-control" ref="latitudeInput" placeholder="Latitude"></input>
            </div>
            <div className="form-group col-sm-6 col-sm-offset-1 noPadding">
              <input type="text" className="form-control" ref="longitudeInput" placeholder="Longitude"></input>
            </div>

            <hr></hr>

            <h4>Property Picture URL</h4>
            <div className="form-group">
              <input type="text" className="form-control" ref="propPicInput" placeholder="Image URL"></input>
            </div>
            <button type="submit" className="btn btn-default">Add Property</button>
          </form>

        </div>
      </div>

    );
  },

  render() {
    return (

      <div>

        <nav id="topBar" className="navbar navbar-fixed-top borderBottom">
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

            <div className="navbar-left">
              <p className="verMar15">Virtual Reality Powered by Virtuocity</p>
            </div>

            <div className="collapse navbar-collapse">
              <ul className="navbar-nav navbar-right">
                <li><a href="/"><i className="fa fa-navicon"></i> Listings</a></li>
                <li><a href="javascript:;" onClick={this._togglePopup}><i className="fa fa-plus-circle"></i> Add Property</a></li>
                <li><a href="/about"><i className="fa fa-info-circle"></i> About</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {this._renderAddHome()}

      </div>

    );
  }
});
