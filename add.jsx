// MapKey = AIzaSyDI1UZpsaowlO7XYZK1V1d7cCRZ-fymBOs;

// Property component
Add = React.createClass({

  mixins: [ReactMeteorData],
 
  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    return {
      homes: Homes.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch()
    }
  },
 
  renderHomes() {
    // Get tasks from this.data.tasks
    return this.data.homes.map((home) => {
      return <Home key={home.name} home={home} />;
    });
  },

  addProperty(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    var name = React.findDOMNode(this.refs.nameInput).value.trim();
    var address = React.findDOMNode(this.refs.addressInput).value.trim();
    var latitude = React.findDOMNode(this.refs.latitudeInput).value.trim();
    var longitude = React.findDOMNode(this.refs.longitudeInput).value.trim();
    var proPic = React.findDOMNode(this.refs.propPicInput).value.trim();
    var notes = React.findDOMNode(this.refs.notesInput).value.trim();

 
    Homes.insert({
      name: name,
      address: address,
      latitude: latitude,
      longitude: longitude,
      proPic: proPic,
      notes: notes,

      createdAt: new Date() // current time
    });
 
    // Clear form
    React.findDOMNode(this.refs.nameInput).value = "";
    React.findDOMNode(this.refs.addressInput).value = "";
    React.findDOMNode(this.refs.latitudeInput).value = "";
    React.findDOMNode(this.refs.longitudeInput).value = "";
    React.findDOMNode(this.refs.notesInput).value = "";
  },

  render() {
    return (

      <div id="contentContainer">

        <div id="mainContent" className="col-sm-12 col-lg-10 col-lg-offset-1 noPadding">

          {this.props.header}

          <div className="addForm container-fluid">
            <div className="col-sm-8 col-sm-offset-2">

              <h4>Add a new property</h4>

              <hr></hr>

              <form role="addHome vertCenter" onSubmit={this.addProperty}>
                <div className="form-group">
                  <input type="text" className="form-control" ref="nameInput" placeholder="Name"></input>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" ref="addressInput" placeholder="Address"></input>
                </div>
                <div className="form-group col-sm-6 noPadding">
                  <input type="text" className="form-control" ref="longitudeInput" placeholder="Latitude"></input>
                </div>
                <div className="form-group col-sm-6 noPadRight">
                  <input type="text" className="form-control" ref="latitudeInput" placeholder="Longitude"></input>
                </div>
                <div className="form-group">
                  <label for="propPic">Property Picture:</label>
                  <input type="file" ref="propPicInput" placeholder></input>
                  <p className="picDescription">This will be visible when browsing properties.</p>
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" ref="notesInput" placeholder="Notes"></input>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" ref="saleInput"> Is this property for sale? </input>
                  </label>
                </div>
                <button type="submit" className="btn btn-default">Add</button>
              </form>

            </div>
          </div>

          <h3 className="text-center">All Properties</h3>

          <hr className="noMarBottom"></hr>

          <div className="propList row-fluid">
            <ul>
              {this.renderHomes()}
            </ul>
          </div>
        
        </div>

      </div>
 
    );
  }
});