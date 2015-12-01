// Property component
Add = React.createClass({

  addHome(event) {
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

          <hr className="noMarBottom"></hr>
        
        </div>

      </div>
 
    );
  }
});